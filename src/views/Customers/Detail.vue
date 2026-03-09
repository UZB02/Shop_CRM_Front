<template>
  <div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6 pb-2">
      <div class="flex items-center gap-5">
        <button 
          @click="$router.push('/dashboard/customers')"
          class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-sm group"
        >
          <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h1 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Mijoz Tafsilotlari</h1>
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Mijoz haqida batafsil ma'lumotlar
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button 
          label="Tahrirlash" 
          icon="pi pi-pencil" 
          severity="success" 
          class="!rounded-2xl !px-6 shadow-lg shadow-emerald-500/20"
          @click="editCustomer" 
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="h-20 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl"></div>
      <div class="h-[500px] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[2.5rem]"></div>
    </div>

    <div v-else-if="customer" class="space-y-6">
      <!-- Customer Info Accordion -->
      <Accordion :value="['0']" class="detail-accordion">
        <AccordionPanel value="0" class="!border-none !bg-transparent">
          <AccordionHeader class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border !border-slate-100 dark:!border-slate-800 !px-8 !py-6 !shadow-sm hover:!bg-slate-50 dark:hover:!bg-slate-800/50 transition-colors">
            <div class="flex items-center gap-5 text-left">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-500/20">
                {{ getInitials(customer.name) }}
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-black text-slate-800 dark:text-white tracking-tight">{{ customer.name }}</span>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="customer.group_name" class="px-2 py-0.5 rounded-md bg-amber-500/10 text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest border border-amber-500/20">
                    {{ customer.group_name }}
                  </span>
                  <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{{ customer.status_display || customer.status }}</span>
                </div>
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent class="!bg-white dark:!bg-slate-900 !mt-2 !rounded-[2rem] !border !border-slate-100 dark:!border-slate-800 !overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
              <!-- Contact -->
              <div class="space-y-4">
                <div class="flex flex-col gap-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefon</span>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ customer.phone }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ro'yxatdan o'tgan</span>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ customer.created_on || formatDate(customer.createdAt) }}</p>
                </div>
              </div>

              <!-- Address -->
              <div class="flex flex-col gap-1">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manzil</span>
                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ customer.address || '—' }}</p>
              </div>

              <!-- Stats 1 -->
              <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Jami xarid</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{{ formatCurrency(customer.totalSpent) }}</span>
                </div>
                <div class="text-[10px] font-bold text-slate-500 mt-2">{{ customer.tradesCount }} ta savdo orqali</div>
              </div>

              <!-- Stats 2 -->
              <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-center">
                <template v-if="Number(customer.debt_balance) > 0">
                  <span class="text-[8px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1 block">Qarz qoldig'i</span>
                  <span class="text-2xl font-black text-rose-500 tracking-tighter">{{ formatCurrency(customer.debt_balance) }}</span>
                </template>
                <template v-else>
                  <span class="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1 block">Moliyaviy holat</span>
                  <span class="text-sm font-black text-emerald-500">Qarzlar mavjud emas</span>
                </template>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <!-- History Column -->
      <div class="h-full">
        <CustomerTradesTable :trades="trades" />
      </div>
    </div>
    
    <!-- Not Found State -->
    <div v-else class="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
      <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
        <i class="pi pi-exclamation-circle text-3xl text-slate-300"></i>
      </div>
      <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">Mijoz topilmadi</h3>
      <p class="text-slate-500 text-sm mt-2">Balki u o'chirib yuborilgan yoki ID xato kiritilgan.</p>
      <Button label="Ortga qaytish" class="!rounded-2xl !mt-8 shadow-sm" severity="secondary" @click="$router.push('/dashboard/customers')" />
    </div>

    <!-- Edit Dialog -->
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
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

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
  loading.value = true
  try {
    const id = route.params.id
    if (!id) return
    const response = await customersAPI.getById(id)
    console.log('Customer Data from Backend:', response.data)
    
    // Support different response structures: { data: { customer, trades } } or { data: { results, ... } }
    if (response.data.customer) {
        customer.value = response.data.customer
        trades.value = response.data.trades || []
    } else {
        customer.value = response.data
        trades.value = [] // For now, handle separately if API split
    }
  } catch (error) {
    console.error('Error loading customer details:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ma\'lumotlarni yuklashda xatolik', life: 3000 })
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
        const payload = {
            name: customerToEdit.value.name,
            phone: customerToEdit.value.phone,
            address: customerToEdit.value.address,
            group: customerToEdit.value.group
        }
        await customersAPI.update(customerToEdit.value.id, payload)
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
  const parts = name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
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

<style scoped>
.detail-accordion :deep(.p-accordionheader) {
  padding: 0;
}
.detail-accordion :deep(.p-accordioncontent-content) {
  padding: 0;
}
</style>

