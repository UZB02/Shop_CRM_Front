<template>
  <div class="space-y-4">
    <!-- Analysis Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
       <div class="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div class="flex items-center justify-between mb-8">
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ t('finance.profitability') }} Analysis</h3>
          </div>
          <div class="h-[400px]">
             <Chart type="bar" :data="chartData" :options="chartOptions" />
          </div>
       </div>

       <!-- Summary Stats -->
       <div class="space-y-4">
          <div v-for="stat in summaryStats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
             <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ t(stat.label) }}</p>
             <h4 :class="['text-lg font-black tracking-tighter', stat.color]">{{ stat.value }}</h4>
             <div class="mt-2 w-full h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <div :class="['h-full rounded-full', stat.bg]" :style="{ width: stat.pct + '%' }"></div>
             </div>
          </div>
       </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/10">
                   <th class="px-6 py-4">ID</th>
                   <th class="px-6 py-4">{{ t('finance.category') }}</th>
                   <th class="px-6 py-4">{{ t('finance.revenue') }}</th>
                   <th class="px-6 py-4">Tannarx (COGS)</th>
                   <th class="px-6 py-4">{{ t('finance.gross_profit') }}</th>
                   <th class="px-6 py-4">{{ t('finance.margin') }} %</th>
                   <th class="px-6 py-4">Sotuv soni</th>
                   <th class="px-6 py-4">Ulushi %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in tableData" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                   <td class="px-6 py-3 text-[10px] font-bold text-slate-400">#{{ item.id }}</td>
                   <td class="px-6 py-3">
                      <div class="flex flex-col">
                         <span class="text-[12px] font-black text-slate-800 dark:text-slate-100">{{ item.name }}</span>
                         <span v-if="item.parent" class="text-[9px] font-bold text-slate-400 uppercase">{{ item.parent }}</span>
                      </div>
                   </td>
                   <td class="px-6 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-6 py-3 text-[11px] font-semibold text-slate-400">{{ formatPrice(item.cogs) }}</td>
                   <td class="px-6 py-3">
                      <span class="text-[11px] font-black text-emerald-600">{{ formatPrice(item.gross_profit) }}</span>
                   </td>
                   <td class="px-6 py-3">
                      <div :class="['inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold', parseFloat(item.margin_pct) > 15 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
                         {{ item.margin_pct }}%
                      </div>
                   </td>
                   <td class="px-6 py-3 text-[11px] font-semibold text-slate-500">{{ item.sales_count }}</td>
                   <td class="px-6 py-3">
                      <span class="text-[10px] font-black text-slate-400">{{ item.share_pct }}%</span>
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

const summaryStats = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'finance.total_revenue', value: formatPrice(sum.total_revenue || 0), pct: 100, color: 'text-slate-800 dark:text-white', bg: 'bg-slate-400' },
    { label: 'finance.gross_profit', value: formatPrice(sum.total_profit || 0), pct: sum.avg_margin_pct || 0, color: 'text-emerald-600', bg: 'bg-emerald-500' },
    { label: 'finance.margin', value: (sum.avg_margin_pct || 0) + '%', pct: sum.avg_margin_pct || 0, color: 'text-rose-600', bg: 'bg-rose-500' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.slice(0, 15).map(i => i.label) || [],
  datasets: [
    {
      label: 'Gross Profit',
      data: props.data.chart?.slice(0, 15).map(i => parseFloat(i.gross_profit)) || [],
      backgroundColor: '#f43f5e',
      borderRadius: 4
    },
    {
      label: 'COGS',
      data: props.data.chart?.slice(0, 15).map(i => parseFloat(i.cogs)) || [],
      backgroundColor: '#e2e8f0',
      borderRadius: 4
    }
  ]
}))

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10, weight: 'bold' } } },
    tooltip: { backgroundColor: '#1e293b', padding: 12, borderRadius: 12 }
  },
  scales: {
    x: { grid: { color: 'rgba(203, 213, 225, 0.1)' }, ticks: { font: { size: 9, weight: 'bold' } } },
    y: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
  }
}

const tableData = computed(() => props.data.table || [])
</script>
