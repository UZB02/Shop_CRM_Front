import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { reportsAPI } from '@/services/api'

const TEMPLATE_CONFIG = {
    products: {
        method: () => reportsAPI.downloadProductsTemplate(),
        fileName: 'products_template.xlsx'
    },
    customers: {
        method: () => reportsAPI.downloadCustomersTemplate(),
        fileName: 'customers_template.xlsx'
    },
    suppliers: {
        method: () => reportsAPI.downloadSuppliersTemplate(),
        fileName: 'suppliers_template.xlsx'
    },
    movements: {
        method: () => reportsAPI.downloadMovementsTemplate(),
        fileName: 'movements_template.xlsx'
    },
    subcategories: {
        method: () => reportsAPI.downloadSubcategoriesTemplate(),
        fileName: 'subcategories_template.xlsx'
    }
}

export function useTemplateDownload() {
    const toast = useToast()
    const { t } = useI18n()

    // Har bir tur uchun alohida loading holati
    const templateLoading = ref(
        Object.fromEntries(Object.keys(TEMPLATE_CONFIG).map(k => [k, false]))
    )

    /**
     * Excel shablon faylini yuklab olish
     * @param {'products'|'customers'|'suppliers'|'movements'|'subcategories'} type
     */
    const downloadTemplate = async (type) => {
        const config = TEMPLATE_CONFIG[type]
        if (!config) {
            console.error(`[useTemplateDownload] Noma'lum shablon turi: ${type}`)
            return
        }

        templateLoading.value[type] = true
        try {
            const res = await config.method()
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', config.fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: t('reports.template_downloaded', { file: config.fileName }),
                life: 3000
            })
        } catch (error) {
            console.error(`[useTemplateDownload] Shablon yuklab bo'lmadi (${type}):`, error)
            const detail = error.response?.status === 403
                ? t('reports.errors.subscription_required')
                : t('reports.template_error')
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail,
                life: 4000
            })
        } finally {
            templateLoading.value[type] = false
        }
    }

    return {
        templateLoading,
        downloadTemplate
    }
}
