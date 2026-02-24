<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="$router.push('/dashboard/customers')" />
        <h1 class="text-2xl font-bold">Mijoz Tafsilotlari</h1>
      </div>
      <Button label="Tahrirlash" icon="pi pi-pencil" severity="info" @click="editCustomer" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <i class="pi pi-spin pi-spinner text-4xl text-emerald-500"></i>
    </div>

    <div v-else-if="customer" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Customer Info Side -->
      <div class="lg:col-span-1 space-y-6">
        <Card class="border-none shadow-sm">
          <template #title>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                {{ getInitials(customer.name) }}
              </div>
              <div>
                <h2 class="text-lg font-bold">{{ customer.name }}</h2>
                <p class="text-sm text-gray-500">{{ customer.phone }}</p>
              </div>
            </div>
          </template>
          <template #content>
            <div class="space-y-4 mt-4">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-500">Filial</span>
                <span class="font-medium">{{ customer.branch || 'Kiritilmagan' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-500">Manzil</span>
                <span class="font-medium">{{ customer.address || 'Kiritilmagan' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-500">Qo'shilgan sana</span>
                <span class="font-medium">{{ formatDate(customer.createdAt) }}</span>
              </div>
              <div class="p-4 bg-emerald-50 rounded-lg mt-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-emerald-700">Jami Xaridlar</span>
                  <i class="pi pi-shopping-bag text-emerald-500"></i>
                </div>
                <div class="text-2xl font-bold text-emerald-700">{{ formatCurrency(customer.totalSpent) }}</div>
                <div class="text-sm text-emerald-600 mt-1">{{ customer.tradesCount }} ta savdo</div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="border-none shadow-sm h-fit">
          <template #title>Eslatmalar</template>
          <template #content>
            <p class="text-gray-600">{{ customer.notes || 'Izohlar mavjud emas.' }}</p>
          </template>
        </Card>
      </div>

      <!-- Trade History Table Component -->
      <div class="lg:col-span-2">
        <CustomerTradesTable :trades="trades" />
      </div>
    </div>
    
    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <i class="pi pi-exclamation-circle text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900">Mijoz topilmadi</h3>
      <Button label="Ortga qaytish" class="mt-4" text @click="$router.push('/dashboard/customers')" />
    </div>

    <!-- Edit Dialog (Shared) -->
    <CustomerDialog 
        v-model:visible="editDialog"
        :customer="customerToEdit"
        :saving="saving"
        :submitted="submitted"
        @save="saveUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { customersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'

import CustomerTradesTable from './components/CustomerTradesTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'

const route = useRoute()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const submitted = ref(false)
const customer = ref(null)
const trades = ref([])

const editDialog = ref(false)
const customerToEdit = ref({})

const loadCustomerData = async () => {
  try {
    const id = route.params.id
    if (!id) return
    const response = await customersAPI.getById(id)
    customer.value = response.data.customer
    trades.value = response.data.trades || []
  } catch (error) {
    console.error('Error loading customer details:', error)
  } finally {
    loading.value = false
  }
}

const editCustomer = () => {
    customerToEdit.value = { ...customer.value }
    editDialog.value = true
}

const saveUpdate = async () => {
    submitted.value = true
    if (!customerToEdit.value.name?.trim() || !customerToEdit.value.phone?.trim()) return

    saving.value = true
    try {
        await customersAPI.update(customerToEdit.value._id, customerToEdit.value)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangilandi', life: 3000 })
        editDialog.value = false
        loadCustomerData()
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xatolik yuz berdi', life: 3000 })
    } finally {
        saving.value = false
    }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

onMounted(() => {
  loadCustomerData()
})
</script>
