<template>
  <div class="mb-4">
    <h3 class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-3 uppercase ml-1">Savdodagi mahsulotlar</h3>
    <div class="border border-slate-200 dark:border-white/5 rounded-[20px] overflow-hidden bg-white dark:bg-transparent shadow-sm">
      <div v-for="item in initialSale.items" :key="item.id" 
           class="p-4 border-b border-slate-100 dark:border-white/5 last:border-0 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all"
           :class="{'opacity-50 grayscale-[50%]': parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0}">
        
        <div class="flex flex-col flex-grow">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[14px] font-bold text-slate-800 dark:text-slate-200">{{ item.product_name }}</span>
            <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
          </div>
          <div class="flex items-center flex-wrap gap-x-4 gap-y-2">
            <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Sotilgan</span>
               <span class="text-[13px] text-slate-700 dark:text-slate-300 font-black">{{ parseFloat(item.quantity) }}</span>
            </div>
            
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-700/50 hidden sm:block"></div>
            
            <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Qaytarilgan</span>
               <span class="text-[13px] font-black" :class="parseFloat(item.returned_qty || 0) > 0 ? 'text-amber-500' : 'text-slate-400'">{{ parseFloat(item.returned_qty || 0) }}</span>
            </div>
            
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-700/50 hidden sm:block"></div>
            
            <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Qolgan</span>
               <span class="text-[13px] text-emerald-500 font-black">{{ parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) }}</span>
            </div>
            
            <div class="w-px h-6 bg-slate-200 dark:bg-slate-700/50 hidden sm:block"></div>
            
            <div class="flex flex-col">
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Narx</span>
               <span class="text-[13px] text-slate-700 dark:text-slate-300 font-black">{{ formatCurrency(item.unit_price) }}</span>
            </div>
          </div>
        </div>
        
        <button 
          @click="$emit('add', item)"
          :disabled="isAlreadyAdded(item.id || item.product_id || item.product, item.tur_id) || parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0"
          class="h-10 px-6 rounded-xl text-[11px] font-black tracking-widest transition-all shadow-sm shrink-0 flex justify-center items-center
                 disabled:opacity-50 disabled:grayscale 
                 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-emerald-500/20
                 border border-slate-200 dark:border-white/5"
        >
          {{ isAlreadyAdded(item.id || item.product_id || item.product, item.tur_id) ? 'QO\'SHILGAN' : (parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0 ? 'TUGAGAN' : 'TANLASH') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  initialSale: Object,
  formatCurrency: Function,
  isAlreadyAdded: Function
})
defineEmits(['add'])
</script>


