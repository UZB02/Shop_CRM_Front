<template>
  <div class="space-y-4 pb-4">
    <!-- Summary Cards (Payment types) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="card in paymentCards"
        :key="card.label"
        :class="[
          'bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group',
          activeMethod && card.key !== 'total' && card.key !== activeMethod
            ? 'opacity-40 border-slate-100 dark:border-slate-800'
            : 'border-slate-100 dark:border-slate-800',
          activeMethod && card.key === activeMethod
            ? 'ring-2 ring-offset-1 ring-emerald-400/50 dark:ring-offset-slate-900'
            : ''
        ]"
      >
        <div :class="['absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full', card.bg]"></div>
        <div class="flex items-center gap-1.5 mb-2 relative z-10">
           <div :class="['w-1.5 h-1.5 rounded-full', card.bg]"></div>
           <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ t(card.label) }}</p>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1 relative z-10">{{ card.value }}</h3>
        <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
          <i :class="['pi', card.icon, 'text-[8px]']"></i>
          <span>{{ card.count }} {{ t('finance.sales_count').toLowerCase() }}</span>
          <span v-if="card.mixed" class="text-emerald-500 ml-auto">+{{ card.mixed }} aralash</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
       <!-- Cumulative Bar Chart -->
       <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div class="mb-4">
             <h3 class="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">To'lov Usullari</h3>
             <p class="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">Tushumlar strukturasi</p>
          </div>
          <div class="flex-1 min-h-[220px] sm:min-h-[250px]">
             <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
       </div>

       <!-- Distribution Pie Chart -->
       <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <h3 class="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 dark:border-slate-800 pb-2">Ulushi Taqsimoti</h3>
          <div class="h-[180px] relative mb-6 flex items-center justify-center">
             <Chart type="doughnut" :data="donutData" :options="donutOptions" class="relative z-10 w-full h-full" />
             <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{{ t('common.total') }}</span>
                <span class="text-lg font-black text-slate-800 dark:text-white leading-none">
                  {{ Math.floor(props.data.summary?.total_revenue || 0).toLocaleString() }}
                </span>
                <span class="text-[8px] font-black text-slate-400 mt-1">SO'M</span>
             </div>
          </div>
          <div class="space-y-4 flex-1">
             <div v-for="method in distribution" :key="method.label" class="group">
                <div class="flex items-center justify-between mb-1.5">
                   <div class="flex items-center gap-2">
                      <div :class="['w-1.5 h-1.5 rounded-full shadow-sm', method.bg]"></div>
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{{ t(method.label) }}</span>
                   </div>
                   <span class="text-[10px] font-black text-slate-800 dark:text-slate-100">{{ method.pct }}%</span>
                </div>
                <div class="h-1 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                   <div :class="['h-full rounded-full transition-all duration-1000 shadow-sm', method.bg]" :style="{ width: method.pct + '%' }"></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Table: Branches breakdown -->
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-2">
             <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
             <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Filiallar bo'yicha tahlil</span>
          </div>
       </div>
       <div class="overflow-x-auto max-h-[400px] custom-scrollbar overflow-y-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[9px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                   <th class="px-4 py-3">{{ t('finance.branch') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.total_revenue') }}</th>
                   <th class="px-4 py-3 text-center">Sotuvlar</th>
                   <th class="px-4 py-3 text-right">Naqd</th>
                   <th class="px-4 py-3 text-right">Karta</th>
                   <th class="px-4 py-3 text-right">Nasiya</th>
                   <th class="px-4 py-3 text-center">{{ t('finance.share') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="item in tableData" :key="item.branch_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                   <td class="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ item.branch_name }}</td>
                   <td class="px-4 py-3 text-right text-xs font-bold text-emerald-600">{{ formatPrice(item.total) }}</td>
                   <td class="px-4 py-3 text-center text-[11px] text-slate-500">{{ item.sales_count }}</td>
                   <td class="px-4 py-3 text-right text-[11px] text-slate-500">{{ formatPrice(item.cash) }}</td>
                   <td class="px-4 py-3 text-right text-[11px] text-slate-500">{{ formatPrice(item.card) }}</td>
                   <td class="px-4 py-3 text-right text-[11px] text-slate-500">{{ formatPrice(item.debt) }}</td>
                   <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                         <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-slate-400 dark:bg-slate-500 rounded-full" :style="{ width: item.share_pct + '%' }"></div>
                         </div>
                         <span class="text-[10px] font-medium text-slate-400 w-8">{{ item.share_pct }}%</span>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  data:         { type: Object, default: () => ({ summary: {}, chart: [], table: [] }) },
  activeMethod: { type: String,  default: null }  // 'cash' | 'card' | 'debt' | null
})

