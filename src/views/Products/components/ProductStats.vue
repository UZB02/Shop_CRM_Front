<template>
  <div class="grid grid-cols-2 gap-3 sm:gap-4">
    <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-center gap-2.5 sm:gap-4">
      <div :class="['w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0', stat.bg]">
        <i :class="['pi text-base sm:text-lg font-bold', stat.icon, stat.color]"></i>
      </div>
      <div class="min-w-0">
        <p class="text-[10px] sm:text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 truncate mb-0.5">{{ $t('products.' + stat.label) }}</p>
        <p class="text-base sm:text-xl font-black text-slate-800 dark:text-white leading-none">{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalProducts: Number
})

const stats = computed(() => [
  { label: 'total', value: props.totalProducts, icon: 'pi-box', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'low_stock', value: 0, icon: 'pi-exclamation-triangle', color: 'text-amber-500', bg: 'bg-amber-500/10' }
])
</script>


