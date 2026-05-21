<template>
  <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-slate-50/80 via-slate-100/70 to-emerald-50/40 dark:from-[#181d29] dark:via-[#0d1017] dark:to-[#042c22] rounded-2xl shadow-sm dark:shadow-md border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group select-none">
    <!-- Ambient glowing background -->
    <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-2xl"></div>
    
    <!-- Current Balance -->
    <div class="flex flex-col relative z-10">
      <span class="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">
        {{ t('subscription.current_balance') || 'Joriy balans' }}
      </span>
      <span class="text-sm font-black tracking-wide text-slate-800 dark:text-white">
        {{ formatPrice(currentBalance) }}
      </span>
    </div>
    
    <!-- Transition Arrow -->
    <div class="flex items-center justify-center relative z-10 px-2">
      <div class="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center justify-center border border-slate-300/30 dark:border-white/10 backdrop-blur-sm">
        <i class="pi pi-arrow-right text-xs text-slate-600 dark:text-emerald-400 animate-pulse"></i>
      </div>
    </div>
    
    <!-- Expected Balance -->
    <div class="flex flex-col items-end relative z-10">
      <span class="text-[9px] text-emerald-600 dark:text-emerald-400/80 font-bold uppercase tracking-widest mb-0.5">
        {{ t('subscription.expected_balance') || 'Yangi balans' }}
      </span>
      <span class="text-sm font-black tracking-wide text-emerald-600 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
        {{ formatPrice(Number(currentBalance) + Number(amount)) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

defineProps({
  currentBalance: {
    type: [Number, String],
    required: true
  },
  amount: {
    type: [Number, String],
    default: 0
  }
})

const formatPrice = (value) => {
  return settingsStore.formatPrice(value)
}
</script>
