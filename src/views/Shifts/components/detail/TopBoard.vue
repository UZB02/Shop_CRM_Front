<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
     <!-- Meta Header -->
     <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
           <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Filial</p>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ smena.branch_name }}</p>
           </div>
           <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
           <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Do'kon</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ smena.store_name }}</p>
           </div>
        </div>
        <div class="md:text-right border-t border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:border-0 md:pl-6 md:border-l">
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Xisobot Davri</p>
           <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ xReport.period.start }} <span class="text-slate-400 mx-1">—</span> {{ xReport.period.end }}</p>
        </div>
     </div>

     <!-- Multi-column Stats -->
     <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        <div class="p-5 xl:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><i class="pi pi-shopping-cart text-xs"></i></div>
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Umumiy Savdo</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-3">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ formatCurrency(xReport.sales_total) }}</h3>
              <span class="text-[10px] font-bold text-slate-400 uppercase">UZS</span>
           </div>
           <p class="text-[10px] font-medium text-slate-400 mt-2">{{ xReport.sales_count }} ta tranzaksiya</p>
        </div>

        <div class="p-5 xl:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center"><i class="pi pi-chart-line text-xs"></i></div>
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Sof Savdo</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-3">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ formatCurrency(xReport.net_sales_total) }}</h3>
              <span class="text-[10px] font-bold text-slate-400 uppercase">UZS</span>
           </div>
        </div>

         <div class="p-5 xl:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
           <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center"><i class="pi pi-refresh text-xs"></i></div>
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Qaytarishlar</span>
           </div>
           <div class="flex items-baseline gap-1.5 mt-3">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ formatCurrency(xReport.returns_total) }}</h3>
              <span class="text-[10px] font-bold text-slate-400 uppercase">UZS</span>
           </div>
           <p class="text-[10px] font-medium text-slate-400 mt-2">{{ xReport.returns_count }} ta operatsiya</p>
        </div>

        <div class="p-5 xl:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors relative overflow-hidden group">
           <div class="absolute -right-4 -bottom-4 opacity-[0.03] scale-150 rotate-12 transition-transform group-hover:scale-[1.7] pointer-events-none">
              <i class="pi pi-wallet text-7xl text-amber-500"></i>
           </div>
           <div class="relative z-10">
              <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center"><i class="pi pi-wallet text-xs"></i></div>
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Sof Foyda</span>
              </div>
              <div class="flex items-baseline gap-1.5 mt-3">
                  <h3 class="text-2xl font-black text-amber-600 dark:text-amber-500 tracking-tight">{{ formatCurrency(xReport.net_income) }}</h3>
                  <span class="text-[10px] font-bold text-amber-500/60 uppercase">UZS</span>
              </div>
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
