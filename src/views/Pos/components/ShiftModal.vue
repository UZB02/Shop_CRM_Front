<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    :header="isClosing ? $t('pos.close_shift') : $t('pos.open_new_shift')" 
    :style="{ width: '420px' }"
    class="shift-dialog"
  >
    <div class="space-y-4 pt-1">
      <!-- Opening Shift Inputs -->
      <div v-if="!isClosing" class="space-y-4">
        <!-- Icon/Header Illustration only for opening -->
        <div class="flex flex-col items-center gap-2 mb-6">
          <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <i class="pi pi-briefcase text-2xl text-emerald-500"></i>
          </div>
          <p class="text-xs text-slate-500 font-bold tracking-widest text-center">
             {{ $t('pos.prepare_cash_register') }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-[13px] font-bold text-slate-400 ml-1">{{ $t('pos.starting_cash') }}</label>
          <InputNumber 
            v-model="cashStart" 
            class="w-full sr-input"
            :min="0"
            placeholder="0.00"
            autofocus
          />
        </div>
        <div class="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-500/10 flex items-center gap-3">
          <i class="pi pi-info-circle text-emerald-500"></i>
          <span class="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {{ $t('pos.shift_opened_in_branch', { branch: authStore.user?.branch_name || authStore.user?.worker?.branch_name || $t('pos.unselected') }) }}
          </span>
        </div>
      </div>

      <!-- Closing Shift / Summary Section -->
      <div v-else class="space-y-4">
        <!-- Shift Meta Info -->
        <div class="px-5 py-3.5 bg-slate-50 dark:bg-[#141b2d] rounded-2xl border border-slate-100 dark:border-[#1e293b]">
           <div class="flex justify-between items-center text-[13px] font-bold">
             <span class="text-slate-500 dark:text-slate-400">{{ $t('pos.opened_time') }}</span>
             <span class="text-slate-800 dark:text-white">{{ formatDate(shift?.opened_at || shift?.start_time || shift?.created_at) }}</span>
           </div>
        </div>

        <!-- Cash Details Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-4 bg-slate-50 dark:bg-[#141b2d] rounded-2xl border border-slate-100 dark:border-[#1e293b] flex flex-col justify-center">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">{{ $t('pos.final_cash') }}</span>
            <span class="text-base font-black text-slate-800 dark:text-white font-outfit">
              {{ formatCurrency(displayCash) }}
            </span>
          </div>
          <div class="p-4 bg-slate-50 dark:bg-[#141b2d] rounded-2xl border border-slate-100 dark:border-[#1e293b] flex flex-col justify-center">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">{{ $t('pos.cash_balance') }}</span>
            <span class="text-base font-black text-slate-800 dark:text-white font-outfit">
              {{ formatCurrency(displayNetIncome) }}
            </span>
          </div>
        </div>

        <!-- Difference / Status Section (Faqat yopiq smenada) -->
        <div v-if="(shift?.status === 'closed' || shift?.cash_difference !== null) && shift?.cash_difference !== undefined" class="animate-fadein">
           <!-- Correct Cash -->
           <div v-if="parseFloat(shift.cash_difference || 0) === 0" class="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
              <i class="pi pi-check-circle text-emerald-500 text-lg"></i>
              <span class="text-[12px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider">✅ {{ $t('pos.cash_correct_no_diff') }}</span>
           </div>
           <!-- Shortage (Kamomad) -->
           <div v-else-if="parseFloat(shift.cash_difference || 0) < 0" class="flex items-center gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 rounded-2xl">
              <i class="pi pi-exclamation-triangle text-rose-500 text-lg"></i>
              <span class="text-[12px] font-black text-rose-600 dark:text-rose-400 tracking-wider leading-tight">
                ⚠️ {{ $t('pos.cashier_shortage', { amount: formatCurrency(Math.abs(shift.cash_difference)) }) }}
              </span>
           </div>
           <!-- Extra (Ortiqcha) -->
           <div v-else class="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
              <i class="pi pi-info-circle text-amber-500 text-lg"></i>
              <span class="text-[12px] font-black text-amber-600 dark:text-amber-400 tracking-wider leading-tight">
                ℹ️ {{ $t('pos.cashier_surplus', { amount: formatCurrency(shift.cash_difference) }) }}
              </span>
           </div>
        </div>

        <!-- Money Input — faqat require_cash_count=true bo'lganda -->
        <div v-if="shift?.status === 'open' && settingsStore.requireCashCount" class="space-y-2 mt-2 animate-fadein">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[13px] font-bold text-slate-700 dark:text-slate-300">{{ $t('pos.counted_cash_in_register') }}</label>
            <span class="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-500/20">
              Majburiy
            </span>
          </div>
          <div class="p-1 bg-slate-50 dark:bg-[#141b2d] rounded-xl border border-slate-200 dark:border-[#1e293b]">
            <InputNumber 
              v-model="cashCounted" 
              class="w-full text-xl font-bold bg-transparent border-none outline-none px-3 py-2 text-slate-800 dark:text-white dark:bg-transparent [&>input]:bg-transparent [&>input]:text-white [&>input]:border-none [&>input]:shadow-none"
              :min="0"
              placeholder="0"
              autofocus
            />
          </div>
        </div>

        <!-- Discrepancy Reason -->
        <div v-if="showReasonInput" class="space-y-2 mt-2 animate-fadein">
          <div class="flex items-center justify-between mb-1">
            <label class="text-[13px] font-bold text-rose-500">{{ $t('pos.discrepancy_reason') }}</label>
            <span class="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-100 dark:border-rose-500/20">
              Majburiy
            </span>
          </div>
          <div v-if="discrepancyError" class="p-3 mb-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-500 text-[13px] font-bold leading-relaxed">
            {{ discrepancyError }}
          </div>
          <div class="p-1 bg-slate-50 dark:bg-[#141b2d] rounded-xl border border-slate-200 dark:border-[#1e293b]">
            <textarea 
              v-model="discrepancyReason" 
              class="w-full text-sm font-medium bg-transparent border-none outline-none p-3 text-slate-800 dark:text-white resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0"
              rows="3" 
              :placeholder="$t('pos.enter_discrepancy_reason')"
            ></textarea>
          </div>
        </div>

        <!-- require_cash_count=false bo'lganda info xabari -->
        <div v-else-if="shift?.status === 'open' && !settingsStore.requireCashCount"
             class="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-[#141b2d] rounded-2xl border border-slate-100 dark:border-[#1e293b] animate-fadein">
          <i class="pi pi-info-circle text-slate-400 text-lg"></i>
          <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ $t('pos.shift_will_close_without_count') }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-3">
        <button 
          @click="$emit('update:visible', false)"
          class="flex-[1] py-3.5 px-4 rounded-[14px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1e293b] transition-all hover:bg-slate-200 dark:hover:bg-[#334155] active:scale-[0.98]"
        >
          {{ shift?.status === 'closed' ? $t('common.close') : 'Bekor qilish' }}
        </button>
        
        <!-- Case: Success / Download for closed shift -->
        <button 
          v-if="isClosing && shift?.status === 'closed'"
          @click="$emit('download', shift.id)"
          class="flex-[1.5] py-3.5 px-4 rounded-[14px] font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]"
        >
           <i class="pi pi-download mr-2"></i>
           {{ $t('common.download') }}
        </button>

        <!-- Case: Action for opening/closing -->
        <button 
          v-else
          @click="handleSubmit"
          :disabled="loading || (!isClosing && !hasBranchId) || (isClosing && settingsStore.requireCashCount && cashCounted === null) || (isClosing && showReasonInput && !discrepancyReason.trim())"
          class="flex-[1.5] py-3.5 px-4 rounded-[14px] font-bold text-white transition-all shadow-lg disabled:opacity-50 active:scale-[0.98]"
          :class="[
             isClosing ? 'bg-[#9f1239] hover:bg-[#be123c]' : 'bg-[#10b981] hover:bg-[#059669]'
          ]"
        >
           <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
           {{ isClosing ? $t('pos.close_shift') : $t('pos.open_shift') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { useAuthStore } from '@/store/auth'

import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  visible: Boolean,
  isClosing: Boolean,
  shift: Object,
  xReport: Object, // Backend x-report ma'lumotlari
  loading: Boolean,
  discrepancyError: String
})

