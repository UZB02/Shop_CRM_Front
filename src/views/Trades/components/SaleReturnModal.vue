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
      <div v-if="visible" class="fixed inset-0 z-[120] flex items-center justify-center">
        <!-- Minimalist Backdrop -->
        <div class="absolute inset-0 bg-white dark:bg-[#0f1524] transition-opacity"></div>
        
        <!-- Premium Full-Featured Modal Wrapper -->
        <div class="relative w-full h-full bg-white dark:bg-[#0f1524] overflow-hidden flex flex-col">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/[0.02]">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-[12px] bg-rose-50 dark:bg-[#131d31] flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/10 shadow-sm">
                <i class="pi pi-refresh text-lg"></i>
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-3">
                  <h2 class="text-sm font-bold text-slate-800 dark:text-white leading-none">TOVARNI QAYTARISH</h2>
                  <span v-if="initialSale" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-none">SAVDO #{{ initialSale.id }} ASOSIDA</span>
                </div>
              </div>
            </div>
            
            <!-- Mode Switcher (faqat initialSale bo'lmasa) -->
            <div v-if="!initialSale" class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
              <button
                @click="returnMode = 'manual'"
                :class="returnMode === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-black tracking-wide transition-all"
              >
                <i class="pi pi-list text-[10px]" />
                Qo'lda
              </button>
              <button
                @click="returnMode = 'barcode'"
                :class="returnMode === 'barcode'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-black tracking-wide transition-all"
              >
                <i class="pi pi-qrcode text-[10px]" />
                Barcode
              </button>
            </div>
            
            <button 
              @click="close"
              class="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95 border border-transparent dark:border-white/5"
            >
              <i class="pi pi-times text-[13px] font-bold"></i>
            </button>
          </div>

          <!-- Layout Body -->
          <div class="flex flex-col lg:flex-row flex-grow overflow-y-auto lg:overflow-hidden relative custom-scrollbar pb-6 lg:pb-0">
            
            <!-- Left Side: Items Selection -->
            <div class="flex-none lg:flex-grow p-4 md:p-6 flex flex-col lg:flex-row gap-5 lg:h-full lg:overflow-hidden">
              
              <!-- Left Column: Initial Sale Items or Search -->
              <div class="flex-[1.2] flex flex-col lg:overflow-hidden gap-2 lg:gap-0">

                <!-- Barcode Scanner Mode -->
                <div v-if="!initialSale && returnMode === 'barcode'" class="p-4 rounded-[16px] bg-white dark:bg-[#131d31] border border-slate-200 dark:border-white/5 shadow-sm">
                  <h3 class="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-3">BARCODE ORQALI CHEKNI TOPING</h3>
                  <BarcodeScanner @found="onBarcodeFound" />
                </div>

                <!-- Product Search (Only if not from specific sale, manual mode) -->
                <SaleReturnSearch
                   v-if="!initialSale && returnMode === 'manual'"
                   v-model:query="productQuery"
                   :search-results="searchResults"
                   :format-currency="formatCurrency"
                   @search="onSearchProducts"
                   @add="addProduct"
                />

                <!-- Initial Sale Items List -->
                <div v-if="initialSale" class="lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-2">
                  <SaleReturnInitialItems 
                     :initial-sale="initialSale"
                     :format-currency="formatCurrency"
                     :is-already-added="isAlreadyAdded"
                     @add="addFromSale"
                  />
                </div>
              </div>

              <!-- Middle Column: Selected Items (The Return Cart) -->
              <div class="flex-[0.9] flex flex-col lg:overflow-hidden">
                <SaleReturnCart 
                   class="lg:h-full"
                   :items="returnItems"
                   :format-currency="formatCurrency"
                   @update-qty="updateQty"
                   @remove="removeItem"
                />
              </div>
            </div>

            <!-- Right Side: Confirmation & Details -->
            <SaleReturnDetails 
               class="flex-none lg:h-full"
               :initial-sale="initialSale"
               :customers="customers"
               v-model:customer-id="selectedCustomerId"
               v-model:reason="reason"
               :total-amount="totalAmount"
               :loading="loading"
               :disabled="!returnItems.length"
               :format-currency="formatCurrency"
               @submit="submitReturn"
            />
          </div>

          <!-- Barcode Scan Confirmation Dialog (modal ichida, absolute overlay) -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showScanConfirm && scannedSale"
              class="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 dark:bg-[#040814]/60 backdrop-blur-sm"
            >
              <div class="relative w-full max-w-sm mx-4 bg-white dark:bg-[#131d31] rounded-[24px] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
                <!-- Dialog Header -->
                <div class="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-[10px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <i class="pi pi-qrcode text-base" />
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-slate-800 dark:text-white leading-none">Shu savdoni qaytarmoqchimisiz?</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">Barcode skaneridan topildi</p>
                  </div>
                </div>

                <!-- Sale Info -->
                <div class="px-5 py-4 space-y-2.5">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400 font-bold">Savdo №</span>
                    <span class="font-black text-slate-800 dark:text-white">#{{ scannedSale.id }}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400 font-bold">Sana</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ scannedSale.created_on }}</span>
                  </div>
                  <div v-if="scannedSale.customer" class="flex justify-between items-center text-xs">
                    <span class="text-slate-400 font-bold">Mijoz</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ scannedSale.customer }}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs pt-1.5 border-t border-slate-100 dark:border-white/5">
                    <span class="text-slate-500 font-black tracking-widest">JAMI</span>
                    <span class="text-base font-black text-slate-900 dark:text-white">{{ formatCurrency(scannedSale.total_price) }}</span>
                  </div>

                  <!-- Items preview -->
                  <div v-if="scannedSale.items?.length" class="mt-1 space-y-1">
                    <h5 class="text-[10px] font-black text-slate-400 tracking-widest">TOVARLAR</h5>
                    <div
                      v-for="(item, idx) in scannedSale.items"
                      :key="idx"
                      class="flex justify-between items-center py-1 text-[11px] border-b border-slate-50 dark:border-white/5 last:border-0"
                    >
                      <span class="text-slate-600 dark:text-slate-300 font-semibold">
                        {{ item.product }}
                        <span v-if="item.tur" class="text-slate-400">({{ item.tur }})</span>
                      </span>
                      <span class="text-slate-500 font-bold ml-2 shrink-0">{{ item.quantity }} dona</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="px-5 pb-5 flex gap-2">
                  <button
                    @click="cancelScanConfirm"
                    class="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
                  >
                    Bekor qilish
                  </button>
                  <button
                    @click="confirmScannedSale"
                    :disabled="loadingSale"
                    class="flex-1 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <i v-if="loadingSale" class="pi pi-spinner pi-spin text-[11px]" />
                    Ha, davom etish
                  </button>
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useReturnCart } from '../composables/useReturnCart'
import { useToast } from 'primevue/usetoast'
import { salesAPI } from '@/services/api'

