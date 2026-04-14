import { ref, computed } from 'vue'
import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'

export const useSubscription = () => {
    const toast = useToast()
    const { t } = useI18n()
    const authStore = useAuthStore()

    const subscription = ref({
        plan: { plan_type: 'free', name: 'Bepul' },
        status: 'active',
        end_date: null,
        store_name: 'Yuklanmoqda...'
    })

    const loading = ref(false)
    const paymentDialog = ref(false)
    const processing = ref(false)
    const selectedPlan = ref('')
    const paymentMethod = ref('click')
    const isExtending = ref(false)

    const dialogHeader = computed(() => isExtending.value ? t('subscription.uzaytirish') : t('subscription.sotib_olish'))

    const getSelectedPriceLabel = computed(() => {
        switch(selectedPlan.value) {
            case 'free': return '0 so\'m';
            case 'standard': return '150,000 so\'m';
            case 'premium':
            case 'enterprise': return '300,000 so\'m';
            default: return '';
        }
    })

    const loadSubscription = async () => {
        loading.value = true
        try {
            const response = await subscriptionAPI.getStatus()
            subscription.value = response.data
        } catch (error) {
            console.error('Error loading subscription:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: t('warehouse.messages.load_error'), 
                life: 5000 
            })
        } finally {
            loading.value = false
        }
    }

    const confirmChangePlan = (plan) => {
        selectedPlan.value = plan
        isExtending.value = false
        paymentDialog.value = true
    }

    const openExtendDialog = () => {
        selectedPlan.value = subscription.value.plan?.plan_type || 'standard'
        isExtending.value = true
        paymentDialog.value = true
    }

    const processPayment = async () => {
        processing.value = true
        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            let response;
            if (isExtending.value) {
                response = await subscriptionAPI.extend({ durationInDays: 30 })
            } else {
                response = await subscriptionAPI.changePlan({ plan: selectedPlan.value, durationInDays: 30 })
            }

            subscription.value = response.data.subscription
            
            // Sync with auth store if needed
            if (authStore.user && authStore.user.subscription) {
                authStore.user.subscription = response.data.subscription
            }

            toast.add({ 
                severity: 'success', 
                summary: t('common.success'), 
                detail: t('common.updated'), 
                life: 5000 
            })
            paymentDialog.value = false
            
            // Trigger global event for components listening to subscription changes
            window.dispatchEvent(new CustomEvent('subscription-updated'))

        } catch (error) {
            console.error('Payment error:', error)
            toast.add({ 
                severity: 'error', 
                summary: t('common.error'), 
                detail: t('common.error_message'), 
                life: 5000 
            })
        } finally {
            processing.value = false
        }
    }

    return {
        subscription,
        loading,
        paymentDialog,
        processing,
        selectedPlan,
        paymentMethod,
        isExtending,
        dialogHeader,
        getSelectedPriceLabel,
        loadSubscription,
        confirmChangePlan,
        openExtendDialog,
        processPayment
    }
}
