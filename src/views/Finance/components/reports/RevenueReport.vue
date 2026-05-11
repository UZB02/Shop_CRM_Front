<template>
  <div class="space-y-4 pb-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="card in summaryCards" :key="card.label" class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <div class="flex items-center gap-1.5 mb-2">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <p class="text-[11px] font-bold tracking-widest text-slate-400">{{ t(card.label) }}</p>
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight relative z-10">{{ card.value }}</h3>
      </div>
    </div>

    <!-- Chart & Table Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Line Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between mb-4">
           <div>
             <h3 class="text-[11px] font-bold tracking-widest text-slate-400 mb-0.5">{{ t('reports.revenue_dynamics') }}</h3>
             <p class="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">{{ t('reports.revenue_over_time') }}</p>
           </div>
        </div>
        <div class="h-[180px] sm:h-[220px]">
           <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Donut Chart / Top Categories -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
        <h3 class="text-[11px] font-bold tracking-widest text-slate-400 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">{{ t('reports.share_distribution') }}</h3>
        <div class="h-[150px] mb-4 relative flex items-center justify-center">
           <Chart type="doughnut" :data="donutData" :options="donutOptions" class="relative z-10" />
           <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-[11px] font-bold text-slate-800 dark:text-slate-100 tracking-widest">Top 5</span>
           </div>
        </div>
        <div class="space-y-1.5 flex-1 overflow-y-auto max-h-[120px] custom-scrollbar">
           <div v-for="(item, index) in tableData.slice(0, 5)" :key="item.id" class="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div class="flex items-center gap-2">
                 <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: colors[index % colors.length] }"></div>
                 <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">{{ item.name }}</span>
              </div>
              <span class="text-[13px] font-bold text-slate-800 dark:text-slate-100">{{ item.share_pct }}%</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Details Table -->
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
            <span class="text-[12px] font-bold tracking-widest text-slate-500">{{ t('finance.list') }}</span>
          </div>
       </div>
       <div class="overflow-x-auto max-h-[400px] custom-scrollbar overflow-y-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[11px] font-bold tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                   <th class="px-4 py-3">#</th>
                   <th class="px-4 py-3">{{ t('reports.product_category') }}</th>
                   <th class="px-4 py-3" v-if="tableData[0]?.quantity">{{ t('common.quantity') }}</th>
                   <th class="px-4 py-3">{{ t('finance.revenue') }}</th>
                   <th class="px-4 py-3">{{ t('finance.sales_count') }}</th>
                   <th class="px-4 py-3">{{ t('finance.share') }} (%)</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="(item, idx) in tableData" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                   <td class="px-4 py-3 text-[12px] text-slate-400">{{ idx + 1 }}</td>
                   <td class="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ item.name }}</td>
                   <td class="px-4 py-3 text-xs font-black text-slate-500" v-if="item.quantity">{{ item.quantity }}</td>
                   <td class="px-4 py-3 text-xs font-bold text-emerald-600">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-4 py-3 text-[13px] text-slate-500">{{ item.sales_count }}</td>
                   <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                         <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 rounded-full" :style="{ width: item.share_pct + '%' }"></div>
                         </div>
                         <span class="text-[12px] font-medium text-slate-400 w-8">{{ item.share_pct }}%</span>
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


