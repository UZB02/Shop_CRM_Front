<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/warehouse" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-box text-[9px]"></i>
          {{ $t('warehouse.page_title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest truncate">{{ warehouse?.name || '...' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ warehouse?.name || '...' }}</h1>
        <span
          v-if="warehouse"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 border"
          :class="warehouse.status === 'active'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'"
        >
          {{ warehouse.status === 'active' ? 'Faol' : 'Nofaol' }}
        </span>
      </div>
      <p class="text-xs text-slate-400 mt-0.5 truncate">{{ warehouse?.store_name || 'Store unspecified' }} • {{ warehouse?.address || 'Address unspecified' }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="$emit('movement')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-bolt text-xs text-amber-500"></i>
        <span>Ommaviy harakat</span>
      </button>
      <button
        @click="$emit('transfer')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>Yangi o'tkazma</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ warehouse: Object })
defineEmits(['movement', 'transfer'])
</script>
