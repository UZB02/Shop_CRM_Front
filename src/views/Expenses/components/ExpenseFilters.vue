<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <!-- Date Filter -->
      <div class="relative flex-1 min-w-[140px] sm:flex-none sm:w-44">
        <DatePicker
          v-model="filters.date"
          dateFormat="yy-mm-dd"
          :placeholder="$t('common.date')"
          showIcon
          iconDisplay="input"
          class="w-full"
          pt:root:class="!h-9 sm:!h-8 !rounded-xl !border !border-slate-200 dark:!border-slate-700 focus-within:!border-rose-400 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
          pt:input:class="!bg-transparent !border-none !shadow-none !text-xs !font-bold !pl-9 !h-full select-none"
        />
      </div>

      <!-- Category Filter -->
      <div class="relative flex-1 min-w-[160px] sm:flex-none sm:w-56">
        <Select
          v-model="filters.category"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('categories.all')"
          showClear
          class="w-full"
          pt:root:class="!h-9 sm:!h-8 !rounded-xl !border !border-slate-200 dark:!border-slate-700 focus:!border-rose-400 !bg-slate-50/50 dark:!bg-slate-800/40"
          pt:label:class="!text-xs !font-bold !flex !items-center !py-0 !px-3"
        />
      </div>

      <!-- Shift Filter -->
      <div v-if="shifts.length > 0" class="relative flex-1 min-w-[140px] sm:flex-none sm:w-44">
         <Select
          v-model="filters.smena"
          :options="shifts"
          optionLabel="id"
          optionValue="id"
          :placeholder="$t('expenses.smena')"
          showClear
          class="w-full"
          pt:root:class="!h-9 sm:!h-8 !rounded-xl !border !border-slate-200 dark:!border-slate-700 focus:!border-rose-400 !bg-slate-50/50 dark:!bg-slate-800/40"
          pt:label:class="!text-xs !font-bold !flex !items-center !py-0 !px-3"
        >
          <template #option="slotProps">
             <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {{ slotProps.option.id }}</span>
                <span class="text-[8px] font-bold text-slate-500">{{ slotProps.option.opened_at }}</span>
             </div>
          </template>
        </Select>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="hasActiveFilters"
        @click="$emit('clear')"
        class="h-9 sm:h-8 w-9 sm:w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all active:scale-95"
        title="Filtrni tozalash"
      >
        <i class="pi pi-times text-[10px]"></i>
      </button>

      <div class="flex-1"></div>

      <!-- Export Panel Toggle -->
      <button
        @click="showExport = !showExport"
        class="h-9 sm:h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
        :class="showExport ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'"
      >
        <i class="pi pi-sliders-h text-[10px]"></i>
        {{ showExport ? $t('common.close') : $t('reports.title') }}
      </button>
    </div>

    <!-- Export Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showExport" class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1 hidden sm:inline">{{ $t('reports.title') }}:</span>
          <div class="flex items-center gap-2 flex-1 sm:flex-none">
            <DatePicker
              v-model="exportFilters.date_from"
              dateFormat="yy-mm-dd"
              :placeholder="$t('common.date_from')"
              class="flex-1 sm:w-32"
              pt:root:class="!h-8 !rounded-lg !border !border-slate-200 dark:!border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
              pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-bold !h-full"
            />
            <span class="text-slate-300 dark:text-slate-600">—</span>
            <DatePicker
              v-model="exportFilters.date_to"
              dateFormat="yy-mm-dd"
              :placeholder="$t('common.date_to')"
              class="flex-1 sm:w-32"
              pt:root:class="!h-8 !rounded-lg !border !border-slate-200 dark:!border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
              pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-bold !h-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-2 w-full lg:w-auto">
          <button
            @click="$emit('export', 'excel')"
            class="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <i class="pi pi-file-excel text-[10px]"></i>
            Excel
          </button>
          <button
            @click="$emit('export', 'pdf')"
            class="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <i class="pi pi-file-pdf text-[10px]"></i>
            PDF
          </button>
          <button
             v-if="isManager"
             @click="$emit('export-wastage')"
             class="col-span-2 sm:col-span-1 h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <i class="pi pi-file-excel text-[10px]"></i>
            {{ $t('reports.wastage_export') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'

const props = defineProps({
  filters: Object,
  exportFilters: Object,
  categories: Array,
  shifts: Array,
  isManager: Boolean
})

const emit = defineEmits(['clear', 'export', 'export-wastage'])

const showExport = ref(false)

const hasActiveFilters = computed(() => {
  return props.filters.date || props.filters.category || props.filters.smena
})
</script>
