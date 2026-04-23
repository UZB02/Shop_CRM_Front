<template>
  <div class="space-y-8 pb-10">
    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
       <div v-for="card in cards" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden">
          <div :class="['absolute right-0 top-0 w-24 h-24 blur-3xl opacity-5 rounded-full -translate-y-1/2 translate-x-1/2', card.bgGlow]"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">{{ t(card.label) }}</p>
          <div class="flex items-center justify-between relative z-10">
             <h3 :class="['text-xl font-black tracking-tight', card.color]">{{ card.value }}</h3>
             <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110', card.iconBg, card.iconColor]">
                <i :class="['pi text-sm', card.icon]"></i>
             </div>
          </div>
       </div>
    </div>

    <!-- Purchases vs General Expenses Chart -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
       <div class="flex items-center justify-between mb-10">
          <div>
            <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Xarajatlar oqimi</h3>
            <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Kategoriyalar bo'yicha tahlil</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="flex items-center gap-2">
                <div class="w-3 h-1 rounded-full bg-emerald-500"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ t('finance.title') }}</span>
             </div>
          </div>
       </div>
       <div class="h-[280px] sm:h-[350px]">
          <Chart type="line" :data="chartData" :options="chartOptions" />
       </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
       <!-- Purchases Table -->
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden h-fit flex flex-col">
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-emerald-500/5 flex justify-between items-center">
             <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <i class="pi pi-shopping-bag text-xs"></i>
                </div>
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">{{ t('finance.purchases') }} (COGS)</span>
             </div>
             <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/10">{{ props.data.purchases?.count || 0 }} {{ t('finance.all_records', { count: '' }).trim() }}</span>
          </div>
          <div class="overflow-x-auto max-h-[500px] custom-scrollbar overflow-y-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
                      <th class="px-8 py-5">{{ t('finance.date') }}</th>
                      <th class="px-8 py-5">Mahsulot</th>
                      <th class="px-8 py-5 text-right">{{ t('finance.amount') }}</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(p, i) in props.data.purchases?.items" :key="i" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                      <td class="px-8 py-5 text-xs font-bold text-slate-400">{{ p.date }}</td>
                      <td class="px-8 py-5">
                         <div class="flex flex-col">
                            <span class="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ p.product }}</span>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ p.supplier }}</span>
                         </div>
                      </td>
                      <td class="px-8 py-5 text-sm font-black text-emerald-600 text-right">{{ formatPrice(p.total_cost) }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div class="px-8 py-5 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center mt-auto">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ t('finance.total_revenue') }}:</span>
             <span class="text-sm font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.purchases?.total || 0) }}</span>
          </div>
       </div>

       <!-- Expenses Table -->
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden h-fit flex flex-col">
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-rose-500/5 flex justify-between items-center">
               <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <i class="pi pi-receipt text-xs"></i>
                </div>
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600">Umumiy xarajatlar</span>
             </div>
             <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/10">{{ props.data.expenses?.count || 0 }} ta</span>
          </div>
          <div class="overflow-x-auto max-h-[500px] custom-scrollbar overflow-y-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
                      <th class="px-8 py-5">{{ t('finance.date') }}</th>
                      <th class="px-8 py-5">Kategoriya / Izoh</th>
                      <th class="px-8 py-5 text-right">{{ t('finance.amount') }}</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(e, i) in props.data.expenses?.items" :key="i" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                      <td class="px-8 py-5 text-xs font-bold text-slate-400">{{ e.date }}</td>
                      <td class="px-8 py-5">
                         <div class="flex flex-col">
                            <span class="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-rose-500 transition-colors">{{ e.category }}</span>
                            <span class="text-[10px] font-medium text-slate-400 italic mt-0.5">{{ e.description }}</span>
                         </div>
                      </td>
                      <td class="px-8 py-5 text-sm font-black text-rose-500 text-right">{{ formatPrice(e.amount) }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div class="px-8 py-5 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center mt-auto">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Jami xarajatlar:</span>
             <span class="text-sm font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.expenses?.total || 0) }}</span>
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

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  data: { type: Object, default: () => ({ summary: {}, purchases: {}, expenses: {}, chart: [] }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)

const cards = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'finance.purchases', value: formatPrice(sum.purchases_total || 0), color: 'text-emerald-600', icon: 'pi-shopping-bag', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', bgGlow: 'bg-emerald-500' },
    { label: 'finance.title', value: formatPrice(sum.expenses_total || 0), color: 'text-rose-500', icon: 'pi-receipt', iconColor: 'text-rose-500', iconBg: 'bg-rose-50 dark:bg-rose-500/10', bgGlow: 'bg-rose-500' },
    { label: 'finance.tax', value: formatPrice(sum.tax_total || 0), color: 'text-blue-600', icon: 'pi-percentage', iconColor: 'text-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-500/10', bgGlow: 'bg-blue-500' },
    { label: 'finance.grand_total', value: formatPrice(sum.grand_total || 0), color: 'text-slate-800 dark:text-white', icon: 'pi-wallet', iconColor: 'text-slate-400', iconBg: 'bg-slate-50 dark:bg-slate-800', bgGlow: 'bg-slate-400' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.map(i => i.label) || [],
  datasets: [{
    label: t('finance.title'),
    data: props.data.chart?.map(i => parseFloat(i.expenses)) || [],
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

const chartOptions = {
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
}
</script>
