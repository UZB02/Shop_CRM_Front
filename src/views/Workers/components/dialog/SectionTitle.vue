<template>
  <div class="flex items-center gap-3 mb-4 font-inter">
    <span class="w-1 h-5 rounded-full" :class="barColor"></span>
    <h3 class="text-[12px] font-black tracking-[0.2em] text-slate-500 dark:text-slate-400">
      {{ label }}
    </h3>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  color: { type: String, default: 'slate' },
})
const barColor = computed(() => ({
  'bg-emerald-500': props.color === 'emerald',
  'bg-slate-300 dark:bg-slate-700':  props.color === 'slate',
  'bg-blue-500':   props.color === 'blue',
}))
</script>


