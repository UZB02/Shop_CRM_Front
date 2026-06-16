<template>
  <div class="reports-page space-y-4">

    <!-- ── Header + Excel tugmasi ──────────────────────────────── -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          {{ $t('reports.title') }}
        </h1>
        <p class="text-xs font-medium text-slate-400 mt-0.5">
          {{ $t('reports.subtitle') }}
        </p>
      </div>

      <!-- Jami badge -->
      <div
        v-if="!currentState.loading && currentState.count > 0"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
      >
        <i class="pi pi-list text-[11px] text-slate-400"></i>
        <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Jami: <span class="text-slate-800 dark:text-white font-black">{{ currentState.count }}</span> ta
        </span>
      </div>
    </div>

    <!-- ── Birlashtirilgan panel: Tab + Filtr ────────────────────── -->
    <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">

      <!-- Tab bar qatori -->
      <div class="flex items-center gap-0 border-b border-slate-100 dark:border-slate-800 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          v-for="tab in REPORT_TABS"
          :key="tab.id"
          @click="handleTabSwitch(tab.id)"
          :class="[
            'flex items-center gap-2 px-5 py-3.5 text-[12px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 relative border-b-2',
            activeTab === tab.id
              ? tabActiveClass(tab.id)
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
          ]"
        >
          <i :class="tab.icon" class="text-[12px]"></i>
          {{ tabLabel(tab.id) }}

          <!-- Aktiv tab loading dot -->
          <span
            v-if="activeTab === tab.id && currentState.loading"
            class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"
          ></span>
        </button>
      </div>

      <!-- Filtr qatori -->
      <div class="px-4 py-2.5 bg-slate-50/60 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
        <ReportsFilterBar
          :model-filters="currentFilters"
          :has-date-filter="tabHasDateFilter(activeTab)"
          :branches="branches"
          :categories="categories"
          :loading="currentState.loading"
          :excel-loading="excelLoading"
          @update:date_from="val => { currentFilters.date_from = val }"
          @update:date_to="val => { currentFilters.date_to = val }"
          @update:branch="val => { currentFilters.branch = val }"
          @update:category="val => { currentFilters.category = val }"
          @apply="applyFilters"
          @reset="clearFilters"
          @excel="downloadExcel"
        />
      </div>

      <!-- ── Jadval kontent ─────────────────────────────────────── -->
      <div class="tab-content">
        <TopSellingTable
          v-if="activeTab === 'top-selling'"
          :items="state['top-selling'].data"
          :loading="state['top-selling'].loading"
          :total="state['top-selling'].count"
          :page="state['top-selling'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <TopProfitableTable
          v-else-if="activeTab === 'top-profitable'"
          :items="state['top-profitable'].data"
          :loading="state['top-profitable'].loading"
          :total="state['top-profitable'].count"
          :page="state['top-profitable'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <SlowMovingTable
          v-else-if="activeTab === 'slow-moving'"
          :items="state['slow-moving'].data"
          :loading="state['slow-moving'].loading"
          :total="state['slow-moving'].count"
          :page="state['slow-moving'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <DeadStockTable
          v-else-if="activeTab === 'dead-stock'"
          :items="state['dead-stock'].data"
          :loading="state['dead-stock'].loading"
          :total="state['dead-stock'].count"
          :page="state['dead-stock'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoriesAPI, branchesAPI } from '@/services/api'

import { useProductReports, REPORT_TABS, tabHasDateFilter } from './composables/useProductReports'

import ReportsFilterBar   from './components/ReportsFilterBar.vue'
import TopSellingTable    from './components/TopSellingTable.vue'
import TopProfitableTable from './components/TopProfitableTable.vue'
import SlowMovingTable    from './components/SlowMovingTable.vue'
import DeadStockTable     from './components/DeadStockTable.vue'

const { t } = useI18n()

const {
  activeTab,
  state,
  currentState,
  currentFilters,
  excelLoading,
  fetchReport,
  switchTab,
  applyFilters,
  clearFilters,
  onPageChange,
  downloadExcel,
  PAGE_SIZE,
} = useProductReports()

const branches   = ref([])
const categories = ref([])

async function loadMetaData() {
  try {
    const [brRes, catRes] = await Promise.all([
      branchesAPI.getAll({ page_size: 100 }),
      categoriesAPI.getAll({ page_size: 200 }),
    ])
    branches.value   = brRes.data?.results || brRes.data || []
    categories.value = catRes.data?.results || catRes.data || []
  } catch (e) {
    console.warn('[Reports] meta data error:', e)
  }
}

function handleTabSwitch(tab) { switchTab(tab) }

const TAB_ACTIVE = {
  'top-selling':    'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10',
  'top-profitable': 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-900/10',
  'slow-moving':    'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-900/10',
  'dead-stock':     'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-900/10',
}

function tabActiveClass(id) {
  return TAB_ACTIVE[id] || 'border-slate-500 text-slate-600 dark:text-slate-300'
}

const TAB_LABELS = {
  'top-selling':    () => t('reports.tabs.top_selling'),
  'top-profitable': () => t('reports.tabs.top_profitable'),
  'slow-moving':    () => t('reports.tabs.slow_moving'),
  'dead-stock':     () => t('reports.tabs.dead_stock'),
}
function tabLabel(id) { return TAB_LABELS[id]?.() || id }

onMounted(async () => {
  await Promise.all([loadMetaData(), fetchReport('top-selling', 1)])
})
</script>

<style scoped>
.tab-content {
  animation: fadeSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
