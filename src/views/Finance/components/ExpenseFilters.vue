<template>
  <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col gap-3 sm:gap-4">
    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
      <!-- Search Filter -->
      <div v-if="activeTab !== 'payments'" class="relative flex-1 min-w-[200px] sm:w-64 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-search text-[10px]"></i>
        </div>
        <input
          v-model="filters.search"
          type="text"
          :placeholder="activeTab === 'revenue' && filters.category ? 'Mahsulot nomi...' : $t('common.search')"
          class="w-full h-10 pl-9 pr-4 text-xs font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all uppercase tracking-wider placeholder:text-slate-400"
        />
      </div>

      <!-- Date Range Filter -->
      <div class="relative flex-1 min-w-[200px] sm:flex-none sm:w-64 group">
        <DatePicker
          v-model="filters.date"
          selectionMode="range"
          :manualInput="false"
          dateFormat="yy-mm-dd"
          :placeholder="$t('common.date')"
          showIcon
          iconDisplay="input"
          class="w-full"
          pt:root:class="!h-10 !rounded-xl !bg-transparent !border-none transition-all"
          pt:input:class="!w-full !h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 !bg-slate-50/50 dark:!bg-slate-800/40 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !text-xs !font-black !pl-4 !shadow-none select-none !uppercase !tracking-wider !text-slate-700 dark:!text-slate-200 placeholder:!text-slate-400"
        />
      </div>

      <!-- Category Filter -->
      <div v-if="!['profit-loss', 'debtors'].includes(activeTab)" class="relative flex-1 min-w-[180px] sm:flex-none sm:w-60 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-tag text-[10px]"></i>
        </div>
        <Select
          v-model="filters.category"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('categories.all')"
          showClear
          filter
          :filterPlaceholder="$t('common.search')"
          fluid
          class="w-full"
          pt:root:class="!h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all"
          pt:label:class="!text-xs !font-black !flex !items-center !py-0 !pl-9 !pr-3 !uppercase !tracking-wider"
        />
      </div>

      <!-- Group By Filter (Only for Reports) -->
      <div v-if="activeTab && ['revenue', 'payments', 'expenses'].includes(activeTab)" class="relative flex-1 min-w-[140px] sm:flex-none sm:w-40 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-th-large text-[10px]"></i>
        </div>
        <Select
          v-model="filters.group_by"
          :options="[
            { label: $t('finance.day'), value: 'day' },
            { label: $t('finance.month'), value: 'month' }
          ]"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('finance.group_by')"
          class="w-full"
          pt:root:class="!h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all"
          pt:label:class="!text-xs !font-black !flex !items-center !py-0 !pl-9 !pr-3 !uppercase !tracking-wider"
        />
      </div>

      <!-- Year Filter (P&L only) -->
      <div v-if="activeTab === 'profit-loss'" class="relative flex-1 min-w-[100px] sm:flex-none sm:w-32 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-calendar-plus text-[10px]"></i>
        </div>
        <input
          v-model.number="filters.year"
          type="number"
          :placeholder="$t('finance.year')"
          class="w-full h-10 pl-9 pr-4 text-xs font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all uppercase tracking-wider placeholder:text-slate-400"
        />
      </div>

      <!-- Months Filter (P&L only) - Simple Comma Separated for now -->
      <div v-if="activeTab === 'profit-loss'" class="relative flex-1 min-w-[150px] sm:w-48 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-list text-[10px]"></i>
        </div>
        <input
          v-model="filters.months"
          type="text"
          :placeholder="$t('finance.months')"
          class="w-full h-10 pl-9 pr-4 text-xs font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all uppercase tracking-wider placeholder:text-slate-400"
          title="1,2,3... shaklida kiriting"
        />
      </div>

      <!-- Min Debt Filter (Debtors only) -->
      <div v-if="activeTab === 'debtors'" class="relative flex-1 min-w-[150px] sm:w-48 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-money-bill text-[10px]"></i>
        </div>
        <input
          v-model.number="filters.min_debt"
          type="number"
          :placeholder="$t('finance.min_debt')"
          class="w-full h-10 pl-9 pr-4 text-xs font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all uppercase tracking-wider placeholder:text-slate-400"
        />
      </div>


      <!-- Payment Method Filter (Payments tab only) -->
      <div v-if="activeTab === 'payments'" class="relative flex-1 min-w-[150px] sm:flex-none sm:w-48 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <i class="pi pi-credit-card text-[10px]"></i>
        </div>
        <Select
          v-model="filters.payment_method"
          :options="allowedPaymentMethods"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('finance.payment_method')"
          showClear
          class="w-full"
          pt:root:class="!h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all"
          pt:label:class="!text-xs !font-black !flex !items-center !py-0 !pl-9 !pr-3 !uppercase !tracking-wider"
        />
      </div>

      <!-- Clear Filters -->
      <button
        v-if="hasActiveFilters"
        @click="$emit('clear')"
        class="h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all active:scale-95 hover:shadow-lg hover:shadow-rose-500/10"
        title="Filtrni tozalash"
      >
        <i class="pi pi-refresh text-[11px]"></i>
      </button>

      <div class="flex-1"></div>

      <!-- Export Panel Toggle -->
      <button
        @click="showExport = !showExport"
        class="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 border"
        :class="showExport 
          ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'"
      >
        <i class="pi pi-sliders-h text-[11px]"></i>
        {{ showExport ? $t('common.close') : $t('reports.title') }}
      </button>
    </div>

    <!-- Export Panel -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showExport" class="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <i class="pi pi-filter text-[9px] text-slate-400"></i>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-500">{{ $t('reports.title') }}</span>
          </div>
          <div class="flex items-center gap-2 flex-1 sm:flex-none">
            <DatePicker
              v-model="exportFilters.date_from"
              dateFormat="yy-mm-dd"
              :placeholder="$t('common.date_from')"
              class="flex-1 sm:w-36"
              pt:root:class="!h-9 !rounded-xl !border !border-slate-200 dark:!border-slate-700 bg-white dark:bg-slate-900"
              pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-black !h-full !uppercase !tracking-wider"
            />
            <span class="text-slate-300 dark:text-slate-700">to</span>
            <DatePicker
              v-model="exportFilters.date_to"
              dateFormat="yy-mm-dd"
              :placeholder="$t('common.date_to')"
              class="flex-1 sm:w-36"
              pt:root:class="!h-9 !rounded-xl !border !border-slate-200 dark:!border-slate-700 bg-white dark:bg-slate-900"
              pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-black !h-full !uppercase !tracking-wider"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-2.5 w-full lg:w-auto">
          <button
            @click="$emit('export', 'excel')"
            class="h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-sm"
          >
            <i class="pi pi-file-excel text-[11px]"></i>
            Excel
          </button>
          <button
            @click="$emit('export', 'pdf')"
            class="h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2.5 active:scale-95 shadow-sm"
          >
            <i class="pi pi-file-pdf text-[11px]"></i>
            PDF
          </button>
          <button
             v-if="isManager"
             @click="$emit('export-wastage')"
             class="col-span-2 sm:col-span-1 h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap shadow-sm"
          >
            <i class="pi pi-trash text-[11px]"></i>
            {{ $t('reports.wastage_export') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  filters: Object,
  exportFilters: Object,
  categories: Array,
  shifts: Array,
  isManager: Boolean,
  activeTab: String
})

