<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <!-- Active Shifts (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.open_shifts') }}</h3>
        <div class="flex items-center gap-2">
          <span v-if="currentSmena?.open_count" class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[11px] font-black ">{{ currentSmena.open_count }} TA</span>
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[11px] font-black ">
            <span class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ $t('dashboard.smena_live').toUpperCase() }}
          </div>
        </div>
      </div>
      
      <div v-if="!currentSmena?.smenas?.length" class="flex flex-col items-center justify-center py-12 text-slate-400">
        <i class="pi pi-moon text-xl mb-2 opacity-20"></i>
        <p class="text-[12px] font-black tracking-widest">{{ $t('dashboard.top_lists.no_shifts') }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="s in currentSmena.smenas" :key="s.smena_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[12px] font-black text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            {{ s.worker.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-black text-slate-800 dark:text-white truncate">{{ s.worker }}</p>
            <p class="text-[12px] text-slate-400 font-bold tracking-tighter">{{ s.branch }} • {{ s.start_time }}</p>
          </div>
          <div class="text-right">
            <p class="text-[13px] font-black text-emerald-600 dark:text-emerald-400">{{ formatPrice(s.sales_total) }}</p>
            <p class="text-[11px] text-slate-400 font-bold">{{ s.sales_count }} {{ $t('common.count') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Selling Products (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.popular_products') }}</h3>
        <span class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[11px] font-black ">{{ $t('dashboard.top_lists.top_sold') }}</span>
      </div>
      <div class="space-y-4">
        <div v-for="p in products.top_selling" :key="p.product_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            <i class="pi pi-box"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-black text-slate-800 dark:text-white truncate">{{ p.name }}</p>
            <p class="text-[12px] text-slate-400 font-bold tracking-tighter">{{ $t('dashboard.top_lists.sold_count', { count: p.total_qty, unit: p.unit }) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[13px] font-black text-slate-800 dark:text-white">{{ formatPrice(p.total_revenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Profitable Products (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.top_profitable') }}</h3>
        <span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[11px] font-black ">{{ $t('dashboard.top_lists.by_profit') }}</span>
      </div>
      <div class="space-y-4">
        <div v-for="p in products.top_profitable" :key="p.product_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <i class="pi pi-chart-bar"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-black text-slate-800 dark:text-white truncate">{{ p.name }}</p>
            <p class="text-[12px] text-slate-400 font-bold tracking-tighter">{{ $t('dashboard.charts.revenue') }}: {{ formatPrice(p.total_revenue) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[13px] font-black text-blue-600 dark:text-blue-400">{{ formatPrice(p.total_profit) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Worker Ranking (Sales Tab) -->
    <div v-if="type === 'sales'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.seller_ranking') }}</h3>
        <span v-if="workers.total_active_workers" class="text-[11px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.top_lists.active_count', { count: workers.total_active_workers }) }}</span>
      </div>
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto no-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[11px] font-black text-slate-400 tracking-widest border-b border-slate-50 dark:border-slate-800">
              <th class="pb-3 pl-2">#</th>
              <th class="pb-3">{{ $t('dashboard.top_lists.seller') }}</th>
              <th class="pb-3">{{ $t('dashboard.top_lists.role') }}</th>
              <th class="pb-3 text-right">{{ $t('dashboard.metrics.sales') }}</th>
              <th class="pb-3 text-right">{{ $t('dashboard.metrics.avg_check') }}</th>
              <th class="pb-3 text-right">{{ $t('dashboard.charts.revenue') }}</th>
              <th class="pb-3 text-right text-blue-500">{{ $t('dashboard.charts.profit') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="(w, idx) in workers.ranking" :key="w.worker_id" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="py-4 pl-2">
                <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] font-black text-slate-500">
                  {{ idx + 1 }}
                </div>
              </td>
              <td class="py-4">
                <p class="text-xs font-black text-slate-800 dark:text-white">{{ w.name }}</p>
              </td>
              <td class="py-4">
                <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black ', 
                  w.role === 'owner' ? 'bg-purple-500/10 text-purple-500' : 
                  w.role === 'manager' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500']">
                  {{ w.role }}
                </span>
              </td>
              <td class="py-4 text-right">
                <p class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ w.sales_count }} {{ $t('common.count') }}</p>
              </td>
              <td class="py-4 text-right">
                <p class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(w.avg_check) }}</p>
              </td>
              <td class="py-4 text-right text-xs font-black text-slate-800 dark:text-white">
                {{ formatPrice(w.revenue) }}
              </td>
              <td class="py-4 text-right text-xs font-black text-blue-600 dark:text-blue-400">
                {{ formatPrice(w.profit) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-3">
        <div v-for="(w, idx) in workers.ranking" :key="`mobile-${w.worker_id}`" class="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-col gap-3 relative">
          <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[12px] font-black text-slate-500 shadow-sm">
            {{ idx + 1 }}
          </div>
          
          <div class="flex items-start justify-between pl-4">
            <div>
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ w.name }}</p>
              <span :class="['inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black ', 
                w.role === 'owner' ? 'bg-purple-500/10 text-purple-500' : 
                w.role === 'manager' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500']">
                {{ w.role }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.charts.revenue') }}</p>
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ formatPrice(w.revenue) }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
             <div class="text-left">
               <p class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.metrics.sales') }}</p>
               <p class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ w.sales_count }} {{ $t('common.count') }}</p>
             </div>
             <div class="text-center">
               <p class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.metrics.avg_check') }}</p>
               <p class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ formatPrice(w.avg_check) }}</p>
             </div>
             <div class="text-right">
               <p class="text-[10px] font-black text-blue-400 tracking-widest">{{ $t('dashboard.charts.profit') }}</p>
               <p class="text-xs font-black text-blue-600 dark:text-blue-400">{{ formatPrice(w.profit) }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Branch Ranking (Inventory Tab) -->
    <div v-if="type === 'inventory'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.efficiency') }}</h3>
        <i class="pi pi-map-marker text-emerald-500"></i>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="b in branches" :key="b.branch_id" class="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <i class="pi pi-building"></i>
              </div>
              <div>
                 <p class="text-xs font-black text-slate-800 dark:text-white">{{ b.name }}</p>
                 <p class="text-[11px] font-black text-slate-400 tracking-tighter">{{ b.count }} sotuv • Kapital: {{ formatPrice(b.warehouse_value) }}</p>
              </div>
           </div>
           <div class="flex gap-8 ml-auto">
              <div class="text-right">
                 <p class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.charts.revenue') }}</p>
                 <p class="text-xs font-black text-slate-800 dark:text-white">{{ formatPrice(b.revenue) }}</p>
              </div>
              <div class="text-right">
                 <p class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('dashboard.charts.profit') }}</p>
                 <p class="text-xs font-black text-emerald-600">{{ formatPrice(b.profit) }}</p>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Suppliers (Finance Tab) -->
    <div v-if="type === 'finance'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <!-- Decorative background -->
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000 pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 class="text-base font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <i class="pi pi-truck text-emerald-500 bg-emerald-500/10 p-2 rounded-xl text-sm"></i>
            {{ $t('dashboard.top_lists.suppliers') }}
          </h3>
          <p class="text-[11px] text-slate-400 font-bold mt-1 tracking-widest uppercase">{{ $te('dashboard.top_lists.suppliers_desc') ? $t('dashboard.top_lists.suppliers_desc') : 'Qarzdorlik va to\'lovlar nazorati' }}</p>
        </div>
        
        <div class="flex items-center gap-3 bg-rose-50 dark:bg-rose-500/10 px-4 py-2.5 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm">
          <div class="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
            <i class="pi pi-exclamation-triangle text-rose-500 text-[12px]"></i>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-black text-rose-400 tracking-widest uppercase">{{ $t('dashboard.top_lists.total_debt') }}</span>
            <span class="text-[15px] font-black text-rose-600 dark:text-rose-400 tracking-tight leading-none mt-0.5">{{ formatPrice(suppliers.total_debt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="!suppliers.top_debtors?.length" class="relative z-10 flex flex-col items-center justify-center py-10 px-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100 dark:border-emerald-500/20">
          <i class="pi pi-check-circle text-2xl"></i>
        </div>
        <h4 class="text-[13px] font-black text-slate-700 dark:text-slate-200 tracking-tight mb-1">{{ $te('dashboard.top_lists.no_debtors_title') ? $t('dashboard.top_lists.no_debtors_title') : 'Barchasi joyida!' }}</h4>
        <p class="text-[11px] font-bold text-slate-400 tracking-widest text-center">{{ $te('dashboard.top_lists.no_debtors') ? $t('dashboard.top_lists.no_debtors') : 'Ayni vaqtda yetkazib beruvchilardan yirik qarzlar mavjud emas.' }}</p>
      </div>

      <div v-else class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link 
          v-for="s in suppliers.top_debtors" 
          :key="s.supplier_id" 
          :to="`/dashboard/suppliers/${s.supplier_id}`"
          class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center gap-4 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5 transition-all group/item"
        >
          <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center text-slate-400 group-hover/item:bg-rose-500 group-hover/item:border-rose-500 group-hover/item:text-white transition-all shadow-sm">
             <i class="pi pi-truck text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-black text-slate-800 dark:text-white truncate group-hover/item:text-rose-500 transition-colors">{{ s.name }}</p>
            <p class="text-[11px] text-slate-400 font-bold tracking-widest truncate">{{ s.company || '—' }}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[9px] font-black text-slate-400 tracking-widest uppercase block mb-0.5">{{ $t('suppliers.table.debt') }}</span>
            <p class="text-[14px] font-black text-rose-500">{{ formatPrice(s.debt_balance) }}</p>
          </div>
        </router-link>
      </div>
      
      <div class="mt-6 flex justify-end relative z-10">
        <router-link to="/dashboard/suppliers" class="text-[11px] font-black text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1.5 uppercase">
          {{ $te('dashboard.top_lists.view_all_suppliers') ? $t('dashboard.top_lists.view_all_suppliers') : 'Barcha yetkazuvchilar' }}
          <i class="pi pi-arrow-right text-[10px]"></i>
        </router-link>
      </div>
    </div>

    <!-- VIP Customers (Customers Tab) -->
    <div v-if="type === 'customers'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">{{ $t('dashboard.top_lists.vip_customers') }}</h3>
        <span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[11px] font-black ">{{ $t('dashboard.top_lists.by_purchases') }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="c in customers.top_buyers" :key="c.customer_id" class="flex items-center gap-3 group p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
           <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
             {{ c.name.charAt(0) }}
           </div>
           <div class="flex-1 min-w-0">
             <p class="text-[13px] font-black text-slate-800 dark:text-white truncate">{{ c.name }}</p>
             <p class="text-[12px] text-slate-400 font-bold tracking-tighter">{{ $t('dashboard.top_lists.visit_count', { count: c.visit_count }) }}</p>
           </div>
           <div class="text-right">
             <p class="text-xs font-black text-slate-800 dark:text-white">{{ formatPrice(c.total_spent) }}</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

defineProps({
  products:      { type: Object, default: () => ({ top_selling: [], top_profitable: [] }) },
  customers:     { type: Object, default: () => ({ top_buyers: [] }) },
  workers:       { type: Object, default: () => ({ ranking: [], total_active_workers: 0 }) },
  currentSmena:  { type: Object, default: () => ({ smenas: [], open_count: 0 }) },
  branches:      { type: Array,  default: () => [] },
  suppliers:     { type: Object, default: () => ({ total_debt: 0, top_debtors: [] }) },
  type:          { type: String, default: '' }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)
</script>


