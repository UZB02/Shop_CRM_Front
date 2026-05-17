<template>
  <div class="space-y-4 pb-4">
    <!-- Executive Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
       <div v-for="card in execCards.slice(0, 4)" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div :class="['absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full', card.glow]"></div>
          
          <div class="flex items-center gap-1.5 mb-2 relative z-10">
            <div :class="['w-1.5 h-1.5 rounded-full', card.glow]"></div>
            <p class="text-[13px] font-bold tracking-widest text-slate-400">{{ t(card.label) }}</p>
          </div>

          <div class="flex items-end justify-between relative z-10">
             <h3 :class="['text-xl font-bold tracking-tight truncate', card.color]">{{ card.value }}</h3>
             <span v-if="card.sub" class="text-[12px] font-black tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 flex items-center px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
               {{ card.sub }}
             </span>
          </div>
       </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
      <!-- Profitability Trend Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col h-full">
          <div class="flex items-center justify-between mb-6">
             <div>
                <h3 class="text-[13px] font-bold tracking-widest text-slate-400 mb-0.5">{{ t('reports.profit_loss') }} Flux</h3>
                <p class="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">{{ props.data.year }} {{ t('common.year') }} {{ t('reports.summary') }}</p>
             </div>
             <div class="flex gap-4">
                <div class="flex items-center gap-2">
                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></div>
                   <span class="text-[13px] font-bold tracking-widest text-slate-400">{{ t('finance.net_profit') }}</span>
                </div>
                <div class="flex items-center gap-2">
                   <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                   <span class="text-[13px] font-bold tracking-widest text-slate-400">{{ t('finance.revenue') }}</span>
                </div>
             </div>
          </div>
          <div class="flex-1 min-h-[250px] sm:min-h-[350px]">
             <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
      </div>

      <!-- Quick Analysis / Key Metrics -->
       <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/10 flex flex-col justify-between overflow-hidden relative h-full">
          <div class="absolute top-0 right-0 p-6 opacity-10">
            <i class="pi pi-chart-bar text-8xl -rotate-12"></i>
          </div>
          
          <div class="relative z-10">
            <h4 class="text-[13px] font-black tracking-widest opacity-80 mb-6 border-b border-white/10 pb-2">{{ t('common.analytics') }}</h4>
            <div class="space-y-6">
               <div v-for="metric in metrics" :key="metric.label" class="flex flex-col gap-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[13px] font-bold tracking-widest opacity-70">{{ t(metric.label) }}</span>
                    <div v-if="metric.trend" :class="['flex items-center gap-1 text-[12px] font-black px-1.5 py-0.5 rounded-md bg-white/10', metric.trend > 0 ? 'text-white' : 'text-rose-200']">
                      <i :class="['pi', metric.trend > 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right']"></i>
                      {{ Math.abs(metric.trend) }}%
                    </div>
                  </div>
                  <span class="text-sm font-black">{{ metric.value }}</span>
                  <div class="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div class="h-full bg-white rounded-full transition-all duration-1000" :style="{ width: metric.percent + '%' }"></div>
                  </div>
               </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 relative z-10">
            <p class="text-xs font-medium opacity-80 leading-relaxed italic">
              {{ t('reports.profit_loss_desc') }}
            </p>
          </div>
       </div>
    </div>

    <!-- Detailed Monthly Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
            <span class="text-xs font-bold tracking-widest text-slate-500">{{ t('reports.monthly_distribution') }}</span>
          </div>
          <button v-if="settingsStore.hasPlanExport" class="text-xs font-bold tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2">
            <i class="pi pi-download"></i>
            {{ t('common.export') }}
          </button>
       </div>
       <div class="overflow-x-auto max-h-[500px] custom-scrollbar overflow-y-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[13px] font-bold tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                   <th class="px-4 py-3">{{ t('common.month') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.revenue') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.cogs') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.gross_profit') }}</th>
                   <th v-if="settingsStore.isWastageEnabled" class="px-4 py-3 text-right">{{ t('finance.wastage_loss') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.expenses') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('finance.net_profit') }}</th>
                   <th class="px-4 py-3 text-center">{{ t('finance.margin') }} %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/30">
                <tr v-for="row in tableData" :key="row.month" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group text-sm">
                   <td class="px-4 py-3">
                      <span class="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{{ row.month_name }}</span>
                   </td>
                   <td class="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">{{ formatPrice(row.revenue) }}</td>
                   <td class="px-4 py-3 text-right text-slate-400">{{ formatPrice(row.cogs) }}</td>
                   <td class="px-4 py-3 text-right">
                      <span class="font-black text-emerald-500">{{ formatPrice(row.gross_profit) }}</span>
                   </td>
                   <td v-if="settingsStore.isWastageEnabled" class="px-4 py-3 text-right text-rose-400/80 font-bold">({{ formatPrice(row.wastage_loss) }})</td>
                   <td class="px-4 py-3 text-right text-slate-400">{{ formatPrice(row.expenses) }}</td>
                   <td class="px-4 py-3 text-right">
                      <span :class="['font-black', parseFloat(row.net_profit) >= 0 ? 'text-emerald-600' : 'text-rose-500']">
                         {{ formatPrice(row.net_profit) }}
                      </span>
                   </td>
                   <td class="px-4 py-3 text-center">
                      <div :class="['inline-flex px-2 py-0.5 rounded-lg text-[13px] font-black transition-all', parseFloat(row.margin_pct) >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500']">
                         {{ row.margin_pct }}%
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
  data: { type: Object, default: () => ({ summary: {}, data: [] }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)

const execCards = computed(() => {
  const sum = props.data.summary || {}
  return [
    { label: 'finance.total_revenue', value: formatPrice(sum.total_revenue || 0), color: 'text-slate-800 dark:text-white', iconBg: 'bg-slate-100 dark:bg-slate-800', icon: 'pi pi-chart-line', glow: 'bg-slate-500' },
    { label: 'finance.gross_profit', value: formatPrice(sum.total_gross_profit || 0), color: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'pi pi-bolt', glow: 'bg-emerald-500' },
    { label: 'finance.wastage_loss', value: formatPrice(sum.total_wastage_loss || 0), color: 'text-rose-500', iconBg: 'bg-rose-50 dark:bg-rose-500/10', icon: 'pi pi-trash', glow: 'bg-rose-500', sub: t('common.loss') },
    { label: 'finance.net_profit', value: formatPrice(sum.total_net_profit || 0), color: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'pi pi-wallet', glow: 'bg-emerald-400' },
    { label: 'finance.margin', value: (sum.avg_margin_pct || 0) + '%', color: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'pi pi-percentage', glow: 'bg-blue-500', sub: t('common.average') }
  ]
})

const metrics = computed(() => {
  const sum = props.data.summary || {}
  const rev = parseFloat(sum.total_revenue || 1)
  return [
    { label: 'finance.gross_profit', value: formatPrice(sum.total_gross_profit || 0), percent: (parseFloat(sum.total_gross_profit || 0) / rev * 100).toFixed(0), trend: 12 },
    { label: 'finance.net_profit', value: formatPrice(sum.total_net_profit || 0), percent: (parseFloat(sum.total_net_profit || 0) / rev * 100).toFixed(0), trend: 5 },
    { label: 'finance.wastage_loss', value: formatPrice(sum.total_wastage_loss || 0), percent: (parseFloat(sum.total_wastage_loss || 1) / rev * 100).toFixed(0), trend: -8 }
  ]
})

const chartData = computed(() => ({
  labels: props.data.data?.map(i => i.month_name) || [],
  datasets: [
    {
      label: t('finance.net_profit'),
      data: props.data.data?.map(i => parseFloat(i.net_profit)) || [],
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
      borderWidth: 4,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      tension: 0.4,
      fill: true
    },
    {
      label: t('finance.revenue'),
      data: props.data.data?.map(i => parseFloat(i.revenue)) || [],
      borderColor: 'rgba(203, 213, 225, 0.5)',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [8, 4],
      pointRadius: 0,
      tension: 0.4,
      fill: false
    }
  ]
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
      borderRadius: 20,
      usePointStyle: true,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${formatPrice(context.parsed.y)}`
      }
    }
  },
  scales: {
    y: { 
      grid: { color: 'rgba(203, 213, 225, 0.08)', drawBorder: false }, 
      ticks: { 
        color: '#94a3b8',
        font: { size: 11, weight: '600' },
        callback: (val) => val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(0) + 'K' : val
      } 
    },
    x: { 
      grid: { display: false }, 
      ticks: { 
        color: '#94a3b8',
        font: { size: 11, weight: '600' } 
      } 
    }
  }
}

const tableData = computed(() => props.data.data || [])
</script>


