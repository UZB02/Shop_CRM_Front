<template>
  <div class="pos-workspace min-h-screen font-inter text-slate-900 dark:text-slate-100 flex flex-col pt-0 transition-colors duration-300">
    <!-- RetailOS Style Header -->
    <header class="bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800/60 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-10">
        <!-- Logo -->
        <h1 class="text-xl font-black font-outfit m-0 tracking-tighter leading-none dark:text-white">Sirius CRM</h1>

        <!-- Integrated Search -->
        <div class="hidden lg:flex w-[400px] relative group">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            ref="searchRef"
            v-model="searchQueryGlobal" 
            type="text" 
            placeholder="Skanerlang yoki mahsulot nomi..." 
            @keyup.enter="handleSearchEnter"
            class="w-full bg-[#f4f7fa] dark:bg-slate-950/40 border-none rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 placeholder:text-slate-300 dark:placeholder:text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <!-- Center-Right Info Sections -->
      <div class="flex items-center gap-8">
        <!-- Do'kon Info -->
        <div class="hidden xl:flex items-center gap-4 text-right">
           <div class="flex flex-col">
              <span class="text-[11px] font-black text-slate-400 tracking-widest leading-none mb-1">Do'kon</span>
              <span class="text-xs font-black text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {{ activeShift?.branch_name || authStore.user?.branch_name || authStore.user?.worker?.branch_name || 'Tanlanmagan' }}
              </span>
           </div>
        </div>

        <!-- Xodim Info -->
        <div class="hidden sm:flex items-center gap-3">
           <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold transition-transform hover:scale-105">
              {{ (activeShift?.worker_open_name || authStore.user?.full_name || 'U').charAt(0) }}
           </div>
           <div class="flex flex-col">
              <span class="text-[11px] font-black text-slate-400 tracking-widest leading-none mb-1">Xodim</span>
              <span class="text-xs font-black text-slate-800 dark:text-slate-200">
                {{ activeShift?.worker_open_name || authStore.user?.full_name || 'Foydalanuvchi' }}
              </span>
           </div>
        </div>

        <!-- Vertical Divider -->
        <div class="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Shift & Actions -->
        <div class="flex items-center gap-3">
          <div v-if="activeShift && settingsStore.isShiftEnabled" class="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
             <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-pulse"></span>
             <span class="text-[12px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider">Smena #{{ activeShift.id }}</span>
          </div>

          <button 
            v-if="settingsStore.isShiftEnabled"
            @click="handleShiftAction"
            class="px-6 py-3.5 rounded-xl text-[12px] font-black transition-all shadow-xl active:scale-95"
            :class="activeShift && activeShift.status === 'open' ? 'bg-[#151c2f] text-white hover:bg-[#0f1422]' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'"
          >
            {{ activeShift && activeShift.status === 'open' ? 'Smena Yopish' : (activeShift?.status === 'closed' ? 'Smena Hisoboti' : 'Smena Ochish') }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Dynamic Layout -->
    <main v-if="activeShift || !settingsStore.isShiftEnabled" class="flex-1 overflow-hidden flex">
      <!-- Left side: Product Library -->
      <section class="flex-1 h-full relative overflow-hidden flex flex-col p-8">
        <input ref="barcodeInput" type="text" v-model="barcodeBuffer" @keyup.enter="handleBarcodeScan" class="opacity-0 absolute -top-8 left-0"/>
        
        <PosCatalog 
          ref="catalogRef"
          :cart="cart"
          :active-shift="activeShift"
          @add-to-cart="addToCart"
          @focus-barcode="focusScanning"
          :external-search="searchQueryGlobal"
        />
      </section>

      <!-- Right side: Sidebar (Cart) -->
      <section class="w-[340px] xl:w-[380px] flex-shrink-0 h-full border-l border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0f1422] z-10 shadow-lg flex flex-col overflow-hidden">
        <PosCart 
          :cart="cart"
          :totals="cartTotals"
          :orders="orders"
          :active-order-index="activeOrderIndex"
          @update-qty="updateQty"
          @remove="removeFromCart"
          @clear="clearCart"
          @checkout="showCheckout = true"
          @update-discount="discountAmount = $event"
          @update-item-discount="updateItemDiscount"
          @new-order="createNewOrder"
          @switch-order="switchOrder"
          @remove-order="removeOrder"
        />
      </section>
    </main>

    <!-- Closed State (Only if shifts are enabled but none is active) -->
    <div v-else-if="settingsStore.isShiftEnabled && !activeShift" class="flex-1 flex flex-col items-center justify-center py-20 px-8">
      <div class="w-24 h-24 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
         <i class="pi pi-lock text-4xl text-slate-200 dark:text-slate-800"></i>
      </div>
      <div class="text-center mt-12 space-y-4 max-w-sm px-6">
        <h2 class="text-2xl font-black text-slate-800 dark:text-white font-outfit tracking-tighter">Terminal Yopilgan</h2>
        <p class="text-slate-400 font-medium text-sm">Savdoni boshlash uchun avval yangi smena ochishingiz lozim.</p>
        <button 
          @click="showShiftModal = true"
          class="inline-block px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-[13px] tracking-widest shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-all active:scale-95"
        >
          Smena Ochish
        </button>
      </div>
    </div>

    <!-- Modals -->
      <ShiftModal 
        v-model:visible="showShiftModal" 
        :is-closing="!!activeShift" 
        :shift="activeShift" 
        :x-report="activeXReport"
        :loading="posLoading" 
        @confirm="onShiftConfirm"
        @download="onDownloadShift"
      />
      <CheckoutModal 
        v-model:visible="showCheckout" 
        :total="cartTotals.finalTotal" 
        :currency-code="cartTotals.currency"
        :customers="customers"
        :customer-groups="customerGroups"
        v-model:selected-customer="selectedCustomer" 
        :loading="posLoading" 
        @search-customers="fetchCustomers"
        @confirm="onCheckoutConfirm" 
      />
      <PosReceipt v-model:visible="showReceipt" :transaction="lastTransaction" @print="printReceipt" @download="downloadReceipt(lastTransaction.id)" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { usePOS } from '@/composables/usePOS'
  import { useAuthStore } from '@/store/auth'
  import { useSettingsStore } from '@/store/settings'
  import { shiftsAPI } from '@/services/api' 
  import { useToast } from 'primevue/usetoast'
  import PosCatalog from './components/PosCatalog.vue'
  import PosCart from './components/PosCart.vue'
  import PosReceipt from './components/PosReceipt.vue'
  import CheckoutModal from './components/CheckoutModal.vue'
  import ShiftModal from './components/ShiftModal.vue'
  
  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()
  const toast = useToast()
  
  const {
    activeShift,
    activeXReport,
    shiftLoading,
    posLoading,
    orders,
    activeOrderIndex,
    cart,
    discountAmount,
    selectedCustomer,
    customers,
    customerGroups,
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
    fetchCustomerGroups,
    performCheckout,
    downloadReceipt
  } = usePOS()

  // ... (o'rta qismlar uzgarmaydi)

  const onDownloadShift = async (shiftId) => {
    try {
      const res = await shiftsAPI.export(shiftId)
      // Excel uchun blob yaratamiz
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `shift-report-${shiftId}.xlsx`) // .xlsx formatida yuklaymiz
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Hisobotni yuklab bo\'lmadi', life: 3000 })
    }
  }

