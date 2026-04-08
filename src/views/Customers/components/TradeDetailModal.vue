<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          @click="$emit('update:visible', false)"
        ></div>

        <!-- Modal Container -->
        <div class="relative w-full max-w-[620px] bg-slate-50 dark:bg-slate-950 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 dark:border-slate-800 flex flex-col max-h-[90vh]">
          
          <!-- Close Button -->
          <button 
            @click="$emit('update:visible', false)"
            class="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10"
          >
            <i class="pi pi-times text-xs"></i>
          </button>

          <!-- Header -->
          <div class="p-6 pb-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden shrink-0">
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#grid-custom)" /></svg>
            </div>
            
            <div class="relative z-10 flex flex-col items-center">
              <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-xl">
                <i class="pi pi-receipt text-lg text-white"></i>
              </div>
              <h2 class="text-[10px] font-black text-white uppercase tracking-[4px] mb-1.5 drop-shadow-sm">{{ $t('customers.trades.detail_title') }}</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] font-black text-indigo-200 tracking-tight">#{{ trade.id }}</span>
                <div class="w-1 h-1 rounded-full bg-white/20"></div>
                <span class="text-[10px] font-bold text-white/50 tracking-tight">{{ trade.created_on }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 -mt-6 pb-6 relative z-20 overflow-y-auto custom-scrollbar flex-grow">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
              <!-- Items -->
              <div class="md:col-span-7 flex flex-col gap-4">
                <div class="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800/50 flex flex-col h-full min-h-[300px]">
                  <div class="px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-[2px]">{{ $t('customers.trades.items_title') }}</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-[9px] font-black text-indigo-500 uppercase">{{ trade.items?.length || 0 }}</span>
                  </div>
                  <div class="flex-grow">
                    <div v-for="(item, idx) in trade.items" :key="idx" 
                         class="flex items-start justify-between p-4 border-b border-slate-50 last:border-0">
                      <div class="flex flex-col gap-0.5 min-w-0 pr-4">
                        <span class="text-[11px] font-black text-slate-800 dark:text-white mb-1">{{ item.product_name }}</span>
                        <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                          <span class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">{{ parseFloat(item.quantity) }} {{ item.unit }}</span>
                          <span>×</span>
                          <span>{{ formatCurrency(item.unit_price) }}</span>
                        </div>
                      </div>
                      <span class="text-[11px] font-black text-slate-900 dark:text-white shrink-0 mt-0.5">{{ formatCurrency(item.total_price) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Financials -->
              <div class="md:col-span-5 flex flex-col gap-5">
                <div class="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
                  <div class="space-y-3.5 text-[10px] font-bold text-slate-400">
                    <div class="flex justify-between uppercase"><span>{{ $t('customers.trades.col_total') }}</span><span>{{ formatCurrency(trade.total_price) }}</span></div>
                    <div v-if="parseFloat(trade.discount_amount) > 0" class="flex justify-between text-emerald-500 uppercase"><span>Chegirma</span><span>-{{ formatCurrency(trade.discount_amount) }}</span></div>
                    <div class="h-px bg-slate-50 dark:bg-slate-800"></div>
                    <div class="flex flex-col gap-1.5">
                      <span class="uppercase tracking-[2px]">To'lov Summasi</span>
                      <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatCurrency(trade.net_price) }}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-indigo-600 rounded-[24px] p-6 text-white shadow-xl flex flex-col gap-4 relative overflow-hidden">
                  <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                   <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                      <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">To'landi</span>
                      <span class="text-base font-black">{{ formatCurrency(trade.paid_amount) }}</span>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      <i class="pi pi-check text-base"></i>
                    </div>
                  </div>

                  <!-- Mixed Payment Breakdown -->
                  <div v-if="trade.payment_type === 'mixed'" class="flex flex-col gap-2 p-3 bg-white/10 rounded-xl border border-white/10">
                    <div class="flex justify-between items-center text-[10px] font-bold">
                      <span class="opacity-60 uppercase">Naqd</span>
                      <span>{{ formatCurrency(trade.cash_amount) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-[10px] font-bold">
                      <span class="opacity-60 uppercase">Karta</span>
                      <span>{{ formatCurrency(trade.card_amount) }}</span>
                    </div>
                  </div>
                  <div v-if="parseFloat(trade.debt_amount) > 0" class="h-px bg-white/10"></div>
                  <div v-if="parseFloat(trade.debt_amount) > 0" class="flex items-center justify-between text-rose-100 font-black">
                    <div class="flex flex-col gap-1">
                      <span class="text-[9px] text-rose-200/60 uppercase">Qarz Qoldig'i</span>
                      <span class="text-base">{{ formatCurrency(trade.debt_amount) }}</span>
                    </div>
                    <i class="pi pi-exclamation-triangle text-base opacity-50"></i>
                  </div>
                </div>

                <div class="bg-white dark:bg-slate-900 rounded-[20px] p-4.5 border border-slate-100 flex flex-col gap-3.5">
                  <div class="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                    <span>Sotuvchi</span><span class="text-slate-700 dark:text-slate-200">{{ trade.worker_name }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[9px] font-black text-slate-400 uppercase">Holati</span>
                    <TradeStatusBadge :status="trade.payment_type" :display-label="trade.payment_type_display" />
                  </div>
                </div>

                <button class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[20px] text-[11px] font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-3 active:scale-95">
                  <i class="pi pi-print"></i>{{ $t('shifts.print') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Shared patterns -->
  <svg style="display: none">
    <pattern id="grid-custom" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" stroke-width="0.5"/></pattern>
  </svg>
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
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
