<template>
  <div class="pos-workspace min-h-screen font-inter text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">

    <!-- ── Header ──────────────────────────────────────────────────────── -->
    <PosHeader
      v-model:search-query="searchQueryGlobal"
      :active-shift="activeShift"
      :is-shift-enabled="settingsStore.isShiftEnabled && settingsStore.hasPlanShift"
      :worker-name="activeShift?.worker_open_name || authStore.user?.full_name || ''"
      @search-enter="handleSearchEnter"
      @search-ref="(el) => (searchRef = el)"
      @shift-action="handleShiftAction"
    >
      <template #printer>
        <PrinterStatusBar />
      </template>
    </PosHeader>

    <!-- ── Main: active shift OR shifts disabled ───────────────────────── -->
    <main
      v-if="activeShift || !settingsStore.isShiftEnabled || !settingsStore.hasPlanShift"
      class="flex-1 overflow-hidden flex flex-col lg:flex-row"
    >
      <!-- Hidden barcode scanner input -->
      <input
        ref="barcodeInput"
        type="text"
        v-model="barcodeBuffer"
        @keyup.enter="handleBarcodeScan"
        class="opacity-0 absolute -top-8 left-0"
      />

      <!-- Product Catalog (always visible) -->
      <section class="flex-1 h-full relative overflow-hidden flex flex-col p-3 sm:p-5 lg:p-8">
        <PosCatalog
          ref="catalogRef"
          :cart="cart"
          :active-shift="activeShift"
          :external-search="searchQueryGlobal"
          @add-to-cart="addToCart"
          @focus-barcode="focusScanning"
        />
      </section>

      <!-- Desktop Cart Sidebar (only mounted on lg+ screens) -->
      <section
        v-if="isDesktop"
        class="w-[340px] xl:w-[380px] flex-shrink-0 h-full border-l border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0f1422] z-10 shadow-lg flex flex-col overflow-hidden"
      >
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

      <!-- Mobile: Sticky Bar + Bottom Sheet Drawer (only on small screens) -->
      <MobileCartDrawer
        v-if="!isDesktop"
        v-model="mobileCartOpen"
        :cart="cart"
        :totals="cartTotals"
        @open="mobileCartOpen = true"
      >
        <PosCart
          :cart="cart"
          :totals="cartTotals"
          :orders="orders"
          :active-order-index="activeOrderIndex"
          @update-qty="updateQty"
          @remove="removeFromCart"
          @clear="clearCart"
          @checkout="mobileCartOpen = false; showCheckout = true"
          @update-discount="discountAmount = $event"
          @update-item-discount="updateItemDiscount"
          @new-order="createNewOrder"
          @switch-order="switchOrder"
          @remove-order="removeOrder"
        />
      </MobileCartDrawer>
    </main>

    <!-- ── Closed state (shift required but not opened) ───────────────── -->
    <div
      v-else-if="settingsStore.isShiftEnabled && settingsStore.hasPlanShift && !activeShift"
      class="flex-1 flex flex-col items-center justify-center py-20 px-8"
    >
      <div class="w-24 h-24 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
        <i class="pi pi-lock text-4xl text-slate-200 dark:text-slate-800" />
      </div>
      <div class="text-center mt-12 space-y-4 max-w-sm px-6">
        <h2 class="text-2xl font-black text-slate-800 dark:text-white font-outfit tracking-tighter">{{ $t('pos.terminal_closed') }}</h2>
        <p class="text-slate-400 font-medium text-sm">{{ $t('pos.need_to_open_shift') }}</p>
        <button
          @click="showShiftModal = true"
          class="inline-block px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-[13px] tracking-widest shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-all active:scale-95"
        >
          {{ $t('pos.open_shift') }}
        </button>
      </div>
    </div>

    <!-- ── Modals ──────────────────────────────────────────────────────── -->
    <ShiftModal
      v-model:visible="showShiftModal"
      :is-closing="!!activeShift"
      :shift="activeShift"
      :x-report="activeXReport"
      :loading="posLoading"
      :discrepancy-error="shiftDiscrepancyError"
      @update:discrepancy-error="shiftDiscrepancyError = $event"
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

    <PosReceipt
      v-model:visible="showReceipt"
      :transaction="lastTransaction"
      @print="printReceipt"
      @download="downloadReceipt(lastTransaction.id)"
    />

    <!-- Tur (Variant) Selection Modal -->
    <TurSelectModal
      :visible="turDialog"
      :product="selectedProductForTur"
      :turlar="turlar"
      :loading="loadingTurlar"
      @select="selectTur"
      @close="turDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

