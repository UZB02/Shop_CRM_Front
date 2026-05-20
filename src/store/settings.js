import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { settingsAPI, subscriptionAPI, storesAPI } from '@/services/api'
import { useNotificationStore } from '@/store/notifications'
import { useAuthStore } from '@/store/auth'

export const useSettingsStore = defineStore('settings', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const settings = ref(null)
  const loading = ref(false)
  const initialized = ref(false)
  const storeLogoUrl = ref(null)
  const notificationStore = useNotificationStore()
  const { subscription } = storeToRefs(notificationStore)

  // ─── Getters (computed) ───────────────────────────────────────────────────

  // Modules
  const isSubcategoryEnabled   = computed(() => !!settings.value?.subcategory_enabled)

  const isSaleReturnEnabled    = computed(() => !!settings.value?.sale_return_enabled)
  const isWastageEnabled       = computed(() => !!settings.value?.wastage_enabled)
  const isStockAuditEnabled    = computed(() => !!settings.value?.stock_audit_enabled)
  const isKpiEnabled           = computed(() => !!settings.value?.kpi_enabled)
  const isShiftEnabled         = computed(() => !!settings.value?.shift_enabled)
  const isTelegramEnabled      = computed(() => !!settings.value?.telegram_enabled)
  const isTaxEnabled           = computed(() => !!settings.value?.tax_enabled)
  const isOfdEnabled           = computed(() => !!settings.value?.ofd_enabled)
  const isAutoPdfEnabled       = computed(() => !!settings.value?.auto_pdf_on_smena_close)
  const isLowStockEnabled      = computed(() => !!settings.value?.low_stock_enabled)
  const lowStockThreshold      = computed(() => parseInt(settings.value?.low_stock_threshold || 5))

  // ─── Plan Features (Tarif imkoniyatlari) ────────────────────────────────────
  // Manba 1: subscription.plan (asosiy — eng ishonchli)
  // Manba 2: settings API plan_features (zaxira)
  // Qoida: ikkala manba ham yo'q bo'lsa → feature YOQILGAN hisoblanadi (orqaga moslik)
  const planFeatures = computed(() => {
    // Subscription plan — asosiy manba (eng ishonchli va yangi ma'lumot)
    const subPlan = subscription.value?.plan
    if (subPlan && 'has_export' in subPlan) return subPlan

    // settings API plan_features — zaxira manba
    const feats = settings.value?.plan_features
    if (feats && typeof feats === 'object' && 'has_export' in feats) return feats

    return {}
  })
  const hasPlanShift           = computed(() => planFeatures.value.has_shift           !== false)
  const hasPlanDiscount        = computed(() => planFeatures.value.has_discount         !== false)
  const hasPlanTelegram        = computed(() => planFeatures.value.has_telegram         !== false)
  const hasPlanMultiCurrency   = computed(() => planFeatures.value.has_multi_currency   !== false)
  const hasPlanReceiptDesign   = computed(() => planFeatures.value.has_receipt_design   !== false)
  const hasPlanKpi             = computed(() => planFeatures.value.has_kpi              !== false)
  const hasPlanSaleReturn      = computed(() => planFeatures.value.has_sale_return      !== false)
  const hasPlanWastage         = computed(() => planFeatures.value.has_wastage          !== false)
  const hasPlanStockAudit      = computed(() => planFeatures.value.has_stock_audit      !== false)
  const hasPlanSubcategory     = computed(() => planFeatures.value.has_subcategory      !== false)
  const hasPlanSupplier        = computed(() => planFeatures.value.has_supplier         !== false)
  const hasPlanDashboard       = computed(() => planFeatures.value.has_dashboard        !== false)
  const hasPlanQrBulk          = computed(() => planFeatures.value.has_qr_bulk          !== false)
  const hasPlanAuditLog        = computed(() => planFeatures.value.has_audit_log        !== false)
  const hasPlanExport          = computed(() => planFeatures.value.has_export           !== false)

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
        // Agar settings API plan_features ni qaytarmasa yoki bo'sh object bo'lsa → subscription API dan olamiz
        const hasPlanFeatures = data.plan_features && typeof data.plan_features === 'object' && 'has_export' in data.plan_features
        if (!hasPlanFeatures) {
          try {
            const subRes = await subscriptionAPI.getStatus()
            const sub = subRes.data
            // plan_features ni turli response strukturalaridan olib olamiz
            const plan = sub?.plan
            if (plan && 'has_export' in plan) {
              data.plan_features = plan
            } else if (sub && 'has_export' in sub) {
              data.plan_features = sub
            }
            console.log('📋 Settings store: plan_features subscription dan olindi', data.plan_features)
          } catch (e) {
            console.warn('⚠️ Settings store: plan_features olib bo\'lmadi', e)
          }
        }
        settings.value = { ...data }
        initialized.value = true
        console.log('✅ Settings store: fetched & initialized', data)

        // Fetch store logo URL
        const authStore = useAuthStore()
        if (authStore.user?.store_id) {
            try {
                const storeRes = await storesAPI.getById(authStore.user.store_id)
                storeLogoUrl.value = storeRes.data?.logo_url || null
            } catch(e) {
                console.warn('⚠️ Settings store: store details fetch error', e)
            }
        }
      }
    } catch (e) {
      console.error('❌ Settings store: failed to fetch', e)
    } finally {
      loading.value = false
    }
  }

  function updateLocalSettings(newData) {
    settings.value = { ...(settings.value || {}), ...newData }
    initialized.value = true
    console.log('🔄 Settings store: updated with new data', newData)
  }

  /**
   * Global narx formatlovchi funksiya.
   * Sozlamalardagi default_currency ni hisobga oladi.
   */
  function formatPrice(amount, code = null) {
    const curr = code || currency.value
    const value = parseFloat(amount || 0)
    
    try {
      if (curr === 'UZS') {
        return new Intl.NumberFormat('uz-UZ', { 
          maximumFractionDigits: 0 
        }).format(value) + " so'm"
      }
      
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: curr,
        maximumFractionDigits: (curr === 'UZS' || curr === 'JPY') ? 0 : 2
      }).format(value)
    } catch (e) {
      return value + ' ' + curr
    }
  }

  /**
   * Umumiy sonlarni formatlovchi funksiya (masalan, qoldiqlar uchun).
   */
  function formatNumber(value) {
    if (value === null || value === undefined) return '0'
    return new Intl.NumberFormat('uz-UZ').format(value)
  }

  return {
    // state
    settings,
    loading,
    initialized,
    storeLogoUrl,

    // getters
    isSubcategoryEnabled,
    isSaleReturnEnabled,
    isWastageEnabled,
    isStockAuditEnabled,
    isKpiEnabled,
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

    // plan features getters
    planFeatures,
    hasPlanShift,
    hasPlanDiscount,
    hasPlanTelegram,
    hasPlanMultiCurrency,
    hasPlanReceiptDesign,
    hasPlanKpi,
    hasPlanSaleReturn,
    hasPlanWastage,
    hasPlanStockAudit,
    hasPlanSubcategory,
    hasPlanSupplier,
    hasPlanDashboard,
    hasPlanQrBulk,
    hasPlanAuditLog,
    hasPlanExport,

    // actions
    fetchSettings,
    updateLocalSettings,
    formatPrice,
    formatNumber,
    setStoreLogoUrl: (url) => { storeLogoUrl.value = url }
  }
})


