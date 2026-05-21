<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <!-- Backdrop with Blur -->
        <div 
          class="fixed inset-0 bg-slate-950/60 backdrop-blur-[4px] transition-opacity duration-300"
          @click="onBackdropClick"
        ></div>
        
        <!-- Modal Panel -->
        <div class="relative bg-white dark:bg-[#0c0e14] w-full max-w-[440px] rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col z-10 transition-all duration-300">
          
          <!-- Decorative subtle glows -->
          <div class="absolute -right-36 -top-36 w-72 h-72 rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center border border-emerald-500/20 shadow-sm relative">
                <i class="pi pi-wallet text-emerald-600 dark:text-emerald-400 text-sm"></i>
                <span class="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-wide leading-none">
                  {{ t('subscription.topup_balance') || 'Balansni to\'ldirish' }}
                </h3>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 block">
                  {{ t('subscription.topup_subtitle') || "Hisobingizni xavfsiz to'ldirish" }}
                </span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button 
              v-if="!pollingActive"
              type="button" 
              @click="$emit('update:visible', false)"
              class="w-7 h-7 rounded-full border border-slate-100 dark:border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:scale-105 active:scale-95 transition-all duration-150"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Content Wrapper -->
          <div class="p-5 relative z-10 space-y-4">
            
            <!-- Polling State View -->
            <div v-if="pollingActive" class="flex flex-col items-center justify-center py-6 px-4 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
              <!-- Animated Radar Scanner -->
              <div class="relative mb-5 flex items-center justify-center">
                <div class="absolute w-20 h-20 rounded-full border border-emerald-500/20 animate-ping opacity-75" style="animation-duration: 2s;"></div>
                <div class="w-12 h-12 rounded-full border-[3px] border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                <div class="absolute w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 shadow-md">
                  <i class="pi pi-credit-card text-xs text-emerald-500 animate-pulse"></i>
                </div>
              </div>
              
              <h3 class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">
                {{ t('subscription.payment_waiting') || "To'lov kutilmoqda..." }}
              </h3>
              
              <!-- Live status box -->
              <div class="bg-white dark:bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm max-w-sm mb-5">
                <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {{ statusText || t('subscription.payment_redirect_desc') || "To'lov oynasi yangi oynada ochildi. Telefonda to'lovni tasdiqlang." }}
                </p>
              </div>

              <!-- Dynamic Action Buttons for Polling -->
              <div class="flex flex-col gap-2 w-full max-w-xs relative z-10">
                <button 
                  type="button"
                  class="w-full rounded-xl text-[11px] font-black py-2.5 shadow-md shadow-emerald-500/15 transition-all duration-150 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  @click="$emit('refresh-balance')" 
                >
                  <i class="pi pi-refresh animate-spin-hover text-[10px]"></i>
                  <span>{{ t('subscription.refresh_balance') || 'Balansni qo\'lda yangilash' }}</span>
                </button>
                <button 
                  type="button"
                  class="w-full rounded-xl text-[10px] font-bold py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all duration-150" 
                  @click="$emit('update:visible', false)" 
                >
                  {{ t('common.close') || 'Oynani yopish' }}
                </button>
              </div>
            </div>

            <!-- Normal Input/Select View -->
            <div v-else class="space-y-4">
              
              <!-- Presentational Balance Transition Card -->
              <BalanceTransitionCard 
                :current-balance="currentBalance"
                :amount="amount"
              />

              <!-- Amount Input Group -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between px-1">
                  <label class="block text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">{{ t('subscription.topup_amount') || "To'ldirish summasi" }}</label>
                  <span v-if="amount > 0" class="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">{{ t('subscription.click_payment') || "Click to'lovi" }}</span>
                </div>
                
                <!-- Flex container to isolate the input and the clear button -->
                <div class="flex items-center h-13 w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-3 transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white dark:focus-within:bg-slate-900/60 shadow-inner">
                  <!-- Left Prefix Label -->
                  <div class="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 dark:border-slate-800/80 mr-2.5 shrink-0 select-none">
                    <i class="pi pi-credit-card text-slate-450 dark:text-slate-500 text-sm"></i>
                    <span class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">UZS</span>
                  </div>
                  
                  <!-- Input (takes remaining space) -->
                  <input
                    type="text"
                    inputmode="numeric"
                    :value="amount ? Number(amount).toLocaleString('ru-RU') : ''"
                    placeholder="0"
                    @input="onAmountInput"
                    class="flex-1 min-w-0 bg-transparent border-none outline-none ring-0 p-0 text-lg font-black text-right text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  />
                  
                  <!-- Clear button -->
                  <button 
                    v-if="amount > 0" 
                    type="button" 
                    @click="clearAmount"
                    class="ml-2 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                    title="Tozalash"
                  >
                    <i class="pi pi-times-circle text-base"></i>
                  </button>
                </div>
              </div>

              <!-- Quick Amount Selectors -->
              <div class="grid grid-cols-4 gap-1.5">
                <button 
                  v-for="val in quickAmounts" 
                  :key="val"
                  type="button"
                  @click="setQuickAmount(val)"
                  class="py-2.5 text-xs font-bold rounded-xl border transition-all duration-150 select-none flex items-center justify-center animate-btn"
                  :class="Number(amount) === val 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'"
                >
                  +{{ formatCompact(val) }}
                </button>
              </div>

              <!-- Payment Providers Selection Grid -->
              <PaymentProviders v-model="provider" />

              <!-- Compact Informative Note -->
              <div class="bg-gradient-to-r from-emerald-500/[0.02] to-teal-500/[0.005] text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl border border-emerald-500/10 dark:border-emerald-500/5 flex gap-2.5 items-center shadow-sm">
                <i class="pi pi-shield flex-shrink-0 text-xs text-emerald-500 animate-pulse"></i>
                <span class="text-[10px] leading-snug font-semibold">
                  {{ t('subscription.secure_note') || "Click tizimi orqali 256-bit shifrlangan xavfsiz to'lov kafolatlanadi." }}
                </span>
              </div>

            </div>
          </div>

          <!-- Footer Actions -->
          <div v-if="!pollingActive" class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/60 flex gap-2.5 w-full relative z-10">
            <button 
              type="button"
              class="flex-1 rounded-xl text-xs font-bold py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-150" 
              @click="$emit('update:visible', false)" 
            >
              {{ t('common.cancel') || 'Bekor qilish' }}
            </button>
            
            <button 
              v-if="loading"
              disabled
              class="flex-1 rounded-xl text-xs font-black py-2.5 bg-emerald-600/80 dark:bg-emerald-600/40 text-white flex items-center justify-center gap-1.5 select-none"
            >
              <i class="pi pi-spin pi-spinner text-xs"></i>
              <span>Jarayonda...</span>
            </button>
            <button 
              v-else
              type="button"
              @click="$emit('process')" 
              class="flex-1 rounded-xl text-xs font-black py-2.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-150 border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
            >
              <i class="pi pi-external-link text-xs"></i>
              <span>{{ t('subscription.topup_action') || "Click orqali to'ldirish" }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useTopupDialog } from '../composables/useTopupDialog'
import BalanceTransitionCard from './BalanceTransitionCard.vue'
import PaymentProviders from './PaymentProviders.vue'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  amount: [Number, String],
  currentBalance: [Number, String],
  loading: Boolean,
  pollingActive: Boolean,
  statusText: String
})

const emit = defineEmits(['update:visible', 'update:amount', 'process', 'refresh-balance'])

const {
  provider,
  quickAmounts,
  formatCompact,
  onAmountInput,
  setQuickAmount,
  clearAmount,
  onBackdropClick
} = useTopupDialog(props, emit)
</script>

<style scoped>
/* Custom Teleport Modal Transition (Fade + Scale-up) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-active > div:last-child,
.modal-fade-leave-active > div:last-child {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from > div:last-child {
  transform: scale(0.94) translateY(8px);
  opacity: 0;
}
.modal-fade-leave-to > div:last-child {
  transform: scale(0.97) translateY(4px);
  opacity: 0;
}

/* Animations */
.animate-spin-hover:hover {
  animation: spin 1.1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-btn {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-btn:active {
  transform: scale(0.96);
}
</style>
