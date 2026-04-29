<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      v-for="stat in stats" 
      :key="stat.label"
      class="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md group"
    >
      <div class="flex items-center justify-between mb-4">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110', stat.bg]">
          <i :class="[stat.icon, 'text-xl', stat.color]"></i>
        </div>
        <div :class="['flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full', stat.trendUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10']">
          <i :class="['pi', stat.trendUp ? 'pi-arrow-up-right' : 'pi-arrow-down-right']"></i>
          <span>{{ stat.trend }}</span>
        </div>
      </div>
      
      <div>
        <p class="text-xs font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">{{ stat.label }}</p>
        <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">{{ stat.value }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>
