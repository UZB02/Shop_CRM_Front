<template>
  <div class="w-full lg:w-[320px] xl:w-[340px] bg-[#f8fafc]/50 dark:bg-[#0c121e] border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-white/5 flex flex-col shrink-0 lg:h-full">
    <div class="flex flex-col gap-6 lg:flex-grow lg:overflow-y-auto custom-scrollbar p-4 md:p-6">
      
      <!-- Customer Section -->
      <div v-if="!initialSale" class="space-y-2">
        <label class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Mijoz (Ixtiyoriy)</label>
        <div class="relative group">
          <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <select 
            v-model="internalCustomerId" 
            class="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#131d31] border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 appearance-none transition-all text-slate-800 dark:text-slate-200 shadow-sm"
          >
            <option :value="null">Noma'lum mijoz</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.full_name }}</option>
          </select>
          <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 text-[11px] pointer-events-none"></i>
        </div>
      </div>
      <!-- Customer Display (Static) -->
      <div v-else class="p-3 rounded-[14px] bg-white dark:bg-[#131d31] border border-slate-100 dark:border-white/5 shadow-sm">
         <h5 class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-1.5 ml-1">Mijoz</h5>
         <div class="flex items-center gap-2.5 px-1 pb-1">
           <div class="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-user text-[12px] text-rose-500"></i>
           </div>
           <span class="text-[14px] font-bold text-slate-800 dark:text-slate-200">{{ initialSale.customer_name || 'Noma\'lum mijoz' }}</span>
         </div>
      </div>

      <!-- Reason Section -->
      <div class="space-y-2">
        <label class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Qaytarish Sababi</label>
        <textarea 
          v-model="internalReason"
          placeholder="Masalan: Mahsulot nuqsonli chiqqan..."
          class="w-full min-h-[90px] p-3.5 bg-white dark:bg-[#131d31] border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none shadow-sm placeholder-slate-400"
        ></textarea>
      </div>

      <!-- Spacer -->
      <div class="flex-grow"></div>

      <!-- Total Amount Summary & Finalize -->
      <div class="space-y-4">
        <div class="space-y-3 px-1">
           <h3 class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Jami summa</h3>
           <div class="flex justify-between items-baseline pt-1">
              <span class="text-[24px] font-black text-slate-900 dark:text-white tracking-tighter leading-none">{{ formatCurrency(totalAmount) }}</span>
           </div>
        </div>

        <div v-if="!showConfirm" class="w-full">
          <button 
            @click="showConfirm = true"
            :disabled="loading || disabled"
            class="w-full h-12 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500/90 dark:hover:bg-rose-500 disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 text-white rounded-[14px] text-xs font-black tracking-widest transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2 border border-rose-600/20 leading-none"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <i v-else class="pi pi-check-circle"></i>
            Tasdiqlash va Qaytarish
          </button>
          <p class="text-[11px] font-medium text-slate-400 dark:text-slate-500 text-center leading-relaxed mt-4">"Tasdiqlash" tugmasini bossangiz, mahsulotlar stokga qaytadi va tranzaksiya saqlanadi.</p>
        </div>

        <!-- Inline Confirmation -->
        <div v-else class="w-full flex flex-col gap-3 p-4 rounded-[16px] border border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 shadow-sm animate-in">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <i class="pi pi-exclamation-triangle text-sm"></i>
            </div>
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight pt-0.5">Haqiqatan ham ushbu mahsulotlarni qaytarmoqchimisiz?</p>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button @click="showConfirm = false" class="flex-1 h-10 rounded-xl bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95">Bekor qilish</button>
            <button @click="handleFinalSubmit" :disabled="loading" class="flex-1 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
              <i v-if="loading" class="pi pi-spinner pi-spin"></i>
              Ha, qaytarish
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  initialSale: Object,
  customers: Array,
  customerId: [Number, String],
  reason: String,
  totalAmount: Number,
  loading: Boolean,
  disabled: Boolean,
  formatCurrency: Function
})

const emit = defineEmits(['update:customerId', 'update:reason', 'submit'])

const internalCustomerId = computed({
  get: () => props.customerId,
  set: (val) => emit('update:customerId', val)
})

const internalReason = computed({
  get: () => props.reason,
  set: (val) => emit('update:reason', val)
})

const showConfirm = ref(false)

// Reset confirmation state if disabled becomes true
watch(() => props.disabled, (val) => {
  if (val) showConfirm.value = false
})

const handleFinalSubmit = () => {
  emit('submit')
  showConfirm.value = false
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>


