<template>
  <div class="pos-workspace min-h-screen font-inter text-slate-900 dark:text-slate-100 flex flex-col pt-0 transition-colors duration-300">
    <!-- RetailOS Style Header -->
    <header class="bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800/60 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-10">
        <!-- Logo -->
        <div class="flex flex-col">
          <h1 class="text-xl font-black font-outfit m-0 tracking-tighter leading-none dark:text-white">Sirius CRM</h1>
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-tight">Point of Sale</span>
        </div>

        <!-- Integrated Search -->
        <div class="hidden lg:flex w-[400px] relative group">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            v-model="searchQueryGlobal" 
            type="text" 
            placeholder="Barcode yoki mahsulot nomi..." 
            class="w-full bg-[#f4f7fa] dark:bg-slate-950/40 border-none rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 placeholder:text-slate-300 dark:placeholder:text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <!-- Center-Right Info Sections -->
      <div class="flex items-center gap-8">
        <!-- Do'kon Info -->
        <div class="hidden xl:flex items-center gap-4 text-right">
           <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Do'kon</span>
              <span class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase truncate max-w-[120px]">
                {{ activeShift?.branch_name || 'Tanlanmagan' }}
              </span>
           </div>
        </div>

        <!-- Xodim Info -->
        <div class="hidden sm:flex items-center gap-3">
           <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold uppercase">
              {{ authStore.user?.full_name?.charAt(0) || 'U' }}
           </div>
           <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Xodim</span>
              <span class="text-xs font-black text-slate-800 dark:text-slate-200">
                {{ authStore.user?.full_name || 'Foydalanuvchi' }}
              </span>
           </div>
        </div>

        <!-- Vertical Divider -->
        <div class="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Shift & Actions -->
        <div class="flex items-center gap-3">
          <div v-if="activeShift" class="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
             <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-pulse"></span>
             <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Smena #{{ activeShift.id }}</span>
          </div>

          <button 
            @click="handleShiftAction"
            class="px-6 py-3.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl active:scale-95"
            :class="activeShift ? 'bg-[#151c2f] text-white hover:bg-[#0f1422]' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'"
          >
            {{ activeShift ? 'Smena Yopish' : 'Smena Ochish' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Dynamic Layout -->
    <main v-if="activeShift" class="flex-1 overflow-hidden grid grid-cols-12">
      <!-- Left side: Product Library -->
      <section class="col-span-12 lg:col-span-8 h-full relative overflow-hidden flex flex-col p-8">
        <input ref="barcodeInput" type="text" v-model="barcodeBuffer" @keyup.enter="handleBarcodeScan" class="opacity-0 absolute -top-8 left-0"/>
        
        <PosCatalog 
          @add-to-cart="addToCart"
          @focus-barcode="focusScanning"
          :external-search="searchQueryGlobal"
        />
      </section>

      <!-- Right side: Sidebar (Cart) -->
      <section class="col-span-12 lg:col-span-4 h-full border-l border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0f1422] z-10 shadow-lg relative flex flex-col">
        <PosCart 
          :cart="cart"
          :totals="cartTotals"
          :customers="customers"
          :orders="orders"
          :active-order-index="activeOrderIndex"
          v-model:selectedCustomer="selectedCustomer"
          @update-qty="updateQty"
          @remove="removeFromCart"
          @clear="clearCart"
          @checkout="showCheckout = true"
          @search-customers="fetchCustomers"
          @update-discount="discountAmount = $event"
          @update-item-discount="updateItemDiscount"
          @new-order="createNewOrder"
          @switch-order="switchOrder"
          @remove-order="removeOrder"
        />
      </section>
    </main>

    <!-- Closed State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center py-20 px-8">
      <div class="w-24 h-24 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
         <i class="pi pi-lock text-4xl text-slate-200 dark:text-slate-800"></i>
      </div>
      <div class="text-center mt-12 space-y-4 max-w-sm px-6">
        <h2 class="text-2xl font-black text-slate-800 dark:text-white font-outfit uppercase tracking-tighter">Terminal Yopilgan</h2>
        <p class="text-slate-400 font-medium text-sm">Savdoni boshlash uchun avval yangi smena ochishingiz lozim.</p>
        <button 
          @click="showShiftModal = true"
          class="inline-block px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-all active:scale-95"
        >
          Smena Ochish
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ShiftModal v-model:visible="showShiftModal" :is-closing="!!activeShift" :shift="activeShift" :loading="posLoading" @confirm="onShiftConfirm" />
    <CheckoutModal v-model:visible="showCheckout" :total="cartTotals.finalTotal" :selected-customer="selectedCustomer" :loading="posLoading" @confirm="onCheckoutConfirm" />
    <PosReceipt v-model:visible="showReceipt" :transaction="lastTransaction" @print="printReceipt" @download="downloadReceipt(lastTransaction.id)" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePOS } from '@/composables/usePOS'
import { useAuthStore } from '@/store/auth'
import PosCatalog from './components/PosCatalog.vue'
import PosCart from './components/PosCart.vue'
import PosReceipt from './components/PosReceipt.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import ShiftModal from './components/ShiftModal.vue'

const authStore = useAuthStore()

const {
  activeShift,
  posLoading,
  orders,
  activeOrderIndex,
  cart,
  discountAmount,
  selectedCustomer,
  customers,
  cartTotals,
  createNewOrder,
  switchOrder,
  removeOrder,
  fetchShiftStatus,
  openShift,
  closeShift,
  addToCart,
  removeFromCart,
  updateQty,
  updateItemDiscount,
  scanAndAdd,
  clearCart,
  fetchCustomers,
  performCheckout,
  downloadReceipt
} = usePOS()

const showShiftModal = ref(false)
const showCheckout = ref(false)
const showReceipt = ref(false)
const lastTransaction = ref(null)
const barcodeBuffer = ref('')
const barcodeInput = ref(null)
const searchQueryGlobal = ref('')

onMounted(async () => {
  await fetchShiftStatus()
  window.addEventListener('keydown', handleGlobalKey)
  if (activeShift.value) focusScanning()
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalKey))

const handleGlobalKey = (e) => {
  if (e.key === 'F2') { e.preventDefault(); focusScanning() }
  if (e.key === 'F4' && activeShift.value && cart.value.length > 0) { e.preventDefault(); showCheckout.value = true }
}

const focusScanning = () => barcodeInput.value?.focus()

const handleBarcodeScan = async () => {
  const code = barcodeBuffer.value.trim()
  if (!code) return
  const success = await scanAndAdd(code)
  if (success) { barcodeBuffer.value = '' } 
  else { setTimeout(() => { barcodeBuffer.value = '' }, 500) }
}

const handleShiftAction = () => {
  showShiftModal.value = true
}

const onShiftConfirm = async (data) => {
  let success = activeShift.value ? await closeShift(data.cash_counted) : await openShift(data.branch, data.cash_start)
  if (success) showShiftModal.value = false
}

const onCheckoutConfirm = async (paymentData) => {
  const result = await performCheckout(paymentData)
  if (result) {
    lastTransaction.value = result
    showCheckout.value = false
    showReceipt.value = true
  }
}

const printReceipt = () => window.print()
const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.font-inter { font-family: 'Inter', sans-serif; }

.shadow-pulse {
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
</style>
