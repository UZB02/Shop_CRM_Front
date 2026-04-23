<template>
  <div class="space-y-8 pb-10">
    <!-- Exec Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
       <div v-for="card in execCards" :key="card.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden group">
          <div :class="['absolute right-0 top-0 w-32 h-32 blur-3xl opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-500 group-hover:opacity-20', card.glow]"></div>
          
          <div class="flex items-center gap-2 mb-4">
            <div :class="['w-8 h-8 rounded-xl flex items-center justify-center text-[10px]', card.iconBg, card.color]">
              <i :class="card.icon"></i>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{{ t(card.label) }}</p>
          </div>

          <div class="flex items-end justify-between relative z-10">
             <h3 :class="['text-2xl font-black tracking-tight truncate', card.color]">{{ card.value }}</h3>
             <span v-if="card.sub" class="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
               {{ card.sub }}
             </span>
          </div>
       </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profitability Trend Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
         <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
               <div class="flex items-center gap-2 mb-1">
                 <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{{ t('reports.profit_loss') }} Flux</h3>
               </div>
               <p class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ props.data.year }} {{ t('common.year') }} {{ t('reports.summary') }}</p>
            </div>
            <div class="flex gap-6">
               <div class="flex items-center gap-2.5">
                  <div class="w-4 h-1.5 rounded-full bg-emerald-500"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ t('finance.net_profit') }}</span>
               </div>
               <div class="flex items-center gap-2.5">
                  <div class="w-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ t('finance.revenue') }}</span>
               </div>
            </div>
         </div>
         <div class="h-[300px] sm:h-[380px]">
            <Chart type="line" :data="chartData" :options="chartOptions" />
         </div>
      </div>

      <!-- Quick Analysis / Key Metrics -->
       <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-[2.5rem] p-5 sm:p-8 text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between overflow-hidden relative">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <i class="pi pi-chart-bar text-[120px] -rotate-12"></i>
          </div>
          
          <div class="relative z-10">
            <h4 class="text-sm font-black uppercase tracking-widest opacity-70 mb-6">{{ t('common.analytics') }}</h4>
            <div class="space-y-8">
               <div v-for="metric in metrics" :key="metric.label" class="flex flex-col gap-1">
                  <span class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ t(metric.label) }}</span>
                  <div class="flex items-center justify-between">
                    <span class="text-xl font-black">{{ metric.value }}</span>
                    <div v-if="metric.trend" :class="['flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md', metric.trend > 0 ? 'text-white' : 'text-rose-200']">
                      <i :class="['pi', metric.trend > 0 ? 'pi-arrow-up-right' : 'pi-arrow-down-right']"></i>
                      {{ Math.abs(metric.trend) }}%
                    </div>
                  </div>
                  <div class="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div class="h-full bg-white rounded-full transition-all duration-1000" :style="{ width: metric.percent + '%' }"></div>
                  </div>
               </div>
            </div>
          </div>

          <div class="mt-10 pt-8 border-t border-white/10 relative z-10">
            <p class="text-[11px] font-medium opacity-70 leading-relaxed italic">
              "Foyda va zarar hisoboti biznesingizning moliyaviy sog'lig'ini real vaqt rejimida ko'rsatadi."
            </p>
          </div>
       </div>
    </div>

    <!-- Detailed Monthly Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden">
       <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
            <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Oylik moliyaviy taqsimot</span>
          </div>
          <button class="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2">
            <i class="pi pi-download"></i>
            {{ t('common.export') }}
          </button>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-5 sm:px-8 py-5">Oy</th>
                   <th class="px-5 sm:px-8 py-5">{{ t('finance.revenue') }}</th>
                   <th class="px-5 sm:px-8 py-5">COGS (Tannarx)</th>
                   <th class="px-5 sm:px-8 py-5">{{ t('finance.gross_profit') }}</th>
                   <th class="px-5 sm:px-8 py-5">{{ t('finance.wastage_loss') }}</th>
                   <th class="px-5 sm:px-8 py-5">Xarajatlar</th>
                   <th class="px-5 sm:px-8 py-5">{{ t('finance.net_profit') }}</th>
                   <th class="px-5 sm:px-8 py-5">Margin %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
                <tr v-for="row in tableData" :key="row.month" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                   <td class="px-5 sm:px-8 py-5">
                      <span class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{{ row.month_name }}</span>
                   </td>
                   <td class="px-5 sm:px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(row.revenue) }}</td>
                   <td class="px-5 sm:px-8 py-5 text-sm font-bold text-slate-400">{{ formatPrice(row.cogs) }}</td>
                   <td class="px-5 sm:px-8 py-5">
                      <span class="text-sm font-black text-emerald-500">{{ formatPrice(row.gross_profit) }}</span>
                   </td>
                   <td class="px-5 sm:px-8 py-5 text-[12px] font-bold text-rose-400/80">({{ formatPrice(row.wastage_loss) }})</td>
                   <td class="px-5 sm:px-8 py-5 text-[12px] font-bold text-slate-400">{{ formatPrice(row.expenses) }}</td>
                   <td class="px-5 sm:px-8 py-5">
                      <span :class="['text-sm font-black', parseFloat(row.net_profit) >= 0 ? 'text-emerald-600' : 'text-rose-500']">
                         {{ formatPrice(row.net_profit) }}
                      </span>
                   </td>
                   <td class="px-5 sm:px-8 py-5">
                      <div :class="['inline-flex px-3 py-1 rounded-xl text-[10px] font-black transition-all', parseFloat(row.margin_pct) > 15 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500']">
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
    { label: 'finance.wastage_loss', value: formatPrice(sum.total_wastage_loss || 0), color: 'text-rose-500', iconBg: 'bg-rose-50 dark:bg-rose-500/10', icon: 'pi pi-trash', glow: 'bg-rose-500', sub: 'Zarar' },
    { label: 'finance.net_profit', value: formatPrice(sum.total_net_profit || 0), color: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'pi pi-wallet', glow: 'bg-emerald-400' },
    { label: 'finance.margin', value: (sum.avg_margin_pct || 0) + '%', color: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'pi pi-percentage', glow: 'bg-blue-500', sub: "O'rtacha" }
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
      label: 'Revenue',
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
        font: { size: 10, weight: '600' },
        callback: (val) => val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(0) + 'K' : val
      } 
    },
    x: { 
      grid: { display: false }, 
      ticks: { 
        color: '#94a3b8',
        font: { size: 10, weight: '600' } 
      } 
    }
  }
}

const tableData = computed(() => props.data.data || [])
</script>
