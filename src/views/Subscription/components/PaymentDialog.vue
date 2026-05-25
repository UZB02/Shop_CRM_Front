<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <!-- Backdrop with Blur -->
        <div 
          class="fixed inset-0 bg-slate-950/70 backdrop-blur-[3px] transition-opacity duration-300"
          @click="$emit('update:visible', false)"
        ></div>
        
        <!-- Modal Panel -->
        <div class="relative bg-white dark:bg-[#0c0e14] w-full max-w-[400px] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col z-10 transition-all duration-300">
          
          <!-- Decorative subtle glows -->
          <div class="absolute -right-32 -top-32 w-64 h-64 rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 relative z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <i class="pi pi-credit-card text-emerald-600 dark:text-emerald-400 text-xs"></i>
              </div>
              <div>
                <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wide leading-none">
                  {{ header || t('subscription.sotib_olish') }}
                </h3>
                <span class="text-[9px] text-slate-450 dark:text-slate-500 font-bold mt-0.5 block">
                  {{ t('subscription.payment_secure_subtitle') || "Xavfsiz obuna to'lovi" }}
                </span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button 
              type="button" 
              @click="$emit('update:visible', false)"
              class="w-6 h-6 rounded-full border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/60 hover:scale-105 active:scale-95 transition-all duration-150"
            >
              <i class="pi pi-times text-[9px]"></i>
            </button>
          </div>

          <!-- Content Wrapper -->
          <div class="p-4 relative z-10 space-y-3">
            
            <!-- Premium Plan Info Card -->
            <div class="p-3.5 bg-gradient-to-br from-slate-50 via-slate-100/40 to-emerald-50/20 dark:from-[#131722] dark:via-[#090b10] dark:to-[#021813] rounded-xl border border-slate-150 dark:border-slate-850/80 shadow-sm relative overflow-hidden group select-none">
              <!-- Glow -->
              <div class="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-xl"></div>

              <div class="flex justify-between items-center">
                <span class="text-[9px] text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">
                  {{ isExtending ? t('subscription.current_plan') : t('subscription.selected_plan') }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {{ t(`subscription.plans.${plan}`) || plan }}
                </span>
              </div>

              <!-- Price & Discount Details -->
              <div class="mt-2.5 pt-2 border-t border-slate-150 dark:border-slate-850 space-y-1.5" v-if="discountLabel">
                <div class="flex justify-between items-center text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>{{ t('common.price') || 'Narxi' }}:</span>
                  <span class="font-bold text-slate-700 dark:text-slate-350">{{ priceLabel }}</span>
                </div>
                <div class="flex justify-between items-center text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.04] px-1.5 py-0.5 rounded-lg border border-emerald-500/10">
                  <span class="flex items-center gap-1">
                    <i class="pi pi-ticket text-[9px]"></i>
                    <span>{{ t('common.discount') || 'Chegirma' }} ({{ activeCoupon?.code }}):</span>
                  </span>
                  <span>{{ discountLabel }}</span>
                </div>
                <div class="h-px bg-slate-150 dark:bg-slate-850 my-1"></div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {{ t('common.total_to_pay') || 'Jami summa' }}:
                  </span>
                  <span class="text-base font-black text-emerald-600 dark:text-emerald-405 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]">
                    {{ finalPriceLabel }}
                  </span>
                </div>
              </div>
              
              <!-- Direct Simple Price when no Coupon -->
              <div class="mt-2.5 pt-2 border-t border-slate-150 dark:border-slate-850 flex justify-between items-center" v-else>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {{ t('common.total_to_pay') || 'Jami summa' }}:
                </span>
                <span class="text-base font-black text-emerald-600 dark:text-emerald-45">
                  {{ priceLabel }}
                </span>
              </div>
            </div>

            <!-- Wallet / Balance Select Section -->
            <div class="space-y-2">
              <label class="block text-[9px] font-bold tracking-widest text-slate-450 dark:text-slate-550 uppercase px-1">
                {{ t('subscription.payment_type') || 'To\'lov turi' }}
              </label>
              
              <div class="p-3 rounded-xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-[#0f1118]/60 flex items-center justify-between shadow-sm relative overflow-hidden group">
                <div class="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] blur-lg"></div>
                
                <div class="flex items-center gap-2.5 relative z-10">
                  <div class="w-8.5 h-8.5 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <i class="pi pi-wallet text-base text-emerald-500 dark:text-emerald-450"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[11px] font-bold tracking-wide text-slate-850 dark:text-slate-150">
                      {{ t('subscription.wallet_balance') || 'Hisob balansi (Wallet)' }}
                    </span>
                    <span class="text-[8px] text-slate-400 dark:text-slate-500 font-bold leading-none mt-0.5">
                      {{ t('subscription.balance_deduction') || 'Balansdan yechib olinadi' }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col items-end relative z-10">
                  <span class="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">
                    {{ t('subscription.available_balance') || 'Mavjud balans' }}
                  </span>
                  <span class="text-xs font-black text-slate-850 dark:text-white mt-1">
                    {{ new Intl.NumberFormat('uz-UZ').format(currentBalance) }} so'm
                  </span>
                </div>
              </div>

              <!-- Projected balance after purchase -->
              <div 
                v-if="currentBalance >= finalPrice" 
                class="px-3 py-2 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/10 rounded-lg flex items-center justify-between text-[10px]"
              >
                <span class="font-bold text-slate-450 dark:text-slate-500">{{ t('subscription.balance_after') || 'To\'lovdan keyingi qoldiq' }}:</span>
                <span class="font-black text-emerald-600 dark:text-emerald-400">
                  {{ new Intl.NumberFormat('uz-UZ').format(currentBalance - finalPrice) }} so'm
                </span>
              </div>

              <!-- Insufficient balance warning -->
              <div 
                v-else 
                class="p-2.5 bg-amber-500/[0.04] dark:bg-amber-500/[0.01] border border-amber-500/20 dark:border-amber-500/10 rounded-lg flex flex-col gap-1"
              >
                <div class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] font-black">
                  <i class="pi pi-exclamation-triangle"></i>
                  <span>{{ t('subscription.insufficient_balance') || 'Balans yetarli emas!' }}</span>
                </div>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Ushbu tarifni faollashtirish uchun hisobingizda yana <strong class="text-amber-600 dark:text-amber-400 font-black">{{ new Intl.NumberFormat('uz-UZ').format(finalPrice - currentBalance) }} so'm</strong> yetishmayapti.
                </p>
              </div>
            </div>

            <!-- Compact Informative Note -->
            <div class="bg-blue-500/[0.02] dark:bg-blue-500/[0.01] text-blue-600 dark:text-blue-400 p-2.5 rounded-lg border border-blue-500/10 dark:border-blue-500/5 flex gap-2 items-start shadow-sm">
              <i class="pi pi-info-circle flex-shrink-0 text-[10px] text-blue-550 dark:text-blue-450 mt-0.5"></i>
              <span class="text-[9px] leading-relaxed font-semibold">
                {{ t('subscription.balance_charge_desc') || "To'lov do'koningiz hisob balansidan avtomatik ravishda yechiladi. Tarif darhol faollashadi." }}
              </span>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 flex gap-2 w-full relative z-10">
            <button 
              type="button"
              class="flex-1 rounded-lg text-[11px] font-bold py-2 border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-150" 
              @click="$emit('update:visible', false)" 
            >
              {{ t('common.cancel') || 'Bekor qilish' }}
            </button>
            
            <button 
              v-if="loading"
              disabled
              class="flex-1 rounded-lg text-[11px] font-black py-2 bg-emerald-600/80 dark:bg-emerald-600/40 text-white flex items-center justify-center gap-1 select-none"
            >
              <i class="pi pi-spin pi-spinner text-[10px]"></i>
              <span>Jarayonda...</span>
            </button>
            <button 
              v-else-if="currentBalance < finalPrice"
              type="button"
              @click="$emit('topup-required', finalPrice - currentBalance)" 
              class="flex-1 rounded-lg text-[11px] font-black py-2 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-150 border-none bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <i class="pi pi-plus text-[10px]"></i>
              <span>{{ t('subscription.topup_action_btn') || "Balansni to'ldirish" }}</span>
            </button>
            <button 
              v-else
              type="button"
              @click="$emit('process')" 
              class="flex-1 rounded-lg text-[11px] font-black py-2 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-150 border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <i class="pi pi-check text-[10px]"></i>
              <span>{{ isExtending ? (t('subscription.confirm_extend') || "Obunani uzaytirish") : (t('subscription.confirm_change') || "Tarifni almashtirish") }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  header: String,
  plan: [String, Number],
  priceLabel: String,
  method: String,
  loading: Boolean,
  discountLabel: String,
  finalPriceLabel: String,
  activeCoupon: Object,
  currentBalance: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    default: 0
  },
  isExtending: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:visible', 'update:method', 'process', 'topup-required'])
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
