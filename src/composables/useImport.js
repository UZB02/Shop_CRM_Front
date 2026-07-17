import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { reportsAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'

export function useImport() {
    const toast = useToast()
    const { t } = useI18n()
    const authStore = useAuthStore()

    const importing = ref(false)
    const importResult = ref(null)
    const showResultDialog = ref(false)

    /**
     * ✅ Permission-based tekshiruv (rol emas, ruxsat asosida)
     * Backend: CanAccess('mahsulotlar') → mahsulot import uchun
     */
    const isManagerOrAbove = () => {
        return authStore.hasAccess('products')
    }

    /**
     * Excel fayl import qilish
     * @param {String} type - 'products' yoki 'customers'
     * @param {File} file - .xlsx fayl
     * @param {Function} onSuccess - muvaffaqiyatli import dan keyin chaqiriladigan callback
     */
    const importData = async (type, file, onSuccess = null) => {
        // Frontend ruxsat tekshiruvi
        if (!isManagerOrAbove()) {
            toast.add({
                severity: 'warn',
                summary: t('common.access_denied') || 'Ruxsat yo\'q',
                detail: t('reports.import_permission_denied'),
                life: 4000
            })
            return
        }

        // Fayl validatsiyasi
        if (!file) return
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (ext !== 'xlsx') {
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('reports.import_invalid_file'),
                life: 4000
            })
            return
        }

        importing.value = true
        try {
            toast.add({
                severity: 'info',
                summary: t('common.processing') || 'Jarayonda...',
                detail: t('reports.import_processing') || 'Fayl yuklanmoqda...',
                life: 2000
            })

            const formData = new FormData()
            formData.append('file', file)

            let apiMethod;
            switch(type) {
                case 'products':
                    apiMethod = reportsAPI.importProducts
                    break
                case 'customers':
                    apiMethod = reportsAPI.importCustomers
                    break
                case 'subcategories':
                    apiMethod = reportsAPI.importSubcategories
                    break
                // D: Mavjud mahsulotlarga kirim/chiqim importi
                case 'stock_movements':
                    apiMethod = reportsAPI.importStockMovements
                    break
                default:
                    throw new Error('Noto\'g\'ri import turi: ' + type)
            }

            const res = await apiMethod(formData)
            // Natijani normalizatsiya qilish (A format va eski format uchun)
            importResult.value = {
                created:      res.data?.created      ?? 0,
                updated:      res.data?.updated      ?? null,
                skipped:      res.data?.skipped      ?? 0,
                turs_created: res.data?.turs_created ?? null,  // A format (products/import)
                stock_added:  res.data?.stock_added  ?? null,  // A format (products/import)
                errors:       Array.isArray(res.data?.errors) ? res.data.errors : []
            }
            showResultDialog.value = true

            // Callback chaqirish (masalan: mahsulotlar ro'yxatini yangilash)
            if (typeof onSuccess === 'function') {
                onSuccess()
            }
        } catch (error) {
            console.error('[useImport] Import xatosi:', error)
            const status = error.response?.status
            let detail

            if (status === 403) {
                detail = t('reports.import_permission_denied')
            } else if (status === 400) {
                const msg = error.response?.data?.detail
                    || error.response?.data?.file?.[0]
                    || error.response?.data?.non_field_errors?.[0]
                detail = msg || t('reports.import_invalid_file')
            } else {
                detail = t('reports.errors.export_failed')
            }

            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail,
                life: 5000
            })
        } finally {
            importing.value = false
        }
    }

    const closeResultDialog = () => {
        showResultDialog.value = false
        importResult.value = null
    }

    return {
        importing,
        importResult,
        showResultDialog,
        isManagerOrAbove,
        importData,
        closeResultDialog
    }
}
