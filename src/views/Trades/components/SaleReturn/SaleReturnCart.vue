<template>
  <div class="flex flex-col lg:flex-grow lg:min-h-0 bg-slate-50/50 dark:bg-[#131d31]/30 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
    <div class="px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-transparent">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm border border-rose-200/50 dark:border-rose-500/20">
           <i class="pi pi-shopping-bag text-[11px]"></i>
        </div>
        <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Qaytariladigan mahsulotlar</h3>
      </div>
      <span v-if="items.length" class="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-500/10 leading-none shadow-sm tracking-widest">{{ items.length }} XIL</span>
    </div>
    
    <div class="p-4 space-y-3 lg:flex-grow lg:overflow-y-auto custom-scrollbar">
      <div v-if="!items.length" class="h-full flex flex-col items-center justify-center opacity-40 py-10">
        <div class="w-16 h-16 rounded-[20px] bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 shadow-inner">
           <i class="pi pi-box text-2xl text-slate-400 dark:text-slate-500"></i>
        </div>
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Hech qanday mahsulot tanlanmagan</p>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Yuqoridagi ro'yxatdan qaytarmoqchi bo'lganingizni tanlang</p>
      </div>

      <div v-for="(item, idx) in items" :key="idx" 
           class="group flex flex-col gap-3 p-4 rounded-[16px] transition-all duration-200 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1a2333] shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-md">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <h4 class="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{{ item.product_name }}</h4>
              <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-slate-400 font-medium tracking-widest uppercase">Birlik narxi:</span>
              <span class="text-[12px] font-black text-slate-700 dark:text-slate-300">{{ formatCurrency(item.unit_price) }}</span>
            </div>
          </div>
          <button @click="$emit('remove', idx)" class="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0 flex items-center justify-center border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 active:scale-95">
            <i class="pi pi-trash text-[13px]"></i>
          </button>
        </div>
        
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
          <div class="flex items-center bg-slate-50 dark:bg-[#0f1524] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
             <button @click="$emit('updateQty', idx, -1)" class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors border border-slate-100 dark:border-slate-700 active:scale-95">
               <i class="pi pi-minus text-[11px] font-bold"></i>
             </button>
             <input 
               v-model="item.quantity"
               type="number" 
               step="0.01"
               class="w-16 h-8 bg-transparent text-center text-[13px] font-black text-slate-800 dark:text-white focus:outline-none"
             />
             <button @click="$emit('updateQty', idx, 1)" class="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors border border-slate-100 dark:border-slate-700 active:scale-95">
               <i class="pi pi-plus text-[11px] font-bold"></i>
             </button>
          </div>

          <div class="flex flex-col text-right">
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Qaytarish Summasi</span>
            <span class="text-lg font-black text-slate-900 dark:text-white leading-none">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
          </div>
        </div>
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
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>


