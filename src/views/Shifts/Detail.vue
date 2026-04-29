<template>
  <div class="space-y-4">
    <!-- Header -->
    <ShiftPageHeader
      v-if="data?.smena"
      :status="data.smena.status"
      :branchName="data.smena.branch_name"
      :storeName="data.smena.store_name"
      @download="handleDownload"
    />

    <!-- Skeleton Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div class="md:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
         <div class="h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
      </div>
    </div>

    <template v-else-if="data">
      <div class="space-y-4 animate-in">
        
        <!-- Stats Top Board -->
        <TopBoard 
          :smena="data.smena" 
          :xReport="data.x_report" 
          :formatCurrency="formatCurrency" 
        />

        <!-- Detailed Section Tabs -->
        <div class="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit">
           <button 
             v-for="t in [
               { id: 'general', label: $t('shifts.tabs.general'), icon: 'pi-objects-column' },
               { id: 'debts',   label: $t('shifts.tabs.debts'),   icon: 'pi-history' },
               { id: 'finance', label: $t('shifts.tabs.finance'), icon: 'pi-wallet' }
             ]" 
             :key="t.id"
             @click="activeTab = t.id"
             class="px-4 py-2 rounded-xl text-xs font-bold tracking-widest flex items-center gap-2 transition-all"
             :class="activeTab === t.id 
               ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
               : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'"
           >
             <i class="pi" :class="t.icon"></i> {{ t.label }}
           </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-start anim-tab">
           
           <!-- Tab: General Contents -->
           <template v-if="activeTab === 'general'">
              <div class="lg:col-span-2 space-y-4 lg:order-1">
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
              </div>

              <!-- General Right Column Meta -->
              <div class="space-y-4 lg:order-2">
                 <CashBalance 
                    :xReport="data.x_report"
                    :formatCurrency="formatCurrency"
                 />
                 
                 <!-- Time & Personnel Details -->
                 <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <h3 class="text-xs font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                       <i class="pi pi-clock text-slate-400"></i> {{ $t('shifts.info.title') }}
                    </h3>
                    <div class="space-y-5">
                       <div class="flex gap-4">
                          <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20"><i class="pi pi-sign-in text-sm"></i></div>
                          <div class="min-w-0">
                             <p class="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.info.opened') }}</p>
                             <p class="text-xs font-semibold text-slate-800 dark:text-white truncate">{{ data.smena.start_time }}</p>
                             <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 truncate"><i class="pi pi-user text-[10px]"></i>{{ data.smena.worker_open_name }}</p>
                          </div>
                       </div>

                       <div class="flex gap-4">
                          <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-500/20"><i class="pi pi-sign-out text-sm"></i></div>
                          <div class="min-w-0">
                             <p class="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.info.closed') }}</p>
                             <p class="text-xs font-semibold text-slate-800 dark:text-white truncate">{{ data.smena.end_time || '-' }}</p>
                             <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 truncate"><i class="pi pi-user text-[10px]"></i>{{ data.smena.worker_close_name || '-' }}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <!-- Note -->
                 <div v-if="data.smena.description" class="bg-amber-50/50 dark:bg-amber-500/5 rounded-xl border border-amber-100/50 dark:border-amber-500/20 p-4 shadow-sm">
                    <h3 class="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 tracking-wider mb-2 flex items-center gap-1.5"><i class="pi pi-comment"></i> {{ $t('shifts.info.note') }}</h3>
                    <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">{{ data.smena.description }}</p>
                 </div>
              </div>
           </template>

           <!-- Tab: Debt List Details -->
           <template v-if="activeTab === 'debts'">
              <div class="lg:col-span-3">
                 <DebtDetails 
                    v-if="data.x_report.debt_info"
                    :debtInfo="data.x_report.debt_info"
                    :formatCurrency="formatCurrency"
                 />
                 <div v-else class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 italic text-sm">
                    {{ $t('common.no_results') }}
                 </div>
              </div>
           </template>

           <!-- Tab: Finance & Discounts -->
           <template v-if="activeTab === 'finance'">
              <div class="lg:col-span-2 space-y-4">
                 <DiscountBreakdown
                    v-if="data.x_report.discounts"
                    :xReport="data.x_report"
                    :formatCurrency="formatCurrency"
                 />
                 
                 <!-- Expenses Card -->
                 <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                       <i class="pi pi-receipt text-slate-400"></i> {{ $t('shifts.finance.title') }}
                    </h3>
                    <div class="p-8 text-center text-slate-400 italic text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/10">
                       {{ formatCurrency(data.x_report.expenses_total) }}
                    </div>
                 </div>
              </div>

              <!-- Right Sidebar for Finance -->
              <div class="space-y-4">
                 <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div class="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mb-4"><i class="pi pi-trash"></i></div>
                    <p class="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">{{ $t('shifts.finance.wastage') }}</p>
                    <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ data.x_report.wastage_count }} <span class="text-[10px] font-medium text-slate-400">{{ $t('shifts.finance.docs', { count: data.x_report.wastage_count }) }}</span></p>
                 </div>
              </div>
           </template>

        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="!loading" class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
       <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-500/20">
          <i class="pi pi-exclamation-triangle text-xl"></i>
       </div>
       <h3 class="text-sm font-semibold text-slate-800 dark:text-white mb-2">{{ $t('shifts.error.not_found') }}</h3>
       <p class="text-xs text-slate-500 mb-6 max-w-sm mx-auto">{{ $t('shifts.error.not_found_desc') }}</p>
       <button @click="$router.back()" class="h-9 px-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
          {{ $t('shifts.error.back') }}
       </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShiftDetail } from './composables/useShiftDetail'
import ShiftPageHeader from './components/ShiftPageHeader.vue'
import TopBoard from './components/detail/TopBoard.vue'
import PaymentBreakdown from './components/detail/PaymentBreakdown.vue'
import WorkersPerformance from './components/detail/WorkersPerformance.vue'
import CashBalance from './components/detail/CashBalance.vue'
import DiscountBreakdown from './components/detail/DiscountBreakdown.vue'
import DebtDetails from './components/detail/DebtDetails.vue'

const activeTab = ref('general')

const {
  loading,
  data,
  paymentMethods,
  methodLabels,
  dotClasses,
  progressClasses,
  formatCurrency,
  calculatePercent,
  handleDownload
} = useShiftDetail()
</script>

<style scoped>
.animate-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-tab { animation: tabIn 0.3s ease-out; }
@keyframes tabIn { from { opacity: 0; transform: translateX(5px); } to { opacity: 1; transform: translateX(0); } }

@media print {
  .bg-slate-50\/50, .dark\:bg-\[\#0B0F19\] { background-color: white !important; }
  .p-4, .p-6, .p-8 { padding: 0 !important; }
  button, i.pi-arrow-left { display: none !important; }
  .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #ddd !important; border-radius: 0 !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>

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
