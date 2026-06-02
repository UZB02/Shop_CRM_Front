import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notifications'
import { useSubscriptionState } from './modules/useSubscriptionState'
import { useSubscriptionPlans } from './modules/useSubscriptionPlans'
import { useSubscriptionCoupons } from './modules/useSubscriptionCoupons'
import { useSubscriptionBilling } from './modules/useSubscriptionBilling'
import { useSubscriptionPayment } from './modules/useSubscriptionPayment'

export const useSubscription = () => {
    const toast = useToast()
    const { t } = useI18n()
    const notificationStore = useNotificationStore()

    // 1. Init state
    const state = useSubscriptionState()

    // 2. Init Core logic (Plans)
    const plans = useSubscriptionPlans(state)

    // 3. Init Coupons logic
    const coupons = useSubscriptionCoupons(state, plans)

    // Main loading function
    const loadSubscription = async (force = false) => {
        if (notificationStore.subscription && !force) {
            state.subscription.value = notificationStore.subscription
            if (notificationStore.subscription.balance !== undefined) {
                state.currentBalance.value = notificationStore.subscription.balance
            }
            return
        }
        
        if (notificationStore.loading.subscription) {
            state.loading.value = true
            while (notificationStore.loading.subscription) {
                await new Promise(resolve => setTimeout(resolve, 50))
            }
            if (notificationStore.subscription) {
                state.subscription.value = notificationStore.subscription
                if (notificationStore.subscription.balance !== undefined) {
                    state.currentBalance.value = notificationStore.subscription.balance
                }
            }
            state.loading.value = false
            return
        }

        state.loading.value = true
        try {
            await notificationStore.fetchSubscription()
            if (notificationStore.subscription) {
                state.subscription.value = notificationStore.subscription
                if (notificationStore.subscription.balance !== undefined) {
                    state.currentBalance.value = notificationStore.subscription.balance
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
            state.loading.value = false
        }
    }

    // 4. Init Billing logic
    const billing = useSubscriptionBilling(state, loadSubscription)

    // 5. Init Payment logic
    const loaders = { 
        loadSubscription, 
        loadBalanceData: billing.loadBalanceData, 
        loadBillingData: billing.loadBillingData 
    }
    const payment = useSubscriptionPayment(state, plans, coupons, loaders)

    return {
        ...state,
        ...plans,
        ...coupons,
        ...billing,
        ...payment,
        loadSubscription
    }
}
