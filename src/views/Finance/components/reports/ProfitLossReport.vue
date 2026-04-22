<template>
  <div class="space-y-6">
    <!-- Exec Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
       <div v-for="card in execCards" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm relative overflow-hidden group">
          <div :class="['absolute right-0 top-0 w-24 h-24 blur-3xl opacity-10 rounded-full -translate-y-1/2 translate-x-1/2', card.glow]"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">{{ t(card.label) }}</p>
          <div class="flex items-end justify-between">
             <h3 :class="['text-xl font-black tracking-tighter truncate', card.color]">{{ card.value }}</h3>
             <span v-if="card.sub" class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{{ card.sub }}</span>
          </div>
       </div>
    </div>

    <!-- Profitability Trend Chart -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
       <div class="flex items-center justify-between mb-8">
          <div>
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ t('reports.profit_loss') }} Trendi</h3>
             <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase">{{ props.data.year }} yil hisoboti</p>
          </div>
          <div class="flex gap-4">
             <div class="flex items-center gap-2">
                <div class="w-3 h-1 rounded-full bg-rose-500"></div>
                <span class="text-[10px] font-black uppercase text-slate-400">Net Profit</span>
             </div>
             <div class="flex items-center gap-2">
                <div class="w-3 h-1 rounded-full bg-slate-300"></div>
                <span class="text-[10px] font-black uppercase text-slate-400">Revenue</span>
             </div>
          </div>
       </div>
       <div class="h-[350px]">
          <Chart type="line" :data="chartData" :options="chartOptions" />
       </div>
    </div>

    <!-- Detailed Monthly Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
       <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Oylik moliyaviy jadval</span>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-6 py-4">Oy</th>
                   <th class="px-6 py-4">{{ t('finance.revenue') }}</th>
                   <th class="px-6 py-4">COGS (Tannarx)</th>
                   <th class="px-6 py-4">{{ t('finance.gross_profit') }}</th>
                   <th class="px-6 py-4">{{ t('finance.wastage_loss') }}</th>
                   <th class="px-6 py-4">Xarajatlar</th>
                   <th class="px-6 py-4">{{ t('finance.net_profit') }}</th>
                   <th class="px-6 py-4">Margin %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                <tr v-for="row in tableData" :key="row.month" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                   <td class="px-6 py-4">
                      <span class="text-[12px] font-black text-slate-800 dark:text-slate-100">{{ row.month_name }}</span>
                   </td>
                   <td class="px-6 py-4 text-[12px] font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(row.revenue) }}</td>
                   <td class="px-6 py-4 text-[12px] font-bold text-slate-400">{{ formatPrice(row.cogs) }}</td>
                   <td class="px-6 py-4">
                      <span class="text-[12px] font-black text-emerald-600">{{ formatPrice(row.gross_profit) }}</span>
                   </td>
                   <td class="px-6 py-4 text-[11px] font-bold text-slate-400">({{ formatPrice(row.wastage_loss) }})</td>
                   <td class="px-6 py-4 text-[11px] font-bold text-slate-400">{{ formatPrice(row.expenses) }}</td>
                   <td class="px-6 py-4">
                      <span :class="['text-[14px] font-black', parseFloat(row.net_profit) >= 0 ? 'text-rose-500' : 'text-slate-400']">
                         {{ formatPrice(row.net_profit) }}
                      </span>
                   </td>
                   <td class="px-6 py-4">
                      <div :class="['inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black', parseFloat(row.margin_pct) > 0 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500']">
                         {{ row.margin_pct }}%
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
  data: { type: Object, default: () => ({ summary: {}, data: [] }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)

const execCards = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'finance.total_revenue', value: formatPrice(sum.total_revenue || 0), color: 'text-slate-800 dark:text-white', glow: 'bg-slate-500' },
    { label: 'finance.gross_profit', value: formatPrice(sum.total_gross_profit || 0), color: 'text-emerald-600', glow: 'bg-emerald-500' },
    { label: 'finance.wastage_loss', value: formatPrice(sum.total_wastage_loss || 0), color: 'text-amber-500', glow: 'bg-amber-500', sub: 'Zarar' },
    { label: 'finance.net_profit', value: formatPrice(sum.total_net_profit || 0), color: 'text-rose-600', glow: 'bg-rose-500' },
    { label: 'finance.margin', value: (sum.avg_margin_pct || 0) + '%', color: 'text-slate-900 dark:text-slate-100', glow: 'bg-blue-500', sub: "O'rtacha" }
  ]
})

const chartData = computed(() => ({
  labels: props.data.data?.map(i => i.month_name) || [],
  datasets: [
    {
      label: 'Net Profit',
      data: props.data.data?.map(i => parseFloat(i.net_profit)) || [],
      borderColor: '#f43f5e',
      backgroundColor: '#f43f5e',
      borderWidth: 4,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4
    },
    {
      label: 'Revenue',
      data: props.data.data?.map(i => parseFloat(i.revenue)) || [],
      borderColor: 'rgba(203, 213, 225, 0.4)',
      backgroundColor: 'rgba(203, 213, 225, 0.1)',
      borderWidth: 2,
      borderDash: [5,5],
      pointRadius: 0,
      tension: 0.4,
      fill: true
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: { size: 11, weight: 'bold' },
      bodyFont: { size: 13, weight: 'black' },
      padding: 12,
      borderRadius: 16
    }
  },
  scales: {
    y: { grid: { color: 'rgba(203, 213, 225, 0.1)' }, ticks: { font: { size: 9, weight: 'bold' } } },
    x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
  }
}

const tableData = computed(() => props.data.data || [])
</script>