// Stores & composables
import { useAuthStore }     from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { usePOS }           from '@/composables/usePOS'
import { usePrinter }       from '@/composables/usePrinter'
import { shiftsAPI }        from '@/services/api'
import { usePosReceipt }    from './composables/usePosReceipt'

// Components
import PosHeader         from './components/PosHeader.vue'
import PosCatalog        from './components/PosCatalog.vue'
import PosCart           from './components/PosCart.vue'
import PosReceipt        from './components/PosReceipt.vue'
import CheckoutModal     from './components/CheckoutModal.vue'
import ShiftModal        from './components/ShiftModal.vue'
import PrinterStatusBar  from './components/PrinterStatusBar.vue'
import MobileCartDrawer  from './components/MobileCartDrawer.vue'
import TurSelectModal    from './components/TurSelectModal.vue'

// ─────────────────────────────────────────────────────────────────────────────
const authStore     = useAuthStore()
const settingsStore = useSettingsStore()
const toast         = useToast()
const { t }         = useI18n()

// ── POS core ─────────────────────────────────────────────────────────────────
const {
  activeShift, activeXReport, posLoading,
  orders, activeOrderIndex,
  cart, discountAmount, selectedCustomer, customers, customerGroups, cartTotals,
  createNewOrder, switchOrder, removeOrder,
  fetchShiftStatus, openShift, closeShift,
  addToCart, removeFromCart, updateQty, updateItemDiscount, scanAndAdd, clearCart,
  fetchCustomers, fetchCustomerGroups,
  performCheckout, downloadReceipt,
} = usePOS()

// ── Screen size: faqat bitta PosCart mount bo'lishi uchun ───────────────────
const isDesktop = ref(window.innerWidth >= 1024)
const onResize = () => { isDesktop.value = window.innerWidth >= 1024 }

// ── UI state ──────────────────────────────────────────────────────────────────
const showShiftModal       = ref(false)
const shiftDiscrepancyError = ref('')
const showCheckout         = ref(false)
const showReceipt          = ref(false)
const lastTransaction      = ref(null)
const mobileCartOpen       = ref(false)

// ── Barcode / search refs ─────────────────────────────────────────────────────
const barcodeBuffer    = ref('')
const barcodeInput     = ref(null)
const searchRef        = ref(null)
const searchQueryGlobal = ref('')
const catalogRef       = ref(null)

// ── Tur dialog state ──────────────────────────────────────────────────────────
const turDialog             = ref(false)
const selectedProductForTur = ref(null)
const turlar                = ref([])
const loadingTurlar         = ref(false)

// ── Receipt composable ────────────────────────────────────────────────────────
const { printReceipt } = usePosReceipt(showReceipt)
const { isConnected: isPrinterConnected } = usePrinter()

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('resize', onResize)
  await Promise.all([fetchShiftStatus(), fetchCustomers(), fetchCustomerGroups()])
  window.addEventListener('keydown', handleGlobalKey)
  if (activeShift.value) setTimeout(() => searchRef.value?.focus(), 500)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKey)
  window.removeEventListener('resize', onResize)
})

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard shortcuts
// ─────────────────────────────────────────────────────────────────────────────
const handleGlobalKey = (e) => {
  if (e.key === 'F2') { e.preventDefault(); focusScanning() }
  if (e.key === 'F4' && activeShift.value && cart.value.length > 0) {
    e.preventDefault(); showCheckout.value = true
  }
}

