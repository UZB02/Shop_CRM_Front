<template>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
    <!-- 1. Title & Status Section -->
    <div class="flex items-center gap-3 min-w-0 shrink-0">
      <div class="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-inner">
        <i class="pi pi-th-large text-base sm:text-lg"></i>
      </div>
      <div class="min-w-0">
        <h1 class="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight truncate">
          {{ $t('dashboard.center_title') }}
        </h1>
        <div class="flex items-center gap-2 mt-0.5 flex-wrap">
          <div v-if="loading" class="w-2.5 h-2.5 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <template v-else>
            <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 dark:bg-emerald-500/10">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[10px] sm:text-[11px] font-black tracking-wider">{{ $t('dashboard.status_active') }}</span>
            </div>
            <span v-if="periodText" class="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest hidden md:inline border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
              {{ periodText }}
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- 2. Filters & Actions Bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 grow lg:grow-0">
      <!-- Date Range -->
      <div class="relative group flex-1 lg:flex-none">
        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          :placeholder="$t('dashboard.date')"
          showIcon
          iconDisplay="input"
          @update:modelValue="onDateChange"
          class="w-full h-10"
          pt:root:class="!bg-transparent !border-none"
          pt:input:class="!w-full lg:!w-[200px] !h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/40 !bg-white dark:!bg-slate-800/80 focus:!border-emerald-500/50 !text-[12px] !font-black !pl-4 !shadow-sm !!text-slate-700 dark:!text-slate-200"
        />
      </div>

      <!-- Branch Selection -->
      <div class="relative group flex-1 lg:flex-none min-w-0">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none">
          <i class="pi pi-map-marker text-[12px]"></i>
        </div>
        <Select
          v-model="selectedBranch"
          :options="branches"
          optionLabel="name"
          optionValue="branch_id"
          :placeholder="$t('common.branch')"
          showClear
          @change="onFilterChange"
          class="w-full h-10"
          pt:root:class="!h-10 lg:!w-[180px] !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/40 !bg-white dark:!bg-slate-800/80 focus:!border-emerald-500/50 transition-all shadow-sm"
          pt:label:class="!text-[12px] !font-black !flex !items-center !py-0 !pl-9 !pr-4 !!text-slate-700 dark:!text-slate-200 truncate"
        />
      </div>

      <!-- Reset & Refresh (Sticky to the right) -->
      <div class="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
        <button
          v-if="hasFilters"
          @click="$emit('reset')"
          class="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 border border-slate-200/60 dark:border-slate-700/40 bg-white/80 dark:bg-slate-800/80 transition-all active:scale-95 shadow-sm"
          :title="$t('dashboard.charts.total')"
        >
          <i class="pi pi-filter-slash text-[12px]"></i>
        </button>

        <button
          @click="$emit('refresh')"
          :disabled="loading"
          class="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95 group"
        >
          <i :class="['pi pi-sync text-[13px] transition-transform duration-700', loading ? 'animate-spin' : 'group-hover:rotate-180']"></i>
          <span class="text-[12px] font-black tracking-widest">{{ $t('dashboard.refresh') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'

const props = defineProps({
  loading:  Boolean,
  filters:  { type: Object, required: true },
  branches: { type: Array,  default: () => [] },
  period:   { type: Object, default: () => ({}) }
})

const emit = defineEmits(['refresh', 'update:filters', 'reset'])
const { t } = useI18n()

const dates = ref([new Date(props.filters.date_from), new Date(props.filters.date_to)])
const selectedBranch = ref(props.filters.branch)

const hasFilters = computed(() => {
  const f = props.filters
  
  // 1. Check if branch, worker, category or warehouse is selected
  if (f.branch !== null || !!f.category || !!f.worker || !!f.warehouse) return true

  // 2. Check if dates are different from default (First day of month to Today)
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const formatDateStr = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const defaultFrom = formatDateStr(firstDay)
  const defaultTo = formatDateStr(now)

  return f.date_from !== defaultFrom || f.date_to !== defaultTo
})

const periodText = computed(() => {
  if (!props.period?.date_from || !props.period?.date_to) return null
  const months = [
    t('common.months.january'), t('common.months.february'), t('common.months.march'), 
    t('common.months.april'), t('common.months.may'), t('common.months.june'), 
    t('common.months.july'), t('common.months.august'), t('common.months.september'), 
    t('common.months.october'), t('common.months.november'), t('common.months.december')
  ]
  const fmt = (s) => { const d = new Date(s); return `${d.getDate()} ${months[d.getMonth()]}` }
  return `${fmt(props.period.date_from)} — ${fmt(props.period.date_to)} (${props.period.days} ${t('dashboard.period_days', { days: '' }).trim()})`
})

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const onDateChange = (val) => {
  if (val?.[0] && val?.[1]) {
    emit('update:filters', { ...props.filters, date_from: formatDate(val[0]), date_to: formatDate(val[1]) })
  }
}

const onFilterChange = () => {
  emit('update:filters', { ...props.filters, branch: selectedBranch.value })
}

watch(() => props.filters, (v) => {
  dates.value = [new Date(v.date_from), new Date(v.date_to)]
  selectedBranch.value = v.branch
}, { deep: true })
</script>

<style scoped>
:deep(.p-datepicker-input), :deep(.p-select) {
  background-color: transparent !important;
}
</style>


