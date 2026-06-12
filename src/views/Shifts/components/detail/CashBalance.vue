<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">

    <!-- Card Header -->
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <i class="pi pi-wallet text-slate-500 dark:text-slate-400 text-sm"></i>
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-800 dark:text-white leading-none">{{ $t('shifts.cash.title') }}</h3>
        <p class="text-[11px] text-slate-400 mt-0.5">{{ $t('shifts.cash.subtitle') }}</p>
      </div>
    </div>

    <!-- Flow Section: Start → Income → Expected -->
    <div class="px-5 pt-5 pb-3">
      <!-- Boshlang'ich + Tushum Row -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <!-- Boshlang'ich kassa -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/60">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
              <i class="pi pi-sign-in text-[10px] text-slate-400"></i>
            </div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Boshlanish</span>
          </div>
          <p class="text-[15px] font-black text-slate-800 dark:text-white tabular-nums">{{ formatCurrency(xReport.cash_start) }}</p>
        </div>

        <!-- Naqd tushum -->
        <div class="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3.5 border border-emerald-100 dark:border-emerald-800/30">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/50 flex items-center justify-center">
              <i class="pi pi-arrow-down text-[10px] text-emerald-500"></i>
            </div>
            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Tushum</span>
          </div>
          <p class="text-[15px] font-black text-emerald-700 dark:text-emerald-400 tabular-nums">+ {{ formatCurrency(xReport.by_payment?.total_cash ?? xReport.by_payment?.cash) }}</p>
        </div>
      </div>

      <!-- Divider with equals sign -->
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
        <div class="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
          <i class="pi pi-equals text-[10px] text-slate-400"></i>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kutilayotgan</span>
        </div>
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700/50"></div>
      </div>

      <!-- Kutilayotgan qoldiq -->
      <div class="bg-slate-900 dark:bg-slate-800 rounded-xl px-4 py-3.5 flex items-center justify-between mb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <i class="pi pi-calculator text-white/70 text-xs"></i>
          </div>
          <span class="text-[13px] font-bold text-slate-300">{{ $t('shifts.cash.expected') }}</span>
        </div>
        <span class="text-[17px] font-black text-white tabular-nums">{{ formatCurrency(xReport.expected_cash) }}</span>
      </div>
    </div>

    <!-- Separator -->
    <div class="mx-5 border-t border-dashed border-slate-200 dark:border-slate-700/50"></div>

    <!-- Actual Count Section -->
    <div class="px-5 pt-3 pb-5 space-y-2">

      <!-- Yakuniy kassa (sanalgan) -->
      <div class="rounded-xl px-4 py-3.5 flex items-center justify-between border bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/40">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
            <i class="pi pi-check text-emerald-600 dark:text-emerald-400 text-xs"></i>
          </div>
          <div>
            <p class="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">{{ $t('shifts.cash.end') }}</p>
            <p class="text-[11px] text-emerald-500/70 dark:text-emerald-600">{{ $t('shifts.cash.counted') }}</p>
          </div>
        </div>
        <span class="text-[17px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ formatCurrency(xReport.cash_end ?? xReport.expected_cash) }}</span>
      </div>

      <!-- Kassa farqi — ZERO: Ideal holat -->
      <div
        v-if="!xReport.cash_difference || parseFloat(xReport.cash_difference) === 0"
        class="rounded-xl px-4 py-3 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30"
      >
        <i class="pi pi-check-circle text-emerald-500 text-base shrink-0"></i>
        <span class="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">Kassa to'g'ri — farq yo'q ✅</span>
      </div>

      <!-- Kassa farqi — SHORTAGE: Kamomad -->
      <div
        v-else-if="parseFloat(xReport.cash_difference) < 0"
        class="rounded-xl border border-rose-200 dark:border-rose-800/40 overflow-hidden"
      >
        <!-- Farq header -->
        <div class="px-4 py-3 bg-rose-600 dark:bg-rose-900/40 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <i class="pi pi-arrow-down-right text-white text-xs"></i>
            </div>
            <div>
              <p class="text-[13px] font-bold text-white">{{ $t('shifts.cash.difference') }}</p>
              <p class="text-[11px] text-rose-200">{{ $t('shifts.cash.shortage') }}</p>
            </div>
          </div>
          <span class="text-[19px] font-black text-white tabular-nums">{{ formatCurrency(xReport.cash_difference) }}</span>
        </div>
        <!-- Sababi -->
        <div v-if="xReport.discrepancy_reason" class="px-4 py-3 bg-rose-50 dark:bg-rose-900/10 flex items-start gap-2.5">
          <i class="pi pi-comment text-rose-400 text-sm mt-0.5 shrink-0"></i>
          <div>
            <p class="text-[11px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">{{ $t('shifts.cash.reason') }}</p>
            <p class="text-[13px] font-medium text-rose-700 dark:text-rose-300 leading-snug">{{ xReport.discrepancy_reason }}</p>
          </div>
        </div>
      </div>

      <!-- Kassa farqi — SURPLUS: Ortiqcha -->
      <div
        v-else
        class="rounded-xl border border-amber-200 dark:border-amber-800/40 overflow-hidden"
      >
        <!-- Farq header -->
        <div class="px-4 py-3 bg-amber-500 dark:bg-amber-900/40 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <i class="pi pi-arrow-up-right text-white text-xs"></i>
            </div>
            <div>
              <p class="text-[13px] font-bold text-white">{{ $t('shifts.cash.difference') }}</p>
              <p class="text-[11px] text-amber-100">{{ $t('shifts.cash.surplus') }}</p>
            </div>
          </div>
          <span class="text-[19px] font-black text-white tabular-nums">+{{ formatCurrency(xReport.cash_difference) }}</span>
        </div>
        <!-- Sababi -->
        <div v-if="xReport.discrepancy_reason" class="px-4 py-3 bg-amber-50 dark:bg-amber-900/10 flex items-start gap-2.5">
          <i class="pi pi-comment text-amber-400 text-sm mt-0.5 shrink-0"></i>
          <div>
            <p class="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">{{ $t('shifts.cash.reason') }}</p>
            <p class="text-[13px] font-medium text-amber-700 dark:text-amber-300 leading-snug">{{ xReport.discrepancy_reason }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  xReport: { type: Object, required: true },
  formatCurrency: { type: Function, required: true }
})
</script>
