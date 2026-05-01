<template>
  <div class="space-y-4 animate-in">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <i class="pi pi-check-circle text-sm"></i>
          </div>
          <span class="text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('shifts.debt_info.paid_now') }}</span>
        </div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ formatCurrency(debtInfo.paid_now) }} <span class="text-xs font-medium text-slate-400">UZS</span>
        </h3>
      </div>
      
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <i class="pi pi-history text-sm"></i>
          </div>
          <span class="text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('shifts.debt_info.outstanding') }}</span>
        </div>
        <h3 class="text-xl font-black text-rose-500 tracking-tight">
          {{ formatCurrency(debtInfo.outstanding) }} <span class="text-xs font-medium text-slate-400">UZS</span>
        </h3>
      </div>
    </div>

    <!-- Customers List Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-users text-slate-400"></i> {{ $t('shifts.debt_info.title') }}
        </h3>
        <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[12px] font-bold text-slate-500 ">
          {{ $t('shifts.debt_info.count', { count: debtInfo.count }) }}
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 text-[12px] font-bold text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-3 font-semibold">{{ $t('shifts.debt_info.col_customer') }}</th>
              <th class="px-6 py-3 font-semibold text-right">{{ $t('shifts.debt_info.col_paid') }}</th>
              <th class="px-6 py-3 font-semibold text-right">{{ $t('shifts.debt_info.col_debt') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <tr v-for="(debt, idx) in debtInfo.customers" :key="idx" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td class="px-6 py-3.5 font-medium text-slate-900 dark:text-slate-200 max-w-[200px]">
                <div class="truncate text-xs" :title="debt.name">{{ debt.name }}</div>
              </td>
              <td class="px-6 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                {{ formatCurrency(debt.paid_amount) }}
              </td>
              <td class="px-6 py-3.5 text-right font-black text-rose-500">
                {{ formatCurrency(debt.debt_amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  debtInfo: { type: Object, required: true },
  formatCurrency: { type: Function, required: true }
})
</script>