const emit = defineEmits(['update:visible', 'update:discrepancyError', 'confirm', 'download'])

const authStore = useAuthStore()
const cashStart = ref(0)
const cashCounted = ref(null)
const discrepancyReason = ref('')

const formatCurrency = (val) => settingsStore.formatPrice(val)

const hasBranchId = computed(() => !!(authStore.user?.branch_id || authStore.user?.worker?.branch || authStore.user?.branch))

// Backend logic: cash_end bo'lmasa, x-report yoki shift dagi expected_cash ni ko'rsatamiz
const displayCash = computed(() => {
  if (props.shift?.status === 'closed' && props.shift?.cash_end !== null) {
     return props.shift.cash_end
  }
  // xReport null bo'lsa → shift.expected_cash dan olamiz
  return props.xReport?.expected_cash
      ?? props.xReport?.cash_end
      ?? props.xReport?.total_cash
      ?? props.shift?.expected_cash
      ?? props.shift?.cash_start
      ?? 0
})

const expectedCash = computed(() => {
  return props.xReport?.expected_cash
      ?? props.shift?.expected_cash
      ?? 0
})

const needsReasonLocal = computed(() => {
  if (!settingsStore.requireCashCount || cashCounted.value === null) return false
  const diff = Math.abs(cashCounted.value - parseFloat(expectedCash.value))
  const threshold = parseFloat(settingsStore.cashDiscrepancyThreshold || 0)
  return threshold > 0 && diff > threshold
})

