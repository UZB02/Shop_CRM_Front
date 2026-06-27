<template>
  <div class="flex flex-col gap-3 mt-1 animate-fadein">
     <div class="grid grid-cols-2 gap-2">
       <div class="flex flex-col gap-1">
         <label class="lbl">{{ $t('pos.cash') }}</label>
         <div :class="isDebtOverflow ? 'co-input-error' : ''">
           <InputNumber 
             :model-value="debtCashAmount" 
             @update:model-value="$emit('update:debtCashAmount', $event || 0)" 
             class="w-full co-amount-input-sm" 
             :min="0" 
             :use-grouping="true" 
           />
         </div>
       </div>
       <div class="flex flex-col gap-1">
         <label class="lbl">{{ $t('pos.card') }}</label>
         <div :class="isDebtOverflow ? 'co-input-error' : ''">
           <InputNumber 
             :model-value="debtCardAmount" 
             @update:model-value="$emit('update:debtCardAmount', $event || 0)" 
             class="w-full co-amount-input-sm" 
             :min="0" 
             :use-grouping="true" 
           />
         </div>
       </div>
     </div>

     <!-- Yig'indi oshib ketsa -->
     <div v-if="isDebtOverflow"
       class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-800/30 animate-fadein">
       <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
       <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">{{ $t('pos.total_entered_exceeds') }}</span>
     </div>

     <!-- Debt Summary -->
     <div class="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
       <div>
         <span class="text-[10px] font-black tracking-widest block opacity-80">{{ $t('pos.customer_debt_will_be') }}</span>
         <span class="text-xl font-black font-outfit leading-none">{{ settingsStore.formatPrice(remainingDebt, currencyCode) }}</span>
       </div>
       <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
         <i class="pi pi-history text-base text-white" />
       </div>
     </div>
  </div>
</template>

<script setup>
import InputNumber from 'primevue/inputnumber'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

defineProps({
  debtCashAmount: Number,
  debtCardAmount: Number,
  isDebtOverflow: Boolean,
  remainingDebt: Number,
  currencyCode: String
})

defineEmits(['update:debtCashAmount', 'update:debtCardAmount'])
</script>
