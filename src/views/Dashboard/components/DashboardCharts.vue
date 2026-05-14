<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Main Sales Chart (Overview mode) -->
    <div v-if="mode === 'overview'" class="lg:col-span-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.charts.sales_dynamics') }}</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-widest mt-0.5">{{ $t('dashboard.charts.daily_summary') }}</p>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"></div>
          <span class="text-[11px] font-black tracking-widest">{{ $t('dashboard.charts.revenue') }}</span>
        </div>
      </div>
      <div v-if="dailySales.length" class="flex-1 min-h-[300px] relative">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-full w-full" />
      </div>
      <div v-else class="flex-1 min-h-[300px] flex items-center justify-center bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <p class="text-[12px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.charts.loading') }}</p>
      </div>
    </div>

    <!-- 3-Month Trend (Overview mode) -->
    <div v-if="mode === 'overview' && trend3months.length" class="lg:col-span-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.charts.trend_3months') }}</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-widest mt-0.5">{{ $t('dashboard.charts.trend_summary') }}</p>
        </div>
      </div>
      <div class="h-[160px]">
        <Chart type="bar" :data="trendData" :options="trendOptions" class="h-full w-full" />
      </div>
    </div>

    <!-- Payment Breakdown (Sales mode) -->
    <div v-if="mode === 'sales'" class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col">
      <div class="mb-4">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.charts.payment_breakdown') }}</h3>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-widest mt-0.5">{{ $t('dashboard.charts.payment_types') }}</p>
      </div>
      <div class="h-[140px] relative flex items-center justify-center mb-4">
        <Chart type="doughnut" :data="pieData" :options="pieOptions" class="h-full w-full" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.3em] mb-0.5">{{ $t('dashboard.charts.total') }}</span>
          <span class="text-sm font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">{{ formatPrice(totalRevenue) }}</span>
        </div>
      </div>
      <div class="space-y-1 mt-auto">
        <div v-for="(item, key) in breakdown" :key="key" class="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-default">
          <div class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', getStatusColor(key)]"></div>
            <span class="text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{{ paymentLabel(key) }}</span>
          </div>
          <div class="text-right">
            <p class="text-[12px] font-black text-slate-800 dark:text-white">{{ formatPrice(item.amount) }}</p>
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 ">{{ item.percent }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hourly Activity (Sales mode) -->
    <div v-if="mode === 'sales'" class="lg:col-span-2 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.charts.hourly_activity') }}</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-widest mt-0.5">{{ $t('dashboard.charts.busy_analysis') }}</p>
        </div>
        <i class="pi pi-clock text-[12px] text-slate-300"></i>
      </div>
      <div v-if="hourlyHeatmap.length" class="flex-1 min-h-[220px] w-full">
        <Chart type="bar" :data="hourlyData" :options="hourlyOptions" class="h-full w-full" />
      </div>
      <div v-else class="flex-1 min-h-[220px] flex items-center justify-center">
        <p class="text-[11px] font-black text-slate-400 ">{{ $t('dashboard.charts.hourly_loading') }}</p>
      </div>
    </div>

    <!-- Expense Categories (Finance mode) -->
    <div v-if="mode === 'finance'" class="lg:col-span-3 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col lg:flex-row gap-6 sm:gap-8">
      <div class="lg:w-1/3">
        <h3 class="text-lg font-black text-slate-800 dark:text-white tracking-tight mb-1">{{ $t('dashboard.charts.expense_analysis') }}</h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-widest mb-6">{{ $t('dashboard.charts.category_distribution') }}</p>
        
        <div class="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 mb-6">
           <p class="text-[12px] font-black text-rose-400 tracking-[0.2em] mb-1">Jami Xarajat</p>
           <h4 class="text-2xl font-black text-rose-500 tracking-tighter">{{ formatPrice(expensesData.total) }}</h4>
        </div>

        <div class="space-y-3">
           <div v-for="cat in expensesData.by_category" :key="cat.category_id" class="flex flex-col gap-1.5">
              <div class="flex justify-between text-[12px] font-black ">
                 <span class="text-slate-500">{{ cat.name }}</span>
                 <span class="text-rose-500">{{ cat.percent }}%</span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div class="h-full bg-rose-500 rounded-full" :style="{ width: cat.percent + '%' }"></div>
              </div>
           </div>
        </div>
      </div>
      
      <div class="flex-1 flex items-center justify-center min-h-[300px]">
         <div v-if="expensesData.by_category?.length" class="w-full h-full max-w-md relative">
           <Chart type="pie" :data="expensePieData" :options="pieOptions" class="h-full w-full" />
         </div>
         <div v-else class="text-slate-400 text-center">
            <i class="pi pi-inbox text-4xl mb-4 opacity-20"></i>
            <p class="text-[12px] font-black tracking-widest">{{ $t('dashboard.charts.no_data') }}</p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  dailySales:    { type: Array,   default: () => [] },
  breakdown:     { type: Object,  default: () => ({}) },
  hourlyHeatmap: { type: Array,   default: () => [] },
  totalRevenue:  { type: Number,  default: 0 },
  expensesData:  { type: Object,  default: () => ({ total: 0, by_category: [], trend_3months: [] }) },
  trend3months:  { type: Array,   default: () => [] },
  mode:          { type: String,  default: 'overview' }
})

