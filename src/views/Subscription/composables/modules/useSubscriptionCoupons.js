import { computed } from 'vue'
import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export const useSubscriptionCoupons = (state, plans) => {
    const toast = useToast()
    const { t } = useI18n()
    const { coupons, loadingCoupons, couponsCount, couponsPage, couponsPageSize, isYearly } = state
    const { selectedPlanObject } = plans

    const activeCoupon = computed(() => coupons.value[0] || null)

    const discountAmount = computed(() => {
        if (!activeCoupon.value || !selectedPlanObject.value) return 0
        const rawPrice = isYearly.value 
            ? (selectedPlanObject.value.price_yearly || selectedPlanObject.value.price_monthly * 12) 
            : (selectedPlanObject.value.price_monthly || 0)
        const val = parseFloat(activeCoupon.value.discount_value || 0)
        
        const couponObj = activeCoupon.value
        const typeKeys = [
            couponObj.type,
            couponObj.discount_type,
            couponObj.coupon_type,
            couponObj.type_display,
            couponObj.discount_type_display
        ]
        
        const matchesKeyword = (keywords) => {
            return typeKeys.some(val => {
                if (!val) return false
                const str = String(val).toLowerCase()
                return keywords.some(keyword => str.includes(keyword))
            })
        }
        
        // 1. Free Days Check
        if (matchesKeyword(['free_days', 'free-days', 'kun'])) {
            return 0
        }
        
        // 2. Percentage Check
        if (matchesKeyword(['percent', 'percentage', 'foiz', '%'])) {
            return (rawPrice * val) / 100
        }
        
        // 3. Fallback: Fixed Discount
        return val
    })

    const finalPrice = computed(() => {
        if (!selectedPlanObject.value) return 0
        const rawPrice = isYearly.value 
            ? (selectedPlanObject.value.price_yearly || selectedPlanObject.value.price_monthly * 12) 
            : (selectedPlanObject.value.price_monthly || 0)
        return Math.max(rawPrice - discountAmount.value, 0)
    })

    const getDiscountLabel = computed(() => {
        if (discountAmount.value <= 0) return ''
        return `-${new Intl.NumberFormat('uz-UZ').format(discountAmount.value)} so'm`
    })

    const getFinalPriceLabel = computed(() => {
        if (!selectedPlanObject.value) return ''
        return `${new Intl.NumberFormat('uz-UZ').format(finalPrice.value)} so'm`
    })

    const loadCouponsData = async () => {
        loadingCoupons.value = true
        try {
            const params = {
                page: couponsPage.value,
                page_size: couponsPageSize.value
            }
            const res = await subscriptionAPI.getMyCoupons(params)
            coupons.value = res?.data?.results || []
            couponsCount.value = res?.data?.count || 0
        } catch (error) {
            console.error('Error loading coupons data:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: t('common.error_message'), 
                life: 5000 
            })
        } finally {
            loadingCoupons.value = false
        }
    }

    return {
        activeCoupon,
        discountAmount,
        finalPrice,
        getDiscountLabel,
        getFinalPriceLabel,
        loadCouponsData
    }
}
