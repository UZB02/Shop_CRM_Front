import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useConfirmStore } from '@/store/confirm'
import { useSettingsStore } from '@/store/settings'

export const useSubscriptionPayment = (state, plans, coupons, loaders) => {
    const toast = useToast()
    const { t } = useI18n()
    const { 
        subscription, selectedPlanId, isExtending, isYearly, paymentDialog, processing,
        topupAmount, topupDialog
    } = state
    const { selectedPlanObject, selectedPlanType } = plans
    const { getFinalPriceLabel } = coupons
    const { loadSubscription, loadBalanceData, loadBillingData } = loaders

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
                    const payload = {
                        plan_id: selectedPlanId.value,
                        is_yearly: isYearly.value
                    }
                    const response = await subscriptionAPI.changePlan(payload)

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
                    
                    toast.add({ 
                        severity: 'success', 
                        summary: t('common.success') || 'Muvaffaqiyat', 
                        detail: successDetail, 
                        life: 7000 
                    })
                    
                    await Promise.all([
                        loadSubscription(true),
                        loadBalanceData(),
                        loadBillingData(),
                        // ✅ Plan o'zgarganda plan_features ni ham yangilash (has_promotion va boshqalar)
                        useSettingsStore().fetchSettings()
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

    return {
        confirmChangePlan,
        openExtendDialog,
        processPayment,
        handleTopupRequired
    }
}
