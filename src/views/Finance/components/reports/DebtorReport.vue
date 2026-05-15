<template>
  <div class="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <!-- Debtor Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
           <div class="absolute -right-2 -top-2 w-16 h-16 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
           <div class="flex items-center gap-3 relative z-10">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                 <i class="pi pi-users text-sm"></i>
              </div>
              <div>
                 <p class="text-[11px] font-bold tracking-widest text-slate-400 mb-0.5">{{ t('reports.debtor_customers') }}</p>
                 <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ data?.summary?.total_debtors || 0 }} ta</p>
              </div>
           </div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
           <div class="absolute -right-2 -top-2 w-16 h-16 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
           <div class="flex items-center gap-3 relative z-10">
              <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-500/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                 <i class="pi pi-money-bill text-sm"></i>
              </div>
              <div>
                 <p class="text-[11px] font-bold tracking-widest text-slate-400 mb-0.5">{{ t('reports.total_debt_amount') }}</p>
                 <p class="text-sm font-bold text-rose-500">{{ formatCurrency(data?.summary?.total_debt || 0) }}</p>
              </div>
           </div>
        </div>
    </div>

    <!-- Debtors Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
       <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
            <span class="text-[12px] font-bold tracking-widest text-slate-500">{{ t('reports.debtors_list') }}</span>
          </div>
       </div>
       
       <div class="overflow-x-auto max-h-[400px] custom-scrollbar overflow-y-auto">
          <table class="w-full text-left border-collapse">
             <thead>
                <tr class="text-[11px] font-bold tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                   <th class="px-4 py-3">{{ t('reports.customer_phone') }}</th>
                   <th class="px-4 py-3">{{ t('reports.last_sale') }}</th>
                   <th class="px-4 py-3">{{ t('reports.sales_count') }}</th>
                   <th class="px-4 py-3 text-right">{{ t('reports.debt_amount') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in (data?.results || [])" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                   <td class="px-4 py-3">
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">{{ item.name }}</span>
                        <span class="text-[11px] font-medium text-slate-400 tracking-widest mt-0.5">{{ item.phone || '—' }}</span>
                      </div>
                   </td>
                   <td class="px-4 py-3 text-[12px] font-medium text-slate-500">
                      {{ item.last_sale || '—' }}
                   </td>
                   <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 tracking-widest border border-slate-100 dark:border-slate-800/50">
                         {{ item.sales_count }} ta
                      </span>
                   </td>
                   <td class="px-4 py-3 text-right">
                      <span class="text-xs font-bold text-rose-500">{{ formatCurrency(item.debt_balance) }}</span>
                   </td>
                </tr>
                <tr v-if="!(data?.results?.length)">
                   <td colspan="4" class="px-4 py-12 text-center">
                      <p class="text-[12px] font-bold text-slate-400 tracking-widest">{{ t('reports.no_debtors_found') }}</p>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ items: [], total_debt: 0 })
  }
})

const formatCurrency = (value) => settingsStore.formatPrice(value)
</script>


