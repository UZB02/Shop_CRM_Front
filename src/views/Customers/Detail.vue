<template>
  <div class="space-y-4 pb-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div>
          <div class="flex items-center gap-1.5 mb-0.5">
            <router-link to="/dashboard/customers" class="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
              {{ $t('menu.customers') }}
            </router-link>
            <i class="pi pi-chevron-right text-[6px] text-slate-300 dark:text-slate-700"></i>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-500">
              {{ $t('customers.details.subtitle') }}
            </span>
          </div>
          <h1 class="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            {{ customer?.name || $t('customers.details.title') }}
          </h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          :label="$t('common.edit')" 
          icon="pi pi-pencil text-xs" 
          severity="success" 
          class="!rounded-xl !px-4 !py-2 !text-xs !font-bold shadow-lg shadow-emerald-500/20"
          @click="editCustomer" 
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
      <div class="md:col-span-4 h-[300px] bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
      <div class="md:col-span-8 h-[400px] bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
    </div>

    <div v-else-if="customer" class="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
      
      <!-- Left Column: Customer Profile & Stats -->
      <div class="lg:col-span-4 flex flex-col gap-5">
        
        <!-- Profile Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="flex items-start gap-4 mb-5 relative z-10">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-emerald-500/20 shrink-0">
              {{ getInitials(customer.name) }}
            </div>
            <div class="flex flex-col pt-1">
              <h2 class="text-base font-black text-slate-800 dark:text-white tracking-tight leading-tight">{{ customer.name }}</h2>
              <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                <span v-if="customer.group_name" class="px-2 py-0.5 rounded-md bg-amber-500/10 text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest border border-amber-500/20">
                  {{ customer.group_name }}
                </span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                  {{ customer.status_display || customer.status || 'ACTIVE' }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2.5 relative z-10 border-t border-slate-50 dark:border-slate-800/50 pt-5">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <i class="pi pi-phone text-[10px]"></i>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.phone') }}</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ customer.phone || '—' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <i class="pi pi-map-marker text-[10px]"></i>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.address') }}</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight">{{ customer.address || '—' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <i class="pi pi-calendar text-[10px]"></i>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.registered') }}</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ customer.created_on || formatDate(customer.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Overview Cards -->
        <div class="grid grid-cols-2 gap-3 md:gap-4">
          <!-- Total Spent Card -->
          <div class="bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 rounded-2xl p-4 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10 flex flex-col h-full justify-between gap-3">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <i class="pi pi-wallet text-[10px]"></i>
                </div>
                <span class="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{{ $t('customers.details.total_spent') }}</span>
              </div>
              <div>
                <span class="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{{ formatCurrency(customer.totalSpent) }}</span>
                <p class="text-[8px] text-slate-400 mt-0.5 uppercase font-bold tracking-wider">{{ $t('customers.details.trades_count', { count: customer.tradesCount }) }}</p>
              </div>
            </div>
          </div>

          <!-- Debt Card -->
          <div :class="[
              'rounded-2xl p-4 border relative overflow-hidden group',
              Number(customer.debt_balance) > 0 ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
            ]"
          >
            <div class="absolute -left-4 -bottom-4 w-16 h-16 bg-white/40 dark:bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative z-10 flex flex-col h-full justify-between gap-3">
              <div class="flex items-center gap-2">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center', Number(customer.debt_balance) > 0 ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20' : 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20']">
                  <i :class="['text-[10px] pi', Number(customer.debt_balance) > 0 ? 'pi-exclamation-triangle' : 'pi-check-circle']"></i>
                </div>
                <span :class="['text-[8px] font-black uppercase tracking-widest', Number(customer.debt_balance) > 0 ? 'text-rose-400' : 'text-emerald-400']">{{ Number(customer.debt_balance) > 0 ? $t('customers.details.debt') : $t('customers.details.financial_status') }}</span>
              </div>
              <div>
                <template v-if="Number(customer.debt_balance) > 0">
                  <span class="text-sm font-black text-rose-600 dark:text-rose-400 tracking-tighter">{{ formatCurrency(customer.debt_balance) }}</span>
                </template>
                <template v-else>
                  <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block pt-1.5">{{ $t('customers.details.no_debt') }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Trade History -->
      <div class="lg:col-span-8 flex flex-col min-h-[400px]">
        <CustomerTradesTable :trades="trades" class="flex-grow" />
      </div>

    </div>
    
    <!-- Not Found State -->
    <div v-else class="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 mt-4">
      <div class="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
        <i class="pi pi-search text-lg text-slate-400"></i>
      </div>
      <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">{{ $t('customers.details.not_found') }}</h3>
      <p class="text-slate-400 text-xs mt-1">{{ $t('customers.details.not_found_desc') }}</p>
      <Button :label="$t('customers.details.back')" class="!rounded-xl !mt-6 shadow-sm !text-xs !px-4 !py-2" severity="secondary" @click="$router.push('/dashboard/customers')" />
    </div>

    <!-- Edit Dialog -->
    <CustomerDialog 
        v-model:visible="editDialog"
        :customer="customerToEdit"
        :groups="groups"
        :saving="saving"
        :submitted="submitted"
        @save="saveUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { customersAPI, customerGroupsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

import CustomerTradesTable from './components/CustomerTradesTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'

const route = useRoute()
const toast = useToast()
const { t } = useI18n()

const loading = ref(true)
const saving = ref(false)
const submitted = ref(false)
const customer = ref(null)
const trades = ref([])
const groups = ref([])

const editDialog = ref(false)
const customerToEdit = ref({})

const loadCustomerData = async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (!id) return
    const response = await customersAPI.getById(id)
    console.log('Customer Data from Backend:', response.data)
    
    // Support different response structures
    if (response.data.customer) {
        customer.value = response.data.customer
        trades.value = response.data.trades || []
    } else {
        customer.value = response.data
        trades.value = [] // For now, handle separately if API split
    }
  } catch (error) {
    console.error('Error loading customer details:', error)
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
  } finally {
    loading.value = false
  }
}

const loadGroups = async () => {
    try {
        const response = await customerGroupsAPI.getAll()
        groups.value = response.data.results || response.data
    } catch (error) {
        console.error('Error loading groups:', error)
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
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.updated'), life: 5000 })
        editDialog.value = false
        loadCustomerData()
    } catch (error) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 5000 })
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
  loadGroups()
})
</script>

