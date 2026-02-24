<template>
  <div class="flex items-center gap-3 mb-5">
    <span class="w-1.5 h-6 rounded-full" :class="barColor"></span>
    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{{ label }}</h3>
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
  'bg-slate-300':  props.color === 'slate',
  'bg-blue-500':   props.color === 'blue',
}))
</script>
