<template>
  <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <i class="pi pi-shield text-2xl"></i>
      </div>
      <div>
        <h2 class="text-base font-black text-slate-900 dark:text-white tracking-tight">{{ $t('workers.permissions') }}</h2>
        <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ $t('workers.user_permissions') }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <div v-for="perm in worker?.permissions" :key="perm" 
           class="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-500/5 border border-slate-100 dark:border-slate-700/50 rounded-2xl transition-all duration-300 group">
        <div class="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-emerald-500">
          <i class="pi pi-check text-[10px]"></i>
        </div>
        <span class="text-[11px] font-black text-slate-700 dark:text-slate-300 capitalize tracking-wide">{{ perm }}</span>
      </div>
      
      <div v-if="!worker?.permissions?.length" class="w-full py-12 text-center opacity-40">
        <i class="pi pi-lock text-3xl text-slate-300 block mb-3"></i>
        <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ $t('workers.no_permissions') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  worker: Object
})
</script>
