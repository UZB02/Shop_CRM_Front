<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

    <!-- ── 1. Revenue Card ── -->
    <div class="enterprise-kpi group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-2 sm:gap-3">
      <div class="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <i class="pi pi-dollar text-sm"></i>
        </div>
        <!-- vs_prev_period badge -->
        <div v-if="sales.vs_prev_period?.revenue_pct !== undefined"
             :class="['flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black border',
                      sales.vs_prev_period.revenue_pct >= 0
                        ? 'text-emerald-500 bg-emerald-500/8 border-emerald-500/20'
                        : 'text-rose-500 bg-rose-500/8 border-rose-500/20']">
          <i :class="['pi text-[8px]', sales.vs_prev_period.revenue_pct >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
          {{ Math.abs(sales.vs_prev_period.revenue_pct).toFixed(1) }}%
        </div>
      </div>

      <!-- Main value -->
      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Sof Tushum</p>
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{{ formatPrice(sales.total_revenue) }}</h2>
        <!-- Gross + discount -->
        <div class="flex items-center gap-2 mt-1.5">
          <span class="text-[8px] font-bold text-slate-400">Yalpi: {{ formatPrice(sales.gross_revenue) }}</span>
          <span v-if="sales.discount_total" class="text-[8px] font-bold text-rose-400">−{{ formatPrice(sales.discount_total) }}</span>
        </div>
      </div>

      <!-- Sparkline mini-chart from trend_3months -->
      <div v-if="sales.trend_3months?.length" class="h-8 w-full">
        <Chart type="line" :data="sparklineData" :options="sparklineOptions" class="!h-8 w-full" />
      </div>

      <!-- Footer: count + avg_check + return_stats -->
      <div class="pt-2 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <div>
          <span class="text-[9px] font-black text-slate-600 dark:text-slate-300">{{ sales.count || 0 }} xarid</span>
          <span v-if="sales.vs_prev_period?.count_diff" class="ml-1 text-[8px] font-black text-emerald-500">+{{ sales.vs_prev_period.count_diff }}</span>
        </div>
        <span class="text-[8px] font-bold text-slate-400">~{{ formatPrice(sales.avg_check) }}</span>
      </div>
      <!-- Return stats -->
      <div v-if="sales.return_stats?.count" class="flex items-center justify-between text-[8px] font-black">
        <span class="text-rose-400">{{ sales.return_stats.count }} qaytarish</span>
        <span :class="['px-1.5 py-0.5 rounded-md', sales.return_stats.return_rate > 5 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500']">
          {{ sales.return_stats.return_rate }}%
        </span>
      </div>
    </div>

    <!-- ── 2. Profit Card ── -->
    <div class="enterprise-kpi group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-2 sm:gap-3">
      <div class="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>

      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <i class="pi pi-chart-line text-sm"></i>
        </div>
        <div class="flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black border border-blue-500/20 bg-blue-500/8 text-blue-500">
          {{ parseFloat(sales.margin_percent || 0).toFixed(1) }}% marja
        </div>
      </div>

      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Yalpi Foyda</p>
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{{ formatPrice(sales.total_profit) }}</h2>
      </div>

      <!-- Expense ratio progress bar -->
      <div class="space-y-1">
        <div class="flex justify-between text-[8px] font-black uppercase text-slate-400">
          <span>Sof foyda</span>
          <span class="text-rose-400">{{ expenses.expense_ratio || 0 }}% xarajat</span>
        </div>
        <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div class="h-full bg-blue-500 rounded-l-full" :style="{ width: (100 - (expenses.expense_ratio || 0)) + '%' }"></div>
          <div class="h-full bg-rose-400/60 rounded-r-full" :style="{ width: (expenses.expense_ratio || 0) + '%' }"></div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
        <span class="text-[9px] font-black text-slate-600 dark:text-slate-300">Sof: <span class="text-emerald-500">{{ formatPrice(expenses.net_profit) }}</span></span>
        <span class="text-[8px] font-bold text-slate-400">COGS: {{ formatPrice(expenses.cogs) }}</span>
      </div>
    </div>

    <!-- ── 3. Inventory Card ── -->
    <div class="enterprise-kpi group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-2 sm:gap-3">
      <div class="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>

      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
          <i class="pi pi-box text-sm"></i>
        </div>
        <div v-if="products.low_stock_count"
             class="flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black border border-rose-500/20 bg-rose-500/8 text-rose-500 animate-pulse">
          ⚠ {{ products.low_stock_count }} Defitsit
        </div>
      </div>

      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Ombor Kapitali</p>
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{{ formatPrice(products.warehouse_value) }}</h2>
        <p class="text-[8px] font-bold text-slate-400 mt-1">Savat: {{ products.avg_items_per_sale }} ta/sotuv</p>
      </div>

      <div class="pt-2 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
        <span class="text-[9px] font-black text-slate-500">Isrof: <span class="text-orange-500">{{ formatPrice(products.wastage_total) }}</span></span>
      </div>
    </div>

    <!-- ── 4. Customers Card ── -->
    <div class="enterprise-kpi group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-2 sm:gap-3">
      <div class="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>

      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <i class="pi pi-users text-sm"></i>
        </div>
        <div class="flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black border border-amber-500/20 bg-amber-500/8 text-amber-600">
          +{{ customers.new_count || 0 }} yangi
        </div>
      </div>

      <div>
        <p class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Mijozlar Bazasi</p>
        <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{{ customers.total || 0 }} ta</h2>
        <p v-if="workers.total_active_workers" class="text-[8px] font-black text-emerald-500 mt-1 uppercase tracking-wider">
          {{ workers.total_active_workers }} ta faol sotuvchi
        </p>
      </div>

      <div class="pt-2 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
        <span class="text-[9px] font-black text-slate-500">Nasiya: <span class="text-rose-500">{{ formatPrice(customers.total_debt) }}</span></span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  sales:     { type: Object, default: () => ({}) },
  products:  { type: Object, default: () => ({}) },
  customers: { type: Object, default: () => ({}) },
  expenses:  { type: Object, default: () => ({}) },
  workers:   { type: Object, default: () => ({}) }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)

// Sparkline from trend_3months: shows last 3 months revenue trend
const sparklineData = computed(() => ({
  labels: props.sales.trend_3months?.map(t => t.month.slice(5)) || [],
  datasets: [{
    data: props.sales.trend_3months?.map(t => t.revenue) || [],
    borderColor: '#10b981',
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 0
  }]
}))

const sparklineOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  animation: false
}
</script>

<style scoped>
.enterprise-kpi {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.enterprise-kpi:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.08);
}
</style>
