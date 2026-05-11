import { ref, computed } from 'vue'
import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'

export const useSubscription = () => {
    const toast = useToast()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    const subscription = ref(notificationStore.subscription || {
        plan: null,
        plans: [],
        status: 'active',
        end_date: null,
        store_name: 'Yuklanmoqda...',
        days_left: 0
    })

    const loading = ref(false)
    const paymentDialog = ref(false)
    const processing = ref(false)
    const selectedPlanId = ref(null)
    const paymentMethod = ref('click')
    const isExtending = ref(false)
    
    // Billing specific states
    const loadingBilling = ref(false)
    const invoices = ref([])
    const currentBalance = ref(notificationStore.subscription?.balance || 0)
    const balanceTransactions = ref([])

    // Coupons specific states
    const coupons = ref([])
    const loadingCoupons = ref(false)
    const couponsCount = ref(0)
    const couponsPage = ref(1)
    const couponsPageSize = ref(10)

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

    const getSelectedPriceLabel = computed(() => {
        if (!selectedPlanObject.value) return ''
        const price = selectedPlanObject.value.price_monthly
        return `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`
    })

    const activeCoupon = computed(() => coupons.value[0] || null)

    const discountAmount = computed(() => {
        if (!activeCoupon.value || !selectedPlanObject.value) return 0
        const rawPrice = selectedPlanObject.value.price_monthly || 0
        const val = parseFloat(activeCoupon.value.discount_value || 0)
        
        const typeStr = String(activeCoupon.value.type || '').toLowerCase()
        const typeDisplayStr = String(activeCoupon.value.type_display || '').toLowerCase()
        
        if (
            typeStr.includes('percent') || 
            typeStr.includes('percentage') || 
            typeStr.includes('foiz') || 
            typeDisplayStr.includes('foiz') || 
            typeDisplayStr.includes('percent') ||
            typeDisplayStr.includes('percentage')
        ) {
            return (rawPrice * val) / 100
        }
        return val // fixed discount
    })

    const finalPrice = computed(() => {
        if (!selectedPlanObject.value) return 0
        const rawPrice = selectedPlanObject.value.price_monthly || 0
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

    const loadSubscription = async (force = false) => {
        // 1. If global store already has subscription data, use it immediately (0 requests)
        if (notificationStore.subscription && !force) {
            subscription.value = notificationStore.subscription
            if (notificationStore.subscription.balance !== undefined) {
                currentBalance.value = notificationStore.subscription.balance
            }
            return
        }
        
        // 2. If global store is already loading, wait for it to complete to prevent parallel requests
        if (notificationStore.loading.subscription) {
            loading.value = true
            while (notificationStore.loading.subscription) {
                await new Promise(resolve => setTimeout(resolve, 50))
            }
            if (notificationStore.subscription) {
                subscription.value = notificationStore.subscription
                if (notificationStore.subscription.balance !== undefined) {
                    currentBalance.value = notificationStore.subscription.balance
                }
            }
            loading.value = false
            return
        }

        loading.value = true
        try {
            // 3. Otherwise, fetch via global store to keep everyone in sync
            await notificationStore.fetchSubscription()
            if (notificationStore.subscription) {
                subscription.value = notificationStore.subscription
                if (notificationStore.subscription.balance !== undefined) {
                    currentBalance.value = notificationStore.subscription.balance
                }
            }
        } catch (error) {
            console.error('Error loading subscription:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: t('common.error_message'), 
                life: 5000 
            })
        } finally {
            loading.value = false
        }
    }
    const loadBalanceData = async () => {
        try {
            const balanceRes = await subscriptionAPI.getBalance().catch(e => {
                console.error('Balance load error:', e);
                return { data: {} };
            });
            const balData = balanceRes?.data || {}
            currentBalance.value = balData.balance || balData.current_balance || 0
            if (subscription.value) {
                subscription.value.balance = currentBalance.value
            }
            balanceTransactions.value = balData.transactions || balData.results || []
        } catch (error) {
            console.error('Error loading balance:', error)
        }
    }

    const loadBillingData = async () => {
        loadingBilling.value = true
        try {
            const [invoicesRes] = await Promise.all([
                subscriptionAPI.getInvoices().catch(e => {
                    console.error('Invoices load error:', e);
                    return { data: { results: [] } };
                })
            ])
            
            invoices.value = invoicesRes?.data?.results || invoicesRes?.data || []
            
            // We load balance globally, but if needed, we can also refresh it here
            await loadBalanceData();
        } catch (error) {
            console.error('Error loading billing data:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: t('common.error_message'), 
                life: 5000 
            })
        } finally {
            loadingBilling.value = false
        }
    }

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

    const confirmChangePlan = (planId) => {
        selectedPlanId.value = planId
        isExtending.value = false
        paymentDialog.value = true
    }

    const openExtendDialog = () => {
        if (subscription.value.plan) {
            selectedPlanId.value = subscription.value.plan.id
            isExtending.value = true
            paymentDialog.value = true
        }
    }

    const processPayment = async () => {
        if (!selectedPlanId.value) return
        
        processing.value = true
        try {
            // In a real app, this would involve a redirect or specific payment API call
            const payload = {
                plan_id: selectedPlanId.value,
                duration: 30, // Default 30 days
                method: paymentMethod.value
            }

            let response;
            if (isExtending.value) {
                // Assuming there's an extend endpoint or changePlan handles it
                response = await subscriptionAPI.extend(payload)
            } else {
                response = await subscriptionAPI.changePlan(payload)
            }

            // Successfully processed
            toast.add({ 
                severity: 'success', 
                summary: t('common.success'), 
                detail: t('common.updated'), 
                life: 5000 
            })
            
            await loadSubscription() // Reload fresh data
            paymentDialog.value = false

        } catch (error) {
            console.error('Payment error:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: error.response?.data?.message || t('common.error_message'), 
                life: 5000 
            })
        } finally {
            processing.value = false
        }
    }

    const getPlanFeatures = (plan) => {
        if (!plan) return []
        const features = []
        
        // Map boolean flags to localized feature names
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
        
        return features
    }

    return {
        subscription,
        availablePlans,
        loading,
        paymentDialog,
        processing,
        selectedPlanId,
        paymentMethod,
        isExtending,
        dialogHeader,
        getSelectedPriceLabel,
        loadSubscription,
        confirmChangePlan,
        openExtendDialog,
        processPayment,
        getPlanFeatures,
        loadingBilling,
        invoices,
        currentBalance,
        balanceTransactions,
        loadBillingData,
        loadBalanceData,
        coupons,
        loadingCoupons,
        couponsCount,
        couponsPage,
        couponsPageSize,
        loadCouponsData,
        activeCoupon,
        discountAmount,
        finalPrice,
        getDiscountLabel,
        getFinalPriceLabel,
        selectedPlanType
    }
}


