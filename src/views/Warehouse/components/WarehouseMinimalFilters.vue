<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Search -->
    <div class="relative group/search w-full sm:max-w-xs">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] transition-colors group-focus-within/search:text-emerald-500"></i>
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        :placeholder="$t('warehouse.search_placeholder')" 
        class="w-full h-8 pl-8 pr-4 text-xs rounded-lg border-none bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-0 outline-none"
      />
    </div>

    <div class="flex items-center gap-2 px-1">
      <!-- Info -->
      <div v-if="count > 0" class="hidden sm:block text-[12px] font-bold text-slate-400 tracking-widest px-2">
        {{ count }} {{ $t('warehouse.count_suffix') }}
      </div>
      
      <!-- View Toggle -->
      <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-100 dark:border-slate-700">
        <button 
          @click="$emit('update:viewMode', 'grid')"
          class="w-7 h-7 flex items-center justify-center rounded-md transition-all"
          :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          <i class="pi pi-th-large text-[12px]"></i>
        </button>
        <button 
          @click="$emit('update:viewMode', 'table')"
          class="w-7 h-7 flex items-center justify-center rounded-md transition-all"
          :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          <i class="pi pi-list text-[12px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  viewMode: String,
  count: Number
})
defineEmits(['update:searchQuery', 'update:viewMode'])
</script>


