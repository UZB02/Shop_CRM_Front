<template>
  <div class="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
     <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <i class="pi pi-box text-slate-400"></i> {{ $t('shifts.cash.title') }}
     </h3>
     
     <div class="relative">
        <!-- The continuous vertical timeline line -->
        <div class="absolute left-[11px] top-3 bottom-12 w-[2px] bg-slate-200 dark:bg-slate-700/50 z-0"></div>

        <div class="space-y-6">
           <!-- Items container with left padding to align with timeline -->
           <div class="space-y-6 pl-[34px] relative z-10">
              <!-- Boshlang'ich kassa -->
              <div class="relative">
                 <!-- Timeline node -->
                 <div class="absolute -left-[34px] top-1 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-[#0f172a] shrink-0">
                    <div class="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                 </div>
                 <div>
                    <p class="text-[13px] font-bold text-slate-500 dark:text-slate-400">{{ $t('shifts.cash.start') }}</p>
                    <p class="text-[15px] font-bold text-slate-900 dark:text-white mt-1">{{ formatCurrency(xReport.cash_start) }}</p>
                 </div>
              </div>

              <!-- Tushum -->
              <div class="relative">
                 <div class="absolute -left-[34px] top-1 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-[#0f172a] text-emerald-500 shrink-0">
                    <i class="pi pi-plus text-[10px] font-black"></i>
                 </div>
                 <div>
                    <p class="text-[13px] font-bold text-slate-500 dark:text-slate-400">{{ $t('shifts.cash.income') }}</p>
                    <p class="text-[15px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">+ {{ formatCurrency(xReport.by_payment.total_cash ?? xReport.by_payment.cash) }}</p>
                 </div>
              </div>
           </div>

           <!-- Cards Section -->
           <div class="space-y-2 relative z-10 pt-2">
              <!-- Kutilayotgan qoldiq -->
              <div class="bg-slate-50/80 dark:bg-[#1e293b]/40 rounded-[14px] pl-[34px] pr-4 py-4 border border-slate-200 dark:border-slate-700/50 flex justify-between items-center backdrop-blur-md">
                 <span class="text-[13px] font-bold text-slate-600 dark:text-slate-400">{{ $t('shifts.cash.expected') }}</span>
                 <span class="text-base font-bold text-slate-800 dark:text-white">{{ formatCurrency(xReport.expected_cash) }}</span>
              </div>
              
              <!-- Yakuniy kassa -->
              <div class="bg-emerald-50/80 dark:bg-emerald-900/10 rounded-[14px] pl-[34px] pr-4 py-4 border border-emerald-200/60 dark:border-emerald-800/40 flex justify-between items-center backdrop-blur-md">
                 <span class="text-[13px] font-bold text-emerald-700 dark:text-emerald-500">
                    {{ $t('shifts.cash.end') }} <span class="opacity-60 text-[11px] ml-1">({{ $t('shifts.cash.counted') }})</span>
                 </span>
                 <span class="text-[17px] font-black text-emerald-600 dark:text-emerald-500">{{ formatCurrency(xReport.cash_end ?? xReport.expected_cash) }}</span>
              </div>

              <!-- Kassa farqi (Agar farq bo'lsa) -->
              <div v-if="xReport.cash_difference && parseFloat(xReport.cash_difference) !== 0" 
                   class="rounded-[14px] pl-[34px] pr-4 py-4 border flex justify-between items-start backdrop-blur-md"
                   :class="parseFloat(xReport.cash_difference) < 0 ? 'bg-rose-50/80 dark:bg-rose-900/10 border-rose-200/60 dark:border-rose-900/30' : 'bg-amber-50/80 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-900/30'"
              >
                 <div class="flex flex-col gap-2.5">
                   <span class="text-[13px] font-bold" :class="parseFloat(xReport.cash_difference) < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'">
                     {{ $t('shifts.cash.difference') }} ({{ parseFloat(xReport.cash_difference) < 0 ? $t('shifts.cash.shortage') : $t('shifts.cash.surplus') }})
                   </span>
                   <div v-if="xReport.discrepancy_reason" class="text-[13px] font-bold" :class="parseFloat(xReport.cash_difference) < 0 ? 'text-rose-500/90 dark:text-rose-300' : 'text-amber-500/90 dark:text-amber-300'">
                     {{ $t('shifts.cash.reason') }}: <span class="font-medium">{{ xReport.discrepancy_reason }}</span>
                   </div>
                 </div>
                 <span class="text-[17px] font-black shrink-0" :class="parseFloat(xReport.cash_difference) < 0 ? 'text-rose-600 dark:text-rose-500' : 'text-amber-600 dark:text-amber-500'">
                   {{ parseFloat(xReport.cash_difference) > 0 ? '+' : '' }}{{ formatCurrency(xReport.cash_difference) }}
                 </span>
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


