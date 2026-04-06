import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { settingsAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'

const FORM_FIELDS = [
    'subcategory_enabled', 'sale_return_enabled', 'wastage_enabled',
    'stock_audit_enabled', 'kpi_enabled', 'price_list_enabled',
    'default_currency', 'show_usd_price', 'show_rub_price', 'show_eur_price', 'show_cny_price',
    'allow_cash', 'allow_card', 'allow_debt', 'allow_discount',
    'max_discount_percent', 'receipt_header', 'receipt_footer',
    'show_store_logo', 'show_worker_name', 'low_stock_enabled',
    'low_stock_threshold', 'shift_enabled', 'shifts_per_day',
    'require_cash_count', 'telegram_enabled', 'telegram_chat_id',
    'tax_enabled', 'tax_percent', 'ofd_enabled', 'ofd_token',
    'ofd_device_id', 'supplier_credit_enabled',
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

    const isDirty = computed(() =>
        FORM_FIELDS.some(f => String(form[f]) !== String(originalForm.value[f]))
    )

    const loadSettings = async () => {
        loading.value = true
        console.group('⚙️ Settings Page Loading Process')
        try {
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
        saving.value = true
        console.group('💾 Save Settings Process')
        try {
            const dataToSave = {}
            FORM_FIELDS.forEach(f => {
                if (String(form[f]) !== String(originalForm.value[f])) dataToSave[f] = form[f]
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

            originalForm.value = { ...form }
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

    return { loading, saving, settings, form, isDirty, saveSettings }
}
