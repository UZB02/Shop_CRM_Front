<template>
  <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white dark:bg-[#0f172a] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <!-- Search -->
    <div class="relative flex-1">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
      <input
        v-model="search"
        type="text"
        :placeholder="$t('stores.search_placeholder')"
        class="w-full h-10 pl-9 pr-8 text-[13px] font-bold rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
      />
      <button
        v-if="search"
        @click="search = ''"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-slate-200/50 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
      >
        <i class="pi pi-times text-[10px]"></i>
      </button>
    </div>
    
    <!-- Status Filter -->
    <div class="relative w-full sm:w-48 shrink-0">
      <select
        v-model="status"
        class="w-full h-10 px-3 pr-8 text-[13px] font-bold rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none shadow-inner"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <i class="pi pi-angle-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  search: String,
  status: String
})

const emit = defineEmits(['update:search', 'update:status'])

const search = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
})

const status = computed({
  get: () => props.status,
  set: (val) => emit('update:status', val)
})

const statusOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('stores.status_active'), value: 'active' },
  { label: t('stores.status_inactive'), value: 'inactive' }
])
</script>


