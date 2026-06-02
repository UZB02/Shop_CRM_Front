import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export const useSubscriptionBilling = (state, loadSubscription) => {
    const toast = useToast()
    const { t } = useI18n()
    const { 
        loadingBilling, invoices, currentBalance, balanceTransactions, subscription,
        topupDialog, topupAmount, topupLoading, pollingActive, topupStatusText
    } = state

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

    const startBalancePolling = (topupId, initialBalance) => {
        let attempts = 0
        const maxAttempts = 15 // ~105 seconds total
        
        const pollInterval = setInterval(async () => {
            if (!pollingActive.value) {
                clearInterval(pollInterval)
                return
            }
            
            attempts++
            try {
                await loadBalanceData()
                
                // If balance has increased, payment was successful!
                if (Number(currentBalance.value) > Number(initialBalance)) {
                    clearInterval(pollInterval)
                    pollingActive.value = false
                    topupDialog.value = false
                    
                    toast.add({
                        severity: 'success',
                        summary: t('common.success') || 'Muvaffaqiyat',
                        detail: t('subscription.topup_success_detail') || "Balans muvaffaqiyatli to'ldirildi!",
                        life: 5000
                    })
                    
                    // Force refresh subscription data
                    if (loadSubscription) await loadSubscription(true)
                }
            } catch (e) {
                console.error('Polling error:', e)
            }
            
            if (attempts >= maxAttempts) {
                clearInterval(pollInterval)
                pollingActive.value = false
                topupStatusText.value = ''
                
                toast.add({
                    severity: 'info',
                    summary: t('subscription.payment_waiting') || 'To\'lov kutilmoqda',
                    detail: t('subscription.payment_auto_update_detail') || 'To\'lov amalga oshirilgandan so\'ng balans avtomatik yangilanadi.',
                    life: 5000
                })
            }
        }, 7000)
    }

    const handleTopup = async () => {
        if (!topupAmount.value || Number(topupAmount.value) < 1000) {
            toast.add({
                severity: 'warn',
                summary: t('common.error') || 'Xato',
                detail: t('subscription.min_topup_error') || 'Minimal to\'ldirish summasi 1 000 so\'m bo\'lishi kerak.',
                life: 4000
            })
            return
        }

        topupLoading.value = true
        topupStatusText.value = t('subscription.creating_request') || 'To\'lov so\'rovi yaratilmoqda...'
        
        try {
            const initialBalance = currentBalance.value
            
            const response = await subscriptionAPI.topupBalance({
                amount: Math.round(Number(topupAmount.value)),
                provider: 'click'
            })
            
            const data = response?.data || {}
            
            if (data.payment_url) {
                // Click to'lov tizimining to'g'ri billing manzili 'services/pay' hisoblanadi.
                // Agar backend '/pay/details' (xato manzil) qaytarsa, uni avtomatik to'g'rilaymiz:
                let finalUrl = data.payment_url
                if (finalUrl.includes('/pay/details')) {
                    finalUrl = finalUrl.replace('/pay/details', '/services/pay')
                }

                // Open payment in new window/tab
                window.open(finalUrl, '_blank')
                
                pollingActive.value = true
                topupStatusText.value = t('subscription.payment_redirect_desc') || 'To\'lov oynasi yangi tabda ochildi. Tasdiqlashingiz kutilmoqda...'
                
                // Start dynamic polling
                startBalancePolling(data.topup_id, initialBalance)
            } else {
                throw new Error('Payment URL not received')
            }
        } catch (error) {
            console.error('Topup error:', error)
            pollingActive.value = false
            topupStatusText.value = ''
            
            let errorMsg = t('common.error_message')
            if (error.response?.data) {
                const data = error.response.data
                if (data.amount && Array.isArray(data.amount)) {
                    errorMsg = data.amount[0]
                } else if (typeof data.amount === 'string') {
                    errorMsg = data.amount
                } else {
                    errorMsg = data.error || data.detail || errorMsg
                }
            }
            
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMsg,
                life: 6000
            })
        } finally {
            topupLoading.value = false
        }
    }

    return {
        loadBalanceData,
        loadBillingData,
        handleTopup
    }
}
