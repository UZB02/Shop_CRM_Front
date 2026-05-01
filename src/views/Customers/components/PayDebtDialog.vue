<template>
  <Teleport to="body">
    <!-- Backdrop: Smooth Fade -->
    <Transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
    </Transition>

    <!-- Slide-over Panel: Professional Cubic-Bezier -->
    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
      enter-from-class="translate-x-full" 
      enter-to-class="translate-x-0" 
      leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col font-inter">
        
        <!-- Header -->
        <div class="p-8 pb-6 flex items-start justify-between shrink-0">
          <div>
            <h2 class="text-[15px] font-black text-emerald-500 tracking-widest mb-1">
              {{ $t('customers.details.pay_debt_title') }}
            </h2>
            <p class="text-[12px] font-bold text-slate-400 tracking-widest">Mijozlar</p>
          </div>
          <button 
            @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm"
          >
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
          <div class="space-y-8 pb-8">
            
            <!-- Financial Status Indicator -->
            <div class="p-6 rounded-[1.3rem] bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100/30 dark:border-rose-500/10 flex items-center justify-between group transition-all duration-300 hover:shadow-sm">
               <div class="flex flex-col">
                 <span class="text-[11px] font-black text-rose-400 tracking-[0.2em] mb-1.5 opacity-80">
                   {{ $t('customers.details.current_debt') }}
                 </span>
                 <span class="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tighter">{{ formatCurrency(customerDebt) }}</span>
               </div>
               <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-rose-500 shadow-sm transition-transform group-hover:scale-105">
                 <i class="pi pi-exclamation-circle text-xl"></i>
               </div>
            </div>

            <!-- Amount Input Segment -->
            <div class="space-y-3">
              <div class="flex items-center justify-between px-1">
                 <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <i class="pi pi-money-bill text-[12px]"></i>
                    </div>
                    <label class="text-[12px] font-black text-slate-400 tracking-widest leading-none">
                      {{ $t('customers.details.payment_amount') }}
                    </label>
                 </div>
                 <button 
                  @click="payment.amount = parseFloat(customerDebt)"
                  class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest hover:underline"
                 >
                   {{ $t('customers.details.pay_all') }}
                 </button>
              </div>
              <div class="relative">
                <InputNumber 
                  v-model="payment.amount" 
                  :min="0" :max="parseFloat(customerDebt)"
                  mode="decimal"
                  class="w-full"
                  pt:input:class="!w-full !rounded-[1.3rem] !bg-slate-50/80 dark:!bg-slate-900/50 !border-slate-100 dark:!border-slate-800 !px-6 !py-5 !text-[16px] !font-bold !text-slate-800 dark:!text-white focus:!border-emerald-500 focus:!ring-0 focus:!bg-white dark:focus:!bg-slate-900 transition-all border shadow-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Payment Method Segment -->
            <div class="space-y-4 pt-2">
              <label class="text-[12px] font-black text-slate-400 tracking-widest ml-1 opacity-70">
                {{ $t('customers.details.payment_method') }}
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button 
                  v-for="method in ['cash', 'card']" :key="method"
                  @click="payment.payment_method = method"
                  :class="[
                    'relative p-6 rounded-[1.3rem] border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95',
                    payment.payment_method === method 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <div v-if="payment.payment_method === method" class="absolute top-3 right-3">
                     <i class="pi pi-check-circle text-[12px] text-emerald-500"></i>
                  </div>
                  <i :class="['text-xl pi', method === 'cash' ? 'pi-wallet' : 'pi-credit-card']"></i>
                  <span class="text-[12px] font-black tracking-widest text-center">
                    {{ method === 'cash' ? $t('shifts.payment.cash_part') : $t('shifts.payment.card_part') }}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-slate-50 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950">
          <div class="flex gap-3 items-center">
            <button 
              @click="$emit('update:visible', false)"
              class="flex-1 h-12 rounded-xl text-[12px] font-black tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
            >
              {{ $t('common.cancel') }}
            </button>
            <button 
              @click="submitPayment"
              :disabled="saving || !payment.amount || payment.amount <= 0"
              class="flex-[2] h-12 rounded-xl bg-emerald-500 text-white text-[12px] font-black tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-[12px]"></i>
              {{ saving ? $t('common.saving') : $t('common.pay') }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InputNumber from 'primevue/inputnumber'
import { customersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: Boolean,
  customerId: { type: [String, Number], default: null },
  customerDebt: { type: [String, Number], default: 0 }
})

const emit = defineEmits(['update:visible', 'success'])
const toast = useToast()
const { t } = useI18n()
const saving = ref(false)

const payment = reactive({
  amount: null,
  payment_method: 'cash'
})

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const submitPayment = async () => {
  if (!payment.amount || payment.amount <= 0) return
  
  saving.value = true
  try {
    await customersAPI.payDebt(props.customerId, {
      amount: payment.amount,
      payment_method: payment.payment_method
    })
    
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.added'), life: 5000 })
    emit('success')
    emit('update:visible', false)
    payment.amount = null
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.response?.data?.error || t('common.error_message'), life: 5000 })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>


