<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Search -->
    <div class="relative flex-1 min-w-[220px]">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
      <input
        v-model="search"
        type="text"
        :placeholder="$t('stores.search_placeholder')"
        class="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
      />
      <button
        v-if="search"
        @click="search = ''"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
      >
        <i class="pi pi-times text-[9px]"></i>
      </button>
    </div>
    
    <!-- Status Filter -->
    <select
      v-model="status"
      class="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none pr-8 min-w-[120px]"
    >
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
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
