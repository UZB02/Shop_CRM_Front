<template>
  <div class="space-y-4">
    <!-- Summary Cards (Payment types) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in paymentCards" :key="card.label" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group">
        <div class="absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:scale-125 transition-transform duration-500">
           <i :class="['pi', card.icon, 'text-4xl', card.color]"></i>
        </div>
        <div class="flex items-center gap-2 mb-2">
           <div :class="['w-1.5 h-6 rounded-full', card.bg]"></div>
           <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ t(card.label) }}</p>
        </div>
        <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ card.value }}</h3>
        <p class="text-[10px] font-bold text-slate-400 mt-1">{{ card.count }} {{ t('finance.sales_count').toLowerCase() }}</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
       <!-- Cumulative Bar Chart -->
       <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-6">
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ t('finance.revenue') }} / {{ t('finance.payment_methods') }}</h3>
          </div>
          <div class="h-[350px]">
             <Chart type="bar" :data="chartData" :options="chartOptions" />
          </div>
       </div>

       <!-- Distribution Pie Chart -->
       <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">{{ t('finance.share') }}</h3>
          <div class="h-[250px] relative">
             <Chart type="doughnut" :data="donutData" :options="donutOptions" />
             <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ t('common.total') }}</span>
                <span class="text-sm font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.summary?.total_revenue || 0).split('.')[0] }}</span>
             </div>
          </div>
          <div class="mt-8 space-y-4">
             <div v-for="method in distribution" :key="method.label" class="space-y-1.5">
                <div class="flex justify-between items-center px-1">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ t(method.label) }}</span>
                   <span class="text-[11px] font-black text-slate-800 dark:text-slate-100">{{ method.pct }}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div :class="['h-full rounded-full', method.bg]" :style="{ width: method.pct + '%' }"></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Table: Branches breakdown -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ t('finance.branch') }} bo'yicha taqsimot</h3>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/10">
                   <th class="px-5 py-3">{{ t('finance.branch') }}</th>
                   <th class="px-5 py-3">{{ t('finance.total_revenue') }}</th>
                   <th class="px-5 py-3">Naqd (Cash)</th>
                   <th class="px-5 py-3">Karta (Card)</th>
                   <th class="px-5 py-3">Nasiya (Debt)</th>
                   <th class="px-5 py-3">{{ t('finance.share') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                <tr v-for="item in tableData" :key="item.branch_id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/5 transition-colors">
                   <td class="px-5 py-3.5">
                      <span class="text-[11px] font-black tracking-tight text-slate-700 dark:text-slate-200">{{ item.branch_name }}</span>
                   </td>
                   <td class="px-5 py-3.5">
                      <span class="text-[12px] font-black text-rose-500">{{ formatPrice(item.total) }}</span>
                   </td>
                   <td class="px-5 py-3.5 text-[11px] font-semibold text-emerald-600">{{ formatPrice(item.cash) }}</td>
                   <td class="px-5 py-3.5 text-[11px] font-semibold text-blue-600">{{ formatPrice(item.card) }}</td>
                   <td class="px-5 py-3.5 text-[11px] font-semibold text-amber-600">{{ formatPrice(item.debt) }}</td>
                   <td class="px-5 py-3.5">
                      <div class="inline-flex px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">{{ item.share_pct }}%</div>
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
    { label: 'common.total', value: formatPrice(sum.total_revenue || 0), count: sum.sales_count || 0, icon: 'pi-wallet', color: 'text-rose-500', bg: 'bg-rose-500' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.map(i => i.label) || [],
  datasets: [
    { label: 'Naqd', data: props.data.chart?.map(i => parseFloat(i.cash)) || [], backgroundColor: '#10b981', borderRadius: 6 },
    { label: 'Karta', data: props.data.chart?.map(i => parseFloat(i.card)) || [], backgroundColor: '#3b82f6', borderRadius: 6 },
    { label: 'Nasiya', data: props.data.chart?.map(i => parseFloat(i.debt)) || [], backgroundColor: '#f59e0b', borderRadius: 6 }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 8, padding: 20, font: { size: 10, weight: 'bold' }, usePointStyle: true } },
    tooltip: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12 }
  },
  scales: {
    x: { stacked: true, grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } },
    y: { stacked: true, grid: { color: 'rgba(203, 213, 225, 0.1)' }, ticks: { font: { size: 9, weight: 'bold' } } }
  }
}

const donutData = computed(() => {
  const sum = props.data.summary || {}
  return {
    labels: ['Naqd', 'Karta', 'Nasiya'],
    datasets: [{
      data: [sum.cash?.share_pct || 0, sum.card?.share_pct || 0, sum.debt?.share_pct || 0],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 12
    }]
  }
})

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '82%'
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
