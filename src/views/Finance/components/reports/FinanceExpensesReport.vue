<template>
  <div class="space-y-4">
    <!-- Internal Sub-tabs -->
    <div class="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl w-fit">
      <button 
        v-for="tab in subTabs" 
        :key="tab.id"
        @click="activeSubTab = tab.id"
        :class="[
          'px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300',
          activeSubTab === tab.id 
            ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' 
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        ]"
      >
        <i :class="['pi mr-1.5', tab.icon]"></i>
        {{ t(tab.label) }}
      </button>
    </div>

    <!-- Analytics Tab -->
    <div v-if="activeSubTab === 'analytics'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <!-- Summary Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
         <div v-for="card in visibleCards" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
            <div :class="['absolute right-0 top-0 w-16 h-16 blur-2xl opacity-5 rounded-full -translate-y-1/2 translate-x-1/2', card.bgGlow]"></div>
            <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{{ t(card.label) }}</p>
            <div class="flex items-center justify-between relative z-10">
               <h3 :class="['text-sm font-bold tracking-tight', card.color]">{{ card.value }}</h3>
               <div :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110', card.iconBg, card.iconColor]">
                  <i :class="['pi text-[10px]', card.icon]"></i>
               </div>
            </div>
         </div>
      </div>

      <!-- Purchases vs General Expenses Chart -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm">
         <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Xarajatlar oqimi</h3>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">Vaqt kesimida tahlil</p>
            </div>
            <div class="flex items-center gap-1.5">
               <div class="w-2 h-1 rounded-full bg-emerald-500"></div>
               <span class="text-[10px] font-medium text-slate-400">{{ t('finance.expenses') }}</span>
            </div>
         </div>
         <div class="h-[180px]">
            <Chart type="line" :data="chartData" :options="chartOptions" />
         </div>
      </div>
    </div>

     <!-- Purchases Tab -->
    <div v-if="activeSubTab === 'purchases'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-fit flex flex-col">
          <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-emerald-500/5 flex justify-between items-center">
             <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                   <i class="pi pi-shopping-bag text-[10px]"></i>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{{ t('finance.purchases') }}</span>
             </div>
             <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/10">{{ props.data.purchases?.count || 0 }} ta</span>
          </div>
          <div class="overflow-x-auto max-h-[450px] custom-scrollbar overflow-y-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr class="text-[9px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
                      <th class="px-4 py-3">{{ t('finance.date') }}</th>
                      <th class="px-4 py-3">Mahsulot / Kategoriya</th>
                      <th class="px-4 py-3">Yetkazib beruvchi / Filial</th>
                      <th class="px-4 py-3 text-center">Soni / Narxi</th>
                      <th class="px-4 py-3 text-right">Summa</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                   <tr v-for="(p, i) in props.data.purchases?.items" :key="i" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                      <td class="px-4 py-3 text-[10px] font-medium text-slate-400">{{ p.date }}</td>
                      <td class="px-4 py-3">
                         <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ p.product }}</span>
                            <span class="text-[9px] font-medium text-slate-400 mt-0.5">{{ p.category }}</span>
                         </div>
                      </td>
                      <td class="px-4 py-3">
                         <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300">{{ p.supplier }}</span>
                            <span class="text-[9px] font-medium text-slate-400 mt-0.5">{{ p.location }}</span>
                         </div>
                      </td>
                      <td class="px-4 py-3 text-center">
                         <div class="flex flex-col items-center">
                            <span class="text-[10px] font-black text-slate-700 dark:text-slate-200">{{ p.quantity }}</span>
                            <span class="text-[9px] font-medium text-slate-400 mt-0.5">{{ formatPrice(p.unit_cost) }}</span>
                         </div>
                      </td>
                      <td class="px-4 py-3 text-xs font-bold text-emerald-600 text-right">{{ formatPrice(p.total_cost) }}</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div class="px-4 py-2.5 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
             <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Jami xaridlar:</span>
             <span class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ formatPrice(props.data.purchases?.total || 0) }}</span>
          </div>
       </div>
    </div>

    <!-- General Expenses Tab -->
    <div v-if="activeSubTab === 'expenses'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
         <ExpenseTable
           :expenses="props.expenses"
           :loading="props.loading"
           :is-manager="props.isManager"
           @view="emit('view', $event)"
           @edit="emit('edit', $event)"
           @delete="emit('delete', $event)"
         />
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'
import ExpenseTable from '../ExpenseTable.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  data: { type: Object, default: () => ({ summary: {}, purchases: {}, expenses: {}, chart: [] }) },
  expenses: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  isManager: { type: Boolean, default: false }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const activeSubTab = ref('analytics')
