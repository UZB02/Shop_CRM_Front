<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
     <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <i class="pi pi-box text-slate-400"></i> {{ $t('shifts.cash.title') }}
     </h3>
     <div class="space-y-3 relative">
        <div class="absolute left-3.5 top-5 bottom-8 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div class="flex justify-between items-start relative z-10">
           <div class="flex items-start gap-4">
              <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 text-slate-400 shrink-0 mt-[-4px]">
                 <div class="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              </div>
              <div>
                 <p class="text-[12px] font-bold tracking-wider text-slate-500">{{ $t('shifts.cash.start') }}</p>
                 <p class="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-0.5">{{ formatCurrency(xReport.cash_start) }}</p>
              </div>
           </div>
        </div>

         <div class="flex justify-between items-start relative z-10 pt-2">
           <div class="flex items-start gap-4">
              <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 text-emerald-500 shrink-0 mt-[-4px]">
                 <i class="pi pi-plus text-[12px]"></i>
              </div>
              <div>
                 <p class="text-[12px] font-bold tracking-wider text-slate-500">{{ $t('shifts.cash.income') }}</p>
                 <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+ {{ formatCurrency(xReport.by_payment.total_cash ?? xReport.by_payment.cash) }}</p>
              </div>
           </div>
        </div>
        
        <div class="pt-4 mt-2">
           <div class="bg-emerald-50 dark:bg-emerald-500/5 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/20 flex justify-between items-center">
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-500 tracking-wider">{{ $t('shifts.cash.end') }}</span>
              <span class="text-lg font-black text-emerald-600 tracking-tight">{{ formatCurrency(xReport.cash_end ?? xReport.expected_cash) }}</span>
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


