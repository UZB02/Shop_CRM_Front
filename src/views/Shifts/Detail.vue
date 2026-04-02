<template>
  <div class="p-4 sm:p-6 animate-in fade-in duration-500">
    <!-- Header with Back Button -->
    <div class="max-w-[1200px] mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
       <div class="flex items-center gap-4">
          <button 
            @click="$router.back()" 
            class="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <i class="pi pi-arrow-left text-sm text-slate-500"></i>
          </button>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
               <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{{ $t('shifts.report_title') }}</h1>
               <span v-if="data?.smena" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ml-2"
                     :class="data.smena.status === 'closed' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'">
                  {{ $t(`shifts.status.${data.smena.status}`) }}
               </span>
            </div>
          </div>
       </div>
       <div v-if="data?.smena">
         <button @click="handlePrint" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
            <i class="pi pi-print text-slate-400"></i>
            {{ $t('shifts.print') }}
          </button>
       </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="loading" class="max-w-[1200px] mx-auto space-y-4">
      <div class="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div class="md:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
         <div class="h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
      </div>
    </div>

    <template v-else-if="data">
      <div class="max-w-[1200px] mx-auto space-y-4">
        
        <TopBoard 
          :smena="data.smena" 
          :xReport="data.x_report" 
          :formatCurrency="formatCurrency" 
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-start">
           
           <!-- Left Column: Payments & Workers -->
           <div class="lg:col-span-2 space-y-4">
              <PaymentBreakdown 
                 :xReport="data.x_report" 
                 :paymentMethods="paymentMethods"
                 :methodLabels="methodLabels"
                 :dotClasses="dotClasses"
                 :progressClasses="progressClasses"
                 :calculatePercent="calculatePercent"
                 :formatCurrency="formatCurrency"
              />

              <WorkersPerformance 
                 v-if="data.x_report.by_worker?.length > 0"
                 :workers="data.x_report.by_worker"
                 :formatCurrency="formatCurrency"
              />
              
              <!-- Additional Expenses / Wastage (Compact) -->
              <div class="grid grid-cols-2 gap-4">
                 <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0"><i class="pi pi-receipt"></i></div>
                    <div class="min-w-0">
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-0.5">{{ $t('shifts.expenses.title') }}</p>
                       <p class="text-sm font-black text-slate-900 dark:text-white truncate">{{ formatCurrency(data.x_report.expenses_total) }} <span class="text-[10px] font-medium text-slate-400">UZS</span></p>
                    </div>
                 </div>
                 <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0"><i class="pi pi-trash"></i></div>
                    <div class="min-w-0">
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-0.5">{{ $t('shifts.expenses.wastage') }}</p>
                       <p class="text-sm font-black text-slate-900 dark:text-white truncate">{{ data.x_report.wastage_count }} <span class="text-[10px] font-medium text-slate-400">{{ $t('shifts.expenses.docs', { count: data.x_report.wastage_count }) }}</span></p>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Column: Meta info -->
           <div class="space-y-4">
              <CashBalance 
                 :xReport="data.x_report"
                 :formatCurrency="formatCurrency"
              />

              <!-- Time & Personnel Details -->
              <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                 <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <i class="pi pi-clock text-slate-400"></i> {{ $t('shifts.info.title') }}
                 </h3>
                 <div class="space-y-5">
                    <div class="flex gap-4">
                       <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20"><i class="pi pi-sign-in text-sm"></i></div>
                       <div class="min-w-0">
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{{ $t('shifts.info.opened') }}</p>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ data.smena.start_time }}</p>
                          <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 truncate"><i class="pi pi-user text-[10px]"></i>{{ data.smena.worker_open_name }}</p>
                       </div>
                    </div>

                    <div class="flex gap-4">
                       <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-500/20"><i class="pi pi-sign-out text-sm"></i></div>
                       <div class="min-w-0">
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{{ $t('shifts.info.closed') }}</p>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ data.smena.end_time || '-' }}</p>
                          <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 truncate"><i class="pi pi-user text-[10px]"></i>{{ data.smena.worker_close_name || '-' }}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Note -->
              <div v-if="data.smena.description" class="bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100/50 dark:border-amber-500/20 p-5 shadow-sm">
                 <h3 class="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-wider mb-2 flex items-center gap-1.5"><i class="pi pi-comment"></i> {{ $t('shifts.info.note') }}</h3>
                 <p class="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed italic">{{ data.smena.description }}</p>
              </div>

           </div>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else class="max-w-[1200px] mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
       <div class="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-500/20">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
       </div>
       <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">{{ $t('shifts.error.not_found') }}</h3>
       <p class="text-xs text-slate-500 mb-6 max-w-sm mx-auto">{{ $t('shifts.error.not_found_desc') }}</p>
       <button @click="$router.back()" class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
          {{ $t('shifts.error.back') }}
       </button>
    </div>
  </div>
</template>

<script setup>
import { useShiftDetail } from './composables/useShiftDetail'
import TopBoard from './components/detail/TopBoard.vue'
import PaymentBreakdown from './components/detail/PaymentBreakdown.vue'
import WorkersPerformance from './components/detail/WorkersPerformance.vue'
import CashBalance from './components/detail/CashBalance.vue'

const {
  loading,
  data,
  paymentMethods,
  methodLabels,
  dotClasses,
  progressClasses,
  formatCurrency,
  calculatePercent,
  handlePrint
} = useShiftDetail()
</script>

<style scoped>
.animate-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media print {
  .bg-slate-50\/50, .dark\:bg-\[\#0B0F19\] { background-color: white !important; }
  .p-4, .p-6, .p-8 { padding: 0 !important; }
  button, i.pi-arrow-left { display: none !important; }
  .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #ddd !important; border-radius: 0 !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
