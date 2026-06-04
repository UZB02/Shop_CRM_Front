import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { settingsAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

const FORM_FIELDS = [
    'subcategory_enabled', 'sale_return_enabled', 'wastage_enabled',
    'stock_audit_enabled', 'kpi_enabled', 'promotion_enabled',
    'default_currency', 'show_usd_price', 'show_rub_price', 'show_eur_price', 'show_cny_price',
    'allow_cash', 'allow_card', 'allow_debt', 'allow_discount',
    'max_discount_percent', 'receipt_header', 'receipt_footer',
    'receipt_address', 'receipt_phone', 'receipt_promo_text',
    'show_store_logo', 'show_worker_name', 'low_stock_enabled',
    'low_stock_threshold', 'shift_enabled', 'shifts_per_day',
    'require_cash_count', 'telegram_enabled', 'telegram_chat_id',
    'tax_enabled', 'tax_percent', 'ofd_enabled', 'ofd_token',
    'ofd_device_id', 'tin', 'ofd_provider',
    'show_name_on_barcode', 'show_price_on_barcode', 'show_tur_on_barcode', 'auto_pdf_on_smena_close'
]

// Mapping fields to tabs for precise change tracking
export const TAB_FIELDS = {
    modules: ['subcategory_enabled', 'sale_return_enabled', 'wastage_enabled', 'stock_audit_enabled', 'kpi_enabled', 'promotion_enabled', 'shift_enabled', 'shifts_per_day', 'require_cash_count', 'auto_pdf_on_smena_close'],
    stock: ['low_stock_enabled', 'low_stock_threshold'],
    payment: ['allow_cash', 'allow_card', 'allow_debt', 'allow_discount', 'max_discount_percent'],
    currency: ['default_currency', 'show_usd_price', 'show_rub_price', 'show_eur_price', 'show_cny_price'],
    receipt: ['receipt_header', 'receipt_footer', 'receipt_address', 'receipt_phone', 'receipt_promo_text', 'show_store_logo', 'show_worker_name', 'show_name_on_barcode', 'show_price_on_barcode', 'show_tur_on_barcode'],
    tax: ['tax_enabled', 'tax_percent', 'ofd_enabled', 'ofd_token', 'ofd_device_id', 'tin', 'ofd_provider'],
    telegram: ['telegram_enabled', 'telegram_chat_id']
}

// Tab config — tKey used in index.vue via $t()
export const SETTINGS_TABS = [
    { key: 'modules', icon: 'pi-th-large', tKey: 'settings.tabs.modules' },
    { key: 'stock', icon: 'pi-box', tKey: 'settings.tabs.stock' },
    { key: 'payment', icon: 'pi-wallet', tKey: 'settings.tabs.payment' },
    { key: 'currency', icon: 'pi-dollar', tKey: 'settings.tabs.currency' },
    { key: 'receipt', icon: 'pi-receipt', tKey: 'settings.tabs.receipt' },
    { key: 'tax', icon: 'pi-percentage', tKey: 'settings.tabs.tax' },
    { key: 'telegram', icon: 'pi-send', tKey: 'settings.tabs.telegram' },
]

export function useSettings() {
    const toast = useToast()
    const { t } = useI18n()
    const loading = ref(false)
    const saving = ref(false)
    const settings = ref(null)
    const settingsId = ref(null) // ⚠️ Backend: PATCH faqat /settings/{id}/ bilan ishlaydi
    const form = reactive({})
    const originalForm = ref({})
    
    const settingsStore = useSettingsStore()
    const authStore = useAuthStore()
    const isOwner = computed(() => {
        const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
        return role === 'owner' || authStore.user?.is_owner
    })

    const isFieldDirty = (field) => {
        const val = form[field] ?? ''
        const orig = originalForm.value[field] ?? ''
        return String(val) !== String(orig)
    }

    const isDirty = computed(() =>
        FORM_FIELDS.some(f => isFieldDirty(f))
    )

    // Compute which tabs have unsaved changes
    const dirtyTabs = computed(() => {
        const res = {}
        Object.entries(TAB_FIELDS).forEach(([tab, fields]) => {
            res[tab] = fields.some(f => isFieldDirty(f))
        })
        return res
    })

    const loadSettings = async () => {
        loading.value = true
        try {
            // Keshdan foydalanish — store allaqachon to'ldirilgan bo'lsa API so'rovi yubormaymiz
            if (settingsStore.initialized && settingsStore.settings) {
                const data = settingsStore.settings
                settings.value = data
                settingsId.value = data.id || null // ✅ ID ni alohida saqlab qo'yamiz
                FORM_FIELDS.forEach(f => { form[f] = data[f] ?? null })
                // promotion_enabled backend'da yo'q → plan_features dan default qiymati olamiz
                if (form.promotion_enabled === null) {
                    form.promotion_enabled = data.plan_features?.has_promotion !== false
                }
                originalForm.value = { ...form }
                loading.value = false
                return
            }

            // Birinchi marta: backend'dan yuklaymiz
            // Backend hujjati: GET /settings/ → to'g'ridan-to'g'ri array qaytaradi (pagination yo'q)
            const res = await settingsAPI.getAll()
            const data = Array.isArray(res.data)
                ? res.data[0]
                : (res.data?.results?.[0] || res.data)

            if (data) {
                settings.value = data
                settingsId.value = data.id || null // ✅ ID ni alohida saqlab qo'yamiz
                FORM_FIELDS.forEach(f => { form[f] = data[f] ?? null })
                // promotion_enabled backend'da yo'q → plan_features dan default qiymati olamiz
                if (form.promotion_enabled === null) {
                    form.promotion_enabled = data.plan_features?.has_promotion !== false
                }
                originalForm.value = { ...form }

                // Global Pinia store'ni yangilash → butun ilova bo'ylab reaktiv yangilanish
                settingsStore.updateLocalSettings(data)
            }
        } catch (e) {
            console.error('❌ Settings load error:', e)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('settings.load_error'),
                life: 5000
            })
        } finally {
            loading.value = false
        }
    }

    const saveSettings = async () => {
        if (!isDirty.value) return

        // Validation: At least one payment method must be enabled
        if (!form.allow_cash && !form.allow_card) {
            toast.add({ severity: 'warn', summary: t('common.validation_error'), detail: t('settings.payment.error_at_least_one'), life: 5000 })
            return
        }

        // Validation: Telegram Chat ID
        if (form.telegram_enabled && (!form.telegram_chat_id || !form.telegram_chat_id.trim())) {
            toast.add({ severity: 'warn', summary: t('common.validation_error'), detail: t('settings.telegram.chat_id_label') + ' requried', life: 5000 })
            return
        }

        // Validation: TIN (STIR)
        if (form.tax_enabled && form.tin && !/^\d{9}$/.test(form.tin)) {
           toast.add({ severity: 'warn', summary: t('common.validation_error'), detail: t('settings.tax.tin_desc'), life: 5000 })
           return
        }

        saving.value = true
        console.group('💾 Save Settings Process')
        try {
            const dataToSave = {}
            FORM_FIELDS.forEach(f => {
                if (isFieldDirty(f)) {
                    const val = form[f]
                    
                    // Skip if it's a sensitive write-only field and is empty
                    if (f === 'ofd_token' && !val) return
                    
                    // Handle nullables
                    if ((f === 'tax_percent' || f === 'telegram_chat_id') && val === '') {
                        dataToSave[f] = null
                    } else {
                        dataToSave[f] = val
                    }
                }
            })

            console.log('📡 Payload being sent:', dataToSave)
            
            // Backend hujjati: PATCH faqat /settings/{id}/ bilan (singleton /settings/ → 405)
            if (!settingsId.value) {
                // ID yo'q bo'lsa — APIdan qayta olib, ID ni aniqlab olamiz
                const fallback = await settingsAPI.getAll()
                const fallbackData = Array.isArray(fallback.data)
                    ? fallback.data[0]
                    : (fallback.data?.results?.[0] || fallback.data)
                if (fallbackData?.id) {
                    settingsId.value = fallbackData.id
                    settings.value = fallbackData
                    settingsStore.updateLocalSettings(fallbackData)
                } else {
                    throw new Error('Settings ID topilmadi — PATCH yuborib bo\'lmaydi')
                }
            }

            console.log(`📡 PATCH /settings/${settingsId.value}/`, dataToSave)
            const res = await settingsAPI.update(settingsId.value, dataToSave)
            
            console.log('✅ API RESPONSE (update):', res.data)

            if (res.data) {
                const raw = res.data
                const newData = raw?.data && raw.data?.id
                    ? raw.data
                    : (Array.isArray(raw) ? raw[0] : raw)

                console.log('📦 Parsed settings after PATCH:', newData)

                if (!newData?.id) {
                    console.warn('⚠️ PATCH response has no id — skipping form update')
                } else {
                    settingsId.value = newData.id
                    FORM_FIELDS.forEach(f => { form[f] = newData[f] ?? null })
                    originalForm.value = { ...form }
                    settings.value = newData

                    // ✅ Global Pinia Store yangilanadi — barcha sahifalar refresh'siz ko'radi
                    settingsStore.updateLocalSettings(newData)
                }
            }

            toast.add({
                severity: 'success',
                summary: t('common.updated'),
                detail: t('settings.save_success'),
                life: 3000
            })
        } catch (e) {
            console.error('❌ Settings save error:', e)
            
            // Plan cheklovi xatolari (400) — field-specific xabarlar
            if (e.response?.status === 400) {
                const data = e.response.data || {}
                const PLAN_FIELD_KEYS = {
                    telegram_enabled: 'plan.error_telegram',
                    shift_enabled:    'plan.error_shift',
                    allow_discount:   'plan.error_discount',
                    show_usd_price:   'plan.error_multi_currency',
                    show_rub_price:   'plan.error_multi_currency',
                    show_eur_price:   'plan.error_multi_currency',
                    show_cny_price:   'plan.error_multi_currency',
                    receipt_header:   'plan.error_receipt_design',
                    receipt_footer:   'plan.error_receipt_design',
                }
                for (const [field, tKey] of Object.entries(PLAN_FIELD_KEYS)) {
                    if (data[field]) {
                        toast.add({
                            severity: 'warn',
                            summary: t('plan.plan_required'),
                            detail: typeof data[field] === 'string' ? data[field] : t(tKey),
                            life: 7000
                        })
                        return
                    }
                }
            }
            
            // Umumiy xato
            const detail = e.response?.data
                ? (typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data))
                : t('settings.error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 5000 })
        } finally {
            console.groupEnd()
            saving.value = false
        }
    }

    const resetForm = () => {
        FORM_FIELDS.forEach(f => {
            form[f] = originalForm.value[f] ?? null
        })
    }

    onMounted(loadSettings)

    return { loading, saving, settings, form, isDirty, isFieldDirty, dirtyTabs, isOwner, saveSettings, resetForm }
}


