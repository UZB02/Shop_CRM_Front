<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <!-- Total Suppliers -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
        <i class="pi pi-users text-emerald-500 text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-[11px] font-bold text-slate-400 tracking-widest uppercase truncate">{{ $t('suppliers.stats.total') }}</p>
        <p class="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">{{ totalCount }}</p>
      </div>
    </div>

    <!-- Total Debt -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
        <i class="pi pi-credit-card text-red-400 text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-[11px] font-bold text-slate-400 tracking-widest uppercase truncate">{{ $t('suppliers.stats.total_debt') }}</p>
        <p class="text-sm font-black text-red-500 leading-tight truncate">{{ formatMoney(totalDebt) }}</p>
      </div>
    </div>

    <!-- Active suppliers -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
        <i class="pi pi-check-circle text-blue-400 text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-[11px] font-bold text-slate-400 tracking-widest uppercase truncate">{{ $t('suppliers.stats.active') }}</p>
        <p class="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">{{ activeCount }}</p>
      </div>
    </div>

    <!-- Top debtor -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
        <i class="pi pi-arrow-up text-amber-400 text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-[11px] font-bold text-slate-400 tracking-widest uppercase truncate">{{ $t('suppliers.stats.top_debtor') }}</p>
        <p class="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight truncate">{{ topDebtor?.name || '—' }}</p>
        <p v-if="topDebtor" class="text-[11px] font-bold text-amber-500 truncate">{{ formatMoney(topDebtor.debt_balance) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalCount: { type: Number, default: 0 },
  activeCount: { type: Number, default: 0 },
  totalDebt: { type: [Number, String], default: 0 },
  topDebtor: { type: Object, default: null }
})

const formatMoney = (val) => {
  const n = Number(val) || 0
  return n.toLocaleString('uz-UZ') + ' UZS'
}
</script>