const formatPrice = (val) => settingsStore.formatPrice(val)

// Visibility helper
const isActive = (key) => !props.activeMethod || props.activeMethod === key

const paymentCards = computed(() => {
  const sum = props.data.summary || {}
  return [
    { key: 'cash', label: 'common.cash', value: formatPrice(sum.cash?.amount || 0), count: sum.cash?.count || 0, icon: 'pi-money-bill', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { key: 'card', label: 'common.card', value: formatPrice(sum.card?.amount || 0), count: sum.card?.count || 0, icon: 'pi-credit-card', color: 'text-blue-500', bg: 'bg-blue-500' },
    { key: 'debt', label: 'common.debt', value: formatPrice(sum.debt?.amount || 0), count: sum.debt?.count || 0, icon: 'pi-history', color: 'text-amber-500', bg: 'bg-amber-500' },
    {
      key: 'total',
      label: 'common.total',
      value: formatPrice(sum.total_revenue || 0),
      count: sum.sales_count || 0,
      mixed: sum.mixed_count || 0,
      icon: 'pi-wallet',
      color: 'text-emerald-600',
      bg: 'bg-emerald-600'
    }
  ]
})

// All method definitions
const ALL_METHODS = [
  { key: 'cash',  label: 'Naqd',   color: '#10b981' },
  { key: 'card',  label: 'Karta',  color: '#3b82f6' },
  { key: 'debt',  label: 'Nasiya', color: '#f59e0b' },
]

const chartData = computed(() => {
  const methods = props.activeMethod
    ? ALL_METHODS.filter(m => m.key === props.activeMethod)
    : ALL_METHODS

  return {
    labels: props.data.chart?.map(i => i.label) || [],
    datasets: methods.map(m => ({
      label: m.label,
      data: props.data.chart?.map(i => parseFloat(i[m.key])) || [],
      backgroundColor: m.color,
      borderRadius: 8,
      barThickness: 30
    }))
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { 
      backgroundColor: '#1e293b', 
      padding: 16, 
      borderRadius: 16,
      titleFont: { size: 12, weight: 'bold', family: 'Inter' },
      bodyFont: { size: 14, weight: '900', family: 'Inter' }
    }
  },
  scales: {
    x: { 
      stacked: true, 
      grid: { display: false }, 
      ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } } 
    },
    y: { 
      stacked: true, 
      grid: { color: 'rgba(203, 213, 225, 0.08)', drawBorder: false },
      ticks: { 
        color: '#94a3b8', 
        font: { size: 10, weight: '600' },
        callback: (val) => val >= 1000 ? (val/1000).toFixed(0) + 'K' : val
      }
    }
  }
}

const donutData = computed(() => {
  const sum = props.data.summary || {}
  const methods = props.activeMethod
    ? ALL_METHODS.filter(m => m.key === props.activeMethod)
    : ALL_METHODS

  return {
    labels: methods.map(m => m.label),
    datasets: [{
      data: methods.map(m => sum[m.key]?.share_pct || 0),
      backgroundColor: methods.map(m => m.color),
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 12,
      hoverOffset: 15
    }]
  }
})

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      borderRadius: 12,
      titleFont: { size: 11, weight: 'bold' },
      bodyFont: { size: 12, weight: 'black' }
    }
  },
  cutout: '75%',
  spacing: 4
}))

const distribution = computed(() => {
  const sum = props.data.summary || {}
  const methods = props.activeMethod
    ? ALL_METHODS.filter(m => m.key === props.activeMethod)
    : ALL_METHODS
  const bgMap = { cash: 'bg-emerald-500', card: 'bg-blue-500', debt: 'bg-amber-500' }
  return methods.map(m => ({
    label: 'common.' + m.key,
    pct: sum[m.key]?.share_pct || 0,
    bg: bgMap[m.key]
  }))
})

const tableData = computed(() => props.data.table || [])
</script>
