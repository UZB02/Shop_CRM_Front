<template>
  <div class="space-y-4 animate-in fade-in duration-500">
    <!-- P&L Header Stats (Summary from API) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <div v-for="card in summaryCards" :key="card.label" 
           class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1.5">
           <div :class="card.iconBg" class="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <i :class="[card.icon, card.iconColor]" class="text-[10px]"></i>
           </div>
           <span v-if="card.pct" class="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {{ card.pct }}%
           </span>
        </div>
        <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{{ card.label }}</p>
        <p class="text-xs font-black tracking-tight" :class="card.textColor">
           {{ settingsStore.formatPrice(card.value) }}
        </p>
        <i :class="card.icon" class="absolute -right-1.5 -bottom-1.5 text-2xl opacity-[0.03] rotate-12"></i>
      </div>
    </div>

    <!-- Main Chart Section -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
       <div class="flex items-center justify-between mb-8">
          <div>
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">Daromad Tahlili (Oyma-oy)</h3>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{{ monthlyData?.year }} - YILLIK DINAMIKA</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Sotuvlar</span>
             </div>
             <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Sof Foyda</span>
             </div>
          </div>
       </div>

       <div class="h-[300px] w-full">
          <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
       </div>
    </div>

    <!-- Monthly Stats Table (Optional but professional) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
       <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Oylik Ko'rsatkichlar</h3>
       </div>
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-800/20">
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Oy</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Tushum</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Tan narxi</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Sof Foyda</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Margin %</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in monthlyData?.data" :key="item.month" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                   <td class="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-100">{{ item.month_name }}</td>
                   <td class="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{{ settingsStore.formatPrice(item.revenue) }}</td>
                   <td class="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{{ settingsStore.formatPrice(item.cogs) }}</td>
                   <td class="px-6 py-4 text-right">
                      <span class="text-xs font-black" :class="parseFloat(item.net_profit) >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                         {{ settingsStore.formatPrice(item.net_profit) }}
                      </span>
                   </td>
                   <td class="px-6 py-4 text-center">
                      <span class="px-2 py-0.5 rounded-lg text-[10px] font-black" 
                            :class="parseFloat(item.margin_pct) >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'">
                         {{ item.margin_pct }}%
                      </span>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  monthlyData: Object // Monthly chart data
})

const summaryCards = computed(() => {
  const sum = props.monthlyData?.summary || {}
  return [
    {
      label: 'Sof Tushum',
      value: sum.total_revenue || 0,
      icon: 'pi pi-shopping-cart',
      iconColor: 'text-sky-500',
      iconBg: 'bg-sky-50 dark:bg-sky-500/10',
      textColor: 'text-slate-800 dark:text-slate-100'
    },
    {
      label: 'Yalpi Foyda',
      value: sum.total_gross_profit || 0,
      icon: 'pi pi-chart-pie',
      iconColor: 'text-indigo-500',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      pct: sum.avg_margin_pct
    },
    {
      label: 'Jami Xarajat',
      value: sum.total_expenses || 0,
      icon: 'pi pi-wallet',
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      label: 'Sof Foyda',
      value: sum.total_net_profit || 0,
       icon: 'pi pi-star-fill',
       iconColor: 'text-emerald-500',
       iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
       textColor: parseFloat(sum.total_net_profit) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
    }
  ]
})

const chartData = computed(() => {
  const items = props.monthlyData?.data || []
  return {
    labels: items.map(i => i.month_name),
    datasets: [
      {
        label: 'Sotuvlar',
        backgroundColor: '#0ea5e9', // sky-500
        hoverBackgroundColor: '#0284c7',
        data: items.map(i => parseFloat(i.revenue)),
        borderRadius: 8,
        barThickness: 20
      },
      {
        label: 'Tan narxi',
        backgroundColor: '#f59e0b', // amber-500
        hoverBackgroundColor: '#d97706',
        data: items.map(i => parseFloat(i.cogs)),
        borderRadius: 8,
        barThickness: 20
      },
      {
        label: 'Yalpi Foyda',
        backgroundColor: '#10b981', // emerald-500
        hoverBackgroundColor: '#059669',
        data: items.map(i => parseFloat(i.gross_profit)),
        borderRadius: 8,
        barThickness: 20
      },
      {
        label: 'Sof Foyda',
        backgroundColor: '#ef4444', // rose-500
        hoverBackgroundColor: '#dc2626',
        data: items.map(i => parseFloat(i.net_profit)),
        borderRadius: 8,
        barThickness: 20
      }
    ]
  }
})

const chartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: { display: false },
      tooltip: {
         mode: 'index',
         intersect: false,
         backgroundColor: isDark ? '#1e293b' : '#fff',
         titleColor: isDark ? '#f1f5f9' : '#0f172a',
         bodyColor: isDark ? '#94a3b8' : '#64748b',
         borderColor: isDark ? '#334155' : '#e2e8f0',
         borderWidth: 1,
         padding: 12,
         cornerRadius: 12,
         callbacks: {
            label: function(context) {
               let label = context.dataset.label || '';
               if (label) label += ': ';
               label += settingsStore.formatPrice(context.parsed.y);
               return label;
            }
         }
      }
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { weight: 'bold', size: 10 }
        }
      },
      y: {
        stacked: false,
        grid: { 
          color: isDark ? '#334155' : '#f1f5f9',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { weight: 'bold', size: 10 },
          callback: (value) => value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value
        }
      }
    }
  }
})
</script>

<style scoped>
:deep(.p-chart) {
   height: 100% !important;
}
</style>
