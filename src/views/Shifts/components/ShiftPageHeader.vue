<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <button
        @click="$router.back()"
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm shrink-0"
      >
        <i class="pi pi-arrow-left text-xs text-slate-500"></i>
      </button>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ $t('shifts.report_title') }}</h1>
          <span
            v-if="status"
            class="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-md border shrink-0"
            :class="status === 'closed'
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
              : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'"
          >
            {{ $t(`shifts.status.${status}`) }}
          </span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5 truncate">{{ branchName }} • {{ storeName }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="$emit('download')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-download text-xs text-slate-400"></i>
        <span>{{ $t('common.download') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  status: String,
  branchName: String,
  storeName: String
})
defineEmits(['download'])
</script>
