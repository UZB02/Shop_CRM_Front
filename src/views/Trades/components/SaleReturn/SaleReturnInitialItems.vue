<template>
  <div class="space-y-3">
    <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Savdodagi mahsulotlar</h3>
    <div class="grid grid-cols-1 gap-2.5">
      <div v-for="item in initialSale.items" :key="item.id" 
           class="p-3 rounded-[14px] border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/[0.02] shadow-sm transition-all group"
           :class="{'opacity-50 grayscale-[50%]': parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0}">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ item.product_name }}</span>
            <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
          </div>
          <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
            <span class="text-[9px] text-slate-500 font-bold tracking-widest">Sotilgan: {{ parseFloat(item.quantity) }}</span>
            <template v-if="parseFloat(item.returned_qty || 0) > 0">
              <span class="w-1 h-1 rounded-full bg-slate-300"></span>
              <span class="text-[9px] text-amber-500 font-bold tracking-widest">Qaytarilgan: {{ parseFloat(item.returned_qty) }}</span>
            </template>
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="text-[9px] text-emerald-500 font-bold tracking-widest">Qolgan: {{ parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="text-[9px] text-slate-400 font-medium tracking-tight">{{ formatCurrency(item.unit_price) }}</span>
          </div>
        </div>
        <button 
          @click="$emit('add', item)"
          :disabled="isAlreadyAdded(item.id || item.product_id || item.product, item.tur_id) || parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0"
          class="h-7 px-3 rounded-lg text-[9px] font-black tracking-widest transition-all
                 disabled:opacity-50 disabled:grayscale 
                 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white 
                 border border-emerald-100 dark:border-emerald-500/10"
        >
          {{ isAlreadyAdded(item.id || item.product_id || item.product, item.tur_id) ? 'Qo\'shilgan' : (parseFloat(item.net_qty || (parseFloat(item.quantity) - parseFloat(item.returned_qty || 0))) <= 0 ? 'Tugagan' : 'Tanlash') }}
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
