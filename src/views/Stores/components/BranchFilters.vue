<template>
  <div class="flex flex-row items-stretch gap-2 mb-2 sm:mb-4">
    <div class="flex-1 relative">
      <i class="pi pi-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] sm:text-sm pointer-events-none"></i>
      <input
        v-model="search"
        type="text"
        :placeholder="$t('stores.search_placeholder')"
        class="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all shadow-sm"
      />
      <button
        v-if="search"
        @click="search = ''"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <i class="pi pi-times text-[8px]"></i>
      </button>
    </div>
    
    <div class="w-28 sm:w-48 shrink-0">
      <Dropdown
        v-model="status"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        class="!w-full !rounded-xl sm:!rounded-2xl !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-sm custom-filter-dropdown"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from 'primevue/dropdown'

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
