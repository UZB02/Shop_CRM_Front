import { defineStore } from 'pinia'
import { settingsAPI } from '@/services/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null,
    loading: false,
    initialized: false
  }),

  getters: {
    // Basic settings accessors
    get: (state) => state.settings || {},

    // Module enablement checks
    isSubcategoryEnabled: (state) => !!state.settings?.subcategory_enabled,
    isSaleReturnEnabled: (state) => !!state.settings?.sale_return_enabled,
    isWastageEnabled: (state) => !!state.settings?.wastage_enabled,
    isStockAuditEnabled: (state) => !!state.settings?.stock_audit_enabled,
    isKpiEnabled: (state) => !!state.settings?.kpi_enabled,
    isPriceListEnabled: (state) => !!state.settings?.price_list_enabled,
    isSupplierCreditEnabled: (state) => !!state.settings?.supplier_credit_enabled,
    isShiftEnabled: (state) => !!state.settings?.shift_enabled,
    isTelegramEnabled: (state) => !!state.settings?.telegram_enabled,
    isTaxEnabled: (state) => !!state.settings?.tax_enabled,
    isOfdEnabled: (state) => !!state.settings?.ofd_enabled,

    // Payment methods
    allowCash: (state) => state.settings?.allow_cash !== false, // default true
    allowCard: (state) => !!state.settings?.allow_card,
    allowDebt: (state) => !!state.settings?.allow_debt,
    allowDiscount: (state) => !!state.settings?.allow_discount,

    // Branding & Receipts
    storeName: (state) => state.settings?.store_name || 'Sirius CRM',
    currency: (state) => state.settings?.default_currency || 'UZS',
    
    // Receipt templates
    receiptConfig: (state) => ({
      header: state.settings?.receipt_header || '',
      footer: state.settings?.receipt_footer || '',
      address: state.settings?.receipt_address || '',
      phone: state.settings?.receipt_phone || '',
      promo: state.settings?.receipt_promo_text || '',
      showLogo: !!state.settings?.show_store_logo,
      showWorker: !!state.settings?.show_worker_name
    })
  },

  actions: {
    async fetchSettings() {
      this.loading = true
      try {
        const res = await settingsAPI.getAll()
        const data = Array.isArray(res.data) 
            ? res.data[0] 
            : (res.data?.results?.[0] || res.data)
        
        if (data) {
          this.settings = data
          this.initialized = true
        }
      } catch (e) {
        console.error('Failed to fetch global settings:', e)
      } finally {
        this.loading = false
      }
    },

    updateLocalSettings(newSettings) {
      if (this.settings) {
        this.settings = { ...this.settings, ...newSettings }
      } else {
        this.settings = newSettings
      }
    }
  }
})
