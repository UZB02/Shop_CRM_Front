<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[9px]"></i>
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('finance.title') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('finance.management') }}</h1>
        <div v-if="loading" class="w-3 h-3 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="isManager"
        @click="$emit('manage-categories')"
        class="flex-1 sm:flex-initial h-9 sm:h-8 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/50 dark:shadow-none"
      >
        <i class="pi pi-tags text-[10px]"></i>
        <span>{{ $t('finance.categories') }}</span>
      </button>
      <button
        @click="$emit('add-expense')"
        class="flex-1 sm:flex-initial h-9 sm:h-8 px-3 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
      >
        <i class="pi pi-plus text-[10px]"></i>
        <span>{{ $t('finance.add') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isManager: Boolean,
  loading: Boolean
})
defineEmits(['manage-categories', 'add-expense'])
</script>
