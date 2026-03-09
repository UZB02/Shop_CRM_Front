<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Mijozlar Bazasi</h1>
        <p class="text-xs text-slate-500 font-semibold mt-1">Sodiq mijozlaringiz bilan ishlash va guruhlarni boshqarish</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative min-w-[300px]">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Mijoz ismi yoki telefon raqami bo'yicha qidirish..." 
            class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all shadow-sm"
            @input="handleSearch"
          />
        </div>

        <Button 
          label="Guruhlar" 
          icon="pi pi-users" 
          severity="secondary" 
          outlined
          class="!rounded-xl !border-slate-200 dark:!border-slate-800"
          @click="groupsDialog = true" 
        />
        <Button 
          label="Yangi mijoz" 
          icon="pi pi-user-plus" 
          severity="success" 
          class="!rounded-xl shadow-lg shadow-emerald-500/20"
          @click="openNew" 
        />
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl p-1">
      <CustomerTable 
        :customers="customers" 
        :loading="loading" 
        v-model:page="page"
        :totalRecords="totalRecords"
        :pageSize="pageSize"
        @page-change="loadCustomers"
        @edit="editCustomer" 
        @delete="confirmDelete"
        @view-history="viewHistory"
      />
    </div>

    <!-- Dialogs -->
    <CustomerDialog 
      v-model:visible="customerDialog"
      :customer="customer"
      :groups="groups"
      :saving="saving"
      :submitted="submitted"
      @save="saveCustomer"
      @hide="hideDialog"
    />

    <CustomerGroupsDialog 
      v-model:visible="groupsDialog" 
      @groups-updated="loadGroups"
    />

    <ConfirmDialog />
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
import CustomerGroupsDialog from './components/CustomerGroupsDialog.vue'
import { customersAPI, customerGroupsAPI } from '@/services/api'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const loading = ref(false)
const saving = ref(false)
const customers = ref([])
const groups = ref([])
const customerDialog = ref(false)
const groupsDialog = ref(false)
const submitted = ref(false)

const totalRecords = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
let searchTimeout = null

const customer = ref({
  name: '',
  phone: '',
  group: null,
  branch: '',
  address: '',
  notes: ''
})

const loadCustomers = async () => {
  loading.value = true
  try {
    const params = { 
      page: page.value, 
      limit: pageSize.value,
      search: searchQuery.value || undefined 
    }
    const response = await customersAPI.getAll(params)
    customers.value = response.data.results || response.data
    totalRecords.value = response.data.count || (response.data.results ? response.data.results.length : response.data.length)
  } catch (error) {
    console.error('Error loading customers:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mijozlarni yuklashda xatolik', life: 3000 })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    loadCustomers()
  }, 500)
}

const loadGroups = async () => {
  try {
    const response = await customerGroupsAPI.getAll()
    groups.value = response.data.results || response.data
  } catch (error) {
    console.error('Error loading groups:', error)
  }
}

const openNew = () => {
  customer.value = { name: '', phone: '', group: null, branch: '', address: '', notes: '' }
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
    const payload = {
      name: customer.value.name,
      phone: customer.value.phone,
      address: customer.value.address,
      group: customer.value.group
    }

    if (customer.value.id) {
      await customersAPI.update(customer.value.id, payload)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mijoz ma\'lumotlari yangilandi', life: 3000 })
    } else {
      await customersAPI.create(payload)
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
        await customersAPI.delete(data.id)
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
  loadGroups()
})
</script>

