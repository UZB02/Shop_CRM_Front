<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
    <div>
      <div class="flex items-center gap-2 mb-1.5">
        <router-link to="/dashboard" class="group flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-emerald-500 transition-all uppercase tracking-[0.2em]">
          <div class="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
            <i class="pi pi-chevron-left text-[8px] group-hover:-translate-x-0.5 transition-transform"></i>
          </div>
          {{ $t('common.back') }}
        </router-link>
        <span class="text-slate-300 dark:text-slate-700">/</span>
        <span class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{{ $t('finance.title') }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
          <i class="pi pi-wallet text-lg"></i>
        </div>
        <h1 class="text-xl font-black text-slate-800 dark:text-slate-50 tracking-tight">{{ $t('finance.management') }}</h1>
      </div>
    </div>

    <div class="flex items-center gap-2.5 w-full sm:w-auto">
      <button
        v-if="isManager"
        @click="$emit('manage-categories')"
        class="flex-1 sm:flex-initial h-10 px-4 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/50 dark:shadow-none active:scale-95"
      >
        <i class="pi pi-tags text-[11px] text-slate-400"></i>
        <span class="uppercase tracking-widest text-[10px]">{{ $t('finance.categories') }}</span>
      </button>
      <button
        @click="$emit('add-expense')"
        class="flex-1 sm:flex-initial h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 border-b-2 border-emerald-700/50"
      >
        <i class="pi pi-plus text-[10px]"></i>
        {{ $t('finance.add') }}
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
