<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
    <!-- Header with Tabs -->
    <div class="px-1 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <i class="pi pi-shopping-bag text-xs"></i>
          </div>
          <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">{{ $t('customers.trades.title') }}</h3>
        </div>
        <div v-if="activeTab === 'debts' && totalDebt > 0" class="flex items-center gap-2">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.debt') }}:</span>
          <span class="px-2.5 py-1 rounded-md bg-rose-500/10 text-[9px] font-black text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
            {{ formatCurrency(totalDebt) }}
          </span>
        </div>
      </div>
      
      <!-- Tab Switcher -->
      <div class="flex gap-1 px-4 pb-0">
        <button 
          v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 outline-none', activeTab === tab.id ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-600']"
        >
          {{ $t(`customers.trades.tabs.${tab.id}`) }} <span class="ml-1 opacity-50">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="flex-grow overflow-x-auto custom-scrollbar">
      <table class="w-full text-left min-w-[600px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <th class="px-5 py-3">{{ $t('common.date') }}</th>
            <th class="px-5 py-3">{{ $t('customers.trades.col_products') }}</th>
            <th class="px-5 py-3">{{ $t('customers.trades.col_total') }}</th>
            <th v-if="activeTab === 'debts'" class="px-5 py-3">{{ $t('customers.trades.col_paid_debt') }}</th>
            <th class="px-5 py-3 text-right">{{ $t('customers.trades.col_status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
          <tr v-if="!currentData.length">
            <td :colspan="activeTab === 'debts' ? 5 : 4" class="px-5 py-12 text-center text-[10px] font-bold text-slate-400 uppercase">
              {{ $t('customers.trades.no_history') }}
            </td>
          </tr>
          <tr v-for="t in currentData" :key="t.id" @click="showTradeDetails(t)" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
            <td class="px-5 py-3.5">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><i class="pi pi-clock text-[8px] text-slate-400"></i>{{ t.created_on }}</span>
                <span class="text-[8px] font-bold text-slate-400 flex items-center gap-1"><i class="pi pi-user text-[7px]"></i>{{ t.worker_name }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex flex-col gap-0.5" v-if="t.items?.length">
                <div v-for="(item, idx) in t.items.slice(0, 2)" :key="idx" class="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                   <span class="text-slate-400 mr-1">{{ parseFloat(item.quantity) }}{{ item.unit }}</span>{{ item.product_name }}
                </div>
                <span v-if="t.items.length > 2" class="text-[8px] font-black text-emerald-500 mt-0.5 uppercase">+ {{ t.items.length - 2 }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex flex-col"><span class="text-xs font-black text-slate-800 dark:text-white">{{ formatCurrency(t.net_price) }}</span><span v-if="parseFloat(t.discount_amount) > 0" class="text-[8px] font-black text-emerald-500 uppercase">-{{ formatCurrency(t.discount_amount) }}</span></div>
            </td>
            <td v-if="activeTab === 'debts'" class="px-5 py-3.5 text-[10px]">
              <div class="flex flex-col gap-0.5"><span class="font-bold text-emerald-600">{{ formatCurrency(t.paid_amount) }}</span><span class="font-black text-rose-500">{{ formatCurrency(t.debt_amount) }} qarz</span></div>
            </td>
            <td class="px-5 py-3.5 text-right"><TradeStatusBadge :status="t.payment_type" :display-label="t.payment_type_display" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <TradeDetailModal v-if="selectedTrade" v-model:visible="displayDetail" :trade="selectedTrade" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TradeStatusBadge from './TradeStatusBadge.vue'
import TradeDetailModal from './TradeDetailModal.vue'
import { useTradeUtils } from '../composables/useTradeUtils'

const props = defineProps({
  purchases: { type: Array, default: () => [] },
  debts: { type: Array, default: () => [] },
  totalDebt: { type: [Number, String], default: 0 }
})

const activeTab = ref('purchases')
const displayDetail = ref(false)
const selectedTrade = ref(null)

const { formatCurrency } = useTradeUtils()

const tabs = computed(() => [
  { id: 'purchases', count: props.purchases.length },
  { id: 'debts', count: props.debts.length }
])

const currentData = computed(() => activeTab.value === 'purchases' ? props.purchases : props.debts)

const showTradeDetails = (trade) => {
  selectedTrade.value = trade
  displayDetail.value = true
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
