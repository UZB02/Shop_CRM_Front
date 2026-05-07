<template>
  <div class="space-y-4">
    <!-- Ombor summary KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" :class="{'lg:grid-cols-3': settingsStore.isWastageEnabled}">
      <!-- Ombor Kapitali -->
      <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-[0.2em]">Ombor Kapitali</span>
          <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
            <i class="pi pi-box text-[12px]"></i>
          </div>
        </div>
        <p class="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tighter">{{ formatPrice(warehouseValue) }}</p>
      </div>

      <!-- Isrof -->
      <div v-if="settingsStore.isWastageEnabled" class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
        <div class="flex items-center justify-between">
          <span class="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-[0.2em]">Isrof</span>
          <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
            <i class="pi pi-trash text-[12px]"></i>
          </div>
        </div>
        <p class="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tighter">{{ formatPrice(wastageTotal) }}</p>
      </div>

      <!-- Defitsit -->
      <div :class="['p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-sm flex flex-col gap-2 transition-all hover:shadow-md',
                    settingsStore.isWastageEnabled ? 'sm:col-span-2 lg:col-span-1' : '',
                    lowStockCount > 0
                      ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800']">
        <div class="flex items-center justify-between">
          <span :class="['text-[10px] sm:text-[11px] font-black tracking-[0.2em]', lowStockCount > 0 ? 'text-rose-500' : 'text-slate-400']">Defitsit</span>
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', lowStockCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']">
            <i class="pi pi-exclamation-triangle text-[12px]"></i>
          </div>
        </div>
        <p :class="['text-base sm:text-lg font-black tracking-tighter', lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600']">
          {{ lowStockCount > 0 ? lowStockCount + ' ta' : 'YAXSHI' }}
        </p>
      </div>
    </div>

    <!-- Low stock list -->
    <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <i class="pi pi-exclamation-triangle text-sm"></i>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">Kritik Zaxira Darajasi</h3>
            <p class="text-[11px] text-slate-400 font-bold tracking-widest mt-0.5">Zudlik bilan to'ldirish kerak bo'lgan mahsulotlar</p>
          </div>
        </div>
        <span v-if="lowStock.length" class="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[12px] font-black border border-rose-500/20">{{ lowStock.length }} ta</span>
      </div>
      
      <div v-if="!lowStock.length" class="flex flex-col items-center justify-center py-12 text-center text-slate-400">
        <div class="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center mb-4">
          <i class="pi pi-check text-2xl text-emerald-500"></i>
        </div>
        <p class="text-[13px] font-black tracking-widest">Barcha zaxiralar me'yorida</p>
      </div>
      
      <div v-else class="space-y-2">
        <div v-for="item in lowStock" :key="item.product_id" 
             class="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/[0.02] transition-all">
          <div class="flex items-center gap-4">
            <div class="w-1.5 h-10 rounded-full bg-rose-500/20 group-hover:bg-rose-500 transition-colors"></div>
            <div>
              <p class="text-xs font-black text-slate-800 dark:text-white">{{ item.name }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <p class="text-[11px] font-bold text-slate-400 tracking-tighter">{{ item.location }}</p>
                <span :class="['text-[10px] font-black px-1.5 py-0.5 rounded-md ',
                               item.location_type === 'branch' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500']">
                  {{ item.location_type === 'branch' ? 'Filial' : 'Omborxona' }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-black text-rose-500 tabular-nums">{{ item.quantity }} {{ item.unit }}</p>
            <p class="text-[10px] font-black text-rose-300 tracking-tighter">Kam qolgan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

defineProps({
  lowStock:       { type: Array,  default: () => [] },
  lowStockCount:  { type: Number, default: 0 },
  warehouseValue: { type: Number, default: 0 },
  wastageTotal:   { type: Number, default: 0 }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)
</script>


