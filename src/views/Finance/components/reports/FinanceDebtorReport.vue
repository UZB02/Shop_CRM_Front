<template>
  <div class="space-y-4">
    <!-- Summary Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between overflow-hidden relative group">
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          <div>
            <p class="text-[12px] font-black tracking-[0.2em] text-slate-400 mb-1">{{ t('reports.total_debt_amount') }}</p>
            <h3 class="text-2xl font-black text-amber-600 tracking-tighter">{{ formatPrice(props.data?.summary?.total_debt || 0) }}</h3>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
             <i class="pi pi-history text-xl"></i>
          </div>
       </div>
       <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p class="text-[12px] font-black tracking-[0.2em] text-slate-400 mb-1">{{ t('reports.debtor_customers') }}</p>
            <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{{ props.data?.summary?.total_debtors || 0 }} ta</h3>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xl font-bold">
             #
          </div>
       </div>
    </div>

    <!-- Debtors Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
       <div class="overflow-x-auto">
          <table class="w-full text-left">
             <thead>
                <tr class="text-[11px] font-black tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/10">
                   <th class="px-6 py-4">{{ t('common.customer') }}</th>
                   <th class="px-6 py-4">{{ t('common.phone') }}</th>
                   <th class="px-6 py-4">{{ t('reports.debt_amount') }}</th>
                   <th class="px-6 py-4">{{ t('reports.last_sale') }}</th>
                   <th class="px-6 py-4">{{ t('reports.sales_count') }}</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="item in props.data?.results" :key="item.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                   <td class="px-6 py-4">
                      <span class="text-[14px] font-black text-slate-800 dark:text-slate-100">{{ item.name }}</span>
                   </td>
                   <td class="px-6 py-4 text-[13px] font-semibold text-slate-500">{{ item.phone || '—' }}</td>
                   <td class="px-6 py-4">
                      <span class="text-[14px] font-black text-amber-600">{{ formatPrice(item.debt_balance) }}</span>
                   </td>
                   <td class="px-6 py-4 text-[13px] font-bold text-slate-400">{{ item.last_sale }}</td>
                   <td class="px-6 py-4 text-[14px] font-semibold text-slate-500">{{ item.sales_count }}</td>
                </tr>
             </tbody>
          </table>
       </div>
       <div v-if="!props.data?.results?.length" class="p-12 text-center text-slate-400 italic text-sm">
          {{ t('reports.no_debtors_found') }}
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
  data: { type: Object, default: () => ({ items: [], total_debt: 0, debtors_count: 0 }) }
})

const formatPrice = (val) => settingsStore.formatPrice(val)
</script>


