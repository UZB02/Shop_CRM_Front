<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <!-- Breadcrumb + Title -->
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link
          to="/dashboard"
          class="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1"
        >
          <i class="pi pi-home text-[11px]" />
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[10px] text-slate-300" />
        <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">
          {{ $t('suppliers.title') }}
        </span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">
        {{ $t('suppliers.management_title') }}
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        {{ totalRecords }} {{ $t('suppliers.count_suffix') }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
      <!-- Search -->
      <div class="relative group/search w-full md:w-[240px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] transition-colors group-focus-within/search:text-emerald-500" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          :placeholder="$t('suppliers.search_placeholder')"
          class="w-full h-9 pl-9 pr-4 text-[13px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          @click="$emit('update:statusFilter', opt.value)"
          class="px-3 h-7 rounded-lg text-[11px] font-bold transition-all"
          :class="statusFilter === opt.value
            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'"
        >
          {{ opt.label }}
        </button>
      </div>
      
      <!-- Has Debt Filter -->
      <button
        @click="$emit('update:hasDebtFilter', !hasDebtFilter)"
        class="h-9 px-3 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border"
        :class="hasDebtFilter
          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 shadow-sm'
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800'"
      >
        <i class="pi" :class="hasDebtFilter ? 'pi-filter-slash text-[11px]' : 'pi-filter text-[11px]'" />
        <span class="hidden sm:inline">{{ $t('suppliers.filters.has_debt') }}</span>
      </button>

      <!-- Export -->
      <div class="relative" ref="exportMenuRef">
        <button
          @click="showExport = !showExport"
          class="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-download text-[12px]" />
          <span class="hidden sm:inline">{{ $t('common.export') }}</span>
        </button>
        <Transition name="dropdown">
          <div
            v-if="showExport"
            class="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <button @click="$emit('export', 'xlsx'); showExport = false"
              class="w-full px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 transition-colors">
              <i class="pi pi-file-excel text-emerald-500 text-[12px]" /> Excel (.xlsx)
            </button>
            <button @click="$emit('export', 'pdf'); showExport = false"
              class="w-full px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 transition-colors">
              <i class="pi pi-file-pdf text-red-500 text-[12px]" /> PDF
            </button>
          </div>
        </Transition>
      </div>

      <!-- Add Button -->
      <button
        @click="$emit('add')"
        class="h-9 px-4 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-emerald-500/20"
      >
        <i class="pi pi-plus text-[12px]" />
        {{ $t('suppliers.new_supplier') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  totalRecords: { type: Number, default: 0 },
  searchQuery: { type: String, default: '' },
  statusFilter: { type: String, default: 'active' },
  hasDebtFilter: { type: Boolean, default: false }
})
defineEmits(['update:searchQuery', 'update:statusFilter', 'update:hasDebtFilter', 'add', 'export'])

const showExport = ref(false)
const exportMenuRef = ref(null)

const statusOptions = [
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' },
  { label: t('common.all'), value: '' }
]

const handleOutside = (e) => {
  if (exportMenuRef.value && !exportMenuRef.value.contains(e.target)) {
    showExport.value = false
  }
}
onMounted(() => document.addEventListener('click', handleOutside))
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.18s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
