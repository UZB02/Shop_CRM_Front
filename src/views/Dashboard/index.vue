<template>
  <div class="dashboard-page space-y-4 p-4 min-h-screen bg-slate-50/30 dark:bg-slate-950 font-inter">
    <!-- ── Integrated Header & Filters ───────────────────────── -->
    <DashboardHeader 
      :loading="dashboardStore.loading"
      :filters="dashboardStore.filters"
      :branches="dashboardStore.branches"
      :period="dashboardStore.period"
      @refresh="refreshData"
      @update:filters="onFilterUpdate"
      @reset="dashboardStore.resetFilters"
    />

    <!-- ── Stats & Tabs Component ────────────────────────────── -->
    <DashboardStatsTabs 
      :tabs="tabs"
      v-model="activeTab"
      :net-profit="dashboardStore.expenses.net_profit || 0"
      :sales-count="dashboardStore.sales.count || 0"
      :vs-prev="dashboardStore.sales.vs_prev_period"
      :smena-count="dashboardStore.currentSmena.open_count || 0"
    />

    <!-- Main Content Area -->
    <div v-if="dashboardStore.loading && !dashboardStore.data" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <div class="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="mt-4 font-black text-[12px] tracking-widest text-emerald-500">{{ $t('dashboard.analyzing') }}</p>
    </div>

    <div v-else-if="dashboardStore.error" class="p-12 rounded-3xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 text-center">
      <i class="pi pi-exclamation-circle text-4xl text-rose-500 mb-4"></i>
      <h2 class="text-base font-black text-slate-800 dark:text-white tracking-tight">{{ dashboardStore.error }}</h2>
      <button @click="refreshData" class="mt-4 px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all text-xs tracking-widest">{{ $t('dashboard.retry') }}</button>
    </div>

    <div v-else class="space-y-4">
      <!-- ── Tab: Overview (Boshqaruv) ─────────────────── -->
      <div v-if="activeTab === 'overview'" class="space-y-4 animate-in">
        <!-- KPI Cards — API: sales, products, customers, expenses, workers -->
        <DashboardKPICards 
          :sales="dashboardStore.sales"
          :products="dashboardStore.products"
          :customers="dashboardStore.customers"
          :expenses="dashboardStore.expenses"
          :workers="dashboardStore.workers"
        />

        <!-- Daily Sales Trend — API: chart_data.daily_sales -->
        <DashboardCharts 
          :daily-sales="dashboardStore.chartData.daily_sales || []"
          :total-revenue="dashboardStore.sales.total_revenue || 0"
          :trend-3months="dashboardStore.sales.trend_3months || []"
          mode="overview"
        />

        <!-- Monthly Revenue Chart — API: /dashboard/revenue-chart/ -->
        <DashboardMonthlyChart 
          v-if="dashboardStore.monthlyChart"
          :chart-data="dashboardStore.monthlyChart"
        />
      </div>

      <!-- ── Tab: Sales (Savdolar) ─────────────────────── -->
      <div v-else-if="activeTab === 'sales'" class="space-y-4 animate-in">
        <!-- Payment breakdown + hourly heatmap — API: chart_data -->
        <DashboardCharts 
          :breakdown="dashboardStore.chartData.payment_breakdown || {}"
          :hourly-heatmap="dashboardStore.chartData.hourly_heatmap || []"
          :total-revenue="dashboardStore.sales.total_revenue || 0"
          mode="sales"
        />

        <!-- Top products + workers ranking + live smenas — API: products, workers, current_smena -->
        <DashboardTopLists 
          :products="dashboardStore.products"
          :workers="dashboardStore.workers"
          :current-smena="dashboardStore.currentSmena"
          type="sales"
        />
      </div>

      <!-- ── Tab: Inventory (Ombor) ────────────────────── -->
      <div v-else-if="activeTab === 'inventory'" class="space-y-4 animate-in">
        <!-- Low stock alerts — API: products.low_stock -->
        <DashboardAlerts 
          :low-stock="dashboardStore.products.low_stock || []"
          :low-stock-count="dashboardStore.products.low_stock_count || 0"
          :warehouse-value="dashboardStore.products.warehouse_value || 0"
          :wastage-total="dashboardStore.products.wastage_total || 0"
        />
        
        <!-- Product insights widget — Top-5 sotilgan + O'lik tovar ogohlantirish -->
        <DashboardProductInsights v-if="isOwnerOrManager" />

        <!-- Branch rankings — API: branches -->
        <DashboardTopLists 
          :branches="dashboardStore.branches"
          type="inventory"
        />
      </div>

      <!-- ── Tab: Customers (Mijozlar) ─────────────────── -->
      <div v-else-if="activeTab === 'customers'" class="animate-in">
        <!-- Top buyers — API: customers.top_buyers -->
        <DashboardTopLists 
          :customers="dashboardStore.customers"
          type="customers"
        />
      </div>

      <!-- ── Tab: Finance (Moliya) ─────────────────────── -->
      <div v-else-if="activeTab === 'finance'" class="space-y-4 animate-in">
        <!-- Net profit breakdown + expense categories pie — API: expenses -->
        <DashboardFinance :expenses="dashboardStore.expenses" :sales="dashboardStore.sales" />
        
        <!-- Suppliers debt list — API: suppliers (filter-independent) -->
        <DashboardTopLists 
          :suppliers="dashboardStore.suppliers"
          type="finance"
        />
      </div>

      <!-- ── Tab: Audit Log (Tizim jurnali) ──────────────── -->
      <div v-else-if="activeTab === 'audit'" class="animate-in">
        <DashboardAuditLog />
      </div>
    </div>

    <!-- Footer: last updated time -->
    <div v-if="dashboardStore.data" class="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        <p class="text-[11px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.system_ok') }}</p>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="settingsStore.isShiftEnabled && smenaPolling" class="flex items-center gap-1.5 text-[11px] font-black text-emerald-500 tracking-widest">
          <span class="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
          {{ $t('dashboard.smena_live') }}
        </div>
        <p class="text-[11px] font-black text-slate-400 tracking-widest">
          {{ $t('dashboard.last_updated') }} {{ formatTime(dashboardStore.lastUpdated) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/dashboard'
import { useSettingsStore } from '@/store/settings'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

// Components
import DashboardHeader       from './components/DashboardHeader.vue'
import DashboardStatsTabs    from './components/DashboardStatsTabs.vue'
import DashboardKPICards     from './components/DashboardKPICards.vue'
import DashboardCharts       from './components/DashboardCharts.vue'
import DashboardAlerts       from './components/DashboardAlerts.vue'
import DashboardTopLists     from './components/DashboardTopLists.vue'
import DashboardMonthlyChart from './components/DashboardMonthlyChart.vue'
import DashboardFinance      from './components/DashboardFinance.vue'
import DashboardAuditLog          from './components/DashboardAuditLog.vue'
import DashboardProductInsights  from './components/DashboardProductInsights.vue'

const route = useRoute()
const router = useRouter()
const dashboardStore = useDashboardStore()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const { t } = useI18n()

// Polling: only current_smena refreshes every 5 min (not entire dashboard)
// Full dashboard only refreshes on filter change or manual refresh
let smenaPolling = ref(false)
let smenaInterval = null

const isOwner = computed(() => {
  const u = authStore.user
  if (!u) return false
  return u.is_owner || u.role === 'owner' || u.worker?.role === 'owner' || u.is_superuser
})

const isOwnerOrManager = computed(() => {
  const u = authStore.user
  if (!u) return false
  const role = (u.role || u.worker?.role || '').toLowerCase()
  return u.is_owner || u.is_superuser || role === 'owner' || role === 'manager'
})

const hasAuditAccess = computed(() => {
  return isOwner.value && settingsStore.hasPlanAuditLog
})

const tabs = computed(() => {
  const base = [
    { id: 'overview',  label: t('dashboard.tabs.overview'),  icon: 'pi pi-chart-bar' },
    { id: 'sales',     label: t('dashboard.tabs.sales'),     icon: 'pi pi-shopping-cart' },
    { id: 'inventory', label: t('dashboard.tabs.inventory'), icon: 'pi pi-box' },
    { id: 'customers', label: t('dashboard.tabs.customers'), icon: 'pi pi-users' },
    { id: 'finance',   label: t('dashboard.tabs.finance'),   icon: 'pi pi-dollar' }
  ]
  if (hasAuditAccess.value) {
    base.push({ id: 'audit', label: t('dashboard.tabs.audit'), icon: 'pi pi-history' })
  }
  return base
})
const activeTab = ref('overview')

// Sync activeTab to URL query parameter tab
watch(activeTab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } })
  }
})

