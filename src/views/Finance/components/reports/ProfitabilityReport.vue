<template>
  <div class="space-y-6 pb-10">
    <!-- Analysis Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
       <div class="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 sm:p-8 rounded-[2.5rem] shadow-sm">
          <div class="flex items-center justify-between mb-10">
             <div>
                <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{{ t('finance.profitability') }} Matritsasi</h3>
                <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                   Kategoriyalar bo'yicha tahlil
                   <span v-if="props.data.subcategory_enabled" class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                     {{ t('finance.subcategory') }} faol
                   </span>
                </p>
             </div>
             <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                   <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ t('finance.gross_profit') }}</span>
                </div>
                <div class="flex items-center gap-2">
                   <div class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ t('finance.cogs') }}</span>
                </div>
             </div>
          </div>
          <div class="h-[350px] sm:h-[450px]">
             <Chart type="bar" :data="chartData" :options="chartOptions" />
          </div>
       </div>

       <!-- Summary Stats -->
       <div class="flex flex-col gap-5">
          <div v-for="stat in summaryStats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:translate-y-[-4px] transition-transform duration-300">
             <div class="flex items-center justify-between mb-4">
               <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ t(stat.label) }}</p>
               <i :class="[stat.icon, 'text-xs opacity-50']"></i>
             </div>
             <h4 :class="['text-xl font-black tracking-tight mb-4', stat.color]">{{ stat.value }}</h4>
             <div class="w-full h-2 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                <div :class="['h-full rounded-full transition-all duration-1000', stat.bg]" :style="{ width: stat.pct + '%' }"></div>
             </div>
             <div class="mt-2 flex justify-end">
               <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70">{{ (Number(stat.pct) || 0).toFixed(0) }}% Ulush</span>
             </div>
          </div>
          
          <!-- Promotion Card -->
          <div class="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/10 flex flex-col justify-end relative overflow-hidden">
             <div class="absolute -right-4 -top-4 opacity-10">
               <i class="pi pi-percentage text-[100px]"></i>
             </div>
             <h5 class="text-sm font-black uppercase tracking-widest mb-2 relative z-10">Margin Control</h5>
             <p class="text-[10px] font-medium opacity-80 leading-relaxed relative z-10">
               Gross Margin biznesingizning barqarorligini ta'minlovchi asosiy ko'rsatkichdir.
             </p>
          </div>
       </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden">
       <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
            <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Rentabellik Jadvali</span>
          </div>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-8 py-5">#</th>
                   <th class="px-8 py-5">{{ t('finance.category') }}</th>
                   <th class="px-8 py-5">{{ t('finance.revenue') }}</th>
                   <th class="px-8 py-5">COGS (Tannarx)</th>
                   <th class="px-8 py-5">{{ t('finance.gross_profit') }}</th>
                   <th class="px-8 py-5">{{ t('finance.margin') }} %</th>
                   <th class="px-8 py-5">Ulushi %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                <tr v-for="item in tableData" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                   <td class="px-8 py-5 text-xs font-bold text-slate-400">{{ item.id }}</td>
                   <td class="px-8 py-5">
                      <div class="flex flex-col">
                         <span class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{{ item.name }}</span>
                         <span v-if="item.parent" class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ item.parent }}</span>
                      </div>
                   </td>
                   <td class="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-8 py-5 text-sm font-bold text-slate-400/80">{{ formatPrice(item.cogs) }}</td>
                   <td class="px-8 py-5">
                      <span class="text-sm font-black text-emerald-500">{{ formatPrice(item.gross_profit) }}</span>
                   </td>
                   <td class="px-8 py-5">
                      <div :class="['inline-flex px-3 py-1 rounded-xl text-[10px] font-black shadow-sm transition-all', parseFloat(item.margin_pct) > 20 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500']">
                         {{ item.margin_pct }}%
                      </div>
                   </td>
                   <td class="px-8 py-5">
                      <div class="flex items-center gap-3">
                        <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-slate-400 dark:bg-slate-500 rounded-full" :style="{ width: item.share_pct + '%' }"></div>
                        </div>
                        <span class="text-[10px] font-black text-slate-400 w-8">{{ item.share_pct }}%</span>
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

const summaryStats = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'finance.total_revenue', value: formatPrice(sum.total_revenue || 0), pct: 100, color: 'text-slate-800 dark:text-white', bg: 'bg-slate-400 dark:bg-slate-600', icon: 'pi pi-chart-line' },
    { label: 'finance.gross_profit', value: formatPrice(sum.total_profit || 0), pct: sum.avg_margin_pct || 0, color: 'text-emerald-500', bg: 'bg-gradient-to-r from-emerald-400 to-emerald-600', icon: 'pi pi-bolt' },
    { label: 'finance.margin', value: (sum.avg_margin_pct || 0) + '%', pct: sum.avg_margin_pct || 0, color: 'text-emerald-600', bg: 'bg-emerald-500', icon: 'pi pi-percentage' }
  ]
})

const chartData = computed(() => ({
  labels: props.data.chart?.slice(0, 15).map(i => i.label) || [],
  datasets: [
    {
      label: t('finance.gross_profit'),
      data: props.data.chart?.slice(0, 15).map(i => parseFloat(i.gross_profit)) || [],
      backgroundColor: '#10b981',
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
      barThickness: 20
    },
    {
      label: t('finance.cogs'),
      data: props.data.chart?.slice(0, 15).map(i => parseFloat(i.cogs)) || [],
      backgroundColor: 'rgba(203, 213, 225, 0.4)',
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
      barThickness: 20
    }
  ]
}))

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { 
      backgroundColor: '#1e293b', 
      padding: 16, 
      borderRadius: 16,
      titleFont: { size: 12, weight: 'bold', family: 'Inter' },
      bodyFont: { size: 14, weight: '900', family: 'Inter' }
    }
  },
  scales: {
    x: { 
      grid: { color: 'rgba(203, 213, 225, 0.08)', drawBorder: false }, 
      ticks: { 
        color: '#94a3b8', 
        font: { size: 10, weight: '600' },
        callback: (val) => val >= 1000 ? (val/1000).toFixed(0) + 'K' : val
      } 
    },
    y: { 
      grid: { display: false }, 
      ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } } 
    }
  }
}

const tableData = computed(() => props.data.table || [])
</script>