const showShiftModal = ref(false)
const showCheckout = ref(false)
const showReceipt = ref(false)
const lastTransaction = ref(null)
const barcodeBuffer = ref('')
const barcodeInput = ref(null)
const searchRef = ref(null)
const searchQueryGlobal = ref('')
const catalogRef = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchShiftStatus(),
    fetchCustomers(),
    fetchCustomerGroups()
  ])
  window.addEventListener('keydown', handleGlobalKey)
  if (activeShift.value) {
    setTimeout(() => searchRef.value?.focus(), 500)
  }
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
  const result = await scanAndAdd(code)
  if (result === true) { 
    barcodeBuffer.value = '' 
  } else if (result && result.needs_tur) {
    catalogRef.value?.handleProductClick(result.product)
    barcodeBuffer.value = ''
  } else { 
    setTimeout(() => { barcodeBuffer.value = '' }, 500) 
  }
}

const handleSearchEnter = async () => {
  const query = searchQueryGlobal.value.trim()
  if (!query) return

  // Agar matn barkod kabi ko'rinsa (masalan: 13 ta raqam bo'lib, uning bir qismi har xil bo'lishi mumkin deb, faqat raqam tekshiramiz)
  // Barkod skanerlar odatda ENTER ni avtomatik yuboradi.
  if (/^\d{5,18}$/.test(query)) {
    const result = await scanAndAdd(query)
    if (result === true) {
      searchQueryGlobal.value = ''
      return
    } else if (result && result.needs_tur) {
      catalogRef.value?.handleProductClick(result.product)
      searchQueryGlobal.value = ''
      return
    }
  }
  
  // Agar barkod sifatida topilmasa, lekin qidiruv natijasida faqat 1 ta mahsulot bo'lsa, 
  // ENTER bosilganda o'shani qo'shib yuborish mantiqan to'g'ri (ixtiyoriy, foydalanuvchi doimiy ishi uchun)
}

