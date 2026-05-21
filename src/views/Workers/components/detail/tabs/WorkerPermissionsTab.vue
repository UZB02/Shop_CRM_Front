<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
    <!-- Compact Header -->
    <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex flex-col gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <i class="pi pi-shield text-[12px]"></i>
        </div>
        <div>
          <h2 class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight ">{{ $t('workers.permissions') }}</h2>
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.user_permissions') }}</p>
        </div>
      </div>
    </div>

    <!-- Permissions List (Compact) -->
    <div class="p-4">
      <div class="flex flex-wrap gap-2">
        <div v-for="perm in worker?.permissions" :key="perm" 
             class="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-500/5 border border-slate-100 dark:border-slate-700/50 rounded-lg transition-all duration-300 group">
          <div class="w-4 h-4 rounded bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-600">
            <i class="pi pi-check text-[9px]"></i>
          </div>
          <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 capitalize tracking-tight">
            {{ getPermLabel(perm) }}
          </span>
        </div>
        
        <div v-if="!worker?.permissions?.length" class="w-full py-8 text-center opacity-40">
          <i class="pi pi-lock text-2xl text-slate-300 block mb-2"></i>
          <p class="text-[12px] font-black text-slate-400 tracking-widest">{{ $t('workers.no_permissions') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PERMISSIONS_LIST } from '../../../composables/useWorkerForm.js'

defineProps({
  worker: Object
})

// Returns human-readable label for a raw permission code
const PERM_MAP = Object.fromEntries(PERMISSIONS_LIST.map(p => [p.value, p.label]))

function getPermLabel(code) {
  return PERM_MAP[code] || code
}
</script>


