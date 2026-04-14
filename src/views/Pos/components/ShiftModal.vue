<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    :header="isClosing ? 'Smenani yopish' : 'Yangi smena ochish'" 
    :style="{ width: '400px' }"
    class="shift-dialog"
  >
    <div class="space-y-6 pt-2">
      <!-- Icon/Header Illustration -->
      <div class="flex flex-col items-center gap-2 mb-4">
        <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <i class="pi pi-briefcase text-2xl" :class="isClosing ? 'text-rose-500' : 'text-emerald-500'"></i>
        </div>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">
           {{ isClosing ? "Kassa hisob-kitobi" : "Kassani tayyorlash" }}
        </p>
      </div>

      <!-- Opening Shift Inputs -->
      <div v-if="!isClosing" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-slate-400 uppercase ml-1">Boshlang'ich kassa (Naqd)</label>
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
          <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
            Smena joriy filialda ({{ authStore.user?.branch_name || authStore.user?.worker?.branch_name || 'Tanlanmagan' }}) ochiladi
          </span>
        </div>
      </div>

      <!-- Closing Shift / Summary Section -->
      <div v-else class="space-y-5">
        <!-- Shift Meta Info -->
        <div class="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
           <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
             <span class="text-slate-400">Smena ID / Holati</span>
             <div class="flex items-center gap-2">
               <span class="text-slate-800 dark:text-white">#{{ shift?.id }}</span>
               <span :class="shift?.status === 'open' ? 'bg-emerald-500' : 'bg-slate-500'" class="w-1.5 h-1.5 rounded-full shadow-pulse"></span>
               <span :class="shift?.status === 'open' ? 'text-emerald-500' : 'text-slate-500'">{{ (shift?.status === 'open' ? 'OCHIQ' : 'YOPILGAN') }}</span>
             </div>
           </div>
           <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
             <span class="text-slate-400">Ochilgan vaqt:</span>
             <span class="text-slate-800 dark:text-white">{{ formatDate(shift?.opened_at || shift?.start_time || shift?.created_at) }}</span>
           </div>
        </div>

        <!-- Cash Details Grid -->
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Yakuniy Kassa</span>
            <span class="text-sm font-black text-slate-800 dark:text-white font-outfit">
              {{ formatCurrency(displayCash) }}
            </span>
          </div>
          <div class="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Naqd Qoldiq</span>
            <span class="text-sm font-black text-slate-800 dark:text-white font-outfit">
              {{ formatCurrency(xReport?.net_income || shift?.net_income) }}
            </span>
          </div>
        </div>

        <!-- Difference / Status Section (Faqat yopiq smenada) -->
        <div v-if="(shift?.status === 'closed' || shift?.cash_difference !== null) && shift?.cash_difference !== undefined" class="animate-fadein">
           <!-- Correct Cash -->
           <div v-if="parseFloat(shift.cash_difference || 0) === 0" class="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
              <i class="pi pi-check-circle text-emerald-500 text-lg"></i>
              <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">✅ Kassa to'g'ri (Farq yo'q)</span>
           </div>
           <!-- Shortage (Kamomad) -->
           <div v-else-if="parseFloat(shift.cash_difference || 0) < 0" class="flex items-center gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-500/20 rounded-2xl">
              <i class="pi pi-exclamation-triangle text-rose-500 text-lg"></i>
              <span class="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider leading-tight">
                ⚠️ Kassir {{ formatCurrency(Math.abs(shift.cash_difference)) }} kam
              </span>
           </div>
           <!-- Extra (Ortiqcha) -->
           <div v-else class="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
              <i class="pi pi-info-circle text-amber-500 text-lg"></i>
              <span class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider leading-tight">
                ℹ️ Kassir {{ formatCurrency(shift.cash_difference) }} ortiqcha
              </span>
           </div>
        </div>

        <!-- Money Input (Only if open and trying to close) -->
        <div v-if="shift?.status === 'open'" class="space-y-2 animate-fadein">
          <div class="flex items-center justify-between ml-1 mb-1">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Kassada sanalgan pul</label>
            <span v-if="settingsStore.requireCashCount" class="text-[8px] font-black text-rose-500 uppercase tracking-tighter bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-md border border-rose-100 dark:border-rose-800/30 animate-pulse">
              Majburiy
            </span>
          </div>
          <InputNumber 
            v-model="cashCounted" 
            class="w-full sr-input text-lg"
            :min="0"
            placeholder="0.00"
            autofocus
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          @click="$emit('update:visible', false)"
          class="flex-1 py-4 px-4 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 transition-all hover:bg-slate-200"
        >
          {{ shift?.status === 'closed' ? 'Yopish' : 'Bekor qilish' }}
        </button>
        
        <!-- Case: Success / Download for closed shift -->
        <button 
          v-if="isClosing && shift?.status === 'closed'"
          @click="$emit('download', shift.id)"
          class="flex-[2] py-4 px-4 rounded-2xl font-bold text-white transition-all shadow-xl bg-[#151c2f] hover:bg-[#0f1422] shadow-slate-400/20"
        >
           <i class="pi pi-download mr-2"></i>
           Yuklab olish
        </button>

        <!-- Case: Action for opening/closing -->
        <button 
          v-else
          @click="handleSubmit"
          :disabled="loading || (!isClosing && !authStore.user?.branch_id) || (settingsStore.requireCashCount && (isClosing ? cashCounted === null : cashStart === null))"
          class="flex-[2] py-4 px-4 rounded-2xl font-bold text-white transition-all shadow-xl disabled:opacity-50"
          :class="[
             isClosing ? 'bg-rose-500 hover:bg-rose-600 hover:shadow-rose-400/30' : 'bg-[#10b981] hover:bg-[#059669] hover:shadow-emerald-500/30'
          ]"
        >
           <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
           {{ isClosing ? 'Smenani yopish' : 'Smenani ochish' }}
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
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'confirm', 'download'])

const authStore = useAuthStore()
const cashStart = ref(0)
const cashCounted = ref(0)

const formatCurrency = (val) => settingsStore.formatPrice(val)

// Backend logic: cash_end bo'lmasa, x-report dagi expected_cash ni ko'rsatamiz
const displayCash = computed(() => {
  if (props.shift?.status === 'closed' && props.shift?.cash_end !== null) {
     return props.shift.cash_end
  }
  return props.xReport?.expected_cash || 0
})

const handleSubmit = () => {
  if (props.isClosing) {
    emit('confirm', cashCounted.value)
  } else {
    // Backend advice: get branch from user data
    // Usually it's in user.branch_id or user.worker.branch
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
    cashCounted.value = 0
  }
})
</script>

<style scoped>
:deep(.shift-dialog) {
  border-radius: 32px !important;
  overflow: hidden;
  border: none;
  box-shadow: 0 40px 60px -20px rgb(0 0 0 / 0.3);
}

:deep(.shift-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  background: white;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
}

:deep(.shift-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: white;
}

.dark :deep(.shift-dialog .p-dialog-header),
.dark :deep(.shift-dialog .p-dialog-content) {
  background: #0f172a;
}
</style>
