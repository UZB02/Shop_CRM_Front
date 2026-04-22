<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in summaryCards" :key="card.label" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ t(card.label) }}</p>
        <h3 class="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ card.value }}</h3>
      </div>
    </div>

    <!-- Chart & Table Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Line Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between mb-6">
           <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ t('finance.revenue') }} / {{ t('finance.date') }}</h3>
           <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-rose-500"></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</span>
           </div>
        </div>
        <div class="h-[300px]">
           <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Donut Chart / Top Categories -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">{{ t('finance.share') }}</h3>
        <div class="h-[200px] mb-6">
           <Chart type="doughnut" :data="donutData" :options="donutOptions" />
        </div>
        <div class="space-y-3">
           <div v-for="(item, index) in tableData.slice(0, 4)" :key="item.id" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                 <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: colors[index % colors.length] }"></div>
                 <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[100px]">{{ item.name }}</span>
              </div>
              <span class="text-[11px] font-black text-slate-800 dark:text-slate-100">{{ item.share_pct }}%</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Details Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ t('finance.list') }}</span>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-4 py-3">#</th>
                   <th class="px-4 py-3">{{ t('finance.category') }} / {{ t('common.name') }}</th>
                   <th class="px-4 py-3">{{ t('finance.revenue') }}</th>
                   <th class="px-4 py-3">{{ t('finance.sales_count') }}</th>
                   <th class="px-4 py-3">{{ t('finance.share') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="(item, idx) in tableData" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                   <td class="px-4 py-2.5 text-[10px] font-bold text-slate-400">{{ idx + 1 }}</td>
                   <td class="px-4 py-2.5 text-[12px] font-black text-slate-700 dark:text-slate-200">{{ item.name }}</td>
                   <td class="px-4 py-2.5 text-[12px] font-bold text-rose-500">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-4 py-2.5 text-[12px] font-semibold text-slate-500">{{ item.sales_count }}</td>
                   <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2">
                         <div class="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-rose-500 rounded-full" :style="{ width: item.share_pct + '%' }"></div>
                         </div>
                         <span class="text-[10px] font-black text-slate-400">{{ item.share_pct }}%</span>
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
    borderColor: '#f43f5e',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    borderWidth: 3
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#1e293b',
      titleFont: { size: 10, weight: 'bold' },
      bodyFont: { size: 12, weight: 'black' },
      padding: 10,
      borderRadius: 12
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(203, 213, 225, 0.1)', drawBorder: false },
      ticks: { color: '#94a3b8', font: { size: 9, weight: 'bold' }, callback: (val) => formatPrice(val).replace('UZS', '') }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 9, weight: 'bold' } }
    }
  }
}))

const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1']

const donutData = computed(() => ({
  labels: props.data.table?.slice(0, 5).map(i => i.name) || [],
  datasets: [{
    data: props.data.table?.slice(0, 5).map(i => i.share_pct) || [],
    backgroundColor: colors,
    borderWidth: 0,
    hoverOffset: 10
  }]
}))

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  cutout: '75%'
}))

const tableData = computed(() => props.data.table || [])
</script>