const focusScanning = () => barcodeInput.value?.focus()

// ─────────────────────────────────────────────────────────────────────────────
// Barcode scanner
// ─────────────────────────────────────────────────────────────────────────────
const handleBarcodeScan = async () => {
  const code = barcodeBuffer.value.trim()
  if (!code) return
  const result = await scanAndAdd(code)
  if (result === true) {
    barcodeBuffer.value = ''
  } else if (result?.needs_tur) {
    openTurDialog(result.product)
    barcodeBuffer.value = ''
  } else {
    setTimeout(() => { barcodeBuffer.value = '' }, 500)
  }
}

const handleSearchEnter = async () => {
  const query = searchQueryGlobal.value.trim()
  if (!query) return
  if (/^\d{5,18}$/.test(query)) {
    const result = await scanAndAdd(query)
    if (result === true) { searchQueryGlobal.value = ''; return }
    if (result?.needs_tur) { openTurDialog(result.product); searchQueryGlobal.value = ''; return }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tur (variant) selection
// ─────────────────────────────────────────────────────────────────────────────
const openTurDialog = async (product) => {
  selectedProductForTur.value = product
  turDialog.value    = true
  loadingTurlar.value = true
  try {
    const { productsAPI } = await import('@/services/api')
    turlar.value = (await productsAPI.getTurlar(product.id)).data
  } catch (err) {
    console.error('Fetch turlar error:', err)
  } finally {
    loadingTurlar.value = false
  }
}

const selectTur = (tur) => {
  addToCart(selectedProductForTur.value, tur)
  turDialog.value = false
}

// ─────────────────────────────────────────────────────────────────────────────
// Shift actions
// ─────────────────────────────────────────────────────────────────────────────
const handleShiftAction = async () => {
  if (activeShift.value) {
    try { await fetchShiftStatus() } catch { /* ignore */ }
  }
  showShiftModal.value = true
}

const onShiftConfirm = async (data) => {
  shiftDiscrepancyError.value = ''
  try {
    const success = activeShift.value
      ? await closeShift(data)
      : await openShift(data.branch, data.cash_start)
    if (success) showShiftModal.value = false
  } catch (err) {
    if (err?.needsReason) {
      // Backend xabar ichidagi -266700.00 kabi sonlarni formatlash
      shiftDiscrepancyError.value = (err.message || '').replace(
        /(-?\d[\d\s]*(?:\.\d+)?)/g,
        (match) => {
          const num = parseFloat(match.replace(/\s/g, ''))
          return isNaN(num) ? match : settingsStore.formatNumber(Math.abs(num))
        }
      )
    }
  }
}

const onDownloadShift = async (shiftId) => {
  try {
    const res  = await shiftsAPI.export(shiftId)
    const url  = window.URL.createObjectURL(new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }))
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: `shift-report-${shiftId}.xlsx`
    })
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('pos.report_download_error'), life: 3000 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout
// ─────────────────────────────────────────────────────────────────────────────
const onCheckoutConfirm = async (paymentData) => {
  try {
    const result = await performCheckout(paymentData)
    if (result) {
      lastTransaction.value = result
      showCheckout.value    = false
      showReceipt.value     = true
      catalogRef.value?.fetchProducts(searchQueryGlobal.value)
      nextTick(() => {
        // Faqat QZ Tray ulangan bo'lsa avtomatik chop etish
        // Ulanmagan bo'lsa kassir chekni ko'rib, o'zi "Chop etish" tugmasini bosadi
        if (isPrinterConnected.value) {
          printReceipt()
        }
      })
    }
  } catch (err) {
    console.error('Checkout error:', err)
  }
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.font-inter  { font-family: 'Inter',  sans-serif; }
</style>