// Sync query parameter tab to activeTab
watch(() => route.query.tab, (newQueryTab) => {
  if (newQueryTab && tabs.value.some(t => t.id === newQueryTab) && activeTab.value !== newQueryTab) {
    activeTab.value = newQueryTab
  }
})

const onFilterUpdate = (newFilters) => {
  dashboardStore.updateFilters(newFilters)
}

const refreshData = () => {
  dashboardStore.fetchDashboard()
}

const formatTime = (date) => {
  if (!date) return '...'
  return new Intl.DateTimeFormat('uz-UZ', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  }).format(date)
}

onMounted(async () => {
  // Restore tab from URL if present and authorized
  const queryTab = route.query.tab
  if (queryTab && tabs.value.some(t => t.id === queryTab)) {
    activeTab.value = queryTab
  } else {
    // If not present, initialize URL query param with current activeTab
    router.replace({ query: { ...route.query, tab: activeTab.value } })
  }

  await dashboardStore.fetchDashboard()
  
  // Only poll current_smena every 5 minutes (lightweight) if shifts are enabled
  if (settingsStore.isShiftEnabled) {
    smenaPolling.value = true
    smenaInterval = setInterval(() => {
      dashboardStore.fetchCurrentSmena()
    }, 5 * 60 * 1000)
  }
})

onUnmounted(() => {
  smenaPolling.value = false
  if (smenaInterval) clearInterval(smenaInterval)
})
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


