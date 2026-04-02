<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[9px]"></i>
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{{ $t('warehouse.page_title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('warehouse.management_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('warehouse.page_subtitle') }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button 
        @click="$emit('add')"
        class="h-8 px-3 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-plus text-[10px]"></i>
        <span>{{ $t('warehouse.new_warehouse') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['add'])
</script>