const handleShiftAction = () => {
  showShiftModal.value = true
}

const onShiftConfirm = async (data) => {
  // activeShift bo'lsa smena yopiladi: data faqat cashCounted summasi
  // activeShift bo'lmasa smena ochiladi: data = { branch, cash_start }
  let success = activeShift.value 
    ? await closeShift(data) 
    : await openShift(data.branch, data.cash_start)
    
  if (success) showShiftModal.value = false
}

const onCheckoutConfirm = async (paymentData) => {
  try {
    const result = await performCheckout(paymentData)
    if (result) {
      lastTransaction.value = result
      showCheckout.value = false
      showReceipt.value = true
      
      // Refresh catalog to update stock levels
      if (catalogRef.value) {
        catalogRef.value.fetchProducts(searchQueryGlobal.value)
      }
    }
  } catch (error) {
    console.error('Checkout error:', error)
  }
}

const printReceipt = () => {
  const el = document.getElementById('printable-receipt')
  if (!el) return
  const html = el.innerHTML
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:80mm;height:auto;border:none;'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow.document
  doc.open()
  doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Savdo cheki</title><style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Courier New',monospace;font-size:9.5px;color:#1e293b;background:#fff;padding:8px 12px;width:80mm;}
    .text-center{text-align:center;} .font-black{font-weight:900;} .font-bold{font-weight:700;}
    .text-slate-400{color:#94a3b8;} .text-slate-500{color:#64748b;} .text-slate-700{color:#334155;}
    .text-slate-800{color:#1e293b;} .text-slate-900{color:#0f172a;}
    .text-emerald-500{color:#10b981;} .text-emerald-600{color:#059669;}
    .text-rose-400{color:#f87171;} .text-rose-500{color:#ef4444;} .text-amber-500{color:#f59e0b;}
    .text-xs{font-size:9px;} .text-sm{font-size:10px;} .text-lg{font-size:14px;}
    .text-xl{font-size:16px;font-weight:900;} .{text-transform:;}
    .tracking-widest{letter-spacing:0.15em;} .tracking-tighter{letter-spacing:-0.02em;}
    .font-outfit{font-family:'Courier New',monospace;}
    .flex{display:flex;} .justify-between{justify-content:space-between;} .items-center{align-items:center;}
    .space-y-1>*+*{margin-top:2px;} .space-y-1\\.5>*+*{margin-top:3px;} .space-y-2\\.5>*+*{margin-top:6px;}
    .border-b-2{border-bottom:1.5px dashed #cbd5e1;} .border-t-2{border-top:1.5px dashed #cbd5e1;}
    .border-t{border-top:1px dashed #e2e8f0;}
    .py-4{padding:8px 0;} .pt-3{padding-top:6px;} .pt-2{padding-top:4px;} .pb-2{padding-bottom:4px;}
    .mb-1{margin-bottom:2px;} .mb-2{margin-bottom:4px;} .mb-3{margin-bottom:8px;} .mt-0\\.5{margin-top:2px;}
    .leading-none{line-height:1;} .leading-tight{line-height:1.25;} .leading-relaxed{line-height:1.5;}
    .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .receipt-paper{border:none!important;box-shadow:none!important;padding:0!important;}
  </style></head><body>${html}</body></html>`)
  doc.close()
  iframe.contentWindow.focus()
  iframe.contentWindow.print()
  setTimeout(() => document.body.removeChild(iframe), 1000)
}
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


