<template>
  <div class="hidden xl:flex flex-col gap-4 sticky top-4 self-start">
    <!-- Profile preview -->
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <span class="w-5 h-5 rounded-md bg-violet-500/10 flex items-center justify-center">
          <i class="pi pi-eye text-violet-500" style="font-size:10px"></i>
        </span>
        <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-widest">{{ $t('workers.form.view').toUpperCase() }}</span>
      </div>
      <div class="p-4">
        <!-- Avatar + name -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-black text-sm text-white shadow-sm"
            :style="avatarStyle">
            <span v-if="worker.first_name || worker.last_name">
              {{ (worker.first_name?.[0]||'').toUpperCase() }}{{ (worker.last_name?.[0]||'').toUpperCase() }}
            </span>
            <i v-else class="pi pi-user text-base"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-black text-slate-800 dark:text-white truncate">
              {{ [worker.first_name, worker.last_name].filter(Boolean).join(' ') || $t('workers.form.avatar_fallback') }}
            </p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[11px] text-slate-400 capitalize">{{ worker.role }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span class="text-[11px] flex items-center gap-1"
                :class="worker.status==='active' ? 'text-emerald-500' : 'text-slate-400'">
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="worker.status==='active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ getStatusLabel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Checklist -->
        <div class="space-y-1.5">
          <div v-for="row in checklist" :key="row.key"
            class="flex items-center gap-2 py-1.5 px-2 rounded-lg"
            :class="row.done ? 'bg-emerald-50 dark:bg-emerald-500/5' : 'bg-slate-50 dark:bg-slate-800/30'">
            <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              :class="row.done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'">
              <i class="pi pi-check text-white" style="font-size:8px"></i>
            </div>
            <span class="text-[11px] flex-1"
              :class="row.done ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'">
              {{ row.label }}
            </span>
            <span v-if="row.done && row.value" class="text-[10px] text-slate-400 truncate max-w-[80px]">{{ row.value }}</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold text-slate-400">{{ $t('workers.form.ready') }}</span>
            <span class="text-[11px] font-black" :class="fillPercent===100 ? 'text-emerald-500' : 'text-blue-400'">{{ fillPercent }}%</span>
          </div>
          <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              :class="fillPercent===100 ? 'bg-emerald-500' : 'bg-blue-400'"
              :style="{ width: fillPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  worker: Object,
  avatarStyle: Object,
  getStatusLabel: String,
  checklist: Array,
  fillPercent: Number
})
</script>
