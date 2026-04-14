import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { settingsAPI } from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const settings = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  // ─── Getters (computed) ───────────────────────────────────────────────────

  // Modules
  const isSubcategoryEnabled   = computed(() => !!settings.value?.subcategory_enabled)
  const isSaleReturnEnabled    = computed(() => !!settings.value?.sale_return_enabled)
  const isWastageEnabled       = computed(() => !!settings.value?.wastage_enabled)
  const isStockAuditEnabled    = computed(() => !!settings.value?.stock_audit_enabled)
  const isKpiEnabled           = computed(() => !!settings.value?.kpi_enabled)
  const isPriceListEnabled     = computed(() => !!settings.value?.price_list_enabled)
  const isSupplierCreditEnabled= computed(() => !!settings.value?.supplier_credit_enabled)
  const isShiftEnabled         = computed(() => !!settings.value?.shift_enabled)
  const isTelegramEnabled      = computed(() => !!settings.value?.telegram_enabled)
  const isTaxEnabled           = computed(() => !!settings.value?.tax_enabled)
  const isOfdEnabled           = computed(() => !!settings.value?.ofd_enabled)
  const isAutoPdfEnabled       = computed(() => !!settings.value?.auto_pdf_on_smena_close)
  const isLowStockEnabled      = computed(() => !!settings.value?.low_stock_enabled)
  const lowStockThreshold      = computed(() => parseInt(settings.value?.low_stock_threshold || 5))

  // Payment methods
  const allowCash     = computed(() => settings.value?.allow_cash !== false)
  const allowCard     = computed(() => !!settings.value?.allow_card)
  const allowDebt     = computed(() => !!settings.value?.allow_debt)
  const allowDiscount = computed(() => !!settings.value?.allow_discount)
  const maxDiscount   = computed(() => parseFloat(settings.value?.max_discount_percent || 0))

  // Currency
  const currency      = computed(() => settings.value?.default_currency || 'UZS')
  const showUsd       = computed(() => !!settings.value?.show_usd_price)
  const showRub       = computed(() => !!settings.value?.show_rub_price)
  const showEur       = computed(() => !!settings.value?.show_eur_price)
  const showCny       = computed(() => !!settings.value?.show_cny_price)

  // Branding
  const storeName = computed(() => settings.value?.store_name || 'Sirius CRM')

  // Barcode
  const showNameOnBarcode  = computed(() => !!settings.value?.show_name_on_barcode)
  const showPriceOnBarcode = computed(() => !!settings.value?.show_price_on_barcode)

  // Receipt
  const receiptConfig = computed(() => ({
    header:     settings.value?.receipt_header     || '',
    footer:     settings.value?.receipt_footer     || '',
    address:    settings.value?.receipt_address    || '',
    phone:      settings.value?.receipt_phone      || '',
    promo:      settings.value?.receipt_promo_text || '',
    showLogo:   !!settings.value?.show_store_logo,
    showWorker: !!settings.value?.show_worker_name,
  }))

  // ─── Actions ─────────────────────────────────────────────────────────────

  async function fetchSettings() {
    loading.value = true
    try {
      const res = await settingsAPI.getAll()
      const data = Array.isArray(res.data)
        ? res.data[0]
        : (res.data?.results?.[0] || res.data)

      if (data) {
        settings.value = { ...data }  // brand-new object → forces full reactivity
        initialized.value = true
        console.log('✅ Settings store: fetched & initialized', data)
      }
    } catch (e) {
      console.error('❌ Settings store: failed to fetch', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Sozlamalar sahifasida PATCH muvaffaqiyatli bo'lganda chaqiriladi.
   * Yangi obyekt yaratish Pinia / Vue reaktivligini to'liq kafolatlaydi.
   */
  function updateLocalSettings(newData) {
    settings.value = { ...(settings.value || {}), ...newData }
    initialized.value = true
    console.log('🔄 Settings store: updated with new data', newData)
  }

  return {
    // state
    settings,
    loading,
    initialized,

    // getters
    isSubcategoryEnabled,
    isSaleReturnEnabled,
    isWastageEnabled,
    isStockAuditEnabled,
    isKpiEnabled,
    isPriceListEnabled,
    isSupplierCreditEnabled,
    isShiftEnabled,
    isTelegramEnabled,
    isTaxEnabled,
    isOfdEnabled,
    isAutoPdfEnabled,
    isLowStockEnabled,
    lowStockThreshold,
    allowCash,
    allowCard,
    allowDebt,
    allowDiscount,
    maxDiscount,
    currency,
    showUsd,
    showRub,
    showEur,
    showCny,
    storeName,
    showNameOnBarcode,
    showPriceOnBarcode,
    receiptConfig,

    // actions
    fetchSettings,
    updateLocalSettings,
  }
})