const emit = defineEmits(['clear', 'export', 'export-wastage'])

const showExport = ref(false)

const hasActiveFilters = computed(() => {
  return props.filters.date || props.filters.category || props.filters.search ||
    props.filters.group_by !== 'day' || props.filters.payment_method
})

const allowedPaymentMethods = computed(() => [
  ...(settingsStore.allowCash ? [{ label: t('common.cash'), value: 'cash' }] : []),
  ...(settingsStore.allowCard ? [{ label: t('common.card'), value: 'card' }] : []),
  ...(settingsStore.allowDebt ? [{ label: t('common.debt'), value: 'debt' }] : []),
])
</script>

<style scoped>
:deep(.p-datepicker-input) {
  background-color: rgb(30 41 59 / 0.4) !important; /* dark:bg-slate-800/40 */
  border-color: rgb(51 65 85 / 0.5) !important; /* dark:border-slate-700/50 */
  color: #e2e8f0 !important; /* text-slate-200 */
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-size: 0.75rem !important;
  box-shadow: none !important;
}

:deep(.p-datepicker:not(.p-datepicker-inline) .p-datepicker-input) {
   background-color: rgb(30 41 59 / 0.4) !important;
}

html:not(.dark) :deep(.p-datepicker-input) {
  background-color: rgb(248 250 252 / 0.5) !important; /* bg-slate-50/50 */
  border-color: rgb(226 232 240 / 0.6) !important; /* border-slate-200/60 */
  color: #334155 !important; /* text-slate-700 */
}
</style>
