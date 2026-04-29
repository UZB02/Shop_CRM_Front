<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
     <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <i class="pi pi-percentage text-slate-400"></i> {{ $t('shifts.discounts.title') }}
     </h3>
     <div class="space-y-4">
        <!-- Catalog Discount -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
               {{ $t('shifts.discounts.catalog') }}
            </span>
            <span class="text-sm font-bold text-slate-800 dark:text-white">
               {{ formatCurrency(xReport.discounts?.catalog_discount || 0) }}
            </span>
        </div>
        
        <!-- Sale Discount -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
               {{ $t('shifts.discounts.sale') }}
            </span>
            <span class="text-sm font-bold text-slate-800 dark:text-white">
               {{ formatCurrency(xReport.discounts?.sale_discount || 0) }}
            </span>
        </div>

        <!-- Total Discount -->
        <div class="flex items-center justify-between p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mt-2">
            <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
               {{ $t('shifts.discounts.total') }}
            </span>
            <span class="text-base font-black text-indigo-600 dark:text-indigo-500 tracking-tight">
               - {{ formatCurrency(xReport.discounts?.total_discount || 0) }}
            </span>
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
