<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest border transition-all duration-200',
      getStatusClass(status)
    ]"
  >
    <div class="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse"></div>
    {{ translatedLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTradeUtils } from '@/views/Customers/composables/useTradeUtils'

const props = defineProps({
  status: { type: String, required: true },
  displayLabel: { type: String, required: true }
})

const { t } = useI18n()
const { getStatusClass } = useTradeUtils()

const translatedLabel = computed(() => {
  const s = props.status?.toLowerCase()
  if (s === 'cash') return t('common.cash_label')
  if (s === 'card') return t('common.card_label')
  if (s === 'debt') return t('common.debt_status')
  return props.displayLabel
})
</script>


