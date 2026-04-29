<template>
  <div class="space-y-4 pb-4">
    <!-- Analysis Summary Cards at Top -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="stat in summaryStats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
           <div :class="['absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full', stat.bg]"></div>
           <div class="flex items-center gap-1.5 mb-2 relative z-10">
              <div :class="['w-1.5 h-1.5 rounded-full', stat.bg]"></div>
              <p class="text-[9px] font-bold tracking-widest text-slate-400">{{ t(stat.label) }}</p>
           </div>
           <h3 :class="['text-lg font-bold tracking-tight mb-2 relative z-10', stat.color]">{{ stat.value }}</h3>
           <div class="w-full h-1 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden relative z-10">
              <div :class="['h-full rounded-full transition-all duration-1000', stat.bg]" :style="{ width: stat.pct + '%' }"></div>
           </div>
        </div>
        
        <!-- Quick Insight Card -->
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/10 flex flex-col justify-center relative overflow-hidden group">
           <div class="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
             <i class="pi pi-percentage text-5xl"></i>
           </div>
           <h5 class="text-[9px] font-black tracking-widest mb-1 relative z-10 opacity-80">Profit Analysis</h5>
           <p class="text-xs font-bold relative z-10 leading-tight">Margin biznes barqarorligidir</p>
        </div>
    </div>

    <!-- Chart Block -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-6">
           <div>
              <h3 class="text-[9px] font-bold tracking-widest text-slate-400 mb-0.5">Rentabellik Matritsasi</h3>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                 Kategoriyalar bo'yicha tahlil
                 <span v-if="props.data.subcategory_enabled" class="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 text-[8px] font-black tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                   {{ t('finance.subcategory') }}
                 </span>
              </p>
           </div>
        </div>
        <div class="flex-1 min-h-[120px]">
           <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
        </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
            <span class="text-[10px] font-bold tracking-widest text-slate-500">Rentabellik Jadvali</span>
          </div>
       </div>
       <div class="overflow-x-auto max-h-[500px] custom-scrollbar overflow-y-auto">
          <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[9px] font-bold tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                   <th class="px-4 py-3 w-10">#</th>
                   <th class="px-4 py-3">{{ t('finance.category') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.revenue') }}</th>
                   <th class="px-4 py-3 text-right">COGS</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.gross_profit') }}</th>
                   <th class="px-4 py-3 text-center">Sotuvlar</th>
                   <th class="px-4 py-3 text-center">Miqdor</th>
                   <th class="px-4 py-3 text-center">Margin %</th>
                   <th class="px-4 py-3 w-32">Ulushi %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="(item, idx) in tableData" :key="item.id || idx" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group text-xs">
                   <td class="px-4 py-3 font-bold text-slate-400">{{ idx + 1 }}</td>
                   <td class="px-4 py-3">
                      <div class="flex flex-col">
                         <span class="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ item.name }}</span>
                         <span v-if="item.parent" class="text-[8px] font-black text-slate-400 tracking-widest">{{ item.parent }}</span>
                      </div>
                   </td>
                   <td class="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">{{ formatPrice(item.revenue) }}</td>
                   <td class="px-4 py-3 text-right text-slate-400">{{ formatPrice(item.cogs) }}</td>
                   <td class="px-4 py-3 text-right">
                      <span class="font-black text-emerald-500">{{ formatPrice(item.gross_profit) }}</span>
                   </td>
                   <td class="px-4 py-3 text-center text-slate-500">{{ item.sales_count || 0 }}</td>
                   <td class="px-4 py-3 text-center text-slate-500">{{ item.qty_sold || 0 }}</td>
                   <td class="px-4 py-3 text-center">
                      <span :class="['px-2 py-0.5 rounded-lg font-black text-[9px]', parseFloat(item.margin_pct) >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500']">
                         {{ item.margin_pct }}%
                      </span>
                   </td>
                   <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-slate-300 dark:bg-slate-600 rounded-full" :style="{ width: item.share_pct + '%' }"></div>
                        </div>
                        <span class="text-[9px] font-bold text-slate-400">{{ item.share_pct }}%</span>
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
      borderRadius: 6,
      barThickness: 24,
      maxBarThickness: 32
    },
    {
      label: t('finance.cogs'),
      data: props.data.chart?.slice(0, 15).map(i => parseFloat(i.cogs)) || [],
      backgroundColor: 'rgba(203, 213, 225, 0.4)',
      borderRadius: 6,
      barThickness: 24,
      maxBarThickness: 32
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
