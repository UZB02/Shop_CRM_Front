<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
     <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <i class="pi pi-chart-pie text-slate-400"></i> {{ $t('shifts.payment.title') }}
     </h3>
     
     <!-- Progress Bar Segmented -->
     <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-6 shadow-inner">
        <div v-for="method in paymentMethods" :key="'bar-'+method"
            v-show="calculatePercent(xReport.by_payment[method]) > 0"
            :style="{ width: calculatePercent(xReport.by_payment[method]) + '%' }"
            :class="progressClasses[method]"
            class="h-full transition-all duration-1000 first:rounded-l-full last:rounded-r-full"></div>
     </div>

     <!-- Payment Grid -->
     <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="method in paymentMethods" :key="method" class="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800 transition-colors">
           <div class="flex flex-col h-full justify-between gap-3">
              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full shadow-sm" :class="dotClasses[method]"></div>
                    <span class="text-[10px] font-bold text-slate-500 tracking-wider">{{ methodLabels[method] }}</span>
                 </div>
              </div>
              <div>
                 <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ formatCurrency(xReport.by_payment[method]) }}</p>
                 <p class="text-[10px] font-semibold text-slate-400 mt-0.5">{{ calculatePercent(xReport.by_payment[method]) }}%</p>
                 <div v-if="(method === 'mixed' || method === 'debt') && xReport.by_payment[method + '_cash'] !== undefined" class="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 flex-none">
                    <div class="flex items-center justify-between">
                       <span class="text-[9px] font-semibold text-slate-400">{{ $t('shifts.payment.cash_part') }}:</span>
                       <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300">{{ formatCurrency(xReport.by_payment[method + '_cash']) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                       <span class="text-[9px] font-semibold text-slate-400">{{ $t('shifts.payment.card_part') }}:</span>
                       <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300">{{ formatCurrency(xReport.by_payment[method + '_card']) }}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
</template>

<script setup>
defineProps({
  xReport: { type: Object, required: true },
  paymentMethods: { type: Array, required: true },
  methodLabels: { type: Object, required: true },
  dotClasses: { type: Object, required: true },
  progressClasses: { type: Object, required: true },
  calculatePercent: { type: Function, required: true },
  formatCurrency: { type: Function, required: true }
})
</script>
