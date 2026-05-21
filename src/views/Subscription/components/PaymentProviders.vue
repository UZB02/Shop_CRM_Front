<template>
  <div class="space-y-2 pt-0.5">
    <label class="block text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase px-1">
      {{ t('subscription.payment_provider') || "To'lov provayderi" }}
    </label>
    <div class="grid grid-cols-2 gap-3">
      
      <!-- Click Provider -->
      <div 
        class="relative p-2.5 border-2 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all duration-200 flex flex-col gap-1.5 group overflow-hidden hover:scale-[1.01] active:scale-[0.99]"
        :class="modelValue === 'click' 
          ? 'border-emerald-500 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.015] shadow-sm' 
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20'"
        @click="$emit('update:modelValue', 'click')"
      >
        <div class="flex items-center gap-2.5">
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            :class="modelValue === 'click' ? 'bg-blue-600 text-white scale-105 shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
          >
            <i class="pi pi-credit-card text-sm"></i>
          </div>
          <div>
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">Click</h4>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 leading-none block mt-1">Uzcard / Humo</span>
          </div>
        </div>
        
        <div v-if="modelValue === 'click'" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm animate-scale-in">
          <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
          </svg>
        </div>
      </div>
      
      <!-- Payme (Coming Soon) -->
      <div class="relative p-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-2xl flex flex-col gap-1.5 opacity-50 select-none bg-slate-50/50 dark:bg-slate-950/20">
        <span class="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15 tracking-wider uppercase">
          <span class="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
          {{ t('subscription.coming_soon') || 'Tez kunda' }}
        </span>
        
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center">
            <i class="pi pi-wallet text-sm"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 leading-none">Payme</h4>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 leading-none block mt-1">Uzcard / Humo</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