const subTabs = computed(() => [
  { id: 'analytics', label: 'reports.analytics', icon: 'pi pi-chart-bar' },
  { id: 'purchases', label: 'finance.purchases', icon: 'pi pi-shopping-bag' },
  { id: 'expenses', label: 'finance.list', icon: 'pi pi-wallet' }
])

const formatPrice = (val) => settingsStore.formatPrice(val)

const visibleCards = computed(() => {
  const sum = props.data.summary || {}
  const isTaxEnabledGlobal = settingsStore.settings?.tax_enabled !== false
  
  const list = [
    { label: 'finance.purchases', value: formatPrice(sum.purchases_total || 0), color: 'text-emerald-600', icon: 'pi-shopping-bag', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', bgGlow: 'bg-emerald-500' },
    { label: 'finance.title', value: formatPrice(sum.expenses_total || 0), color: 'text-rose-500', icon: 'pi-receipt', iconColor: 'text-rose-500', iconBg: 'bg-rose-50 dark:bg-rose-500/10', bgGlow: 'bg-rose-500' },
    { label: 'finance.tax', value: formatPrice(sum.tax_total || 0), color: 'text-blue-600', icon: 'pi-percentage', iconColor: 'text-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-500/10', bgGlow: 'bg-blue-500', isTax: true },
    { label: 'finance.grand_total', value: formatPrice(sum.grand_total || 0), color: 'text-slate-800 dark:text-white', icon: 'pi-wallet', iconColor: 'text-slate-400', iconBg: 'bg-slate-50 dark:bg-slate-800', bgGlow: 'bg-slate-400' }
  ]
  
  if (sum.tax_enabled === false || !isTaxEnabledGlobal) {
    return list.filter(c => !c.isTax)
  }
  return list
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
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)')
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)')
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
      return gradient
    },
    fill: true,
    tension: 0.45,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: '#fff',
    pointBorderColor: '#10b981',
    pointBorderWidth: 2,
    pointHoverBorderWidth: 3,
    borderWidth: 3,
    borderCapStyle: 'round',
    borderJoinStyle: 'round',
    shadowColor: 'rgba(16, 185, 129, 0.3)',
    shadowBlur: 10
  }]
}))

const chartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? 'rgba(203, 213, 225, 0.05)' : 'rgba(0, 0, 0, 0.03)'

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#fff',
        titleColor: isDark ? '#f1f5f9' : '#1e293b',
        bodyColor: isDark ? '#f1f5f9' : '#1e293b',
        titleFont: { size: 10, weight: 'bold', family: 'Inter' },
        bodyFont: { size: 13, weight: '900', family: 'Inter' },
        padding: 12,
        borderRadius: 12,
        displayColors: false,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        boxPadding: 4,
        callbacks: {
          label: (context) => ` ${formatPrice(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: {
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
        ticks: { 
          color: textColor, 
          font: { size: 9, weight: '600' },
          callback: (val) => val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val >= 1000 ? (val/1000).toFixed(0) + 'K' : val),
          padding: 8
        }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { 
          color: textColor, 
          font: { size: 9, weight: '600' },
          padding: 8
        }
      }
    },
    animations: {
      y: { duration: 1000, easing: 'easeInOutQuart' }
    }
  }
})
</script>
