<template>
  <div class="space-y-6 pb-10">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="card in summaryCards" :key="card.label" class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ t(card.label) }}</p>
        </div>
        <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight relative z-10">{{ card.value }}</h3>
      </div>
    </div>

    <!-- Chart & Table Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Line Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between mb-10">
           <div>
             <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{{ t('finance.revenue') }} Dynamika</h3>
             <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Vaqt o'tishi bilan tushumlar</p>
           </div>
           <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                 <div class="w-3 h-1 rounded-full bg-emerald-500"></div>
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
           </div>
        </div>
        <div class="h-[280px] sm:h-[350px]">
           <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Donut Chart / Top Categories -->
      <div class="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
        <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">{{ t('finance.share') }} Taqsimoti</h3>
        <div class="h-[200px] sm:h-[220px] mb-8 relative flex items-center justify-center">
           <Chart type="doughnut" :data="donutData" :options="donutOptions" class="relative z-10" />
           <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top 5</span>
              <span class="text-xl font-black text-slate-800 dark:text-slate-100">Kategoriya</span>
           </div>
        </div>
        <div class="space-y-4 flex-1">
           <div v-for="(item, index) in tableData.slice(0, 5)" :key="item.id" class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div class="flex items-center gap-3">
                 <div class="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" :style="{ backgroundColor: colors[index % colors.length] }"></div>
                 <span class="text-xs font-black text-slate-600 dark:text-slate-300 truncate max-w-[120px] group-hover:text-emerald-500 transition-colors">{{ item.name }}</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ item.share_pct }}%</span>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Details Table -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
            <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{{ t('finance.list') }} Batafsil</span>
          </div>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-8 py-5">#</th>
                   <th class="px-8 py-5">{{ t('finance.category') }}</th>
                   <th class="px-8 py-5">{{ t('finance.revenue') }}</th>
                   <th class="px-8 py-5">{{ t('finance.sales_count') }}</th>
                   <th class="px-8 py-5">{{ t('finance.share') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="(item, idx) in tableData" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                   <td class="px-8 py-5 text-xs font-bold text-slate-400">{{ idx + 1 }}</td>
                   <td class="px-8 py-5 text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ item.name }}</td>
                   <td class="px-8 py-5 text-sm font-black text-emerald-600">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-8 py-5 text-sm font-bold text-slate-500">{{ item.sales_count }}</td>
                   <td class="px-8 py-5 min-w-[200px]">
                      <div class="flex items-center gap-4">
                         <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000" :style="{ width: item.share_pct + '%' }"></div>
                         </div>
                         <span class="text-xs font-black text-slate-400 w-10">{{ item.share_pct }}%</span>
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
  data: { type: Object, default: () => ({ summary: {}, chart: [], table: [] }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)

const summaryCards = computed(() => [
  { label: 'finance.total_revenue', value: formatPrice(props.data.summary?.total_revenue || 0) },
  { label: 'finance.total_sales', value: formatPrice(props.data.summary?.total_sales || 0) },
  { label: 'finance.sales_count', value: props.data.summary?.sales_count || 0 },
  { label: 'finance.avg_sale', value: formatPrice(props.data.summary?.avg_sale || 0) }
])

const chartData = computed(() => ({
  labels: props.data.chart?.map(i => i.label) || [],
  datasets: [{
    label: t('finance.revenue'),
    data: props.data.chart?.map(i => parseFloat(i.revenue)) || [],
    borderColor: '#10b981',
    backgroundColor: (context) => {
      const chart = context.chart
      const { ctx, chartArea } = chart
      if (!chartArea) return null
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0)')
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)')
      return gradient
    },
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#fff',
    pointBorderColor: '#10b981',
    pointBorderWidth: 2,
    borderWidth: 4
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: { size: 12, weight: 'bold', family: 'Inter' },
      bodyFont: { size: 14, weight: '900', family: 'Inter' },
      padding: 16,
      borderRadius: 16,
      displayColors: false,
      callbacks: {
        label: (context) => ` ${formatPrice(context.parsed.y)}`
      }
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(203, 213, 225, 0.08)', drawBorder: false },
      ticks: { 
        color: '#94a3b8', 
        font: { size: 10, weight: '600' },
        callback: (val) => val >= 1000 ? (val/1000).toFixed(0) + 'K' : val
      }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } }
    }
  }
}))

const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const donutData = computed(() => ({
  labels: props.data.table?.slice(0, 5).map(i => i.name) || [],
  datasets: [{
    data: props.data.table?.slice(0, 5).map(i => i.share_pct) || [],
    backgroundColor: colors,
    hoverBackgroundColor: colors,
    borderWidth: 8,
    borderColor: 'transparent',
    borderRadius: 10,
    hoverOffset: 15
  }]
}))

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
  cutout: '80%',
  spacing: 5
}))

const tableData = computed(() => props.data.table || [])
</script>
