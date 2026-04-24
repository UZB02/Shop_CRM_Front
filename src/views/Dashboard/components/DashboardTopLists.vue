<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Top Selling Products -->
    <div v-if="!type || type === 'sales'" class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Ommabop Mahsulotlar</h3>
        <span class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">Top {{ products.top_selling?.length || 0 }}</span>
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
            <div class="w-16 h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" :style="{ width: '80%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Customers -->
    <div v-if="!type || type === 'customers'" :class="['p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm', type === 'customers' ? 'xl:col-span-3' : '']">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">VIP Mijozlar</h3>
        <span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase">Foyda bo'yicha</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-if="type === 'customers'">
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
      <div class="space-y-4" v-else>
        <div v-for="c in customers.top_buyers" :key="c.customer_id" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
            <i class="pi pi-user"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ c.name }}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ c.visit_count }} ta xarid</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-slate-800 dark:text-white">{{ formatPrice(c.total_spent) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Worker Ranking -->
    <div v-if="!type || type === 'sales'" class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Sotuvchilar Reytingi</h3>
        <i class="pi pi-trophy text-orange-400"></i>
      </div>
      <div class="space-y-4">
        <div v-for="(w, idx) in workers.ranking" :key="w.worker_id" class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
               {{ idx + 1 }}
            </div>
            <div v-if="idx === 0" class="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-white">
              <i class="pi pi-star-fill"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-black text-slate-800 dark:text-white truncate">{{ w.name }}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ w.sales_count }} ta sotuv</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] font-black text-slate-800 dark:text-white">{{ formatPrice(w.revenue) }}</p>
            <p class="text-[9px] font-bold text-emerald-500">+{{ formatPrice(w.profit) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

defineProps({
  products:  { type: Object, default: () => ({}) },
  customers: { type: Object, default: () => ({}) },
  workers:   { type: Object, default: () => ({}) },
  type:      { type: String, default: '' }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)
</script>
