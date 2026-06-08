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
                <!-- Product Search (Only if not from specific sale) -->
                <SaleReturnSearch 
                   v-if="!initialSale"
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useReturnCart } from '../composables/useReturnCart'

import SaleReturnSearch from './SaleReturn/SaleReturnSearch.vue'
import SaleReturnInitialItems from './SaleReturn/SaleReturnInitialItems.vue'
import SaleReturnCart from './SaleReturn/SaleReturnCart.vue'
import SaleReturnDetails from './SaleReturn/SaleReturnDetails.vue'

const props = defineProps({
  visible: Boolean,
  initialSale: Object
})

const emit = defineEmits(['update:visible', 'success'])

const settingsStore = useSettingsStore()
const formatCurrency = (val) => settingsStore.formatPrice(val)

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
  }
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


