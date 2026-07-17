<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="rc-backdrop">
      <div v-if="visible" class="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm" @click="$emit('update:visible', false)" />
    </Transition>

    <!-- Receipt Drawer -->
    <Transition name="rc-slide">
      <div v-if="visible" class="fixed top-0 right-0 h-full z-[1101] w-[420px] max-w-full flex flex-col bg-white dark:bg-[#0b0f1a] shadow-2xl">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <i class="pi pi-check text-white text-sm font-black" />
            </div>
            <div>
              <p class="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-600 leading-none mb-0.5">{{ $t('pos.sale_completed') }}</p>
              <p class="text-sm font-black text-slate-800 dark:text-white font-outfit leading-none">{{ $t('pos.sales_receipt_num') }}{{ t.id }}</p>
            </div>
          </div>
          <button @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- Receipt Paper -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div id="printable-receipt" class="receipt-paper mx-auto max-w-[340px] print:text-black" :style="{ '--receipt-width': paperSize + 'mm' }">

            <!-- Store Header -->
            <div class="text-center py-4 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mb-3 print:border-black">
              <p class="text-sm font-black tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1 print:text-black">★ ★ ★</p>

              <!-- Logo -->
              <div v-if="settingsStore.receiptConfig.showLogo && settingsStore.storeLogoUrl" class="flex justify-center mb-2 print:flex print:justify-center" style="text-align: center; width: 100%;">
                <img :src="settingsStore.storeLogoUrl" alt="Store Logo" class="grayscale print:grayscale" style="width: 120px; max-width: 100%; height: auto; max-height: 120px; object-fit: contain; margin: 0 auto; display: block;" />
              </div>
              
              <p v-if="settingsStore.receiptConfig.header" class="text-sm font-bold text-slate-500 mb-1 whitespace-pre-line print:text-black print:font-bold">{{ settingsStore.receiptConfig.header }}</p>
              
              <h2 class="text-xl font-black tracking-tighter text-slate-900 dark:text-white print:text-black print:font-black print:text-xl">
                {{ settingsStore.storeName }}
              </h2>
              
              <p class="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest mt-0.5 print:text-black print:font-bold">{{ t.branch_name || $t('pos.store') }}</p>
              
              <div v-if="settingsStore.receiptConfig.address || settingsStore.receiptConfig.phone" class="mt-2 text-xs text-slate-400 font-bold leading-tight print:text-black print:font-bold">
                <p v-if="settingsStore.receiptConfig.address">{{ settingsStore.receiptConfig.address }}</p>
                <p v-if="settingsStore.receiptConfig.phone">{{ $t('pos.phone_short') }} {{ settingsStore.receiptConfig.phone }}</p>
              </div>
            </div>

            <!-- Meta Info -->
            <div class="space-y-1 text-xs mb-3 print:text-xs print:text-black">
              <div class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.date') }}</span>
                <span class="text-slate-700 dark:text-slate-300 font-black print:text-black print:font-black">{{ t.created_on || '—' }}</span>
              </div>
              <div v-if="settingsStore.receiptConfig.showWorker" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.cashier') }}</span>
                <span class="text-slate-700 dark:text-slate-300 font-black print:text-black print:font-black">{{ t.worker_name || '—' }}</span>
              </div>
              <div v-if="settingsStore.isShiftEnabled" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.shift') }}</span>
                <span class="text-slate-700 dark:text-slate-300 font-black print:text-black print:font-black">#{{ t.smena_id || '—' }}</span>
              </div>
              <div v-if="t.customer_name" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.customer') }}</span>
                <span class="text-slate-700 dark:text-slate-300 font-black print:text-black print:font-black">{{ t.customer_name }}</span>
              </div>

              <div v-if="t.receipt_number" class="flex justify-between">
                <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.receipt_no') }}</span>
                <span class="text-slate-700 dark:text-slate-300 font-black print:text-black print:font-black">{{ t.receipt_number }}</span>
              </div>
            </div>

            <!-- Items -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3 print:border-black">
              <p class="text-xs font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 text-center print:text-black print:font-black print:text-xs">{{ $t('pos.products_title') }}</p>
              <div class="space-y-2.5">
                <div v-for="(item, idx) in t.items" :key="item.id || idx">
                  <!-- Product name -->
                  <p class="text-sm font-black text-slate-800 dark:text-slate-200 truncate leading-tight print:text-black print:font-black print:text-sm">
                    {{ item.product_name || $t('pos.product') }}
                    <span v-if="item.tur_name" class="text-slate-400 font-normal print:text-black print:font-bold">
                       ({{ item.tur_name }}{{ item.tur_color ? ' / ' + item.tur_color : '' }})
                     </span>
                  </p>
                  <!-- qty × price = total -->
                  <div class="flex justify-between items-center mt-0.5">
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold print:text-xs">
                      {{ num(item.quantity) }} {{ item.unit || $t('pos.unit_piece') }} × {{ fmt(item.unit_price) }}
                    </span>
                    <span class="text-sm font-black text-slate-700 dark:text-slate-300 print:text-black print:font-black print:text-sm">
                      {{ fmt(num(item.quantity) * num(item.unit_price)) }}
                    </span>
                  </div>
                  <!-- item discount if any -->
                  <div v-if="num(item.item_discount_pct) > 0" class="flex justify-between items-center print:text-black">
                    <span class="text-xs text-rose-400 font-bold print:text-black print:font-bold print:text-xs">{{ $t('pos.discount') }} {{ item.item_discount_pct }}%:</span>
                    <span class="text-xs text-rose-400 font-bold print:text-black print:font-black print:text-xs">-{{ fmt(num(item.quantity) * num(item.unit_price) * num(item.item_discount_pct) / 100) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3 space-y-1.5 print:border-black">
              <!-- Jami Narx (Subtotal) -->
              <div class="flex justify-between items-center text-sm print:text-sm print:text-black">
                <span class="text-slate-500 dark:text-slate-400 font-bold print:text-black print:font-bold">{{ $t('pos.total_price') }}</span>
                <span class="text-slate-800 dark:text-slate-200 font-black print:text-black print:font-black">{{ fmt(t.total_price) }}</span>
              </div>

              <!-- Discount if any -->
              <div v-if="num(t.discount_amount) > 0" class="flex justify-between items-center text-xs print:text-xs print:text-black">
                <span class="text-rose-400 font-bold print:text-black print:font-bold">{{ $t('pos.discount') }}:</span>
                <span class="text-rose-500 font-black print:text-black print:font-black">-{{ fmt(t.discount_amount) }}</span>
              </div>

              <!-- Final paid line (TO'LANDI) -->
              <div class="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 print:border-black">
                <span class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight print:text-black print:font-black print:text-sm">{{ $t('pos.paid_caps') }}</span>
                <span class="text-2xl font-black text-emerald-500 dark:text-emerald-400 print:text-black print:font-black print:text-2xl">{{ fmt(t.paid_amount) }}</span>
              </div>

              <!-- Debt amount (Qarz) -->
              <div v-if="num(t.debt_amount) > 0" class="flex justify-between items-center text-sm print:text-sm print:text-black">
                <span class="font-black text-amber-500 print:text-black print:font-black">{{ $t('pos.debt') }}</span>
                <span class="font-black text-amber-500 print:text-black print:font-black">{{ fmt(t.debt_amount) }}</span>
              </div>
            </div>

            <!-- Payment Breakdown -->
            <div class="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3 print:border-black">
              <p class="text-xs font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 text-center print:text-black print:font-black print:text-xs">{{ $t('pos.payment_method_title') }}</p>
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs print:text-xs print:text-black">
                  <span class="text-slate-400 dark:text-slate-500 font-bold print:text-black print:font-bold">{{ $t('pos.type') }}</span>
                  <span class="font-black text-emerald-600 dark:text-emerald-400 tracking-wider print:text-black print:font-black">
                    {{ t.payment_type === 'cash' ? $t('pos.cash') : t.payment_type === 'card' ? $t('pos.card') : t.payment_type === 'debt' ? $t('pos.debt') : (t.payment_type_display || t.payment_type || '—') }}
                  </span>
                </div>
                <!-- Naqd Pul -->
                <div v-if="num(t.cash_amount) > 0" class="flex justify-between items-center text-sm print:text-sm print:text-black">
                  <span class="text-slate-500 dark:text-slate-400 font-bold print:text-black print:font-bold">{{ $t('pos.cash') }}:</span>
                  <span class="text-slate-800 dark:text-slate-200 font-black print:text-black print:font-black">{{ fmt(t.cash_amount) }}</span>
                </div>
                <!-- Karta -->
                <div v-if="num(t.card_amount) > 0" class="flex justify-between items-center text-sm print:text-sm print:text-black">
                  <span class="text-slate-500 dark:text-slate-400 font-bold print:text-black print:font-bold">{{ $t('pos.card') }}:</span>
                  <span class="text-slate-800 dark:text-slate-200 font-black print:text-black print:font-black">{{ fmt(t.card_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Barcode / QR Section -->
            <div class="text-center border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 mb-3 print:border-black">
              <!-- OFD ulangan holat: soliq QR kodi -->
              <template v-if="t.ofd_status === 'sent' && t.qr_code_url">
                <p class="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2 print:text-black">
                  SOLIQ QR KODI
                </p>
                <img
                  :src="t.qr_code_url"
                  alt="OFD QR"
                  class="mx-auto w-24 h-24 print:w-24 print:h-24"
                />
              </template>

              <!-- OFD o'chirilgan holat: bizning EAN-13 barcode -->
              <template v-else-if="t.barcode_image_url">
                <!-- Loading skeleton -->
                <div v-if="barcodeLoading" class="mx-auto w-40 h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <!-- Loaded barcode blob -->
                <img
                  v-else-if="blobBarcodeUrl"
                  :src="blobBarcodeUrl"
                  alt="Chek barcode"
                  width="130"
                  class="mx-auto receipt-barcode"
                  style="width: 130px !important; max-width: 130px !important; height: auto !important; margin: 0 auto !important; display: block !important; object-fit: contain !important;"
                />
              </template>
            </div>

            <!-- Footer -->
            <div class="text-center border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-3 pb-2 print:border-black">
               <p v-if="settingsStore.receiptConfig.promo" class="text-sm font-black text-emerald-600 dark:text-emerald-400 mb-2 italic print:text-black print:font-black">
                {{ settingsStore.receiptConfig.promo }}
              </p>
              <p class="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-widest leading-relaxed print:text-black print:font-bold">
                {{ settingsStore.receiptConfig.footer || $t('pos.thank_you_for_purchase') }}<br/>
                <span class="text-xs">★ ★ ★</span>
              </p>
            </div>

          </div>
        </div>

        <!-- Actions -->
        <div class="flex-shrink-0 px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div class="grid grid-cols-2 gap-2">
            <button @click="$emit('download')"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-black tracking-widest text-slate-600 dark:text-slate-300 transition-all active:scale-95">
              <i class="pi pi-download text-sm" />
              {{ $t('common.download') }}
            </button>
            <button @click="$emit('print')"
              class="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-black tracking-widest text-slate-600 dark:text-slate-300 transition-all active:scale-95">
              <i class="pi pi-print text-sm" />
              {{ $t('common.print') }}
            </button>
          </div>
          <button @click="handleStartNewSale"
            class="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black tracking-[0.18em] shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]">
            <i class="pi pi-plus mr-2" />
            {{ $t('pos.start_new_sale') }}
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { salesAPI } from '@/services/api'
import { usePrinter } from '@/composables/usePrinter'

const props = defineProps({
  transaction: Object,
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'print', 'download'])

const handleStartNewSale = () => {
  emit('update:visible', false)
}

const settingsStore = useSettingsStore()
const { paperSize } = usePrinter()

// Safe numeric conversion (handles string values from backend)
const num = (val) => parseFloat(val) || 0

// Currency formatter
const fmt = (val) => settingsStore.formatPrice(num(val))

// Shorthand for cleaner template
const t = computed(() => props.transaction || {})

// ── Barcode blob loader ──────────────────────────────────────────────────────
// <img src="..."> Bearer token yubora olmaydi — auth kerak bo'lgan endpoint
// Shuning uchun salesAPI.getBarcode() orqali blob yuklaymiz va Base64 formatga o'tkazamiz
// QZ Tray (ayri Java jarayoni) blob: URL-larni o'qiy olmaydi, shuning uchun Base64 ishlatiladi
const blobBarcodeUrl = ref(null)
const barcodeLoading = ref(false)

const fetchBarcodeBlob = async (saleId) => {
  if (!saleId) return
  blobBarcodeUrl.value = null
  barcodeLoading.value = true
  try {
    const res = await salesAPI.getBarcode(saleId)
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(res.data)
    })
    blobBarcodeUrl.value = base64Data
  } catch (e) {
    console.warn('Barcode yuklanmadi:', e)
  } finally {
    barcodeLoading.value = false
  }
}

// Transaction o'zgarganda yoki visible bo'lganda barcode yuklash
watch(
  () => [props.transaction?.id, props.visible],
  ([id, visible]) => {
    if (visible && id && props.transaction?.barcode_image_url) {
      fetchBarcodeBlob(id)
    } else if (!visible) {
      blobBarcodeUrl.value = null
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.receipt-paper {
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  padding: 12px 20px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06);
  font-family: "Inter", system-ui, sans-serif !important;
}
.receipt-paper * {
  font-family: "Inter", system-ui, sans-serif !important;
  font-weight: bold !important;
}
.dark .receipt-paper {
  background: #0f172a;
  border-color: #1e293b;
}

/* Transitions */
.rc-backdrop-enter-active, .rc-backdrop-leave-active { transition: opacity 0.25s ease; }
.rc-backdrop-enter-from, .rc-backdrop-leave-to { opacity: 0; }

.rc-slide-enter-active { transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease; }
.rc-slide-leave-active { transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s ease; }
.rc-slide-enter-from, .rc-slide-leave-to { transform: translateX(100%); opacity: 0; }

/* Print styles */
@media print {
  @page { margin: 0; }
  body * { visibility: hidden; }
  #printable-receipt, #printable-receipt * { visibility: visible; }
  #printable-receipt {
    position: absolute;
    left: 0; top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    color: #000 !important;
    background: #fff !important;
    font-family: 'Courier New', Courier, monospace !important;
  }
  
  /* Ensure all text is rendered in high-contrast solid black */
  #printable-receipt p, 
  #printable-receipt span, 
  #printable-receipt h2, 
  #printable-receipt div {
    color: #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-weight: 800 !important;
  }

  /* Store Header Name */
  #printable-receipt h2 {
    font-size: 22px !important;
    font-weight: 900 !important;
    color: #000 !important;
  }

  /* Extremely bold and clear main prices & totals for thermal paper */
  #printable-receipt .text-xl, 
  #printable-receipt .text-2xl,
  #printable-receipt .text-emerald-500,
  #printable-receipt .text-emerald-600 {
    font-size: 24px !important;
    font-weight: 950 !important;
    color: #000 !important;
  }

  /* Make sure currency symbols and unit prices are fully high contrast */
  #printable-receipt span.font-black, 
  #printable-receipt span.font-bold {
    font-weight: 900 !important;
    color: #000 !important;
  }

  /* Stronger dashed border dividers for B&W thermal printing */
  #printable-receipt .border-dashed {
    border-color: #000 !important;
    border-style: dashed !important;
    border-width: 2px !important;
  }

  #printable-receipt .print-hidden {
    display: none !important;
  }

  #printable-receipt .receipt-barcode {
    width: 130px !important;
    max-width: 130px !important;
    height: auto !important;
    display: block !important;
    margin: 0 auto !important;
  }
}
</style>


