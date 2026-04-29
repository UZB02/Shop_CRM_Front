<template>
  <div class="mt-2 flex-grow flex flex-col min-h-0">
    <div class="flex items-center justify-between mb-3 shrink-0">
      <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Qaytariladigan mahsulotlar</h3>
      <span class="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md border border-rose-100 dark:border-rose-500/10 leading-none">{{ items.length }} xil</span>
    </div>
    
    <div class="space-y-2.5 flex-grow overflow-y-auto pr-1 custom-scrollbar">
      <div v-if="!items.length" class="h-full flex flex-col items-center justify-center opacity-40 py-16">
        <i class="pi pi-box text-3xl mb-3 dark:text-slate-500"></i>
        <p class="text-[11px] font-bold dark:text-slate-400">Hech narsa tanlanmagan</p>
      </div>

      <div v-for="(item, idx) in items" :key="idx" 
           class="group flex items-center gap-3 p-3 rounded-[14px] transition-all duration-200 border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent shadow-sm">
        <div class="w-9 h-9 rounded-[10px] bg-slate-50 dark:bg-[#1a2333] flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-200/50 dark:border-white/5">
          <i class="pi pi-box text-xs"></i>
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{{ item.product_name }}</h4>
            <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
          </div>
          <p class="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Birlik: {{ formatCurrency(item.unit_price) }}</p>
        </div>
        
        <div class="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-slate-50 dark:bg-[#131d31] rounded-lg border border-slate-100 dark:border-white/5">
           <button @click="$emit('updateQty', idx, -1)" class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition-colors">
             <i class="pi pi-minus text-[8px] font-bold"></i>
           </button>
           <input 
             v-model="item.quantity"
             type="number" 
             step="0.01"
             class="w-12 h-6 bg-transparent text-center text-xs font-black text-slate-800 dark:text-white focus:outline-none"
           />
           <button @click="$emit('updateQty', idx, 1)" class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-white/5 text-slate-400 hover:text-emerald-500 transition-colors">
             <i class="pi pi-plus text-[8px] font-bold"></i>
           </button>
        </div>

        <div class="w-20 text-right shrink-0">
          <span class="text-[12px] font-black text-slate-900 dark:text-white leading-none">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
        </div>

        <button @click="$emit('remove', idx)" class="w-7 h-7 rounded-lg text-slate-300 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 shrink-0 flex items-center justify-center ml-1">
          <i class="pi pi-trash text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  items: Array,
  formatCurrency: Function
})
defineEmits(['updateQty', 'remove'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
