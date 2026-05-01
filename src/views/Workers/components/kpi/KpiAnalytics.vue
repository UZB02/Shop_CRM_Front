<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Sales Performance Bar Chart -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
       <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-black text-slate-800 dark:text-white tracking-widest flex items-center gap-2">
             <i class="pi pi-chart-bar text-emerald-500"></i>
             {{ $t('kpi.analytics.sales_performance') }}
          </h3>
       </div>
       <div class="h-[260px] w-full">
          <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-full w-full" />
       </div>
    </div>

    <!-- Target Distribution Doughnut Chart -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
       <h3 class="text-xs font-black text-slate-800 dark:text-white tracking-widest flex items-center gap-2 mb-4">
          <i class="pi pi-chart-pie text-emerald-500"></i>
          {{ $t('kpi.analytics.target_analysis') }}
       </h3>
       <div class="flex-1 flex items-center justify-center relative min-h-[180px]">
          <Chart type="doughnut" :data="doughnutChartData" :options="doughnutChartOptions" class="w-full max-w-[180px]" />
       </div>
       <div class="mt-4 grid grid-cols-2 gap-2">
          <div v-for="label in chartLabels" :key="label.text" class="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
             <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: label.color }"></div>
             <span class="text-[11px] font-bold text-slate-500 tracking-tighter">{{ label.text }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart'

defineProps({
  barChartData: Object,
  barChartOptions: Object,
  doughnutChartData: Object
})

const doughnutChartOptions = {
    cutout: '72%',
    plugins: { legend: { display: false } }
}

const chartLabels = [
    { text: '100%+', color: '#10b981' },
    { text: '80-99%', color: '#34d399' },
    { text: '50-79%', color: '#f59e0b' },
    { text: '<50%', color: '#f43f5e' }
]
</script>


