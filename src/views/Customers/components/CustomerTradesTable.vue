<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
    <!-- Header with Tabs -->
    <div class="px-1 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 gap-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <i class="pi pi-shopping-bag text-[10px]"></i>
          </div>
          <h3 class="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-widest truncate">{{ $t('customers.trades.title') }}</h3>
        </div>
        <div v-if="activeTab === 'debts' && totalDebt > 0" class="flex items-center gap-2 bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/10 self-start sm:self-auto">
          <span class="text-[8px] font-black text-rose-500/70 uppercase tracking-widest leading-none">{{ $t('customers.details.debt') }}:</span>
          <span class="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase leading-none">
            {{ formatCurrency(totalDebt) }}
          </span>
        </div>
      </div>
      
      <!-- Tab Switcher & Professional Filters (More Compact & Responsive) -->
      <div class="px-3 pb-3">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <!-- Left: Tabs (Scrollable on mobile) -->
          <div class="flex gap-0.5 bg-slate-100/50 dark:bg-slate-900/50 p-0.5 rounded-lg w-full lg:w-fit overflow-x-auto no-scrollbar border border-slate-200/50 dark:border-slate-800/50">
            <button 
              v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              :class="['px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all outline-none whitespace-nowrap flex-1 lg:flex-none text-center', activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300']"
            >
              {{ $t(`customers.trades.tabs.${tab.id}`) }} <span class="ml-1 opacity-50 font-black">({{ tab.count }})</span>
            </button>
          </div>

          <!-- Right: Professional Filters Group (Responsive Wrap) -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Search Filter -->
            <div class="relative group/search flex-grow sm:flex-grow-0">
              <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400"></i>
              <input 
                v-model="filters.search" 
                @input="debounceApplyFilters"
                type="text" 
                :placeholder="$t('common.search')" 
                class="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 rounded-lg pl-7 pr-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500/50 w-full sm:w-32"
              />
            </div>

            <!-- Amount Range Filter -->
            <div class="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-lg p-0.5 transition-colors flex-grow sm:flex-grow-0 justify-center">
              <div class="flex items-center px-1.5 py-1 gap-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 flex-1 sm:flex-none">
                <span class="text-[7px] font-black text-slate-400">MIN</span>
                <input type="number" v-model="filters.min_amount" @change="applyFilters" placeholder="0" class="bg-transparent border-none text-[9px] font-black text-slate-600 dark:text-slate-300 outline-none w-full sm:w-14" />
              </div>
              <div class="flex items-center px-1.5 py-1 gap-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 flex-1 sm:flex-none">
                <span class="text-[7px] font-black text-slate-400">MAX</span>
                <input type="number" v-model="filters.max_amount" @change="applyFilters" placeholder="∞" class="bg-transparent border-none text-[9px] font-black text-slate-600 dark:text-slate-300 outline-none w-full sm:w-14" />
              </div>
            </div>

            <!-- Professional Date Range Wrapper -->
            <div class="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-lg p-0.5 transition-colors flex-grow lg:flex-grow-0 justify-center">
              <div class="flex items-center px-2 py-1 gap-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 flex-1 lg:flex-none">
                <i class="pi pi-calendar text-[9px] text-slate-400"></i>
                <input type="date" v-model="filters.date_from" @change="applyFilters" class="bg-transparent border-none text-[9px] font-black text-slate-600 dark:text-slate-300 outline-none w-full sm:w-auto uppercase" />
              </div>
              <div class="flex items-center px-2 py-1 gap-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 flex-1 lg:flex-none">
                <input type="date" v-model="filters.date_to" @change="applyFilters" class="bg-transparent border-none text-[9px] font-black text-slate-600 dark:text-slate-300 outline-none w-full sm:w-auto uppercase" />
                <i class="pi pi-calendar text-[9px] text-slate-400"></i>
              </div>
            </div>

            <!-- Payment Type Select & Debt Toggle group -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative group/select flex-grow sm:flex-grow-0">
                <select v-model="filters.payment_type" @change="applyFilters" 
                        class="appearance-none bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 rounded-lg pl-3 pr-7 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 outline-none focus:border-emerald-500/50 transition-all cursor-pointer w-full sm:w-auto">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="cash">{{ $t('common.cash_label') }}</option>
                  <option value="card">{{ $t('common.card_label') }}</option>
                  <option value="mixed">{{ $t('shifts.payment.mixed') }}</option>
                  <option value="debt">{{ $t('common.debt_status') }}</option>
                </select>
                <i class="pi pi-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 pointer-events-none"></i>
              </div>

              <button @click="toggleHasDebt" 
                      :class="['h-8 px-3 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 flex-grow sm:flex-grow-0', filters.has_debt ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700']">
                <div :class="['w-1 h-1 rounded-full', filters.has_debt ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600']"></div>
                <span class="whitespace-nowrap">{{ $t('customers.tab_debtors') }}</span>
              </button>

              <button v-if="isFiltersActive" @click="resetFilters" 
                      class="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-all flex items-center justify-center active:scale-95 shrink-0">
                <i class="pi pi-filter-slash text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Summary Stats Section -->
      <div v-if="currentSummary" class="px-5 pb-4">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-2xl p-3 shadow-inner">
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest">{{ $t('common.all') }}</span>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{ formatCurrency(currentSummary.total_amount) }}</span>
          </div>
          <div class="flex flex-col border-l border-emerald-500/10 pl-3">
            <span class="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest">{{ $t('common.net_price') }}</span>
            <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ formatCurrency(currentSummary.total_net) }}</span>
          </div>
          <div class="flex flex-col border-l border-emerald-500/10 pl-3">
            <span class="text-[8px] font-black text-rose-500/70 uppercase tracking-widest">{{ $t('common.debt_label') }}</span>
            <span class="text-xs font-black text-rose-500">{{ formatCurrency(currentSummary.total_debt) }}</span>
          </div>
          <div class="flex flex-col border-l border-emerald-500/10 pl-3">
            <span class="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest">{{ $t('common.success') }}</span>
            <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ currentSummary.total_count }} {{ $t('customers.trades.count', { count: '' }) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modernized Table Body -->
    <div class="flex-grow overflow-y-auto custom-scrollbar">
      <table class="w-full text-left border-separate border-spacing-y-2 px-4">
        <thead>
          <tr class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400/80">
            <th class="px-4 py-2">{{ $t('common.date') }}</th>
            <th class="px-4 py-2">{{ $t('customers.trades.col_products') }}</th>
            <th class="px-4 py-2">{{ $t('customers.trades.col_total') }}</th>
            <th class="px-4 py-2 text-right">{{ $t('customers.trades.col_status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in currentData" :key="t.id" 
              @click="showTradeDetails(t)"
              class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer rounded-2xl relative overflow-hidden">
            
            <!-- Date & Collector Info -->
            <td class="px-4 py-4 first:rounded-l-2xl">
              <div class="flex flex-col">
                <span class="text-[11px] font-black text-slate-900 dark:text-white leading-none whitespace-nowrap">
                  {{ t.created_on.split('|')[0] }}
                </span>
                <span class="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-tighter">
                  {{ t.created_on.split('|')[1] }}
                </span>
                <div class="flex items-center gap-1.5 mt-2.5">
                  <div class="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <i class="pi pi-user text-[8px] text-slate-400"></i>
                  </div>
                  <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 truncate max-w-[80px]">{{ t.worker_name }}</span>
                </div>
              </div>
            </td>

            <!-- Modernized Product List -->
            <td class="px-4 py-4 min-w-[200px]">
              <div class="flex flex-col gap-1.5">
                <div v-for="(item, idx) in t.items?.slice(0, 2)" :key="idx" class="flex items-center gap-2 group/item">
                  <div class="w-1 h-3 rounded-full bg-emerald-500/20 group-hover/item:bg-emerald-500 transition-colors"></div>
                  <span class="text-[10px] font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <span class="text-emerald-500">{{ parseFloat(item.quantity) }}{{ item.unit }}</span> 
                    {{ item.product_name }}
                    <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                  </span>
                </div>
                <div v-if="t.items?.length > 2" class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  +{{ t.items.length - 2 }} {{ $t('common.more') }}
                </div>
              </div>
            </td>

            <!-- Financial Info -->
            <td class="px-4 py-4">
              <div class="flex flex-col">
                <span class="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  {{ formatCurrency(t.net_price) }}
                </span>
                <div v-if="Number(t.discount_amount) > 0" class="flex items-center gap-1 mt-1">
                  <span class="text-[9px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md">-{{ formatCurrency(t.discount_amount) }}</span>
                </div>
                <div v-if="Number(t.debt_amount) > 0" class="mt-1.5">
                  <span class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-tighter bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {{ formatCurrency(t.debt_amount) }} {{ $t('common.debt_label') }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Status Badge -->
            <td class="px-4 py-4 text-right last:rounded-r-2xl">
              <div class="flex flex-col items-end gap-2">
                <TradeStatusBadge :status="t.payment_type" :display-label="t.status_display || t.payment_type_display" />
                <span v-if="t.branch_name" class="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  <i class="pi pi-map-marker text-[7px]"></i>
                  {{ t.branch_name }}
                </span>
              </div>
              <!-- Interactive Hover Indicator -->
              <div class="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalRecords > 0" 
         class="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none">
        {{ $t('workers.page_info', { current: currentPage, total: totalPages }) }}
      </div>
      <div class="flex items-center gap-1">
        <button @click="changePage(1)" :disabled="currentPage === 1"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-double-left text-[10px]"></i>
        </button>
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-left text-[10px]"></i>
        </button>
        
        <div class="flex items-center gap-1 mx-1">
          <template v-for="page in displayedPages" :key="page">
            <button @click="changePage(page)"
                    class="w-8 h-8 rounded-xl text-[11px] font-black transition-all shadow-sm border focus:outline-none"
                    :class="currentPage === page 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
              {{ page }}
            </button>
          </template>
        </div>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-right text-[10px]"></i>
        </button>
        <button @click="changePage(totalPages)" :disabled="currentPage === totalPages"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-double-right text-[10px]"></i>
        </button>
      </div>
    </div>

    <!-- Modals removed, delegated to parent -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TradeStatusBadge from './TradeStatusBadge.vue'
import TurBadge from '@/components/common/TurBadge.vue'
import { useTradeUtils } from '../composables/useTradeUtils'

const props = defineProps({
  purchases: { type: Array, default: () => [] },
  debts: { type: Array, default: () => [] },
  purchaseCount: { type: Number, default: 0 },
  debtCount: { type: Number, default: 0 },
  purchasePage: { type: Number, default: 1 },
  debtPage: { type: Number, default: 1 },
  purchaseSummary: { type: Object, default: null },
  debtSummary: { type: Object, default: null },
  totalDebt: { type: [Number, String], default: 0 }
})

const emit = defineEmits(['update:purchasePage', 'update:debtPage', 'filter', 'selectTrade'])

const filters = ref({
  payment_type: '',
  has_debt: false,
  date_from: '',
  date_to: '',
  search: '',
  min_amount: '',
  max_amount: ''
})

const isFiltersActive = computed(() => {
  return filters.value.payment_type || filters.value.has_debt || filters.value.date_from || filters.value.date_to || filters.value.search || filters.value.min_amount || filters.value.max_amount
})

let debounceTimer = null
const debounceApplyFilters = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  emit('filter', { ...filters.value })
}

const toggleHasDebt = () => {
  filters.value.has_debt = !filters.value.has_debt
  applyFilters()
}

const resetFilters = () => {
  filters.value = {
    payment_type: '',
    has_debt: false,
    date_from: '',
    date_to: '',
    search: '',
    min_amount: '',
    max_amount: ''
  }
  applyFilters()
}

const activeTab = ref('purchases')

const { formatCurrency } = useTradeUtils()

const currentSummary = computed(() => activeTab.value === 'purchases' ? props.purchaseSummary : props.debtSummary)

const tabs = computed(() => [
  { id: 'purchases', count: props.purchaseCount },
  { id: 'debts', count: props.debtCount }
])

const rows = ref(10)

const totalRecords = computed(() => activeTab.value === 'purchases' ? props.purchaseCount : props.debtCount)
const currentPage = computed(() => activeTab.value === 'purchases' ? props.purchasePage : props.debtPage)

const totalPages = computed(() => {
  return Math.ceil((totalRecords.value || 0) / (rows.value || 10))
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({length: Math.max(0, total)}, (_, i) => i + 1)
  
  if (current <= 3) return [1, 2, 3, 4, 5]
  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  
  return [current - 2, current - 1, current, current + 1, current + 2]
})

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  if (activeTab.value === 'purchases') {
    emit('update:purchasePage', page)
  } else {
    emit('update:debtPage', page)
  }
}

const currentData = computed(() => activeTab.value === 'purchases' ? props.purchases : props.debts)

const showTradeDetails = (trade) => {
  emit('selectTrade', trade)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
tr { margin-bottom: 0.5rem; }
</style>
