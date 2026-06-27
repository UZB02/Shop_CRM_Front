<template>
  <div v-if="allowDiscount" class="flex flex-col gap-1.5 animate-fadein">
    <div class="flex items-center justify-between">
      <label class="lbl">{{ $t('pos.discount_amount') }}</label>
      <div class="flex items-center gap-2">
        <!-- Max limit badge -->
        <span v-if="maxDiscountPct > 0"
          class="text-[11px] font-black tracking-widest px-1.5 py-0.5 rounded-md"
          :class="isDiscountValid ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-rose-100 dark:bg-rose-900/20 text-rose-500'"
        >
          {{ $t('pos.max_discount') }} {{ maxDiscountPct }}%
        </span>
        <button @click="$emit('update:discountAmount', 0)"
          class="text-[11px] font-black text-slate-400 hover:text-slate-500 tracking-widest transition-colors">
          {{ $t('common.clear') }}
        </button>
      </div>
    </div>
    <div class="relative group">
      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-black text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors z-10 select-none">{{ currencyCode || settingsStore.currency }}</span>
      <InputNumber
        :model-value="discountAmount"
        @update:model-value="$emit('update:discountAmount', $event || 0)"
        class="w-full co-amount-input"
        :class="!isDiscountValid ? 'co-amount-input--error' : ''"
        :min="0"
        placeholder="0"
        :use-grouping="true"
      />
    </div>
    <!-- Max chegirimadan oshib ketganda ogohlantirish -->
    <div v-if="!isDiscountValid"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-800/30 animate-fadein">
      <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
      <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">
        {{ $t('pos.discount_limit_exceeded') }} {{ settingsStore.formatPrice(maxDiscountAmount) }} ({{ maxDiscountPct }}%)
      </span>
    </div>
    <!-- Yakuniy to'lanadigan summa (Chegirma berilsa chiqadi, Nasiyadan tashqari) -->
    <div v-if="totalDiscountAmount > 0 && paymentType !== 'debt'"
      class="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 animate-fadein">
      <div>
        <span class="text-[10px] font-black tracking-widest block opacity-80">{{ $t('pos.amount_to_pay') }}</span>
        <span class="text-xl font-black font-outfit leading-none">{{ settingsStore.formatPrice(paidAmount, currencyCode) }}</span>
      </div>
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <i class="pi pi-tag text-base text-white" />
      </div>
    </div>
    <!-- Chegirma totaldan oshib ketsa ogohlantirish -->
    <div v-if="totalDiscountAmount > total"
      class="mt-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-800/30 animate-fadein">
      <i class="pi pi-exclamation-triangle text-rose-500 text-sm" />
      <span class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest">{{ $t('pos.discount_exceeds_total') }}</span>
    </div>
  </div>
</template>

<script setup>
import InputNumber from 'primevue/inputnumber'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

defineProps({
  allowDiscount: Boolean,
  maxDiscountPct: Number,
  maxDiscountAmount: Number,
  discountAmount: Number,
  isDiscountValid: Boolean,
  totalDiscountAmount: Number,
  paidAmount: Number,
  paymentType: String,
  total: Number,
  currencyCode: String
})

defineEmits(['update:discountAmount'])
</script>
