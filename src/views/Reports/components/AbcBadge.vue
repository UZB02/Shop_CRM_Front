<template>
  <span :class="['inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-black', styleMap[grade]]">
    {{ grade }}
  </span>
</template>

<script setup>
defineProps({
  grade: { type: String, required: true }, // 'A' | 'B' | 'C'
})

const styleMap = {
  A: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  B: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  C: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
}
</script>
