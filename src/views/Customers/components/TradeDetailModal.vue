<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        <!-- Minimalist Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/60 dark:bg-[#040814]/80 backdrop-blur-sm transition-opacity"
          @click="$emit('update:visible', false)"
        ></div>

        <!-- Premium Modal Wrapper -->
        <div class="relative w-full max-w-[900px] bg-white dark:bg-[#0f1524] rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 flex flex-col max-h-[92vh]">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/[0.02]">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-[12px] bg-emerald-50 dark:bg-[#131d31] flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/10 shadow-sm">
                <i class="pi pi-receipt text-lg"></i>
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-3">
                  <h2 class="text-sm font-bold text-slate-800 dark:text-white leading-none">{{ $t('customers.trades.detail_title') }}</h2>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-none">#{{ trade.id }}</span>
                </div>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-1">{{ trade.created_on }}</p>
              </div>
            </div>
            
            <button 
              @click="$emit('update:visible', false)"
              class="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95 border border-transparent dark:border-white/5"
            >
              <i class="pi pi-times text-[11px] font-bold"></i>
            </button>
          </div>

          <!-- Layout Body -->
          <div class="flex flex-col md:flex-row overflow-hidden flex-grow relative">
            
            <!-- Left Side: Product List -->
            <div class="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col h-full">
              <div class="flex items-center justify-between mb-4 shrink-0">
                <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{{ $t('customers.trades.items_title') }}</h3>
                <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/10 leading-none">{{ trade.items?.length }} {{ $t('common.pcs') }}</span>
              </div>

              <div class="flex-grow">
                 <div class="space-y-2.5">
                   <div v-for="(item, idx) in processedItems" :key="idx" 
                        class="group flex items-center gap-4 p-3 rounded-[14px] transition-all duration-200 border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02] shadow-sm hover:shadow-md"
                        :class="{'opacity-40 grayscale-[50%]': item.isFullyReturned}">
                     <div class="w-10 h-10 rounded-[10px] bg-slate-50 dark:bg-[#1a2333] flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 transition-all border border-slate-200/50 dark:border-white/5"
                          :class="{'group-hover:scale-105 group-hover:text-emerald-500': !item.isFullyReturned}">
                       <i class="pi pi-box text-sm"></i>
                     </div>
                     <div class="flex-grow min-w-0">
                       <div class="flex items-center gap-2 mb-1">
                         <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" :class="{'line-through opacity-60': item.isFullyReturned}">{{ item.product_name }}</h4>
                         <div v-if="item.tur_name" class="flex items-center gap-1">
                           <span class="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-widest leading-none">
                             {{ item.tur_name }}
                           </span>
                           <span v-if="item.tur_color" class="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest leading-none">
                             {{ item.tur_color }}
                           </span>
                         </div>
                         <span v-if="item.isReturned" class="text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1 py-0.5 rounded border border-amber-100 dark:border-amber-500/10 uppercase tracking-widest leading-none">
                           {{ item.isFullyReturned ? 'Qaytarilgan' : `Qaytarildi (${item.returned_qty})` }}
                         </span>
                         <span v-if="item.hasDiscount" class="text-[8px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1 py-0.5 rounded border border-rose-100 dark:border-rose-500/10 uppercase tracking-widest leading-none">Chegirma</span>
                       </div>
                       <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center flex-wrap gap-y-1">
                         <span class="text-slate-700 dark:text-slate-300">{{ item.quantity }} {{ item.unit }}</span>
                         <span class="mx-1.5 text-slate-300 dark:text-slate-600">×</span> 
                         <template v-if="item.hasDiscount">
                           <span class="line-through text-slate-400 dark:text-slate-500 mr-1.5">{{ formatCurrency(item.original_price) }}</span>
                           <span class="text-rose-500 font-bold">{{ formatCurrency(item.unit_price) }}</span>
                         </template>
                         <template v-else>
                           {{ formatCurrency(item.unit_price) }}
                         </template>

                         <!-- Detail breakdown for returns -->
                         <template v-if="item.isReturned && !item.isFullyReturned">
                           <span class="mx-2 text-slate-300 dark:text-slate-700">|</span>
                           <span class="text-amber-500 font-bold">Qaytarilgan: {{ item.returned_qty }}</span>
                           <span class="mx-2 text-slate-300 dark:text-slate-700">|</span>
                           <span class="text-emerald-500 font-bold">Qolgan: {{ item.net_qty }}</span>
                         </template>
                       </p>
                     </div>
                     <div class="text-right shrink-0 flex flex-col items-end justify-center">
                       <span class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-none" :class="{'opacity-60': item.isFullyReturned}">{{ formatCurrency(item.total_price) }}</span>
                       <span v-if="item.isReturned && !item.isFullyReturned" class="text-[9px] font-bold text-emerald-500 mt-1 leading-none">Haqiqiy: {{ formatCurrency(item.net_total_price) }}</span>
                       <span v-if="item.hasDiscount" class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 leading-none">-{{ formatCurrency(item.discountAmount) }}</span>
                     </div>
                   </div>
                 </div>

                 <!-- Description if exists -->
                 <div v-if="trade.description?.trim()" class="mt-4 p-3 rounded-[14px] bg-amber-50 border border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10 flex gap-3">
                   <div class="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                     <i class="pi pi-comment text-amber-600 dark:text-amber-400 text-[9px]"></i>
                   </div>
                   <div>
                      <h5 class="text-[9px] font-black uppercase text-amber-600/70 dark:text-amber-500/70 tracking-[0.15em] mb-0.5">Izoh</h5>
                      <p class="text-[11px] text-amber-800 dark:text-amber-200/80 leading-relaxed font-medium">{{ trade.description }}</p>
                   </div>
                 </div>
              </div>
            </div>

            <!-- Right Side: Sidebar -->
            <div class="w-full md:w-[320px] lg:w-[340px] bg-[#f8fafc]/50 dark:bg-[#0c121e] border-l border-slate-100 dark:border-white/5 flex flex-col shrink-0">
              <div class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                <!-- Summary Section -->
                <div>
                  <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 pl-1">{{ $t('common.payment_summary') }}</h3>
                  
                  <div class="space-y-2.5 px-1">
                    <div class="flex justify-between items-center text-[11px] font-semibold">
                      <span class="text-slate-500 dark:text-slate-400">Umumiy summa</span>
                      <span class="text-slate-800 dark:text-slate-200">{{ formatCurrency(trade.total_price) }}</span>
                    </div>
                    <div v-if="summary.hasDiscount" class="flex justify-between items-center text-[11px] font-semibold">
                      <span class="text-emerald-500">Chegirma</span>
                      <span class="text-emerald-500">-{{ formatCurrency(trade.discount_amount) }}</span>
                    </div>
                    
                    <div class="pt-3 mt-1 border-t border-slate-200 dark:border-white/5">
                      <div class="flex justify-between items-baseline">
                        <span class="text-[9px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest">Jami Summa</span>
                        <span class="text-[18px] font-black text-slate-900 dark:text-white tracking-tighter">{{ formatCurrency(summary.finalTotal) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Breakdown Cards -->
                <div class="grid grid-cols-1 gap-3">
                  <div class="p-4 bg-white dark:bg-[#131d31] rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm relative overflow-hidden flex flex-col justify-between group h-[80px]">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-xl -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                    <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] relative z-10 block mb-1.5">{{ $t('common.paid') }}</span>
                    <div class="flex items-end justify-between relative z-10 mt-auto">
                      <span class="text-[17px] font-black text-emerald-500 tracking-tight leading-none">{{ formatCurrency(trade.paid_amount) }}</span>
                      <div class="scale-90 origin-bottom-right">
                        <TradeStatusBadge :status="trade.payment_type" :display-label="trade.payment_type_display" />
                      </div>
                    </div>
                  </div>

                  <div v-if="summary.hasDebt" class="p-4 bg-rose-50 dark:bg-rose-500/5 rounded-[16px] border border-rose-100 dark:border-transparent shadow-sm relative overflow-hidden flex flex-col justify-between h-[80px]">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-12 -mt-12"></div>
                    <span class="text-[8px] font-black text-rose-500/70 uppercase tracking-[0.15em] relative z-10 block mb-1.5">{{ $t('customers.details.debt') }}</span>
                    <div class="flex items-end justify-between relative z-10 mt-auto">
                      <span class="text-[17px] font-black text-rose-500 tracking-tight leading-none">{{ formatCurrency(trade.debt_amount) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Info Blocks -->
                <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div class="flex items-center justify-between p-3 bg-white dark:bg-[#131d31] rounded-[14px] border border-slate-200 dark:border-transparent shadow-sm">
                    <div class="flex flex-col gap-0.5">
                      <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{{ $t('shifts.workers.col_worker') }}</span>
                      <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">{{ trade.worker_name }}</span>
                    </div>
                    <div v-if="trade.smena_id" class="px-2 py-1.5 bg-slate-100 dark:bg-white/5 rounded-md text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/5 shadow-inner leading-none">
                      SMENA #{{ trade.smena_id }}
                    </div>
                  </div>

                  <div v-if="trade.ofd_status && trade.ofd_status !== 'disabled'" class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-1.5">
                      <i class="pi pi-shield text-[9px] text-slate-400"></i>
                      <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fiskal Holat</span>
                    </div>
                    <span v-if="trade.ofd_status === 'success'" class="text-[9px] font-black text-emerald-500 flex items-center gap-1"><i class="pi pi-check-circle text-[9px]"></i> Yuborildi</span>
                    <span v-else class="text-[9px] font-black text-amber-500 flex items-center gap-1"><i class="pi pi-info-circle text-[9px]"></i> {{ trade.ofd_status }}</span>
                  </div>
                  <div v-else-if="trade.ofd_status === 'disabled'" class="flex items-center justify-between px-2">
                     <div class="flex items-center gap-1.5">
                      <i class="pi pi-shield text-[9px] text-slate-400"></i>
                      <span class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fiskal Holat</span>
                    </div>
                    <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1 opacity-60"><i class="pi pi-ban text-[9px]"></i> O'chirilgan</span>
                  </div>

                </div>

                <!-- Main Actions Container -->
                <div class="flex flex-col gap-2.5 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                  <template v-if="!showCancelConfirm">
                    <button 
                      v-if="canInitReturn" 
                      @click="$emit('init-return', trade)"
                      class="w-full h-10 bg-[#ff3b5c] hover:bg-[#ff1f44] text-white rounded-[12px] text-[11px] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_8px_15px_-6px_#ff3b5c]"
                    >
                      <i class="pi pi-refresh text-[12px]"></i>
                      Tovarlarni qaytarish
                    </button>

                    <button 
                      v-if="canFullCancel" 
                      @click="showCancelConfirm = true"
                      class="w-full h-8 text-slate-400 dark:text-slate-500 hover:text-[#ff3b5c] hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-[10px] text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-1.5"
                    >
                      <i class="pi pi-times-circle text-[10px]"></i>
                      BEKOR QILISH (TOTAL)
                    </button>
                  </template>
                  
                  <div v-else class="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[16px] text-rose-600 dark:text-rose-400 animate-in slide-in-from-bottom-2 duration-300">
                    <p class="text-[11px] font-bold mb-3 text-center leading-relaxed text-rose-800 dark:text-rose-200">Savdoni bekor qilasizmi? <br/> <span class="text-[9px] font-medium opacity-80 mt-0.5">Mahsulotlar stokga qaytadi.</span></p>
                    <div class="flex gap-2">
                      <button 
                        @click="showCancelConfirm = false"
                        class="flex-1 h-8 rounded-lg bg-white dark:bg-[#131d31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] text-[10px] font-bold transition-colors"
                      >
                        Ortga
                      </button>
                      <button 
                        @click="executeCancel"
                        :disabled="isCancelling"
                        class="flex-1 h-8 rounded-lg bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-70"
                      >
                        <i v-if="isCancelling" class="pi pi-spinner pi-spin text-[9px]"></i>
                        Tasdiqlash
                      </button>
                    </div>
                  </div>

                  <button 
                    @click="printReceipt"
                    :disabled="isPrinting"
                    class="w-full h-10 bg-white dark:bg-white text-slate-900 dark:text-slate-900 rounded-[12px] border border-slate-200 dark:border-transparent text-[11px] font-bold transition-all hover:bg-slate-50 hover:border-slate-300 dark:hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1 shadow-sm"
                  >
                    <i v-if="isPrinting" class="pi pi-spinner pi-spin text-[12px]"></i>
                    <i v-else class="pi pi-print text-[12px]"></i>
                    CHOP ETISH
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
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import TradeStatusBadge from '@/views/Customers/components/TradeStatusBadge.vue'
import { useTradeUtils } from '@/views/Customers/composables/useTradeUtils'
import { useSettingsStore } from '@/store/settings'
import { salesAPI } from '@/services/api'

const props = defineProps({
  visible: Boolean,
  trade: { type: Object, required: true }
})

const emit = defineEmits(['update:visible', 'trade-cancelled', 'init-return'])

const settingsStore = useSettingsStore()
const { formatCurrency } = useTradeUtils()
const toast = useToast()

const isCancelling = ref(false)
const isPrinting = ref(false)
const showCancelConfirm = ref(false)

// Data Parsing & Computation - Optimized for Speed
const processedItems = computed(() => {
  if (!props.trade.items) return []
  return props.trade.items.map(item => {
    const qty = parseFloat(item.quantity || 0)
    const returnedQty = parseFloat(item.returned_qty || 0)
    const netQty = parseFloat(item.net_qty || (qty - returnedQty))
    const discAmt = parseFloat(item.item_discount_amt || 0)
    
    return {
      ...item,
      quantity: qty,
      returned_qty: returnedQty,
      net_qty: netQty,
      isReturned: returnedQty > 0,
      isFullyReturned: netQty <= 0,
      hasDiscount: discAmt > 0,
      discountAmount: discAmt * qty,
      total_price: parseFloat(item.total_price || 0),
      net_total_price: netQty * parseFloat(item.unit_price || 0)
    }
  })
})

const summary = computed(() => {
  const total = parseFloat(props.trade.total_price || 0)
  const discount = parseFloat(props.trade.discount_amount || 0)
  const debt = parseFloat(props.trade.debt_amount || 0)
  return {
    hasDiscount: discount > 0,
    hasDebt: debt > 0,
    finalTotal: total - discount
  }
})

const canInitReturn = computed(() => 
  (props.trade.status === 'completed' || props.trade.status === 'partially_returned') && settingsStore.isSaleReturnEnabled
)

const canFullCancel = computed(() => 
  (props.trade.status === 'completed' || props.trade.status === 'partially_returned') && settingsStore.isSaleReturnEnabled
)

// Actions
const printReceipt = async () => {
  if (isPrinting.value) return
  try {
    isPrinting.value = true
    const response = await salesAPI.getReceipt(props.trade.id)
    const file = new Blob([response.data], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(file)
    
    const printWindow = window.open(fileURL, '_blank')
    if (printWindow) {
      toast.add({ severity: 'info', summary: 'Chek', detail: 'Chop etishga tayyorlanmoqda...', life: 2000 })
    } else {
      toast.add({ severity: 'warn', summary: 'Diqqat', detail: 'Popup bloklangan bo\'lishi mumkin', life: 4000 })
    }
    
    // cleanup
    setTimeout(() => URL.revokeObjectURL(fileURL), 5000)
  } catch (error) {
    console.error('Error printing receipt:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Chekni yuklab bo\'lmadi', life: 3000 })
  } finally {
    isPrinting.value = false
  }
}

const executeCancel = async () => {
  if (isCancelling.value) return
  try {
    isCancelling.value = true
    await salesAPI.cancel(props.trade.id)
    toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Savdo bekor qilindi', life: 3000 })
    emit('trade-cancelled', props.trade.id)
    emit('update:visible', false)
  } catch (error) {
    console.error('Error cancelling trade:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: error.response?.data?.detail || 'Amalni bajarib bo\'lmadi', life: 5000 })
  } finally {
    isCancelling.value = false
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
