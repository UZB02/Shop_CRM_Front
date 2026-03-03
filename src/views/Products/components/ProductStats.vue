<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
    <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all group flex items-center gap-3 sm:gap-5">
      <div :class="['w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0', stat.bg]">
        <i :class="['pi text-lg sm:text-xl font-bold', stat.icon, stat.color]"></i>
      </div>
      <div class="min-w-0">
        <p class="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">{{ $t('products.' + stat.label) }}</p>
        <p class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalProducts: Number,
  categoriesCount: Number,
  warehousesCount: Number
})

const stats = computed(() => [
  { label: 'total', value: props.totalProducts, icon: 'pi-box', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'low_stock', value: 0, icon: 'pi-exclamation-triangle', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'categories_count', value: props.categoriesCount, icon: 'pi-folder', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'warehouses_count', value: props.warehousesCount, icon: 'pi-building', color: 'text-sky-500', bg: 'bg-sky-500/10' }
])
</script>
