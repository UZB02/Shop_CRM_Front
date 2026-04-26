<template>
  <div class="space-y-4 animate-fadeIn pb-8">
    <!-- Header with Filters -->
    <KpiPageHeader 
      v-model:period="period"
      v-model:searchQuery="searchQuery"
      :showCharts="showCharts"
      :loading="loading"
      :hasData="kpiList.length > 0"
      @toggle-charts="showCharts = !showCharts"
      @filter-change="loadKpiData"
      @refresh="loadKpiData"
    />

    <template v-if="settingsStore.isKpiEnabled">
      <!-- Stats Summary -->
      <KpiStatsCards v-if="kpiList.length > 0" :stats="globalStats" />

      <!-- Analytics Section -->
      <transition name="chart-fade">
        <KpiAnalytics 
          v-if="showCharts && kpiList.length > 0"
          :barChartData="barChartData"
          :barChartOptions="barChartOptions"
          :doughnutChartData="doughnutChartData"
        />
      </transition>

      <!-- Main Data Table -->
      <KpiTable 
        :data="filteredKpiList"
        :fullList="kpiList"
        :loading="loading"
        @open-target="openTargetDialog"
      />
    </template>

    <!-- Not Enabled Placeholder -->
    <div v-else class="flex items-center justify-center min-h-[300px]">
      <div class="text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-sm w-full">
        <div class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-lock text-xl text-amber-500"></i>
        </div>
        <h2 class="text-sm font-bold text-slate-800 dark:text-white uppercase mb-4">{{ $t('kpi.not_enabled') }}</h2>
        <router-link 
          :to="{ name: 'settings' }" 
          class="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          <i class="pi pi-cog"></i>
          <span>{{ $t('menu.settings') }}</span>
        </router-link>
      </div>
    </div>

    <!-- Modals -->
    <SetTargetModal 
      v-model="targetModalVisible" 
      :kpi="selectedKpi"
      @saved="loadKpiData"
    />
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
import { useKpi } from './composables/useKpi'

// Components
import KpiPageHeader from './components/kpi/KpiPageHeader.vue'
import KpiStatsCards from './components/kpi/KpiStatsCards.vue'
import KpiAnalytics from './components/kpi/KpiAnalytics.vue'
import KpiTable from './components/kpi/KpiTable.vue'
import SetTargetModal from './components/SetTargetModal.vue'

const settingsStore = useSettingsStore()
const {
  loading,
  kpiList,
  period,
  searchQuery,
  targetModalVisible,
  selectedKpi,
  showCharts,
  filteredKpiList,
  globalStats,
  barChartData,
  barChartOptions,
  doughnutChartData,
  loadKpiData,
  openTargetDialog
} = useKpi()
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

.chart-fade-enter-active, .chart-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.chart-fade-enter-from, .chart-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
