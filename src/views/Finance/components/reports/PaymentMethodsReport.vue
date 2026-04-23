<template>
  <div class="space-y-6 pb-10">
    <!-- Summary Cards (Payment types) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="card in paymentCards" :key="card.label" class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
        <div :class="['absolute -right-4 -bottom-4 w-20 h-20 opacity-10 group-hover:scale-150 transition-transform duration-700 blur-2xl rounded-full', card.bg]"></div>
        <div class="flex items-center gap-3 mb-4 relative z-10">
           <div :class="['w-1 h-6 rounded-full', card.bg]"></div>
           <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ t(card.label) }}</p>
        </div>
        <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2 relative z-10">{{ card.value }}</h3>
        <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
          <i :class="['pi', card.icon, 'text-[8px]']"></i>
          <span>{{ card.count }} {{ t('finance.sales_count').toLowerCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <!-- Cumulative Bar Chart -->
       <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-10">
             <div>
                <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">To'lov Usullari</h3>
                <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Tushumlar strukturasi</p>
             </div>
             <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                   <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash</span>
                </div>
                <div class="flex items-center gap-2">
                   <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card</span>
                </div>
             </div>
          </div>
          <div class="h-[300px] sm:h-[400px]">
             <Chart type="bar" :data="chartData" :options="chartOptions" />
          </div>
       </div>

       <!-- Distribution Pie Chart -->
       <div class="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Umumiy Taqsimot</h3>
          <div class="h-[220px] sm:h-[250px] relative mb-10 flex items-center justify-center">
             <Chart type="doughnut" :data="donutData" :options="donutOptions" class="relative z-10" />
             <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ t('common.total') }}</span>
                <span class="text-xl font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.summary?.total_revenue || 0).split('.')[0] }}</span>
             </div>
          </div>
          <div class="space-y-5 flex-1">
             <div v-for="method in distribution" :key="method.label" class="space-y-2">
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ t(method.label) }}</span>
                   <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ method.pct }}%</span>
                </div>
                <div class="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                   <div :class="['h-full rounded-full transition-all duration-1000', method.bg]" :style="{ width: method.pct + '%' }"></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Table: Branches breakdown -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
             <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
             <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Filiallar bo'yicha tahlil</span>
          </div>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-8 py-5">{{ t('finance.branch') }}</th>
                   <th class="px-8 py-5 text-right">{{ t('finance.total_revenue') }}</th>
                   <th class="px-8 py-5 text-right">Naqd (Cash)</th>
                   <th class="px-8 py-5 text-right">Karta (Card)</th>
                   <th class="px-8 py-5 text-right">Nasiya (Debt)</th>
                   <th class="px-8 py-5 text-center">{{ t('finance.share') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                <tr v-for="item in tableData" :key="item.branch_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                   <td class="px-8 py-5">
                      <span class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{{ item.branch_name }}</span>
                   </td>
                   <td class="px-8 py-5 text-right">
                      <span class="text-sm font-black text-emerald-600">{{ formatPrice(item.total) }}</span>
                   </td>
                   <td class="px-8 py-5 text-right text-xs font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(item.cash) }}</td>
                   <td class="px-8 py-5 text-right text-xs font-bold text-blue-600/80">{{ formatPrice(item.card) }}</td>
                   <td class="px-8 py-5 text-right text-xs font-bold text-amber-500/80">{{ formatPrice(item.debt) }}</td>
                   <td class="px-8 py-5 text-center">
                      <div class="inline-flex px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">{{ item.share_pct }}%</div>
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
  data: { type: Object, default: () => ({ summary: {}, chart: [], table: [] }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)

const paymentCards = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'common.cash', value: formatPrice(sum.cash?.amount || 0), count: sum.cash?.count || 0, icon: 'pi-money-bill', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { label: 'common.card', value: formatPrice(sum.card?.amount || 0), count: sum.card?.count || 0, icon: 'pi-credit-card', color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'common.debt', value: formatPrice(sum.debt?.amount || 0), count: sum.debt?.count || 0, icon: 'pi-history', color: 'text-amber-500', bg: 'bg-amber-500' },
    { label: 'common.total', value: formatPrice(sum.total_revenue || 0), count: sum.sales_count || 0, icon: 'pi-wallet', color: 'text-emerald-600', bg: 'bg-emerald-600' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.map(i => i.label) || [],
  datasets: [
    { label: 'Naqd', data: props.data.chart?.map(i => parseFloat(i.cash)) || [], backgroundColor: '#10b981', borderRadius: 8, barThickness: 20 },
    { label: 'Karta', data: props.data.chart?.map(i => parseFloat(i.card)) || [], backgroundColor: '#3b82f6', borderRadius: 8, barThickness: 20 },
    { label: 'Nasiya', data: props.data.chart?.map(i => parseFloat(i.debt)) || [], backgroundColor: '#f59e0b', borderRadius: 8, barThickness: 20 }
  ]
}))

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
  return {
    labels: ['Naqd', 'Karta', 'Nasiya'],
    datasets: [{
      data: [sum.cash?.share_pct || 0, sum.card?.share_pct || 0, sum.debt?.share_pct || 0],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 8,
      borderColor: 'transparent',
      borderRadius: 10,
      hoverOffset: 15
    }]
  }
})

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '80%',
  spacing: 5
}

const distribution = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'common.cash', pct: sum.cash?.share_pct || 0, bg: 'bg-emerald-500' },
    { label: 'common.card', pct: sum.card?.share_pct || 0, bg: 'bg-blue-500' },
    { label: 'common.debt', pct: sum.debt?.share_pct || 0, bg: 'bg-amber-500' }
  ]
})

const tableData = computed(() => props.data.table || [])
</script>
