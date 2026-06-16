<template>
  <div
    :class="[
      'flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black',
      bgColor, textColor
    ]"
  >
    <i v-if="iconClass" :class="iconClass" class="text-[8px]"></i>
    <span>{{ displayPct }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  pct: { type: [String, Number], default: null },
  direction: { type: String, default: null } // 'up', 'down', 'flat', 'new'
})

const displayPct = computed(() => {
  if (props.pct === null || props.pct === undefined) {
    if (props.direction === 'new') return t('reports.trend.new')
    return '—'
  }
  const val = parseFloat(props.pct)
  if (isNaN(val)) return '—'
  return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`
})

const finalDirection = computed(() => {
  if (props.direction) return props.direction
  // Agar pct berilgan lekin direction berilmagan bo'lsa (masalan summary uchun)
  if (props.pct === null || props.pct === undefined) return 'flat'
  const val = parseFloat(props.pct)
  if (val > 0) return 'up'
  if (val < 0) return 'down'
  return 'flat'
})

const bgColor = computed(() => {
  switch (finalDirection.value) {
    case 'up': return 'bg-emerald-100 dark:bg-emerald-900/30'
    case 'down': return 'bg-rose-100 dark:bg-rose-900/30'
    case 'new': return 'bg-blue-100 dark:bg-blue-900/30'
    case 'flat':
    default: return 'bg-slate-100 dark:bg-slate-800'
  }
})

const textColor = computed(() => {
  switch (finalDirection.value) {
    case 'up': return 'text-emerald-600 dark:text-emerald-400'
    case 'down': return 'text-rose-600 dark:text-rose-400'
    case 'new': return 'text-blue-600 dark:text-blue-400'
    case 'flat':
    default: return 'text-slate-500 dark:text-slate-400'
  }
})

const iconClass = computed(() => {
  switch (finalDirection.value) {
    case 'up': return 'pi pi-arrow-up'
    case 'down': return 'pi pi-arrow-down'
    case 'new': return 'pi pi-star-fill'
    case 'flat':
    default: return 'pi pi-minus'
  }
})
</script>
