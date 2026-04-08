<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all duration-200',
      getStatusClass(status)
    ]"
  >
    <div class="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse"></div>
    {{ displayLabel }}
  </span>
</template>

<script setup>
import { useTradeUtils } from '../composables/useTradeUtils'

defineProps({
  status: { type: String, required: true },
  displayLabel: { type: String, required: true }
})

const { getStatusClass } = useTradeUtils()
</script>
