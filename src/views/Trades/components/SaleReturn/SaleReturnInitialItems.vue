<template>
  <div class="space-y-3">
    <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Savdodagi mahsulotlar</h3>
    <div class="grid grid-cols-1 gap-2.5">
      <div v-for="item in initialSale.items" :key="item.id" 
           class="p-3 rounded-[14px] border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/[0.02] shadow-sm transition-all group">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ item.product_name }}</span>
          <span class="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Sotilgan: {{ parseFloat(item.quantity) }} {{ item.unit }} <span class="mx-1 text-slate-300 dark:text-slate-600">|</span> Narxi: {{ formatCurrency(item.unit_price) }}</span>
        </div>
        <button 
          @click="$emit('add', item)"
          :disabled="isAlreadyAdded(item.product_id || item.product)"
          class="h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                 disabled:opacity-50 disabled:grayscale 
                 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white 
                 border border-emerald-100 dark:border-emerald-500/10"
        >
          {{ isAlreadyAdded(item.product_id || item.product) ? 'Qo\'shilgan' : 'Tanlash' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  initialSale: Object,
  formatCurrency: Function,
  isAlreadyAdded: Function
})
defineEmits(['add'])
</script>
