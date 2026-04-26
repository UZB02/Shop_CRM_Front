<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <!-- Jami Sof Sotuv -->
    <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500/30 transition-all">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('kpi.stats.total_net') }}</span>
        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
          <i class="pi pi-wallet text-[10px]"></i>
        </div>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-sm font-black text-slate-800 dark:text-white">{{ formatPrice(stats.totalNetSales) }}</span>
      </div>
      <div class="mt-2 h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000" :style="{ width: '85%' }"></div>
      </div>
    </div>

    <!-- O'rtacha Samaradorlik -->
    <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-amber-500/30 transition-all">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('kpi.stats.avg_kpi') }}</span>
        <div class="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
          <i class="pi pi-bolt text-[10px]"></i>
        </div>
      </div>
      <span class="text-sm font-black text-slate-800 dark:text-white">{{ stats.avgCompletion }}%</span>
      <div class="mt-2 h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-amber-500 rounded-full transition-all duration-1000" :style="{ width: stats.avgCompletion + '%' }"></div>
      </div>
    </div>

    <!-- Qaytarish Ko'rsatkichi -->
    <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-rose-500/30 transition-all">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('kpi.stats.return_rate') }}</span>
        <div class="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
          <i class="pi pi-history text-[10px]"></i>
        </div>
      </div>
      <span class="text-sm font-black text-rose-500">{{ stats.returnRate }}%</span>
      <div class="mt-2 h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-rose-500 rounded-full transition-all duration-1000" :style="{ width: stats.returnRate + '%' }"></div>
      </div>
    </div>

    <!-- Top Performer -->
    <div class="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20 group relative overflow-hidden">
      <div class="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
        <i class="pi pi-trophy text-5xl text-white"></i>
      </div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">{{ $t('kpi.stats.month_star') }}</span>
        <i class="pi pi-star-fill text-[10px] text-white"></i>
      </div>
      <span class="text-sm font-black text-white truncate block">{{ stats.topPerformer?.worker_name || '---' }}</span>
      <span class="text-[9px] font-bold text-white/60 uppercase tracking-tight mt-1 inline-block">{{ $t('kpi.table.plan') }}: {{ stats.topPerformer?.completion_pct || 0 }}%</span>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

defineProps({
  stats: Object
})

const { formatPrice } = useSettingsStore()
</script>