import SaleReturnSearch from './SaleReturn/SaleReturnSearch.vue'
import SaleReturnInitialItems from './SaleReturn/SaleReturnInitialItems.vue'
import SaleReturnCart from './SaleReturn/SaleReturnCart.vue'
import SaleReturnDetails from './SaleReturn/SaleReturnDetails.vue'
import BarcodeScanner from './SaleReturn/BarcodeScanner.vue'

const props = defineProps({
  visible: Boolean,
  initialSale: Object
})

const emit = defineEmits(['update:visible', 'success', 'load-sale'])

const settingsStore = useSettingsStore()
const toast = useToast()
const formatCurrency = (val) => settingsStore.formatPrice(val)

// Return mode: 'manual' | 'barcode'
const returnMode = ref('manual')

// Barcode scan confirm dialog state
const scannedSale = ref(null)
const showScanConfirm = ref(false)
const loadingSale = ref(false)

const onBarcodeFound = (saleData) => {
  scannedSale.value = saleData
  showScanConfirm.value = true
}

const cancelScanConfirm = () => {
  showScanConfirm.value = false
  scannedSale.value = null
}

const confirmScannedSale = async () => {
  if (!scannedSale.value?.id) return
  loadingSale.value = true
  try {
    const res = await salesAPI.getById(scannedSale.value.id)
    emit('load-sale', res.data)
    showScanConfirm.value = false
    scannedSale.value = null
    returnMode.value = 'manual'
  } catch {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Savdo ma\'lumotlari yuklanmadi', life: 3000 })
  } finally {
    loadingSale.value = false
  }
}

const close = () => {
  emit('update:visible', false)
}

const {
  productQuery,
  searchResults,
  returnItems,
  reason,
  selectedCustomerId,
  customers,
  totalAmount,
  loading,
  resetForm,
  onSearchProducts,
  addProduct,
  addFromSale,
  isAlreadyAdded,
  removeItem,
  updateQty,
  submitReturn
} = useReturnCart(props, emit, close)

// Lifecycle
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
    returnMode.value = 'manual'
    scannedSale.value = null
    showScanConfirm.value = false
  }
})

watch(() => props.initialSale, (newVal) => {
  resetForm()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }

.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
