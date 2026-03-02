<template>
  <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-6 px-1">
    <!-- Left side: Stats & Search -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto order-2 lg:order-1">
      <!-- Stats (Always visible but compact on mobile) -->
      <div class="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          {{ count }} {{ $t('warehouse.count_suffix') }}
        </span>
      </div>

      <!-- Search Bar (Full width on mobile) -->
      <div class="relative flex-1 sm:w-80 group">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          :placeholder="$t('warehouse.search_placeholder')"
          class="w-full pl-11 pr-4 py-3 sm:py-2.5 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
        />
      </div>
    </div>

    <!-- Right side: Mobile Stats & View Toggle Group -->
    <div class="flex items-center justify-between lg:justify-end gap-3 order-1 lg:order-2">
      <!-- Mobile Only Stats -->
      <div class="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          {{ count }} {{ $t('warehouse.count_suffix') }}
        </span>
      </div>

      <!-- View Toggle -->
      <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-inner shrink-0">
        <button
          @click="$emit('update:viewMode', 'grid')"
          :class="variantClasses('grid')"
          class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
        >
          <i class="pi pi-th-large text-[10px]"></i>
          <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{{ $t('warehouse.view_grid') }}</span>
        </button>
        <button
          @click="$emit('update:viewMode', 'table')"
          :class="variantClasses('table')"
          class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
        >
          <i class="pi pi-list text-[10px]"></i>
          <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{{ $t('warehouse.view_table') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  count: Number,
  searchQuery: String,
  viewMode: String
})

defineEmits(['update:searchQuery', 'update:viewMode'])

const variantClasses = (mode) => {
  return props.viewMode === mode
    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
}
</script>
