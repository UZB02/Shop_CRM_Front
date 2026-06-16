<template>
  <div class="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">

    <!-- ── Sana filtri ─────────────────────────────────────────── -->
    <template v-if="hasDateFilter">
      <div class="grid grid-cols-[1fr_auto_1fr] md:flex items-center gap-2">
        <DatePicker
          v-model="localDateFrom"
          dateFormat="yy-mm-dd"
          :placeholder="$t('reports.filters.date_from')"
          showIcon
          iconDisplay="input"
          @date-select="emit('apply')"
          @clear-click="emit('apply')"
          pt:root:class="!h-10 md:!h-8 !w-full !rounded-xl md:!rounded-lg !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 hover:!border-emerald-400 dark:hover:!border-emerald-500 !transition-all !shadow-none"
          pt:input:class="!text-xs !font-semibold !text-slate-700 dark:!text-slate-200 !h-full !bg-transparent !border-none !shadow-none !py-0 !px-3"
          pt:inputicon:class="!text-slate-400 !text-[11px]"
          class="md:!min-w-[130px] md:!max-w-[155px]"
        />

        <span class="text-slate-400 text-xs font-bold select-none shrink-0">—</span>

        <DatePicker
          v-model="localDateTo"
          dateFormat="yy-mm-dd"
          :placeholder="$t('reports.filters.date_to')"
          showIcon
          iconDisplay="input"
          @date-select="emit('apply')"
          @clear-click="emit('apply')"
          pt:root:class="!h-10 md:!h-8 !w-full !rounded-xl md:!rounded-lg !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 hover:!border-emerald-400 dark:hover:!border-emerald-500 !transition-all !shadow-none"
          pt:input:class="!text-xs !font-semibold !text-slate-700 dark:!text-slate-200 !h-full !bg-transparent !border-none !shadow-none !py-0 !px-3"
          pt:inputicon:class="!text-slate-400 !text-[11px]"
          class="md:!min-w-[130px] md:!max-w-[155px]"
        />
      </div>

      <div class="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0"></div>
    </template>

    <!-- ── Sana yo'q badge ────────────────────────────────────── -->
    <div
      v-else
      class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 text-[10px] font-bold shrink-0"
    >
      <i class="pi pi-clock text-[10px]"></i>
      <span>Davr: tizimdan</span>
    </div>

    <!-- ── Filial ──────────────────────────────────────────────── -->
    <Select
      :model-value="modelFilters.branch || null"
      @update:model-value="onBranchChange"
      :options="branches"
      optionLabel="name"
      optionValue="id"
      :placeholder="$t('reports.filters.all_branches')"
      showClear
      class="w-full md:!w-auto md:!min-w-[130px] md:!max-w-[165px]"
      pt:root:class="!h-10 md:!h-8 !rounded-xl md:!rounded-lg !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 hover:!border-emerald-400 dark:hover:!border-emerald-500 !transition-all !shadow-none"
      pt:label:class="!text-xs !font-semibold !text-slate-700 dark:!text-slate-200 !flex !items-center !py-0 !px-3"
      pt:dropdown:class="!w-7 !text-slate-400"
      pt:clearicon:class="!text-slate-400 !text-[10px]"
      pt:overlay:class="!rounded-xl !border-slate-200 dark:!border-slate-700 !shadow-xl dark:!bg-slate-800"
      pt:list:class="!py-1"
      pt:option:class="!text-xs !font-semibold !px-3 !py-2 !text-slate-700 dark:!text-slate-200 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20"
    />

    <!-- ── Kategoriya ─────────────────────────────────────────── -->
    <Select
      :model-value="modelFilters.category || null"
      @update:model-value="onCategoryChange"
      :options="categories"
      optionLabel="name"
      optionValue="id"
      :placeholder="$t('reports.filters.all_categories')"
      showClear
      class="w-full md:!w-auto md:!min-w-[130px] md:!max-w-[175px]"
      pt:root:class="!h-10 md:!h-8 !rounded-xl md:!rounded-lg !border-slate-200 dark:!border-slate-700 !bg-slate-50 dark:!bg-slate-800 hover:!border-emerald-400 dark:hover:!border-emerald-500 !transition-all !shadow-none"
      pt:label:class="!text-xs !font-semibold !text-slate-700 dark:!text-slate-200 !flex !items-center !py-0 !px-3"
      pt:dropdown:class="!w-7 !text-slate-400"
      pt:clearicon:class="!text-slate-400 !text-[10px]"
      pt:overlay:class="!rounded-xl !border-slate-200 dark:!border-slate-700 !shadow-xl dark:!bg-slate-800"
      pt:list:class="!py-1"
      pt:option:class="!text-xs !font-semibold !px-3 !py-2 !text-slate-700 dark:!text-slate-200 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20"
    />

    <!-- ── O'ng: Tozalash + Excel ─────────────────────────────── -->
    <div class="flex items-center gap-2 md:gap-1.5 md:ml-auto w-full md:w-auto mt-2 md:mt-0">
      <button
        @click="emit('reset')"
        class="flex-1 md:flex-none justify-center h-10 md:h-8 px-3 rounded-xl md:rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all flex items-center gap-1 shrink-0"
      >
        <i class="pi pi-times text-[10px]"></i>
        {{ $t('reports.filters.reset') }}
      </button>

      <button
        @click="emit('excel')"
        :disabled="excelLoading"
        class="flex-1 md:flex-none justify-center h-10 md:h-8 px-4 rounded-xl md:rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-black active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-violet-500/30 shrink-0"
      >
        <i v-if="excelLoading" class="pi pi-spin pi-spinner text-[10px]"></i>
        <i v-else class="pi pi-file-excel text-[10px]"></i>
        Excel
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'
import Select     from 'primevue/select'

const props = defineProps({
  modelFilters:  { type: Object,  required: true },
  hasDateFilter: { type: Boolean, default: false },
  branches:      { type: Array,   default: () => [] },
  categories:    { type: Array,   default: () => [] },
  loading:       { type: Boolean, default: false },
  excelLoading:  { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:date_from',
  'update:date_to',
  'update:branch',
  'update:category',
  'apply',
  'reset',
  'excel',
])

// Date ↔ YYYY-MM-DD string, auto-apply on change
const localDateFrom = computed({
  get: () => props.modelFilters.date_from ? new Date(props.modelFilters.date_from) : null,
  set: (val) => {
    emit('update:date_from', val instanceof Date ? val.toISOString().slice(0, 10) : '')
  },
})

const localDateTo = computed({
  get: () => props.modelFilters.date_to ? new Date(props.modelFilters.date_to) : null,
  set: (val) => {
    emit('update:date_to', val instanceof Date ? val.toISOString().slice(0, 10) : '')
  },
})

// Select — emit + apply
function onBranchChange(val) {
  emit('update:branch', val ?? '')
  emit('apply')
}

function onCategoryChange(val) {
  emit('update:category', val ?? '')
  emit('apply')
}
</script>