const showReasonInput = computed(() => needsReasonLocal.value || !!props.discrepancyError)

// net_income: xReport null bo'lsa shift dan olamiz
const displayNetIncome = computed(() => {
  return props.xReport?.net_income
      ?? props.xReport?.total_income
      ?? props.xReport?.income
      ?? props.shift?.net_income
      ?? props.shift?.expected_cash
      ?? 0
})

const handleSubmit = () => {
  emit('update:discrepancyError', '')
  if (props.isClosing) {
    const payload = {}
    if (settingsStore.requireCashCount && cashCounted.value !== null) {
      payload.cash_end = cashCounted.value
    }
    if (showReasonInput.value && discrepancyReason.value) {
      payload.discrepancy_reason = discrepancyReason.value
    }
    emit('confirm', payload)
  } else {
    const branchId = authStore.user?.branch_id || 
                     authStore.user?.worker?.branch || 
                     authStore.user?.branch;

    if (!branchId) {
      console.error('❌ FATAL: Branch ID not found in user profile');
    }

    emit('confirm', { 
      branch: branchId, 
      cash_start: cashStart.value 
    })
  }
}

const formatDate = (val) => {
  if (!val) return ''
  // Sring formatni tekshiramiz: "2024-04-07 | 10:41" dagi "|" JSga xalaqit beradi
  let dateStr = String(val).replace('|', '').trim()
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? val : d.toLocaleString('uz-UZ')
}

// Reset state when opening
watch(() => props.visible, (newVal) => {
  if (newVal && !props.isClosing) {
    cashStart.value = 0
  } else if (newVal && props.isClosing) {
    cashCounted.value = null
    discrepancyReason.value = ''
    emit('update:discrepancyError', '')
  }
})
</script>

<style scoped>
:deep(.shift-dialog) {
  border-radius: 24px !important;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 40px 60px -20px rgb(0 0 0 / 0.5);
}

:deep(.shift-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  background: white;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
}

:deep(.shift-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: white;
}

/* Premium Dark Mode Styling */
.dark :deep(.shift-dialog .p-dialog-header),
.dark :deep(.shift-dialog .p-dialog-content) {
  background: #1c1c1e;
  color: #fff;
}

.dark :deep(.shift-dialog .p-dialog-header-icons button) {
  color: #a1a1aa;
}
.dark :deep(.shift-dialog .p-dialog-header-icons button:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
</style>


