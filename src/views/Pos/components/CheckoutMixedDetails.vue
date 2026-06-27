<template>
  <div class="flex flex-col gap-2 animate-fadein">
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <label class="lbl">{{ $t('pos.cash') }}</label>
        <div :class="isCashOverflow ? 'co-input-error' : ''">
          <InputNumber
            :model-value="cashAmount"
            @update:model-value="$emit('update:cashAmount', $event || 0)"
            class="w-full co-amount-input-sm"
            :min="0"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="lbl">{{ $t('pos.card') }}</label>
        <div :class="isCardOverflow ? 'co-input-error' : ''">
          <InputNumber
            :model-value="cardAmount"
            @update:model-value="$emit('update:cardAmount', $event || 0)"
            class="w-full co-amount-input-sm"
            :min="0"
          />
        </div>
      </div>
    </div>

    <!-- Naqd pul alohida oshib ketsa -->
    <div v-if="isCashOverflow && !isSumOverflow"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-800/30 animate-fadein">
      <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
      <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">{{ $t('pos.cash_exceeds_total') }}</span>
    </div>

    <!-- Plastik karta alohida oshib ketsa -->
    <div v-if="isCardOverflow && !isSumOverflow"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-800/30 animate-fadein">
      <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
      <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">{{ $t('pos.card_exceeds_total') }}</span>
    </div>

    <!-- Yig'indi oshib ketsa -->
    <div v-if="isSumOverflow"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-800/30 animate-fadein">
      <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
      <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">{{ $t('pos.total_entered_exceeds') }}</span>
    </div>

    <div class="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-dashed"
      :class="isMixedValid ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' : isSumOverflow ? 'bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/30' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'">
      <div>
        <span class="text-[10px] font-black tracking-widest block opacity-80"
          :class="isMixedValid ? 'text-emerald-600 dark:text-emerald-400' : isSumOverflow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'">
          {{ $t('pos.total_entered') }}
        </span>
        <span class="text-base font-black font-outfit leading-none"
          :class="isMixedValid ? 'text-emerald-700 dark:text-emerald-300' : isSumOverflow ? 'text-rose-700 dark:text-rose-300' : 'text-slate-800 dark:text-slate-300'">
          {{ settingsStore.formatPrice((cashAmount || 0) + (cardAmount || 0), currencyCode) }}
        </span>
      </div>
      <div>
        <span class="text-[10px] font-black tracking-widest block text-right opacity-70 text-slate-500 dark:text-slate-400">
          {{ $t('pos.to_pay') }}
        </span>
        <span class="text-base font-black font-outfit leading-none text-slate-800 dark:text-slate-300 text-right block">
          {{ settingsStore.formatPrice(paidAmount, currencyCode) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputNumber from 'primevue/inputnumber'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

defineProps({
  cashAmount: Number,
  cardAmount: Number,
  isCashOverflow: Boolean,
  isCardOverflow: Boolean,
  isSumOverflow: Boolean,
  isMixedValid: Boolean,
  paidAmount: Number,
  currencyCode: String
})

defineEmits(['update:cashAmount', 'update:cardAmount'])
</script>
