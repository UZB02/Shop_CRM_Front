<template>
  <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Phone -->
      <a :href="'tel:' + worker?.phone1" class="flex items-center gap-4 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer group">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform">
          <i class="pi pi-phone text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('workers.phone') }}</p>
          <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.phone1 || '—' }}</p>
        </div>
      </a>

      <!-- Email -->
      <div class="flex items-center gap-4 px-2">
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0">
          <i class="pi pi-envelope text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('workers.email') }}</p>
          <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.email || '—' }}</p>
        </div>
      </div>

      <!-- Role -->
      <div class="flex items-center gap-4 px-2">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
          <i class="pi pi-briefcase text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('workers.role') }}</p>
          <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ worker?.role_display || '—' }}</p>
        </div>
      </div>

      <!-- Created At -->
      <div class="flex items-center gap-4 px-2">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <i class="pi pi-calendar text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('workers.created_at') }}</p>
          <p class="text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ formatDate(worker?.created_on) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWorkerDetail } from '../../composables/useWorkerDetail'

const props = defineProps({
  worker: Object
})

const { formatDate } = useWorkerDetail()
</script>
