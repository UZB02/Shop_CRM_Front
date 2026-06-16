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
      <div class="relative border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">

        <!-- Chap scroll shadow -->
        <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10"></div>
        <!-- O'ng scroll shadow -->
        <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10"></div>

        <!-- Scrollable tab qatori -->
        <div
          ref="tabScrollRef"
          class="flex items-center gap-1 px-3 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <!-- 1-to'lqin (Sotuv tahlili) -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              v-for="tab in REPORT_TABS.slice(0, 4)"
              :key="tab.id"
              :data-tab="tab.id"
              @click="handleTabSwitch(tab.id)"
              :class="[
                'group flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-200',
                activeTab === tab.id
                  ? tabPillActiveClass(tab.id)
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/60'
              ]"
            >
              <i :class="tab.icon" class="text-[11px] transition-transform duration-200 group-hover:scale-110"></i>
              <span>{{ tabLabel(tab.id) }}</span>
              <span
                v-if="activeTab === tab.id && currentState.loading"
                class="w-1 h-1 rounded-full bg-current animate-pulse"
              ></span>
            </button>
          </div>

          <!-- Ajratuvchi -->
          <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

          <!-- 2-to'lqin (Stok tahlili) -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              v-for="tab in REPORT_TABS.slice(4, 7)"
              :key="tab.id"
              :data-tab="tab.id"
              @click="handleTabSwitch(tab.id)"
              :class="[
                'group flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-200',
                activeTab === tab.id
                  ? tabPillActiveClass(tab.id)
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/60'
              ]"
            >
              <i :class="tab.icon" class="text-[11px] transition-transform duration-200 group-hover:scale-110"></i>
              <span>{{ tabLabel(tab.id) }}</span>
              <span
                v-if="activeTab === tab.id && currentState.loading"
                class="w-1 h-1 rounded-full bg-current animate-pulse"
              ></span>
            </button>
          </div>

          <!-- Ajratuvchi -->
          <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

          <!-- ABC (alohida, highlighted) -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              v-for="tab in REPORT_TABS.slice(7)"
              :key="tab.id"
              :data-tab="tab.id"
              @click="handleTabSwitch(tab.id)"
              :class="[
                'group flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-200',
                activeTab === tab.id
                  ? tabPillActiveClass(tab.id)
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/60'
              ]"
            >
              <i :class="tab.icon" class="text-[11px] transition-transform duration-200 group-hover:scale-110"></i>
              <span>{{ tabLabel(tab.id) }}</span>
              <!-- NEW badge -->
              <span
                v-if="activeTab !== tab.id"
                class="text-[8px] font-black px-1 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 uppercase tracking-wider"
              >new</span>
              <span
                v-if="activeTab === tab.id && currentState.loading"
                class="w-1 h-1 rounded-full bg-current animate-pulse"
              ></span>
            </button>
          </div>
        </div>
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

        <SoldOutTable
          v-else-if="activeTab === 'sold-out'"
          :items="state['sold-out'].data"
          :loading="state['sold-out'].loading"
          :total="state['sold-out'].count"
          :page="state['sold-out'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <SalesTrendTable
          v-else-if="activeTab === 'sales-trend'"
          :items="state['sales-trend'].data"
          :summary="state['sales-trend'].summary"
          :loading="state['sales-trend'].loading"
          :total="state['sales-trend'].count"
          :page="state['sales-trend'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <StockoutForecastTable
          v-else-if="activeTab === 'stockout-forecast'"
          :items="state['stockout-forecast'].data"
          :loading="state['stockout-forecast'].loading"
          :total="state['stockout-forecast'].count"
          :page="state['stockout-forecast'].page"
          :page-size="PAGE_SIZE"
          @page-change="onPageChange"
        />

        <AbcAnalysisTable
          v-else-if="activeTab === 'abc-analysis'"
          :items="state['abc-analysis'].data"
          :summary="state['abc-analysis'].summary"
          :loading="state['abc-analysis'].loading"
          :total="state['abc-analysis'].count"
          :page="state['abc-analysis'].page"
          :page-size="PAGE_SIZE"
          :sort="currentFilters.sort"
          @page-change="onPageChange"
          @sort-change="onSortChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoriesAPI, branchesAPI } from '@/services/api'

import { useProductReports, REPORT_TABS, tabHasDateFilter } from './composables/useProductReports'

import ReportsFilterBar      from './components/ReportsFilterBar.vue'
import TopSellingTable       from './components/TopSellingTable.vue'
import TopProfitableTable    from './components/TopProfitableTable.vue'
import SlowMovingTable       from './components/SlowMovingTable.vue'
import DeadStockTable        from './components/DeadStockTable.vue'
import SoldOutTable          from './components/SoldOutTable.vue'
import SalesTrendTable       from './components/SalesTrendTable.vue'
import StockoutForecastTable from './components/StockoutForecastTable.vue'
import AbcAnalysisTable      from './components/AbcAnalysisTable.vue'

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
  onSortChange,
  downloadExcel,
  PAGE_SIZE,
} = useProductReports()

const branches      = ref([])
const categories    = ref([])
const tabScrollRef  = ref(null)

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

function handleTabSwitch(tab) {
  switchTab(tab)
  // Aktiv tabni scroll qilib ko'rsatish
  nextTick(() => {
    const container = tabScrollRef.value
    const active = container?.querySelector(`[data-tab="${tab}"]`)
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

const TAB_PILL_ACTIVE = {
  'top-selling':       'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30',
  'top-profitable':    'bg-violet-500 text-white shadow-sm shadow-violet-500/30',
  'slow-moving':       'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
  'dead-stock':        'bg-rose-500 text-white shadow-sm shadow-rose-500/30',
  'sold-out':          'bg-rose-500 text-white shadow-sm shadow-rose-500/30',
  'sales-trend':       'bg-blue-500 text-white shadow-sm shadow-blue-500/30',
  'stockout-forecast': 'bg-orange-500 text-white shadow-sm shadow-orange-500/30',
  'abc-analysis':      'bg-teal-500 text-white shadow-sm shadow-teal-500/30',
}

function tabPillActiveClass(id) {
  return TAB_PILL_ACTIVE[id] || 'bg-slate-600 text-white'
}

// Eski tabActiveClass (filtr border uchun saqlanadi)
const TAB_ACTIVE = {
  'top-selling':    'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10',
  'top-profitable': 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-900/10',
  'slow-moving':    'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-900/10',
  'dead-stock':     'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-900/10',
  'sold-out':       'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-900/10',
  'sales-trend':    'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/10',
  'stockout-forecast': 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/60 dark:bg-orange-900/10',
  'abc-analysis':      'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-900/10',
}

function tabActiveClass(id) {
  return TAB_ACTIVE[id] || 'border-slate-500 text-slate-600 dark:text-slate-300'
}

const TAB_LABELS = {
  'top-selling':    () => t('reports.tabs.top_selling'),
  'top-profitable': () => t('reports.tabs.top_profitable'),
  'slow-moving':    () => t('reports.tabs.slow_moving'),
  'dead-stock':     () => t('reports.tabs.dead_stock'),
  'sold-out':       () => t('reports.tabs.sold_out'),
  'sales-trend':    () => t('reports.tabs.sales_trend'),
  'stockout-forecast': () => t('reports.tabs.stockout_forecast'),
  'abc-analysis':      () => t('reports.tabs.abc_analysis'),
}
function tabLabel(id) { return TAB_LABELS[id]?.() || id }

onMounted(async () => {
  await Promise.all([loadMetaData(), fetchReport(activeTab.value, 1)])
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
