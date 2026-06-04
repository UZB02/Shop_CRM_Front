<template>
  <div>
    <!-- Top Bar -->
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all relative z-10 bg-slate-50/30 dark:bg-slate-900/30">
      <div class="relative flex-1 group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
          <i class="pi pi-search text-[12px]"></i>
        </div>
        <input 
          v-model="filters.search" 
          type="text"
          :placeholder="$t('common.search')" 
          class="w-full h-11 pl-9 pr-4 text-[13px] font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm"
          @keyup.enter="onSearchEnter" 
        />
      </div>

      <button 
        v-if="hasActiveFilters"
        @click="onReset"
        class="h-11 px-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all shrink-0 shadow-sm group"
        title="Filtrlarni tozalash"
      >
        <i class="pi pi-refresh text-[14px] group-hover:rotate-180 transition-transform duration-500"></i>
      </button>

      <button 
        @click="showFilters = true"
        :class="[
          'h-11 px-5 rounded-xl border flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm font-bold text-[14px]',
          hasActiveFilters
            ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-white' 
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
        ]"
      >
        <i class="pi pi-filter text-[14px]"></i>
        <span>Filtr</span>
        <span v-if="hasActiveFilters" class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>
    </div>

    <!-- Sliding Sidebar Drawer (Teleported to Body for perfect layout) -->
    <Teleport to="body">
      <!-- Backdrop -->
      <div 
        v-if="showFilters" 
        @click="showFilters = false"
        class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
      ></div>

      <!-- Drawer Panel -->
      <div 
        :class="[
          'fixed right-0 top-0 bottom-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_60px_rgba(0,0,0,0.7)] z-[10000] flex flex-col transition-all duration-300 ease-out transform',
          showFilters ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20 backdrop-blur">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <i class="pi pi-sliders-h text-[16px]"></i>
            </div>
            <div>
              <h4 class="text-[15px] font-black text-slate-800 dark:text-slate-100">Batafsil saralash</h4>
              <p class="text-[11px] text-slate-400 font-bold">Kirimlar uchun saralash paneli</p>
            </div>
          </div>
          <button 
            @click="showFilters = false" 
            class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <i class="pi pi-times text-[12px] font-bold"></i>
          </button>
        </div>

        <!-- Scrollable Form Container -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
          
          <!-- ID & Filial -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-hashtag text-[11px] text-emerald-500/80"></i>
                ID
              </label>
              <input 
                v-model.number="filters.id" 
                type="number"
                placeholder="ID" 
                class="w-full h-11 px-4 text-[13px] font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm"
                @keyup.enter="onApply"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-building text-[11px] text-emerald-500/80"></i>
                Filial
              </label>
              <Select 
                v-model="filters.branch" 
                :options="branches" 
                optionLabel="name" 
                optionValue="id" 
                placeholder="Filial" 
                showClear
                filter
                :disabled="!!filters.warehouse"
                class="sr-select !h-11 flex items-center w-full"
                pt:root:class="!h-11 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-950/40 transition-all shadow-sm" 
                pt:label:class="!text-[13px] !font-bold !flex !items-center !py-0 !px-4 !tracking-wider text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          <!-- Xodim & Ombor -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-user text-[11px] text-emerald-500/80"></i>
                Xodim
              </label>
              <Select 
                v-model="filters.worker" 
                :options="workers" 
                optionLabel="full_name" 
                optionValue="id" 
                placeholder="Hodim" 
                showClear
                filter
                class="sr-select !h-11 flex items-center w-full"
                pt:root:class="!h-11 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-950/40 transition-all shadow-sm" 
                pt:label:class="!text-[13px] !font-bold !flex !items-center !py-0 !px-4 !tracking-wider text-slate-700 dark:text-slate-200"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-box text-[11px] text-emerald-500/80"></i>
                Ombor
              </label>
              <Select 
                v-model="filters.warehouse" 
                :options="warehouses" 
                optionLabel="name" 
                optionValue="id" 
                placeholder="Ombor" 
                showClear
                filter
                :disabled="!!filters.branch"
                class="sr-select !h-11 flex items-center w-full"
                pt:root:class="!h-11 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-950/40 transition-all shadow-sm" 
                pt:label:class="!text-[13px] !font-bold !flex !items-center !py-0 !px-4 !tracking-wider text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          <!-- Sanalar -->
          <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-calendar text-[10px] text-emerald-500/80"></i>
                Sana oralig'i
              </label>
              <DatePicker 
                v-model="filters.dates" 
                selectionMode="range" 
                :manualInput="false" 
                dateFormat="yy-mm-dd"
                showIcon
                iconDisplay="input"
                class="sr-datepicker-custom !w-full"
                inputClass="!w-full !h-11 px-4 !bg-slate-50/50 dark:!bg-slate-950/40 !border !border-slate-200/80 dark:!border-slate-800/80 !rounded-xl text-[13px] !font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                placeholder="Sana oralig'i"
              />
          </div>

          <!-- Summalar Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-wallet text-[10px] text-emerald-500/80"></i>
                Min. summa
              </label>
              <input 
                v-model.number="filters.min_total" 
                type="number"
                placeholder="0" 
                class="w-full h-11 px-4 text-[13px] font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm"
                @keyup.enter="onApply"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-wallet text-[10px] text-emerald-500/80"></i>
                Max. summa
              </label>
              <input 
                v-model.number="filters.max_total" 
                type="number"
                placeholder="0" 
                class="w-full h-11 px-4 text-[13px] font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-950/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm"
                @keyup.enter="onApply"
              />
            </div>
          </div>
        </div>

        <!-- Sticky Footer inside Drawer -->
        <div class="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/60 p-5 flex items-center justify-between gap-3 bg-slate-50/20">
          <button 
            @click="onReset" 
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold text-[13px]"
          >
            <i class="pi pi-times text-[11px]"></i>
            <span>Tozalash</span>
          </button>
          <button 
            @click="onApply" 
            class="h-11 flex-1 px-6 rounded-xl bg-emerald-500 text-white flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors font-bold text-[13px] shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <i class="pi pi-filter text-[11px]"></i>
            <span>Filtrni qo'llash</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import { useSupplierPurchasesFilter } from '../composables/useSupplierPurchasesFilter'

const emit = defineEmits(['apply'])

const {
  filters,
  showFilters,
  workers,
  branches,
  warehouses,
  hasActiveFilters,
  onApply,
  onReset,
  onSearchEnter
} = useSupplierPurchasesFilter(emit)
</script>

<style scoped>
:deep(.sr-datepicker-custom) {
  width: 100% !important;
}
:deep(.sr-datepicker-custom .p-datepicker-input) {
  width: 100% !important;
}
</style>

<style>
/* Global override to ensure PrimeVue v4 teleported panels are always on top of the fixed sidebar drawer */
.p-select-overlay,
.p-select-panel,
.p-datepicker-panel,
.p-datepicker,
.p-autocomplete-panel {
  z-index: 100010 !important;
}
</style>
