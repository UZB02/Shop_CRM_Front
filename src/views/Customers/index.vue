<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Mijozlar Bazasi</h1>
      <Button label="Yangi mijoz" icon="pi pi-user-plus" severity="success" @click="openNew" />
    </div>

    <CustomerTable 
      :customers="customers" 
      :loading="loading" 
      @edit="editCustomer" 
      @delete="confirmDelete"
      @view-history="viewHistory"
    />

    <CustomerDialog 
      v-model:visible="customerDialog"
      :customer="customer"
      :saving="saving"
      :submitted="submitted"
      @save="saveCustomer"
      @hide="hideDialog"
    />


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import CustomerTable from './components/CustomerTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import { customersAPI } from '@/services/api'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const loading = ref(false)
const saving = ref(false)
const customers = ref([])
const customerDialog = ref(false)
const submitted = ref(false)

const customer = ref({
  name: '',
  phone: '',
  branch: '',
  address: '',
  notes: ''
})

const loadCustomers = async () => {
  loading.value = true
  try {
    const response = await customersAPI.getAll({ page: 1, limit: 10 })
    customers.value = response.data.customers
  } catch (error) {
    console.error('Error loading customers:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mijozlarni yuklashda xatolik', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  customer.value = { name: '', phone: '', branch: '', address: '', notes: '' }
  submitted.value = false
  customerDialog.value = true
}

const editCustomer = (data) => {
  customer.value = { ...data }
  customerDialog.value = true
}

const viewHistory = (id) => {
  router.push(`/dashboard/customers/${id}`)
}

const saveCustomer = async () => {
  submitted.value = true
  if (!customer.value.name?.trim() || !customer.value.phone?.trim()) return

  saving.value = true
  try {
    if (customer.value._id) {
      await customersAPI.update(customer.value._id, customer.value)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mijoz ma\'lumotlari yangilandi', life: 3000 })
    } else {
      await customersAPI.create(customer.value)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangi mijoz qo\'shildi', life: 3000 })
    }
    customerDialog.value = false
    loadCustomers()
  } catch (error) {
    console.error('Error saving customer:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 3000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (data) => {
  confirm.require({
    message: `"${data.name}" mijozini o'chirishni tasdiqlaysizmi?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await customersAPI.delete(data._id)
        toast.add({ severity: 'success', summary: 'O\'chirildi', detail: 'Mijoz muvaffaqiyatli o\'chirildi', life: 3000 })
        loadCustomers()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 3000 })
      }
    }
  })
}

const hideDialog = () => {
  customerDialog.value = false
  submitted.value = false
}

onMounted(() => {
  loadCustomers()
})
</script>
