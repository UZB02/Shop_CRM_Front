<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <!-- Active Shifts (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Ochiq Smenalar</h3>
        <div class="flex items-center gap-2">
          <span v-if="currentSmena?.open_count" class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">{{ currentSmena.open_count }} TA</span>
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">
            <span class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </div>
        </div>
      </div>
      
      <div v-if="!currentSmena?.smenas?.length" class="flex flex-col items-center justify-center py-12 text-slate-400">
        <i class="pi pi-moon text-xl mb-2 opacity-20"></i>
        <p class="text-[10px] font-black uppercase tracking-widest">Smenalar yo'q</p>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="s in currentSmena.smenas" :key="s.smena_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            {{ s.worker.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ s.worker }}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ s.branch }} • {{ s.start_time }}</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{{ formatPrice(s.sales_total) }}</p>
            <p class="text-[9px] text-slate-400 font-bold">{{ s.sales_count }} ta</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Selling Products (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Ommabop Mahsulotlar</h3>
        <span class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">Eng ko'p sotilgan</span>
      </div>
      <div class="space-y-4">
        <div v-for="p in products.top_selling" :key="p.product_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
            <i class="pi pi-box"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ p.name }}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ p.total_qty }} {{ p.unit }} sotilgan</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-slate-800 dark:text-white">{{ formatPrice(p.total_revenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Profitable Products (Sales Tab) -->
    <div v-if="type === 'sales'" class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Eng Foydali</h3>
        <span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase">Foyda bo'yicha</span>
      </div>
      <div class="space-y-4">
        <div v-for="p in products.top_profitable" :key="p.product_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <i class="pi pi-chart-bar"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ p.name }}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tushum: {{ formatPrice(p.total_revenue) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-blue-600 dark:text-blue-400">{{ formatPrice(p.total_profit) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Worker Ranking (Sales Tab) -->
    <div v-if="type === 'sales'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Sotuvchilar Reytingi</h3>
        <span v-if="workers.total_active_workers" class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ workers.total_active_workers }} ta faol</span>
      </div>
      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
              <th class="pb-3 pl-2">#</th>
              <th class="pb-3">Sotuvchi</th>
              <th class="pb-3">Rol</th>
              <th class="pb-3 text-right">Sotuvlar</th>
              <th class="pb-3 text-right">O'rtacha chek</th>
              <th class="pb-3 text-right">Tushum</th>
              <th class="pb-3 text-right text-blue-500">Foyda</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="(w, idx) in workers.ranking" :key="w.worker_id" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="py-4 pl-2">
                <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                  {{ idx + 1 }}
                </div>
              </td>
              <td class="py-4">
                <p class="text-xs font-black text-slate-800 dark:text-white">{{ w.name }}</p>
              </td>
              <td class="py-4">
                <span :class="['px-2 py-0.5 rounded-md text-[8px] font-black uppercase', 
                  w.role === 'owner' ? 'bg-purple-500/10 text-purple-500' : 
                  w.role === 'manager' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500']">
                  {{ w.role }}
                </span>
              </td>
              <td class="py-4 text-right">
                <p class="text-xs font-bold text-slate-600 dark:text-slate-400">{{ w.sales_count }} ta</p>
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
    </div>

    <!-- Branch Ranking (Inventory Tab) -->
    <div v-if="type === 'inventory'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Filiallar Samaradorligi</h3>
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
                 <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ b.count }} sotuv • Kapital: {{ formatPrice(b.warehouse_value) }}</p>
              </div>
           </div>
           <div class="flex gap-8 ml-auto">
              <div class="text-right">
                 <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tushum</p>
                 <p class="text-xs font-black text-slate-800 dark:text-white">{{ formatPrice(b.revenue) }}</p>
              </div>
              <div class="text-right">
                 <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Foyda</p>
                 <p class="text-xs font-black text-emerald-600">{{ formatPrice(b.profit) }}</p>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Suppliers (Finance Tab) -->
    <div v-if="type === 'finance'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Yetkazib Beruvchilar</h3>
        <p class="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-rose-500/5 border border-rose-500/10">Jami Qarz: {{ formatPrice(suppliers.total_debt) }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="s in suppliers.top_debtors" :key="s.supplier_id" class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center gap-3 group hover:border-rose-500/30 transition-all">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
             <i class="pi pi-truck text-xs"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ s.name }}</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{{ s.company }}</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-rose-500">{{ formatPrice(s.debt_balance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP Customers (Customers Tab) -->
    <div v-if="type === 'customers'" class="md:col-span-2 lg:col-span-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">VIP Mijozlar</h3>
        <span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase">Xaridlar bo'yicha</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="c in customers.top_buyers" :key="c.customer_id" class="flex items-center gap-3 group p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
           <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
             {{ c.name.charAt(0) }}
           </div>
           <div class="flex-1 min-w-0">
             <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ c.name }}</p>
             <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ c.visit_count }} ta xarid</p>
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
