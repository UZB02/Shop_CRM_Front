<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/workers" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-users text-[9px]"></i>
          {{ $t('workers.title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest truncate">{{ worker?.full_name || '...' }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ worker?.full_name || '...' }}</h1>
      <p class="text-xs text-slate-400 mt-0.5 truncate">{{ worker?.role_display || worker?.role }} • {{ worker?.branch?.name || 'Branch unspecified' }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="$emit('edit')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-pencil text-xs text-emerald-500"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ worker: Object })
defineEmits(['edit'])
</script>
