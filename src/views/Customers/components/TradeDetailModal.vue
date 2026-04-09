<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Minimalist Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[6px] transition-opacity"
          @click="$emit('update:visible', false)"
        ></div>

        <!-- Premium Modal Wrapper -->
        <div class="relative w-full max-w-[850px] bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
          
          <!-- Header: Clean & Informative -->
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <i class="pi pi-receipt text-xl"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <h2 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('customers.trades.detail_title') }}</h2>
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 tracking-tight">#{{ trade.id }}</span>
                </div>
                <p class="text-xs text-slate-400 font-medium">{{ trade.created_on }}</p>
              </div>
            </div>
            
            <button 
              @click="$emit('update:visible', false)"
              class="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-400 flex items-center justify-center transition-all duration-200"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Layout Body -->
          <div class="flex flex-col md:flex-row overflow-hidden flex-grow">
            
            <!-- Left Side: Product List -->
            <div class="flex-grow p-8 overflow-y-auto custom-scrollbar">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.trades.items_title') }}</h3>
                <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">{{ trade.items?.length }} {{ $t('common.pcs') }}</span>
              </div>

              <div class="space-y-1">
                <div v-for="(item, idx) in trade.items" :key="idx" 
                     class="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 group-hover:scale-105 transition-transform">
                    <i class="pi pi-box text-xs"></i>
                  </div>
                  <div class="flex-grow min-w-0">
                    <h4 class="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">{{ item.product_name }}</h4>
                    <p class="text-[11px] text-slate-400 font-medium">
                      {{ parseFloat(item.quantity) }} {{ item.unit }} <span class="mx-1.5 opacity-30">×</span> {{ formatCurrency(item.unit_price) }}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-[13px] font-bold text-slate-800 dark:text-white">{{ formatCurrency(item.total_price) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Sidebar with Financial Summary -->
            <div class="w-full md:w-[320px] bg-slate-50/50 dark:bg-slate-900/40 border-l border-slate-100 dark:border-slate-800 p-8 flex flex-col justify-between shrink-0">
              
              <div class="space-y-8">
                <!-- Summary Section -->
                <div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">{{ $t('common.payment_summary') }}</h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-[11px] font-semibold text-slate-500">{{ $t('common.total_amount') }}</span>
                      <span class="text-[12px] font-bold text-slate-700 dark:text-slate-200">{{ formatCurrency(trade.total_price) }}</span>
                    </div>
                    <div v-if="parseFloat(trade.discount_amount) > 0" class="flex justify-between items-center">
                      <span class="text-[11px] font-semibold text-emerald-500">{{ $t('common.discount') }}</span>
                      <span class="text-[12px] font-bold text-emerald-500">-{{ formatCurrency(trade.discount_amount) }}</span>
                    </div>
                    <div class="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                      <div class="flex justify-between items-baseline">
                        <span class="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{{ $t('common.total_to_pay') }}</span>
                        <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatCurrency(trade.net_price) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Progress / Breakdown -->
                <div class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
                  <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('common.paid') }}</span>
                      <div class="flex items-center justify-between">
                        <span class="text-lg font-black text-emerald-500">{{ formatCurrency(trade.paid_amount) }}</span>
                        <TradeStatusBadge :status="trade.payment_type" :display-label="trade.payment_type_display" />
                      </div>
                    </div>

                    <div v-if="parseFloat(trade.debt_amount) > 0" class="pt-3 border-t border-slate-100 dark:border-slate-700/50">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('customers.details.debt') }}</span>
                      <p class="text-lg font-black text-rose-500 mt-0.5">{{ formatCurrency(trade.debt_amount) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Mixed Payment Breakdown Small -->
                <div v-if="trade.payment_type === 'mixed'" class="flex gap-4">
                   <div class="flex flex-col flex-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase mb-1">{{ $t('shifts.payment.cash_part') }}</span>
                      <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ formatCurrency(trade.cash_amount) }}</span>
                   </div>
                   <div class="flex flex-col flex-1 border-l border-slate-200 dark:border-slate-800 pl-4">
                      <span class="text-[9px] font-black text-slate-400 uppercase mb-1">{{ $t('shifts.payment.card_part') }}</span>
                      <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ formatCurrency(trade.card_amount) }}</span>
                   </div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between px-1 mb-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{{ $t('shifts.workers.col_worker') }}</span>
                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300">{{ trade.worker_name }}</span>
                  </div>
                  <button class="w-full h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[12px] font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 flex items-center justify-center gap-2">
                    <i class="pi pi-print text-xs"></i>
                    {{ $t('shifts.print') }}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import TradeStatusBadge from './TradeStatusBadge.vue'
import { useTradeUtils } from '../composables/useTradeUtils'

defineProps({
  visible: Boolean,
  trade: { type: Object, required: true }
})

defineEmits(['update:visible'])

const { formatCurrency } = useTradeUtils()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }

@media (max-width: 768px) {
  .md\:w-\[320px\] { 
    width: 100% !important; 
    border-left-width: 0 !important;
    border-top: 1px solid #f1f5f9; 
  }
  .dark .md\:w-\[320px\] {
    border-top-color: rgba(30, 41, 59, 0.5);
  }
}
</style>
