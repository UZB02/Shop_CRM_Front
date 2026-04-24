<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Main Sales Chart -->
    <div class="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Savdo Dinamikasi</h3>
          <p class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Tushum va operatsiyalar</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"></div>
            <span class="text-[9px] font-black uppercase tracking-widest">Tushum</span>
          </div>
        </div>
      </div>
      <div class="flex-1 min-h-[280px] relative">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-full w-full" />
      </div>
    </div>

    <!-- Payment Breakdown -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 flex flex-col">
      <div class="mb-4">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">To'lov Taqsimoti</h3>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Kredit / Naqd / Karta</p>
      </div>
      <div class="h-[160px] relative flex items-center justify-center mb-4">
        <Chart type="doughnut" :data="pieData" :options="pieOptions" class="h-full w-full" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span class="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-0.5">Jami</span>
          <span class="text-sm font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">{{ formatPrice(totalRevenue) }}</span>
        </div>
      </div>
      <div class="space-y-1 mt-auto">
        <div v-for="(item, key) in breakdown" :key="key" class="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-default">
          <div class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', getStatusColor(key)]"></div>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{{ $t(`common.${key}`) }}</span>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-800 dark:text-white">{{ formatPrice(item.amount) }}</p>
            <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ item.percent }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hourly Activity Heatmap -->
    <div class="lg:col-span-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm mt-0">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Soatlik Faollik</h3>
          <p class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Eng faol vaqtlar tahlili</p>
        </div>
        <i class="pi pi-clock text-[10px] text-slate-300"></i>
      </div>
      <div class="h-[140px] w-full">
        <Chart type="bar" :data="hourlyData" :options="hourlyOptions" class="h-full w-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  dailySales:    { type: Array,   default: () => [] },
  breakdown:     { type: Object,  default: () => ({}) },
  hourlyHeatmap: { type: Array,   default: () => [] },
  totalRevenue:  { type: Number,  default: 0 }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)

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
      label: 'Tushum',
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
  labels: ['Naqd', 'Karta', 'Nasiya'],
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

// Hourly Heatmap Config
const hourlyData = computed(() => ({
  labels: props.hourlyHeatmap.map(h => `${h.hour}:00`),
  datasets: [{
    label: 'Sotuvlar',
    data: props.hourlyHeatmap.map(h => h.count),
    backgroundColor: '#10b981',
    hoverBackgroundColor: '#34d399',
    borderRadius: 3,
    barThickness: 12
  }]
}))

const hourlyOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { 
      display: true, 
      grid: { display: false }, 
      ticks: { font: { size: 8, weight: 'bold' }, color: '#94a3b8', maxRotation: 0 } 
    },
    y: { display: false }
  },
  maintainAspectRatio: false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
