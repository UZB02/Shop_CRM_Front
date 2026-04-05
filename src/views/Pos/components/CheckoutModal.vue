<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    header="To'lovni amalga oshirish" 
    :style="{ width: '500px' }"
    :breakpoints="{ '960px': '75vw', '641px': '95vw' }"
    class="checkout-dialog-retail"
    :draggable="false"
  >
    <div class="flex flex-col gap-5 p-1 pt-2">
      <!-- Summary Display -->
      <CheckoutSummary :total="total" />

      <!-- Payment Methods Controls -->
      <PaymentMethodsControl 
        v-model:paymentType="paymentType" 
        :methods="methods" 
      />

      <!-- Contextual Input Fields -->
      <div class="min-h-[100px] flex flex-col justify-center animate-fade-in">
        <div v-if="paymentType !== 'mixed'" class="space-y-2">
          <div class="flex items-center justify-between px-1">
             <label class="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none">Kiritilgan miqdor</label>
             <button v-if="paymentType === 'cash'" @click="paidAmount = total" class="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:underline transition-all">To'liq summa</button>
          </div>
          <div class="relative group">
            <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 font-outfit font-black text-base group-focus-within:text-emerald-500 transition-colors">UZS</span>
            <InputNumber v-model="paidAmount" inputId="paid_amount" class="w-full sr-retail-input-compact" :min="0" placeholder="0.00" autoFocus />
          </div>
        </div>

        <div v-if="paymentType === 'mixed'" class="space-y-4">
           <div class="grid grid-cols-2 gap-3">
              <div class="space-y-2">
                 <label class="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Naqd pul</label>
                 <InputNumber v-model="cashAmount" class="w-full sr-retail-input-small-compact" :min="0" />
              </div>
              <div class="space-y-2">
                 <label class="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Plastik karta</label>
                 <InputNumber v-model="cardAmount" class="w-full sr-retail-input-small-compact" :min="0" />
              </div>
           </div>
           <div class="p-3 rounded-xl border border-dashed flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800">
             <div class="flex flex-col">
                <span class="text-[7px] font-black text-slate-400 uppercase tracking-widest">Jami kiritildi</span>
                <span class="text-base font-black font-outfit" :class="isMixedValid ? 'text-emerald-500' : 'text-slate-400'">
                  {{ formatCurrency(cashAmount + cardAmount).replace('UZS','') }}
                </span>
             </div>
             <div v-if="isMixedValid" class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center anim-bounce">
                <i class="pi pi-check text-[9px]"></i>
             </div>
             <div v-else class="text-[8px] font-black text-rose-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10">Mos emas</div>
           </div>
        </div>

        <div v-if="paymentType === 'cash' && paidAmount > total" class="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10 flex justify-between items-center transition-all animate-fade-in">
          <div class="flex flex-col">
             <span class="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Mijozga qaytim:</span>
             <span class="text-xl font-black text-emerald-600 font-outfit tracking-tight">
                {{ formatCurrency(paidAmount - total).replace('UZS','') }}
             </span>
          </div>
          <i class="pi pi-money-bill text-emerald-500 text-lg"></i>
        </div>

        <div v-if="paymentType === 'debt' && !selectedCustomer" class="mt-3 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30 flex gap-3 items-center">
          <i class="pi pi-user-minus text-rose-500 text-sm"></i>
          <span class="text-[8px] font-black text-rose-600 uppercase tracking-widest leading-none">Mijoz tanlash majburiy!</span>
        </div>
      </div>

      <!-- Additional Note -->
      <div class="space-y-2">
        <label class="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Izoh (Ixtiyoriy)</label>
        <textarea v-model="note" class="sr-retail-textarea-compact" placeholder="Savdo qaydlari..."></textarea>
      </div>

      <!-- Sub-Component Handlers -->
      <CheckoutActions 
        :isValid="isValid" 
        :loading="loading"
        @cancel="$emit('update:visible', false)"
        @confirm="handleConfirm"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { useCheckout } from '@/composables/useCheckout'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import CheckoutSummary from './CheckoutSummary.vue'
import PaymentMethodsControl from './PaymentMethodsControl.vue'
import CheckoutActions from './CheckoutActions.vue'

const props = defineProps({
  visible: Boolean,
  total: Number,
  selectedCustomer: Object,
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'confirm'])

const {
  paymentType,
  paidAmount,
  cashAmount,
  cardAmount,
  note,
  methods,
  isMixedValid,
  isValid,
  handleConfirm
} = useCheckout(props, emit)

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>

<style>
/* Core Global PrimeVue Overrides for POS */
.sr-retail-input-compact .p-inputtext {
  background: #f8fafc !important;
  border: 1px solid #f1f5f9 !important;
  padding: 0.875rem 1rem 0.875rem 4rem !important;
  border-radius: 16px !important;
  font-family: 'Outfit', sans-serif !important;
  font-weight: 800 !important;
  font-size: 1.125rem !important;
  color: #1e293b !important;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: none !important;
}

.dark .sr-retail-input-compact .p-inputtext {
  background: #0f172a !important;
  border-color: #1e293b !important;
  color: white !important;
}

.sr-retail-input-compact .p-inputtext:focus {
  border-color: #10b981 !important;
  background: white !important;
}

.sr-retail-input-small-compact .p-inputtext {
  background: #f8fafc !important;
  border: 1px solid #f1f5f9 !important;
  padding: 0.625rem 0.875rem !important;
  border-radius: 12px !important;
  font-family: 'Outfit', sans-serif !important;
  font-weight: 800 !important;
  font-size: 0.875rem !important;
}

.sr-retail-textarea-compact {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  outline: none;
  min-height: 55px;
  transition: all 0.3s ease;
  resize: none;
}

.dark .sr-retail-textarea-compact {
  background: #0f172a;
  border-color: #1e293b;
  color: #94a3b8;
}

.sr-retail-textarea-compact:focus {
  border-color: #10b981;
  background: white !important;
}

:deep(.checkout-dialog-retail) {
  border-radius: 32px !important;
  border: none;
  background: white;
  box-shadow: 0 40px 100px -20px rgba(0,0,0,0.15) !important;
}

.dark :deep(.checkout-dialog-retail) { background: #0b0f1a; }

:deep(.checkout-dialog-retail .p-dialog-header) {
  padding: 1.5rem 1.5rem 0 1.5rem;
  background: transparent;
}

:deep(.checkout-dialog-retail .p-dialog-title) {
  font-size: 0.85rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  color: #1e293b;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.dark :deep(.checkout-dialog-retail .p-dialog-title) { color: white; }

:deep(.checkout-dialog-retail .p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: transparent;
}
</style>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.anim-bounce { animation: bounce 1.5s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
</style>
