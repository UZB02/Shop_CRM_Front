<template>
  <div class="space-y-4 pb-8">
    <!-- Header Section (Responsive) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1 overflow-x-auto no-scrollbar whitespace-nowrap">
          <router-link to="/dashboard/customers" class="text-[9px] font-black text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
            <i class="pi pi-users text-[8px]"></i>
            {{ $t('customers.title') }}
          </router-link>
          <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
          <span class="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{{ $t('customers.details.title') }}</span>
        </div>
        <h1 class="text-lg sm:text-xl font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{{ customer?.name || '...' }}</h1>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button 
          @click="editCustomer"
          class="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i class="pi pi-pencil text-[10px]"></i>
          <span>{{ $t('common.edit') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
      <div class="md:col-span-4 h-[300px] bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
      <div class="md:col-span-8 h-[400px] bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
    </div>

    <!-- Compact Content Area -->
    <div v-else-if="customer" class="flex flex-col gap-4">
      
      <!-- Compact Top bar & Tab Navigation -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-1.5 shadow-sm overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <!-- Segmented Tab Switcher (Scrollable) -->
          <div class="flex items-center gap-0.5 p-0.5 bg-slate-50 dark:bg-slate-950/50 rounded-lg w-full lg:w-auto overflow-x-auto no-scrollbar">
            <button 
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap',
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm border border-slate-100 dark:border-slate-700' 
                  : 'text-slate-400 hover:text-slate-500 dark:hover:text-slate-300'
              ]"
            >
              <i :class="['pi text-[9px]', tab.icon]"></i>
              {{ tab.label }}
            </button>
          </div>

          <!-- Concise Quick Stats (Responsive stack) -->
          <div class="flex items-center justify-around sm:justify-end gap-3 sm:gap-6 px-4 py-1 sm:py-0 shrink-0 border-t sm:border-t-0 border-slate-50 dark:border-slate-800 mt-1 sm:mt-0">
            <div class="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2">
              <span class="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.total_spent') }}:</span>
              <span class="text-[10px] sm:text-xs font-black text-emerald-500 font-mono">{{ formatCurrency(customer.total_purchases) }}</span>
            </div>
            <div class="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-800"></div>
            <div class="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2">
              <span class="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.debt') }}:</span>
              <span :class="['text-[10px] sm:text-xs font-black font-mono', Number(customer.debt_balance) > 0 ? 'text-rose-500' : 'text-emerald-500']">{{ formatCurrency(customer.debt_balance) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Content Transition Area -->
      <div class="min-h-[400px] relative">
        <Transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform translate-y-4 opacity-0"
          mode="out-in"
        >
          <!-- TAB: OVERVIEW -->
          <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-9 space-y-4">
              <!-- KPI Grid (Precise & Compact) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/20 transition-all">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <i class="pi pi-briefcase text-[10px]"></i>
                    </div>
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{{ $t('customers.details.trades_count', { count: '' }).trim() }}</h4>
                  </div>
                  <p class="text-xl font-black text-slate-800 dark:text-white">{{ purchaseCount }}</p>
                </div>
                <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/20 transition-all">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <i class="pi pi-star text-[10px]"></i>
                    </div>
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{{ $t('customers.details.loyalty_points') || 'LEVEL' }}</h4>
                  </div>
                  <p class="text-xl font-black text-slate-800 dark:text-white truncate">{{ customer.group_name || 'VIP' }}</p>
                </div>
                <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-rose-500/20 transition-all">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <i class="pi pi-exclamation-circle text-[10px]"></i>
                    </div>
                    <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{{ $t('customers.details.financial_status') }}</h4>
                  </div>
                  <p :class="['text-[11px] font-black uppercase tracking-tight', Number(customer.debt_balance) > 0 ? 'text-rose-500' : 'text-emerald-500']">
                    {{ Number(customer.debt_balance) > 0 ? $t('customers.details.debt') : $t('customers.details.no_debt') }}
                  </p>
                </div>
              </div>

              <!-- Compact Activity Table/List -->
              <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-2.5 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 class="text-[9px] font-black text-slate-600 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                    {{ $t('common.recent_activity') || 'RECENT ACTIVITY' }}
                  </h3>
                  <button @click="activeTab = 'trades'" class="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                    {{ $t('common.view_all') }}
                  </button>
                </div>
                <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
                  <div v-for="trade in lastTrades" :key="trade.id" class="flex items-center justify-between p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                    <div class="flex items-center gap-3">
                      <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <i class="pi pi-shopping-cart text-[10px]"></i>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[10px] font-black text-slate-800 dark:text-white truncate max-w-[150px] md:max-w-xs">
                          {{ trade.items?.[0]?.product_name || 'SAVDO' }}
                          <span v-if="trade.items?.length > 1" class="text-[8px] text-slate-400 font-bold ml-1">+{{ trade.items.length - 1 }} {{ $t('common.more') }}</span>
                        </span>
                        <span class="text-[8px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">{{ trade.created_on }}</span>
                      </div>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="text-[11px] font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(trade.net_price) }}</span>
                      <span class="text-[8px] font-black text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/5">{{ trade.payment_type_display }}</span>
                    </div>
                  </div>
                  <div v-if="!lastTrades.length" class="text-center py-6">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('common.no_data') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Overview Side (Compact & Precise Sidebar) -->
            <div class="lg:col-span-3">
              <div class="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 text-white shadow-xl relative overflow-hidden group border border-white/5 h-fit">
                <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div class="relative z-10 flex flex-col items-center">
                  <div class="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-xl font-black mb-3 shadow-xl">
                    {{ getInitials(customer.name) }}
                  </div>
                  <h2 class="text-sm font-black tracking-tight mb-2 text-center w-full truncate">{{ customer.name }}</h2>
                  <div class="flex flex-wrap justify-center gap-1 mb-6">
                    <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/20 text-[7px] font-black uppercase tracking-widest text-emerald-400">{{ customer.status_display || 'ACTIVE' }}</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[7px] font-black uppercase tracking-widest text-slate-400">{{ customer.group_name }}</span>
                  </div>
                  
                  <div class="w-full space-y-3 pt-4 border-t border-white/5">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">{{ $t('customers.details.phone') }}</span>
                        <span class="text-[10px] font-black text-slate-300 truncate">{{ customer.phone || '—' }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">{{ $t('customers.details.registered') }}</span>
                        <span class="text-[9px] font-black text-slate-300">{{ customer.created_on || '-' }}</span>
                    </div>
                  </div>

                  <button 
                    v-if="Number(customer.debt_balance) > 0"
                    @click="payDebtDialog = true"
                    class="w-full mt-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <i class="pi pi-credit-card text-[10px]"></i>
                    {{ $t('customers.details.pay_debt_title') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: TRADES -->
          <div v-else-if="activeTab === 'trades'" class="animate-fade-in">
            <CustomerTradesTable 
              :purchases="purchaseHistory" 
              :debts="debtHistory" 
              :purchase-count="purchaseCount"
              :debt-count="debtCount"
              :purchase-page="purchasePage"
              :debt-page="debtPage"
              :purchase-summary="purchaseSummary"
              :debt-summary="debtSummary"
              :total-debt="totalDebt"
              @update:purchasePage="loadPurchases"
              @update:debtPage="loadDebts"
              @filter="handleFilters"
              class="h-full" 
            />
          </div>

          <!-- TAB: PAYMENTS (Precise Placeholder) -->
          <div v-else-if="activeTab === 'payments'" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div class="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <i class="pi pi-money-bill text-xl text-slate-300 dark:text-slate-700"></i>
            </div>
            <div class="max-w-xs">
              <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">{{ $t('common.payments') }}</h3>
              <p class="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">{{ $t('customers.details.payments_history_desc') }}</p>
            </div>
          </div>

          <!-- TAB: PROFILE (Compact List) -->
          <div v-else-if="activeTab === 'profile'" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
             <div class="px-5 py-3 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
               <h3 class="text-[9px] font-black text-slate-700 dark:text-white uppercase tracking-widest flex items-center gap-2">
                 <i class="pi pi-id-card text-emerald-500"></i>
                 {{ $t('customers.details.full_info') }}
               </h3>
               <Button 
                :label="$t('common.edit')" 
                icon="pi pi-pencil text-[9px]" 
                severity="secondary" 
                text
                class="!rounded-lg !px-4 !py-1.5 !text-[9px] !font-black !uppercase !tracking-widest"
                @click="editCustomer" 
               />
             </div>
             <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div v-for="(val, label) in {
                 'common.fullName': customer.name,
                 'customers.details.phone': customer.phone || '—',
                 'customers.details.group': customer.group_name || '—',
                 'customers.details.address': customer.address || '—',
                 'customers.details.registered': customer.created_on || formatDate(customer.createdAt),
                 'common.status': customer.status_display || 'FAOL'
               }" :key="label" class="space-y-1 group">
                 <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">{{ $t(label) }}</span>
                 <p v-if="label !== 'common.status'" class="text-xs font-black text-slate-800 dark:text-white">{{ val }}</p>
                 <p v-else><span class="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">{{ val }}</span></p>
               </div>
             </div>
          </div>
        </Transition>
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

    <!-- Pay Debt Dialog -->
    <PayDebtDialog 
        v-if="customer?.id"
        v-model:visible="payDebtDialog"
        :customer-id="customer.id"
        :customer-debt="customer.debt_balance"
        @success="loadCustomerData"
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
import PayDebtDialog from './components/PayDebtDialog.vue'

const route = useRoute()
const toast = useToast()
const { t } = useI18n()

const loading = ref(true)
const saving = ref(false)
const submitted = ref(false)
const customer = ref(null)
const trades = ref([])
const purchaseHistory = ref([])
const debtHistory = ref([])
const purchaseCount = ref(0)
const debtCount = ref(0)
const purchasePage = ref(1)
const debtPage = ref(1)
const totalDebt = ref(0)
const groups = ref([])

const currentFilters = ref({})
const purchaseSummary = ref(null)
const debtSummary = ref(null)

const handleFilters = (filters) => {
  currentFilters.value = filters
  loadPurchases(1)
  loadDebts(1)
}

import { computed } from 'vue'

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', icon: 'pi-home', label: t('common.overview') },
  { id: 'trades', icon: 'pi-shopping-bag', label: t('customers.trades.title') },
  { id: 'payments', icon: 'pi-wallet', label: t('common.payments') },
  { id: 'profile', icon: 'pi-user', label: t('common.profile') }
]

const editDialog = ref(false)
const payDebtDialog = ref(false)
const customerToEdit = ref({})

const lastTrades = computed(() => purchaseHistory.value?.slice(0, 3) || [])

const loadCustomerData = async () => {
  loading.value = true
  try {
    const id = route.params.id
    if (!id) return
    
    // Load base customer data
    const response = await customersAPI.getById(id)
    if (response.data.customer) {
        customer.value = response.data.customer
    } else {
        customer.value = response.data
    }

    // Load initial pages
    await Promise.all([
      loadPurchases(1),
      loadDebts(1)
    ])
    
  } catch (error) {
    console.error('Error loading customer details:', error)
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
  } finally {
    loading.value = false
  }
}

const loadPurchases = async (page = 1) => {
  try {
    const id = route.params.id
    const response = await customersAPI.getPurchases(id, { 
      page, 
      page_size: 10,
      ...currentFilters.value
    })
    purchaseHistory.value = response.data.results || []
    purchaseCount.value = response.data.count || purchaseHistory.value.length
    purchaseSummary.value = response.data.summary || null
    purchasePage.value = page
  } catch (error) {
    console.error('Error loading purchases:', error)
  }
}

const loadDebts = async (page = 1) => {
  try {
    const id = route.params.id
    const response = await customersAPI.getDebtSales(id, { 
      page, 
      page_size: 10,
      ...currentFilters.value
    })
    debtHistory.value = response.data.results || []
    debtCount.value = response.data.count || debtHistory.value.length
    debtSummary.value = response.data.summary || null
    totalDebt.value = response.data.total_debt || (debtSummary.value?.total_debt || 0)
    debtPage.value = page
  } catch (error) {
    console.error('Error loading debts:', error)
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

