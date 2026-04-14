<template>
  <div class="space-y-4 animate-in fade-in duration-500">
    <!-- Debtor Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
       <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-500/20">
             <i class="pi pi-users text-sm"></i>
          </div>
          <div>
             <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Qarzdor mijozlar</p>
             <p class="text-base font-black text-slate-800 dark:text-slate-100">{{ data?.debtors_count || 0 }} ta</p>
          </div>
       </div>

       <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-500/20">
             <i class="pi pi-money-bill text-sm"></i>
          </div>
          <div>
             <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Umumiy qarz summasi</p>
             <p class="text-base font-black text-rose-500">{{ formatCurrency(data?.total_debt || 0) }}</p>
          </div>
       </div>
    </div>

    <!-- Debtors Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
       <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">Qarzdorlar ro'yxati</h3>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600">Min: 0.01 UZS</span>
       </div>
       
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-800/20">
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Mijoz</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Telefon</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Oxirgi savdo</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Savdolar</th>
                   <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Qarz summasi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in (data?.items || [])" :key="item.customer_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                   <td class="px-6 py-4">
                      <p class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ item.name }}</p>
                   </td>
                   <td class="px-6 py-4">
                      <span class="text-[10px] font-medium text-slate-500">{{ item.phone || '—' }}</span>
                   </td>
                   <td class="px-6 py-4 text-xs text-slate-500">
                      {{ item.last_sale_date || '—' }}
                   </td>
                   <td class="px-6 py-4">
                      <span class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                         {{ item.sales_count }} ta
                      </span>
                   </td>
                   <td class="px-6 py-4 text-right">
                      <span class="text-xs font-black text-rose-500">{{ formatCurrency(item.debt_balance) }}</span>
                   </td>
                </tr>
                <tr v-if="!(data?.items?.length)">
                   <td colspan="5" class="px-6 py-12 text-center">
                      <i class="pi pi-filter-slash text-2xl text-slate-200 mb-3 block"></i>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qarzdorlar topilmadi</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ items: [], total_debt: 0 })
  }
})

const formatCurrency = (value) => settingsStore.formatPrice(value)
</script>
