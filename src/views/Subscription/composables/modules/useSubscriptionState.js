import { ref } from 'vue'
import { useNotificationStore } from '@/store/notifications'

export const useSubscriptionState = () => {
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
    const isYearly = ref(false)
    
    // Topup specific states
    const topupDialog = ref(false)
    const topupAmount = ref(150000)
    const topupLoading = ref(false)
    const pollingActive = ref(false)
    const topupStatusText = ref('')
    
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

    return {
        subscription,
        loading,
        paymentDialog,
        processing,
        selectedPlanId,
        paymentMethod,
        isExtending,
        isYearly,
        topupDialog,
        topupAmount,
        topupLoading,
        pollingActive,
        topupStatusText,
        loadingBilling,
        invoices,
        currentBalance,
        balanceTransactions,
        coupons,
        loadingCoupons,
        couponsCount,
        couponsPage,
        couponsPageSize
    }
}
