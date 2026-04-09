<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        <router-link to="/dashboard/customers" class="text-[9px] font-black text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-users text-[8px]"></i>
          {{ $t('customers.title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{{ $t('customers.details.title') }}</span>
      </div>
      <h1 class="text-lg sm:text-xl font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{{ customerName || '...' }}</h1>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button 
        @click="$emit('edit')"
        class="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <i class="pi pi-pencil text-[10px]"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customerName: String
})
defineEmits(['edit'])
</script>
