<template>
  <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Oylik Moliyaviy Tahlil</h3>
        <p class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{{ chartData?.year }}-yil tushum va xarajatlar</p>
      </div>
      <div v-if="chartData?.summary" class="flex items-center gap-6">
         <div class="text-right">
           <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Jami Foyda</p>
           <p class="text-xs font-black text-emerald-500">{{ formatPrice(chartData.summary.total_profit) }}</p>
         </div>
         <i class="pi pi-chart-bar text-slate-300"></i>
      </div>
    </div>

    <div class="h-[250px] w-full">
      <Chart type="bar" :data="chartConfig" :options="chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  chartData: { type: Object, default: () => ({ data: [], summary: {}, year: 2026 }) }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)

const chartConfig = computed(() => {
  const labels = props.chartData.data?.map(d => d.month_name) || []
  const revenue = props.chartData.data?.map(d => d.revenue) || []
  const expenses = props.chartData.data?.map(d => d.expenses) || []
  const profit = props.chartData.data?.map(d => d.profit) || []

  return {
    labels,
    datasets: [
      {
        label: 'Tushum',
        backgroundColor: '#10b981',
        data: revenue,
        borderRadius: 4,
        barThickness: 15
      },
      {
        label: 'Xarajat',
        backgroundColor: '#f43f5e',
        data: expenses,
        borderRadius: 4,
        barThickness: 15
      },
      {
        label: 'Foyda',
        type: 'line',
        borderColor: '#3b82f6',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: profit,
        pointRadius: 4,
        pointBackgroundColor: '#fff'
      }
    ]
  }
})

const chartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: { size: 9, weight: 'bold' },
        color: '#94a3b8',
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: { size: 10 },
      bodyFont: { size: 12, weight: 'bold' },
      padding: 10,
      cornerRadius: 12
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 9, weight: '900' }, color: '#94a3b8' }
    },
    y: {
      border: { dash: [4, 4] },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: {
        font: { size: 8, weight: '900' },
        color: '#94a3b8',
        callback: (v) => v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : v
      }
    }
  }
}
</script>
