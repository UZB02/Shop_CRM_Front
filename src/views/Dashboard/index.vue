<template>
  <div class="dashboard-page space-y-4 p-4 min-h-screen bg-slate-50/30 dark:bg-slate-950 font-inter">
    <!-- ── Integrated Header & Filters ───────────────────────── -->
    <DashboardHeader 
      :loading="dashboardStore.loading"
      :filters="dashboardStore.filters"
      :branches="dashboardStore.branches"
      @refresh="refreshData"
      @update:filters="onFilterUpdate"
      @reset="dashboardStore.resetFilters"
    />

    <!-- ── Stats & Tabs Component ────────────────────────────── -->
    <DashboardStatsTabs 
      :tabs="tabs"
      v-model="activeTab"
      :net-profit="dashboardStore.expenses.net_profit || 0"
    />

    <!-- Main Content Area -->
    <div v-if="dashboardStore.loading && !dashboardStore.data" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <div class="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p class="mt-4 font-black uppercase text-[10px] tracking-widest text-emerald-500">Ma'lumotlar tahlil qilinmoqda...</p>
    </div>

    <div v-else-if="dashboardStore.error" class="p-12 rounded-3xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 text-center">
      <i class="pi pi-exclamation-circle text-4xl text-rose-500 mb-4"></i>
      <h2 class="text-base font-black text-slate-800 dark:text-white tracking-tight">{{ dashboardStore.error }}</h2>
      <button @click="refreshData" class="mt-4 px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all text-xs uppercase tracking-widest">Qayta urinish</button>
    </div>

    <div v-else class="space-y-4">
      <!-- ── Tab Content: Overview (Boshqaruv) ─────────────────── -->
      <div v-if="activeTab === 'overview'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <DashboardKPICards 
          :sales="dashboardStore.sales"
          :products="dashboardStore.products"
          :customers="dashboardStore.customers"
          :expenses="dashboardStore.expenses"
        />

        <DashboardCharts 
          :daily-sales="dashboardStore.chartData.daily_sales"
          :breakdown="dashboardStore.chartData.payment_breakdown"
          :hourly-heatmap="dashboardStore.chartData.hourly_heatmap"
          :total-revenue="dashboardStore.sales.total_revenue"
        />
        
        <DashboardAlerts 
          :low-stock="dashboardStore.products.low_stock"
          :current-smena="dashboardStore.currentSmena"
        />
      </div>

      <!-- ── Tab Content: Sales (Savdolar) ─────────────────────── -->
      <div v-else-if="activeTab === 'sales'" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <DashboardTopLists 
          :products="dashboardStore.products"
          :customers="dashboardStore.customers"
          :workers="dashboardStore.workers"
          type="sales"
        />
      </div>

      <!-- ── Tab Content: Inventory (Ombor) ────────────────────── -->
      <div v-else-if="activeTab === 'inventory'" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <DashboardAlerts 
          :low-stock="dashboardStore.products.low_stock"
          :current-smena="dashboardStore.currentSmena"
        />
      </div>

      <!-- ── Tab Content: Customers (Mijozlar) ─────────────────── -->
      <div v-else-if="activeTab === 'customers'" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <DashboardTopLists 
          :products="dashboardStore.products"
          :customers="dashboardStore.customers"
          :workers="dashboardStore.workers"
          type="customers"
        />
      </div>
    </div>

    <!-- Footer Stats -->
    <div v-if="dashboardStore.data" class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tizim holati: Barcha modullar ishlamoqda</p>
      </div>
      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        So'nggi yangilanish: {{ formatTime(dashboardStore.lastUpdated) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/store/dashboard'

// Components
import DashboardHeader from './components/DashboardHeader.vue'
import DashboardStatsTabs from './components/DashboardStatsTabs.vue'
import DashboardKPICards from './components/DashboardKPICards.vue'
import DashboardCharts   from './components/DashboardCharts.vue'
import DashboardAlerts   from './components/DashboardAlerts.vue'
import DashboardTopLists from './components/DashboardTopLists.vue'

const dashboardStore = useDashboardStore()
let pollingInterval = null

const tabs = [
  { id: 'overview',  label: 'Boshqaruv', icon: 'pi pi-chart-bar' },
  { id: 'sales',     label: 'Savdolar',   icon: 'pi pi-shopping-cart' },
  { id: 'inventory', label: 'Ombor',     icon: 'pi pi-box' },
  { id: 'customers', label: 'Mijozlar',   icon: 'pi pi-users' }
]
const activeTab = ref('overview')

const onFilterUpdate = (newFilters) => {
  dashboardStore.updateFilters(newFilters)
}

const refreshData = () => {
  dashboardStore.fetchDashboard()
}

const formatTime = (date) => {
  if (!date) return '...'
  return new Intl.DateTimeFormat('uz-UZ', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }).format(date)
}

onMounted(async () => {
  await dashboardStore.fetchDashboard()
  
  pollingInterval = setInterval(() => {
    dashboardStore.fetchDashboard()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
