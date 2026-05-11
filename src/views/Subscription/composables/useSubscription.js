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

    const availablePlans = computed(() => subscription.value.plans || [])

    const selectedPlanObject = computed(() => {
        return availablePlans.value.find(p => p.id === selectedPlanId.value) || null
    })

    const dialogHeader = computed(() => isExtending.value ? t('subscription.uzaytirish') : t('subscription.sotib_olish'))

    const getSelectedPriceLabel = computed(() => {
        if (!selectedPlanObject.value) return ''
        const price = selectedPlanObject.value.price_monthly
        return `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`
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
        loadBalanceData
    }
}


