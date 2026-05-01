<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
     <!-- Meta Header -->
     <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/10">
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
           <div>
              <p class="text-[12px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.branch') }}</p>
              <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ smena.branch_name }}</p>
           </div>
           <div v-if="smena.store_name" class="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
           <div v-if="smena.store_name">
              <p class="text-[12px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.store') }}</p>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-400">{{ smena.store_name }}</p>
           </div>
        </div>
        <div class="md:text-right border-t border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:border-0 md:pl-6 md:border-l">
           <p class="text-[12px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.period') }}</p>
           <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ xReport.period.start }} <span class="text-slate-400 mx-1">—</span> {{ xReport.period.end }}</p>
        </div>
     </div>

     <!-- Multi-column Stats -->
     <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        <div class="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><i class="pi pi-shopping-cart text-[12px]"></i></div>
              <span class="text-[12px] font-bold text-slate-400 tracking-wider">{{ $t('shifts.stats.total_sales') }}</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-2">
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{{ formatCurrency(xReport.sales_total) }}</h3>
              <span class="text-[12px] font-bold text-slate-400 ">UZS</span>
           </div>
           <p class="text-[12px] font-medium text-slate-400 mt-1">{{ $t('shifts.stats.transactions', { count: xReport.sales_count }) }}</p>
        </div>

        <div class="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center"><i class="pi pi-chart-line text-[12px]"></i></div>
              <span class="text-[12px] font-bold text-slate-400 tracking-wider">{{ $t('shifts.stats.net_sales') }}</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-2">
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{{ formatCurrency(xReport.net_sales_total) }}</h3>
              <span class="text-[12px] font-bold text-slate-400 ">UZS</span>
           </div>
        </div>

         <div class="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center"><i class="pi pi-refresh text-[12px]"></i></div>
              <span class="text-[12px] font-bold text-slate-400 tracking-wider">{{ $t('shifts.stats.returns') }}</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-2">
              <h3 class="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{{ formatCurrency(xReport.returns_total) }}</h3>
              <span class="text-[12px] font-bold text-slate-400 ">UZS</span>
           </div>
           <p class="text-[12px] font-medium text-slate-400 mt-1">{{ $t('shifts.stats.operations', { count: xReport.returns_count }) }}</p>
        </div>

        <div class="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
               <div class="w-6 h-6 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center"><i class="pi pi-wallet text-[12px]"></i></div>
               <span class="text-[12px] font-bold text-slate-400 tracking-wider">{{ $t('shifts.stats.net_income') }}</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-2">
               <h3 class="text-xl font-semibold text-amber-600 dark:text-amber-500 tracking-tight">{{ formatCurrency(xReport.net_income) }}</h3>
               <span class="text-[12px] font-bold text-amber-500/60 ">UZS</span>
           </div>
        </div>
     </div>
  </div>
</template>


<script setup>
defineProps({
  smena: { type: Object, required: true },
  xReport: { type: Object, required: true },
  formatCurrency: { type: Function, required: true }
})
</script>


