import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useSubscriptionPlans = (state) => {
    const { t } = useI18n()
    const { subscription, selectedPlanId, isExtending, isYearly } = state

    const availablePlans = computed(() => subscription.value.plans || [])

    const selectedPlanObject = computed(() => {
        return availablePlans.value.find(p => p.id === selectedPlanId.value) || null
    })

    const selectedPlanType = computed(() => {
        if (selectedPlanObject.value) {
            return selectedPlanObject.value.plan_type
        }
        if (subscription.value.plan && subscription.value.plan.id === selectedPlanId.value) {
            return subscription.value.plan.plan_type
        }
        return selectedPlanId.value
    })

    const dialogHeader = computed(() => isExtending.value ? t('subscription.uzaytirish') : t('subscription.sotib_olish'))

    const hasYearlyOption = computed(() => {
        return !!(selectedPlanObject.value && selectedPlanObject.value.price_yearly)
    })

    const getSelectedPriceLabel = computed(() => {
        if (!selectedPlanObject.value) return ''
        const price = isYearly.value 
            ? (selectedPlanObject.value.price_yearly || selectedPlanObject.value.price_monthly * 12) 
            : (selectedPlanObject.value.price_monthly || 0)
        return `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`
    })

    const getPlanFeatures = (plan) => {
        if (!plan) return []
        const features = []
        
        if (plan.has_subcategory) features.push(t('subscription.features.has_subcategory'))
        if (plan.has_sale_return) features.push(t('subscription.features.has_sale_return'))
        if (plan.has_wastage) features.push(t('subscription.features.has_wastage'))
        if (plan.has_stock_audit) features.push(t('subscription.features.has_stock_audit'))
        if (plan.has_kpi) features.push(t('subscription.features.has_kpi'))
        if (plan.has_multi_currency) features.push(t('subscription.features.has_multi_currency'))
        if (plan.has_supplier) features.push(t('subscription.features.has_supplier'))
        if (plan.has_export) features.push(t('subscription.features.has_export'))
        if (plan.has_dashboard) features.push(t('subscription.features.has_dashboard'))
        if (plan.has_qr_bulk) features.push(t('subscription.features.has_qr_bulk'))
        if (plan.has_audit_log) features.push(t('subscription.features.has_audit_log'))
        if (plan.has_telegram) features.push(t('subscription.features.has_telegram'))
        if (plan.has_shift) features.push(t('subscription.features.has_shift'))
        if (plan.has_discount) features.push(t('subscription.features.has_discount'))
        if (plan.has_receipt_design) features.push(t('subscription.features.has_receipt_design'))
        
        return features
    }

    return {
        availablePlans,
        selectedPlanObject,
        selectedPlanType,
        dialogHeader,
        hasYearlyOption,
        getSelectedPriceLabel,
        getPlanFeatures
    }
}
