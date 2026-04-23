<template>
  <div class="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Debtor Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden group">
           <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
           <div class="flex items-center gap-4 relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-transform duration-500 group-hover:scale-110">
                 <i class="pi pi-users text-lg"></i>
              </div>
              <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Qarzdor mijozlar</p>
                 <p class="text-xl font-black text-slate-800 dark:text-slate-100">{{ data?.debtors_count || 0 }} ta</p>
              </div>
           </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden group">
           <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
           <div class="flex items-center gap-4 relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-500/20 shadow-sm transition-transform duration-500 group-hover:scale-110">
                 <i class="pi pi-money-bill text-lg"></i>
              </div>
              <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Umumiy qarz summasi</p>
                 <p class="text-xl font-black text-rose-500">{{ formatCurrency(data?.total_debt || 0) }}</p>
              </div>
           </div>
        </div>
    </div>

    <!-- Debtors Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
       <div class="px-5 sm:px-8 py-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-3">
            <div class="w-2 h-6 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Qarzdorlar ro'yxati</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/10">Min: 0.01 UZS</span>
       </div>
       
       <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                   <th class="px-5 sm:px-8 py-5">Mijoz / Telefon</th>
                   <th class="px-5 sm:px-8 py-5">Oxirgi savdo</th>
                   <th class="px-5 sm:px-8 py-5">Savdolar soni</th>
                   <th class="px-5 sm:px-8 py-5 text-right">Qarz summasi</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in (data?.items || [])" :key="item.customer_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all duration-300 group">
                   <td class="px-5 sm:px-8 py-5">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">{{ item.name }}</span>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ item.phone || '—' }}</span>
                      </div>
                   </td>
                   <td class="px-5 sm:px-8 py-5 text-sm font-bold text-slate-500">
                      {{ item.last_sale_date || '—' }}
                   </td>
                   <td class="px-5 sm:px-8 py-5">
                      <span class="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-800/50">
                         {{ item.sales_count }} ta savdo
                      </span>
                   </td>
                   <td class="px-5 sm:px-8 py-5 text-right">
                      <span class="text-base font-black text-rose-500">{{ formatCurrency(item.debt_balance) }}</span>
                   </td>
                </tr>
                <tr v-if="!(data?.items?.length)">
                   <td colspan="4" class="px-8 py-20 text-center">
                      <div class="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800 mb-6">
                        <i class="pi pi-filter-slash text-2xl text-slate-300"></i>
                      </div>
                      <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Qarzdorlar topilmadi</p>
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
