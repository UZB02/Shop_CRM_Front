<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/20 transition-all">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <i class="pi pi-briefcase text-[12px]"></i>
        </div>
        <h4 class="text-[11px] font-black text-slate-400 tracking-widest leading-none">{{ $t('customers.details.trades_count', { count: '' }).trim() }}</h4>
      </div>
      <p class="text-xl font-black text-slate-800 dark:text-white">{{ purchaseCount }}</p>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/20 transition-all">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
          <i class="pi pi-users text-[12px]"></i>
        </div>
        <h4 class="text-[11px] font-black text-slate-400 tracking-widest leading-none">{{ $t('customers.details.group') }}</h4>
      </div>
      <p class="text-xl font-black text-slate-800 dark:text-white truncate">{{ groupName || '—' }}</p>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-rose-500/20 transition-all">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
          <i class="pi pi-exclamation-circle text-[12px]"></i>
        </div>
        <h4 class="text-[11px] font-black text-slate-400 tracking-widest leading-none">{{ $t('customers.details.financial_status') }}</h4>
      </div>
      <p :class="['text-[13px] font-black tracking-tight', debtBalance > 0 ? 'text-rose-500' : 'text-emerald-500']">
        {{ debtBalance > 0 ? $t('customers.details.debt') : $t('customers.details.no_debt') }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  purchaseCount: [Number, String],
  groupName: String,
  debtBalance: [Number, String]
})
</script>


