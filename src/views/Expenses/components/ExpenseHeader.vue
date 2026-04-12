<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <div class="flex items-center gap-1.5 mb-1">
        <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[9px]"></i>
          {{ $t('common.back') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300 dark:text-slate-600"></i>
        <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ $t('expenses.title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('expenses.management') }}</h1>
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
      <button
        v-if="isManager"
        @click="$emit('manage-categories')"
        class="flex-1 sm:flex-initial h-9 sm:h-8 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm"
      >
        <i class="pi pi-briefcase text-[10px]"></i>
        {{ $t('expenses.categories') }}
      </button>
      <button
        @click="$emit('add-expense')"
        class="flex-1 sm:flex-initial h-9 sm:h-8 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-lg shadow-rose-500/20 active:scale-95"
      >
        <i class="pi pi-plus text-[10px]"></i>
        {{ $t('expenses.add') }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isManager: Boolean
})
defineEmits(['manage-categories', 'add-expense'])
</script>
