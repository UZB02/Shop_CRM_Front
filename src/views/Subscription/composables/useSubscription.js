import { ref, computed } from 'vue'
import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'
import { useConfirmStore } from '@/store/confirm'

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
        isYearly.value = false
        paymentDialog.value = true
    }

    const openExtendDialog = () => {
        if (subscription.value.plan) {
            selectedPlanId.value = subscription.value.plan.id
            isExtending.value = true
            isYearly.value = false
            paymentDialog.value = true
        }
    }

    const handleTopupRequired = (requiredAmount) => {
        paymentDialog.value = false
        topupAmount.value = requiredAmount
        topupDialog.value = true
    }

    const processPayment = async () => {
        if (!selectedPlanId.value) return
        
        const confirmStore = useConfirmStore()
        
        const actionHeader = isExtending.value 
            ? t('subscription.extend_plan_header')
            : t('subscription.change_plan_header')
            
        const planName = selectedPlanObject.value?.name || t(`subscription.plans.${selectedPlanType.value}`) || selectedPlanType.value || ''
        
        let actionMessage = ''
        let confirmIcon = 'pi pi-bolt'
        if (isExtending.value) {
            actionMessage = `
                <div class="text-sm text-slate-600 dark:text-slate-300 font-bold leading-normal text-center mb-1">
                    ${t('subscription.confirm_extend_msg')}
                </div>
                <div class="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                    ${t('subscription.price_deduction', { price: `<span class="text-emerald-500 dark:text-emerald-400 font-black">${getFinalPriceLabel.value || ''}</span>` })}
                </div>
            `
        } else {
            const currentPlanId = subscription.value.plan?.id
            const daysLeft = subscription.value.days_left || 0
            const bonusDays = subscription.value.bonus_days || 0
            
            if (selectedPlanId.value !== currentPlanId && daysLeft > 0) {
                confirmIcon = 'pi pi-exclamation-triangle'
                actionMessage = `
                    <div class="space-y-2.5 text-left bg-amber-500/[0.04] dark:bg-amber-500/[0.02] p-3 rounded-2xl border border-amber-500/10 mb-3">
                        <div class="flex items-start gap-2">
                            <span class="text-amber-500 text-sm shrink-0">⚠️</span>
                            <span class="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">
                                ${t('subscription.warning_days_lost', { days: `<span class="text-amber-500 font-extrabold">${daysLeft}</span>` })}
                            </span>
                        </div>
                        <div class="text-[11px] text-slate-400 dark:text-slate-500 font-bold pl-5 border-l border-slate-200 dark:border-slate-700/50 leading-tight">
                            ${t('subscription.warning_new_period', { days: isYearly.value ? 365 : 30 })}
                        </div>
                        ${bonusDays > 0 ? `
                        <div class="flex items-center gap-2 pl-5 text-[11px] text-emerald-500 font-black">
                            ${t('subscription.warning_bonus_kept', { days: bonusDays })}
                        </div>
                        ` : ''}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 leading-normal font-bold">
                        ${t('subscription.price_deduction', { price: `<span class="text-emerald-500 dark:text-emerald-400 font-extrabold">${getFinalPriceLabel.value || ''}</span>` })} ${t('subscription.warning_confirm_action')}
                    </div>
                `
            } else {
                actionMessage = `
                    <div class="text-sm text-slate-600 dark:text-slate-300 font-bold leading-normal text-center mb-1">
                        ${t('subscription.confirm_change_msg', { name: planName })}
                    </div>
                    <div class="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                        ${t('subscription.price_deduction', { price: `<span class="text-emerald-500 dark:text-emerald-400 font-black">${getFinalPriceLabel.value || ''}</span>` })}
                    </div>
                `
            }
        }

        confirmStore.require({
            header: actionHeader,
            message: actionMessage,
            icon: confirmIcon,
            acceptLabel: t('common.yes') || 'Ha',
            rejectLabel: t('common.no') || "Yo'q",
            accept: async () => {
                processing.value = true
                try {
                    let response;
                    const payload = {
                        plan_id: selectedPlanId.value,
                        is_yearly: isYearly.value
                    }
                    response = await subscriptionAPI.changePlan(payload)

                    const data = response?.data || {}
                    
                    const newPlanName = data.new_plan || selectedPlanObject.value?.name || t('subscription.plans.custom')
                    const endDate = data.end_date || ''
                    const chargedAmountStr = data.amount ? `${new Intl.NumberFormat('uz-UZ').format(data.amount)} so'm` : ''
                    const bonusDaysVal = data.bonus_days !== undefined ? Number(data.bonus_days) : 0
                    
                    let successDetail = `✅ "${newPlanName}" tarifga o'tildi`
                    if (endDate) {
                        let formattedDate = endDate
                        if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
                            const [yyyy, mm, dd] = endDate.split('-')
                            formattedDate = `${dd}.${mm}.${yyyy}`
                        }
                        successDetail += `\nTugash sanasi: ${formattedDate}`
                    }
                    if (bonusDaysVal > 0) {
                        successDetail += `\n[+${bonusDaysVal} bonus kun hisobga olindi]`
                    }
                    if (chargedAmountStr) {
                        successDetail += `\nBalansdan ${chargedAmountStr} yechildi.`
                    }
                    
                    // Successfully processed
                    toast.add({ 
                        severity: 'success', 
                        summary: t('common.success') || 'Muvaffaqiyat', 
                        detail: successDetail, 
                        life: 7000 
                    })
                    
                    // Reload fresh data and billing history
                    await Promise.all([
                        loadSubscription(true),
                        loadBalanceData(),
                        loadBillingData()
                    ])
                    paymentDialog.value = false

                } catch (error) {
                    console.error('Payment error:', error)
                    const data = error.response?.data || {}
                    
                    if (error.response?.status === 400 && data.required !== undefined) {
                        const requiredAmount = data.required
                        const currentBalVal = data.current_balance
                        
                        const detailMsg = `Hisobingizda mablag' yetarli emas! Sizga yana ${new Intl.NumberFormat('uz-UZ').format(requiredAmount)} so'm kerak. Hozirgi balansingiz: ${new Intl.NumberFormat('uz-UZ').format(currentBalVal)} so'm. Balansni to'ldirish oynasini ochamizmi?`
                        
                        confirmStore.require({
                            header: "Mablag' yetarli emas",
                            message: detailMsg,
                            icon: 'pi pi-wallet text-amber-500 text-lg',
                            acceptLabel: 'Ha',
                            rejectLabel: "Yo'q",
                            accept: () => {
                                handleTopupRequired(requiredAmount)
                            }
                        })
                    } else {
                        const detailMsg = data.message || data.error || data.detail || t('common.error_message')
                        toast.add({ 
                            severity: 'error', 
                            summary: t('common.error') || 'Xatolik', 
                            detail: detailMsg, 
                            life: 6000 
                        })
                    }
                } finally {
                    processing.value = false
                }
            }
        })
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
                    await loadSubscription(true)
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
        // Yangi 3 ta feature (O'zgarish 2)
        if (plan.has_shift) features.push(t('subscription.features.has_shift'))
        if (plan.has_discount) features.push(t('subscription.features.has_discount'))
        if (plan.has_receipt_design) features.push(t('subscription.features.has_receipt_design'))
        
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
        isYearly,
        hasYearlyOption,
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
        selectedPlanType,
        
        // Topup variables & handlers
        topupDialog,
        topupAmount,
        topupLoading,
        pollingActive,
        topupStatusText,
        handleTopup,
        handleTopupRequired
    }
}


