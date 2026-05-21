<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[1100] flex items-center justify-center p-4">
        <!-- Backdrop with Blur -->
        <div 
          class="fixed inset-0 bg-slate-950/60 backdrop-blur-[4px] transition-opacity duration-300"
          @click="$emit('update:visible', false)"
        ></div>
        
        <!-- Modal Panel -->
        <div class="relative bg-white dark:bg-[#0c0e14] w-full max-w-[440px] rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col z-10 transition-all duration-300">
          
          <!-- Decorative subtle glows -->
          <div class="absolute -right-36 -top-36 w-72 h-72 rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <i class="pi pi-credit-card text-emerald-600 dark:text-emerald-400 text-sm"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-wide leading-none">
                  {{ header || t('subscription.sotib_olish') }}
                </h3>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 block">
                  {{ t('subscription.payment_secure_subtitle') || "Xavfsiz obuna to'lovi" }}
                </span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button 
              type="button" 
              @click="$emit('update:visible', false)"
              class="w-7 h-7 rounded-full border border-slate-100 dark:border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:scale-105 active:scale-95 transition-all duration-150"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Content Wrapper -->
          <div class="p-5 relative z-10 space-y-4">
            
            <!-- Premium Plan Info Card -->
            <div class="p-5 bg-gradient-to-br from-slate-50 via-slate-100/70 to-emerald-50/40 dark:from-[#181d29] dark:via-[#0d1017] dark:to-[#042c22] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm relative overflow-hidden group select-none">
              <!-- Glow -->
              <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-2xl"></div>

              <div class="flex flex-col">
                <span class="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">
                  {{ t('subscription.current_plan') || 'Tanlangan tarif' }}
                </span>
                <span class="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                  {{ t(`subscription.plans.${plan}`) || plan }}
                </span>
              </div>

              <!-- Price & Discount Details -->
              <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 space-y-2" v-if="discountLabel">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-500">
                  <span>{{ t('common.price') || 'Narxi' }}:</span>
                  <span class="font-bold text-slate-700 dark:text-slate-300">{{ priceLabel }}</span>
                </div>
                <div class="flex justify-between items-center text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.04] px-2 py-1 rounded-lg border border-emerald-500/10">
                  <span class="flex items-center gap-1.5">
                    <i class="pi pi-ticket text-[10px]"></i>
                    <span>{{ t('common.discount') || 'Chegirma' }} ({{ activeCoupon?.code }}):</span>
                  </span>
                  <span>{{ discountLabel }}</span>
                </div>
                <div class="h-px bg-slate-200/60 dark:bg-slate-800/80 my-1"></div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {{ t('common.total_to_pay') || 'Jami summa' }}:
                  </span>
                  <span class="text-lg font-black text-emerald-600 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
                    {{ finalPriceLabel }}
                  </span>
                </div>
              </div>
              
              <!-- Direct Simple Price when no Coupon -->
              <div class="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex justify-between items-center" v-else>
                <span class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {{ t('common.total_to_pay') || 'Jami summa' }}:
                </span>
                <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {{ priceLabel }}
                </span>
              </div>
            </div>

            <!-- Provider Select Section -->
            <div class="space-y-2">
              <label class="block text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase px-1">
                {{ t('subscription.payment_type') || 'To\'lov turi' }}
              </label>
              
              <div class="grid grid-cols-2 gap-3">
                <!-- Click Provider -->
                <div 
                  @click="$emit('update:method', 'click')"
                  class="relative p-4 rounded-2xl border cursor-pointer select-none transition-all duration-200 flex flex-col items-center gap-2.5 overflow-hidden active:scale-[0.98]"
                  :class="method === 'click' 
                    ? 'border-emerald-500 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50'"
                >
                  <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <i class="pi pi-credit-card text-lg text-blue-500"></i>
                  </div>
                  <span class="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200">Click</span>
                  
                  <!-- Selected indicator check -->
                  <div v-if="method === 'click'" class="absolute -right-6 -top-6 w-12 h-12 bg-emerald-500 rotate-45 flex items-end justify-center pb-1">
                    <i class="pi pi-check text-[8px] text-white -rotate-45 font-bold mb-0.5"></i>
                  </div>
                </div>

                <!-- Payme Provider (Coming soon) -->
                <div 
                  class="relative p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 bg-slate-50/50 dark:bg-[#0c0e14]/20 opacity-55 cursor-not-allowed select-none flex flex-col items-center gap-2.5 overflow-hidden"
                >
                  <div class="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-inner">
                    <i class="pi pi-wallet text-lg text-teal-500"></i>
                  </div>
                  <span class="text-xs font-black tracking-wide text-slate-500 dark:text-slate-400">Payme</span>
                  
                  <!-- Coming Soon Badge -->
                  <span class="absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-300/30 dark:border-slate-700/50 scale-95">
                    {{ t('subscription.coming_soon') || 'Tez kunda' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Compact Informative Note -->
            <div class="bg-blue-500/[0.02] dark:bg-blue-500/[0.01] text-blue-600 dark:text-blue-400 p-3.5 rounded-xl border border-blue-500/10 dark:border-blue-500/5 flex gap-2.5 items-start shadow-sm">
              <i class="pi pi-info-circle flex-shrink-0 text-xs text-blue-550 dark:text-blue-400 mt-0.5"></i>
              <span class="text-[10px] leading-relaxed font-semibold">
                {{ t('subscription.sandbox_mode_desc') || "Bu test rejimi. \"To'lash\" tugmasini bosish orqali to'lov muvaffaqiyatli amalga oshirilgan deb hisoblanadi." }}
              </span>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/60 flex gap-2.5 w-full relative z-10">
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
              <i class="pi pi-check text-xs"></i>
              <span>{{ t('common.pay_action') || "To'lov qilish" }}</span>
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
  activeCoupon: Object
})

defineEmits(['update:visible', 'update:method', 'process'])
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
</style>
