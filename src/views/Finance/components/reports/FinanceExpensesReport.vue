<template>
  <div class="space-y-6">
    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <div v-for="card in cards" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm group">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{{ t(card.label) }}</p>
          <div class="flex items-center justify-between">
             <h3 :class="['text-lg font-black tracking-tighter', card.color]">{{ card.value }}</h3>
             <div :class="['w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/50', card.iconColor]">
                <i :class="['pi text-xs', card.icon]"></i>
             </div>
          </div>
       </div>
    </div>

    <!-- Purchases vs General Expenses Chart -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
       <div class="flex items-center justify-between mb-8">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">Xarajatlar oqimi</h3>
       </div>
       <div class="h-[300px]">
          <Chart type="line" :data="chartData" :options="chartOptions" />
       </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
       <!-- Purchases Table -->
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden h-fit">
          <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-emerald-500/5 flex justify-between items-center">
             <div class="flex items-center gap-2">
                <i class="pi pi-shopping-bag text-emerald-500 text-xs"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{{ t('finance.purchases') }} (COGS)</span>
             </div>
             <span class="text-[10px] font-black text-emerald-500">{{ props.data.purchases?.count || 0 }} {{ t('finance.all_records', { count: '' }).trim() }}</span>
          </div>
          <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
             <table class="w-full text-left">
                <thead>
                   <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800/50 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                      <th class="px-6 py-4">{{ t('finance.date') }}</th>
                      <th class="px-6 py-4">Mahsulot</th>
                      <th class="px-6 py-4">{{ t('finance.amount') }}</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(p, i) in props.data.purchases?.items" :key="i" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td class="px-6 py-3.5 text-[11px] font-bold text-slate-400">{{ p.date }}</td>
                      <td class="px-6 py-3.5">
                         <div class="flex flex-col">
                            <span class="text-[12px] font-black text-slate-700 dark:text-slate-200">{{ p.product }}</span>
                            <span class="text-[9px] font-bold text-slate-400 uppercase">{{ p.supplier }}</span>
                         </div>
                      </td>
                      <td class="px-6 py-3.5 text-[12px] font-bold text-emerald-600">{{ formatPrice(p.total_cost) }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div class="px-6 py-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Purchases:</span>
             <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.purchases?.total || 0) }}</span>
          </div>
       </div>

       <!-- Expenses Table -->
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden h-fit">
          <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-rose-500/5 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="pi pi-receipt text-rose-500 text-xs"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Umumiy xarajatlar</span>
             </div>
             <span class="text-[10px] font-black text-rose-500">{{ props.data.expenses?.count || 0 }} ta</span>
          </div>
          <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
             <table class="w-full text-left">
                <thead>
                   <tr class="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800/50 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                      <th class="px-6 py-4">{{ t('finance.date') }}</th>
                      <th class="px-6 py-4">Kategoriya / Izoh</th>
                      <th class="px-6 py-4">{{ t('finance.amount') }}</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(e, i) in props.data.expenses?.items" :key="i" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td class="px-6 py-3.5 text-[11px] font-bold text-slate-400">{{ e.date }}</td>
                      <td class="px-6 py-3.5">
                         <div class="flex flex-col">
                            <span class="text-[12px] font-black text-slate-700 dark:text-slate-200">{{ e.category }}</span>
                            <span class="text-[9px] font-semibold text-slate-400 italic">{{ e.description }}</span>
                         </div>
                      </td>
                      <td class="px-6 py-3.5 text-[12px] font-bold text-rose-600">{{ formatPrice(e.amount) }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div class="px-6 py-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Expenses:</span>
             <span class="text-xs font-black text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.expenses?.total || 0) }}</span>
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
    { label: 'finance.purchases', value: formatPrice(sum.purchases_total || 0), color: 'text-emerald-600', icon: 'pi-shopping-bag', iconColor: 'text-emerald-500' },
    { label: 'finance.title', value: formatPrice(sum.expenses_total || 0), color: 'text-rose-600', icon: 'pi-receipt', iconColor: 'text-rose-500' },
    { label: 'finance.tax', value: formatPrice(sum.tax_total || 0), color: 'text-blue-600', icon: 'pi-percentage', iconColor: 'text-blue-500' },
    { label: 'finance.grand_total', value: formatPrice(sum.grand_total || 0), color: 'text-slate-900 dark:text-slate-100', icon: 'pi-wallet', iconColor: 'text-slate-400' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.map(i => i.label) || [],
  datasets: [{
    label: t('finance.title'),
    data: props.data.chart?.map(i => parseFloat(i.expenses)) || [],
    borderColor: '#f43f5e',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    fill: true,
    tension: 0.4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } },
    y: { grid: { color: 'rgba(203, 213, 225, 0.1)' } }
  }
}
</script>