const settingsStore = useSettingsStore()
const { t } = useI18n()
const formatPrice = (v) => settingsStore.formatPrice(v)

const paymentLabel = (key) => ({ 
  cash: t('common.cash'), 
  card: t('common.card'), 
  debt: t('common.debt') 
}[key] || key)

const getStatusColor = (key) => {
  if (key === 'cash') return 'bg-emerald-500 shadow-emerald-500/20'
  if (key === 'card') return 'bg-blue-500 shadow-blue-500/20'
  return 'bg-amber-500 shadow-amber-500/20'
}

// Line Chart Config
const lineChartData = computed(() => ({
  labels: props.dailySales.map(d => d.date.split('-').reverse().slice(0, 2).join('.')),
  datasets: [
    {
      label: t('dashboard.charts.revenue'),
      data: props.dailySales.map(d => d.revenue),
      fill: true,
      borderColor: '#10b981',
      backgroundColor: (context) => {
        const chart = context.chart
        const {ctx, chartArea} = chart
        if (!chartArea) return null
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)')
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.08)')
        return gradient
      },
      tension: 0.2,
      pointRadius: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      borderWidth: 3
    }
  ]
}))

const lineChartOptions = {
  plugins: { 
    legend: { display: false }, 
    tooltip: { 
      backgroundColor: '#1e293b',
      titleFont: { size: 9, weight: 'bold' },
      bodyFont: { size: 11, weight: '900' },
      padding: 8,
      cornerRadius: 10,
      displayColors: false
    } 
  },
  scales: {
    x: { 
      display: true, 
      grid: { display: false },
      ticks: { font: { size: 8, weight: '900' }, color: '#94a3b8' }
    },
    y: { 
      display: true, 
      border: { dash: [4, 4] },
      grid: { color: 'rgba(148, 163, 184, 0.1)' }, 
      ticks: { 
        font: { size: 8, weight: '900' }, 
        color: '#94a3b8',
        callback: (v) => v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : v 
      } 
    }
  },
  maintainAspectRatio: false,
  layout: {
    padding: { bottom: 0 }
  }
}

// Pie Chart Config
const pieData = computed(() => ({
  labels: [t('common.cash'), t('common.card'), t('common.debt')],
  datasets: [{
    data: [props.breakdown.cash?.amount || 0, props.breakdown.card?.amount || 0, props.breakdown.debt?.amount || 0],
    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
    borderWidth: 0,
    cutout: '80%',
    borderRadius: 20,
    spacing: 10
  }]
}))

const pieOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  animation: { animateRotate: true, duration: 1500, easing: 'easeOutQuart' }
}

// Expense Pie Config
const expensePieData = computed(() => ({
  labels: props.expensesData.by_category.map(c => c.name),
  datasets: [{
    data: props.expensesData.by_category.map(c => c.total),
    backgroundColor: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fff1f2'],
    borderWidth: 0,
    cutout: '60%',
    borderRadius: 5,
    spacing: 2
  }]
}))

// Hourly Heatmap Config
const hourlyData = computed(() => ({
  labels: props.hourlyHeatmap.map(h => `${h.hour}:00`),
  datasets: [{
    label: t('dashboard.metrics.sales'),
    data: props.hourlyHeatmap.map(h => h.count),
    backgroundColor: (ctx) => {
      const max = Math.max(...props.hourlyHeatmap.map(h => h.count), 1)
      const alpha = 0.2 + 0.8 * (ctx.parsed.y / max)
      return `rgba(16, 185, 129, ${alpha})`
    },
    hoverBackgroundColor: '#34d399',
    borderRadius: 4,
    barThickness: 12
  }]
}))

const hourlyOptions = {
  plugins: { legend: { display: false }, tooltip: {
    backgroundColor: '#1e293b', padding: 8, cornerRadius: 10,
    callbacks: { label: (c) => `${c.parsed.y} ${t('common.count')} ${t('dashboard.tabs.sales').toLowerCase()}` }
  }},
  scales: {
    x: { display: true, grid: { display: false }, ticks: { font: { size: 8, weight: 'bold' }, color: '#94a3b8', maxRotation: 0 } },
    y: { display: false }
  },
  maintainAspectRatio: false
}

// 3-month trend chart
const trendData = computed(() => ({
  labels: props.trend3months.map(t => t.month),
  datasets: [
    {
      label: t('dashboard.charts.revenue'),
      data: props.trend3months.map(t => t.revenue),
      backgroundColor: 'rgba(16,185,129,0.7)',
      borderRadius: 6, barThickness: 24
    },
    {
      type: 'line',
      label: t('dashboard.charts.profit'),
      data: props.trend3months.map(t => t.profit),
      borderColor: '#3b82f6',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#fff'
    }
  ]
}))

const trendOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom', labels: { usePointStyle: true, font: { size: 9 }, color: '#94a3b8', padding: 16 } }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#94a3b8' } },
    y: {
      border: { dash: [4,4] }, grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { font: { size: 8 }, color: '#94a3b8', callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v }
    }
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>


