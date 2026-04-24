<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Revenue Card -->
    <div class="enterprise-kpi group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-hidden h-44 flex flex-col justify-between">
      <div class="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
      
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 transition-transform duration-500 group-hover:scale-105">
            <i class="pi pi-dollar text-base"></i>
          </div>
          <div v-if="sales.vs_prev_period" 
               :class="['flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border backdrop-blur-md', 
                        sales.vs_prev_period.revenue_pct >= 0 
                          ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20' 
                          : 'text-rose-500 bg-rose-500/5 border-rose-500/20']">
            <i :class="['pi', sales.vs_prev_period.revenue_pct >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
            {{ formatPercent(sales.vs_prev_period.revenue_pct) }}%
          </div>
        </div>

        <div>
          <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-0.5">Xisobot Davri Tushumi</span>
          <h2 class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter leading-none">{{ formatPrice(sales.total_revenue) }}</h2>
          <div class="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div class="h-full bg-emerald-500 rounded-full" style="width: 75%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-500">{{ sales.count || 0 }} xarid</span>
          <i class="pi pi-chevron-right text-[9px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>

    <!-- Profit Card -->
    <div class="enterprise-kpi group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-hidden h-44 flex flex-col justify-between">
      <div class="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
      
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
            <i class="pi pi-chart-line text-base"></i>
          </div>
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border border-blue-500/20 bg-blue-500/5 text-blue-500 backdrop-blur-md">
            {{ formatPercent(sales.margin_percent) }}% Rentabellik
          </div>
        </div>

        <div>
          <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-0.5">Yalpi Foyda</span>
          <h2 class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter leading-none">{{ formatPrice(sales.total_profit) }}</h2>
          <div class="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div class="h-full bg-blue-500 rounded-full" style="width: 62%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-500">Sof: {{ formatPrice(expenses.net_profit) }}</span>
          <i class="pi pi-chevron-right text-[9px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>

    <!-- Inventory Card -->
    <div class="enterprise-kpi group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-hidden h-44 flex flex-col justify-between">
      <div class="absolute -top-6 -right-6 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
      
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform">
            <i class="pi pi-box text-base"></i>
          </div>
          <div v-if="products.low_stock_count" 
               class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border border-rose-500/20 bg-rose-500/5 text-rose-500 backdrop-blur-md animate-pulse">
            {{ products.low_stock_count }} Defitsit
          </div>
        </div>

        <div>
          <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-0.5">Ombor Qiymati</span>
          <h2 class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter leading-none">{{ formatPrice(products.warehouse_value) }}</h2>
          <div class="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div class="h-full bg-purple-500 rounded-full" style="width: 88%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-500">Isrof: {{ formatPrice(products.wastage_total) }}</span>
          <i class="pi pi-chevron-right text-[9px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>

    <!-- Active Customers Card -->
    <div class="enterprise-kpi group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 overflow-hidden h-44 flex flex-col justify-between">
      <div class="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
      
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <i class="pi pi-users text-base"></i>
          </div>
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border border-amber-500/20 bg-amber-500/5 text-amber-600 backdrop-blur-md">
            +{{ customers.new_count || 0 }} Dinamika
          </div>
        </div>

        <div>
           <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-0.5">Mijozlar Bazasi</span>
           <h2 class="text-xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter leading-none">{{ customers.total || 0 }} ta</h2>
           <div class="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div class="h-full bg-amber-500 rounded-full" style="width: 45%"></div>
            </div>
        </div>

        <div class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-500">Qarzlar: {{ formatPrice(customers.total_debt) }}</span>
          <i class="pi pi-chevron-right text-[9px] text-slate-300 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  sales:     { type: Object, default: () => ({}) },
  products:  { type: Object, default: () => ({}) },
  customers: { type: Object, default: () => ({}) },
  expenses:  { type: Object, default: () => ({}) }
})

const settingsStore = useSettingsStore()

const formatPrice = (value) => settingsStore.formatPrice(value)
const formatPercent = (value) => parseFloat(value || 0).toLocaleString('uz-UZ', { minimumFractionDigits: 1 })
</script>

<style scoped>
.enterprise-kpi {
  transition: transform 0.3s ease;
}
.enterprise-kpi:hover {
  transform: translateY(-4px);
}
</style>
