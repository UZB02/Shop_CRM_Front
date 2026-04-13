import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { settingsAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

const FORM_FIELDS = [
    'subcategory_enabled', 'sale_return_enabled', 'wastage_enabled',
    'stock_audit_enabled', 'kpi_enabled', 'price_list_enabled',
    'default_currency', 'show_usd_price', 'show_rub_price', 'show_eur_price', 'show_cny_price',
    'allow_cash', 'allow_card', 'allow_debt', 'allow_discount',
    'max_discount_percent', 'receipt_header', 'receipt_footer',
    'receipt_address', 'receipt_phone', 'receipt_promo_text',
    'show_store_logo', 'show_worker_name', 'low_stock_enabled',
    'low_stock_threshold', 'shift_enabled', 'shifts_per_day',
    'require_cash_count', 'telegram_enabled', 'telegram_chat_id',
    'tax_enabled', 'tax_percent', 'ofd_enabled', 'ofd_token',
    'ofd_device_id', 'tin', 'ofd_provider', 'supplier_credit_enabled',
    'show_name_on_barcode', 'show_price_on_barcode', 'auto_pdf_on_smena_close'
]

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
    const form = reactive({})
    const originalForm = ref({})
    
    const settingsStore = useSettingsStore()
    const authStore = useAuthStore()
    const isOwner = computed(() => authStore.user?.role === 'owner')

    const isDirty = computed(() =>
        FORM_FIELDS.some(f => String(form[f]) !== String(originalForm.value[f]))
    )

    const loadSettings = async () => {
        loading.value = true
        console.group('⚙️ Settings Page Loading Process')
        try {
            // Agar global store allaqachon to'ldirilgan bo'lsa, API so'rovi yubormasdan foydalanaiz
            if (settingsStore.initialized && settingsStore.settings) {
                console.log('⚡ Using cached settings from store (no API call needed)')
                const data = settingsStore.settings
                settings.value = data
                FORM_FIELDS.forEach(f => { form[f] = data[f] })
                originalForm.value = { ...form }
                loading.value = false
                console.groupEnd()
                return
            }

            console.log('📡 Fetching settings from /settings/...')
            const res = await settingsAPI.getAll()
            console.log('📦 API RAW RESPONSE:', res)
            
            const data = Array.isArray(res.data) 
                ? res.data[0] 
                : (res.data?.results?.[0] || res.data)
                
            console.log('📉 SETTINGS DATA (processed):', data)

            if (data) {
                settings.value = data
                FORM_FIELDS.forEach(f => { form[f] = data[f] })
                originalForm.value = { ...form }
                
                // Global store ni ham yangilash
                settingsStore.updateLocalSettings(data)
                if (!settingsStore.initialized) {
                    settingsStore.settings = data
                    settingsStore.initialized = true
                }
                
                if (data.id) {
                    console.log('ℹ️ Settings ID loaded:', data.id)
                }
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
            console.groupEnd()
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
                const val = form[f]
                const orig = originalForm.value[f]
                
                if (String(val) !== String(orig)) {
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
            
            let res;
            const settingsId = settings.value?.id
            
            if (settingsId) {
                console.log(`📡 Updating settings via ID: ${settingsId}...`)
                res = await settingsAPI.update(settingsId, dataToSave)
            } else {
                console.warn('⚠️ No Settings ID found for update, attempting singleton PATCH /settings/')
                res = await settingsAPI.update(dataToSave)
            }
            
            console.log('✅ API RESPONSE (update):', res.data)

            if (res.data) {
                // Update local state with fresh data from backend
                const newData = Array.isArray(res.data) ? res.data[0] : res.data
                Object.assign(form, newData)
                originalForm.value = { ...form }
                settings.value = newData

                // Sync with global store
                settingsStore.updateLocalSettings(newData)
            }

            toast.add({
                severity: 'success',
                summary: t('common.updated'),
                detail: t('settings.save_success'),
                life: 3000
            })
        } catch (e) {
            console.error('❌ Settings save error:', e)
            const detail = e.response?.data
                ? (typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data))
                : t('settings.error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 5000 })
        } finally {
            console.groupEnd()
            saving.value = false
        }
    }

    onMounted(loadSettings)

    return { loading, saving, settings, form, isDirty, isOwner, saveSettings }
}
