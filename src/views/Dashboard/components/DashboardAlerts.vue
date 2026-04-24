<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Low Stock Alerts -->
    <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <i class="pi pi-exclamation-triangle text-base"></i>
          </div>
          <div>
             <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Kritik Zaxira</h3>
             <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Zudlik bilan to'ldirish kerak</p>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black border border-rose-500/20">{{ lowStock.length }} ta</span>
      </div>
      
      <div v-if="lowStock.length === 0" class="flex flex-col items-center justify-center py-10 text-center text-slate-400">
        <div class="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center mb-4">
           <i class="pi pi-check text-2xl text-emerald-500"></i>
        </div>
        <p class="text-[11px] font-black uppercase tracking-widest">Barcha zaxiralar me'yorda</p>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="item in lowStock" :key="item.product_id" class="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 hover:bg-rose-500/[0.02] hover:border-rose-500/20 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-1.5 h-10 rounded-full bg-rose-500/20 group-hover:bg-rose-500 transition-colors"></div>
            <div>
              <p class="text-xs font-black text-slate-800 dark:text-white">{{ item.name }}</p>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ item.location }} ({{ item.location_type }})</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-rose-500 tabular-nums">{{ item.quantity }} {{ item.unit }}</p>
            <p class="text-[8px] font-black uppercase text-rose-300 tracking-tighter">Kam qolgan</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Open Shifts -->
    <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i class="pi pi-bolt text-base"></i>
          </div>
          <div>
             <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Ochiq Smenalar</h3>
             <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real vaqtdagi faollik</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black border border-emerald-500/20">
           <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           LIVE
        </div>
      </div>

      <div v-if="currentSmena.open_count === 0" class="flex flex-col items-center justify-center py-10 text-center text-slate-400">
        <div class="w-16 h-16 rounded-full bg-slate-500/5 flex items-center justify-center mb-4">
           <i class="pi pi-moon text-2xl text-slate-400"></i>
        </div>
        <p class="text-[11px] font-black uppercase tracking-widest">Hozirda sotuvlar to'xtagan</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="s in currentSmena.smenas" :key="s.smena_id" class="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
               {{ s.worker.charAt(0) }}
            </div>
            <div>
              <p class="text-xs font-black text-slate-800 dark:text-white">{{ s.worker }}</p>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ s.branch }} • {{ s.start_time }} dan</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ formatPrice(s.sales_total) }}</p>
            <p class="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{{ s.sales_count }} ta xarid</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

defineProps({
  lowStock:     { type: Array,   default: () => [] },
  currentSmena: { type: Object,  default: () => ({ smenas: [], open_count: 0 }) }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)
</script>
