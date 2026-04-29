<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/customers" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-chevron-left text-[9px]"></i>
          {{ $t('customers.title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('customers.groups.manage_title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('customers.groups.manage_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ count }} {{ $t('customers.groups.count_unit') }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button 
        @click="$emit('add')"
        class="h-8 px-3 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-emerald-500/20"
      >
        <i class="pi pi-plus text-[10px]"></i>
        <span>{{ $t('customers.groups.add_new') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: Number
})
defineEmits(['add'])
</script>
