<template>
  <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl p-4">
    <template #content>
        <div class="space-y-4">
           <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                 <i class="pi pi-ticket text-amber-500 text-sm"></i>
              </div>
              <span class="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                {{ $t('subscription.apply_coupon') }}
              </span>
           </div>
           
           <div class="flex gap-2">
              <input 
                 v-model="couponCode" 
                 type="text" 
                 :placeholder="$t('subscription.coupon_placeholder')" 
                 class="flex-1 h-9 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 tracking-wider transition-all"
                 :disabled="applyingCoupon"
                 @keyup.enter="handleApplyCoupon"
              />
              <Button 
                 :label="applyingCoupon ? '...' : $t('subscription.apply_action')" 
                 :loading="applyingCoupon"
                 @click="handleApplyCoupon"
                 class="!bg-amber-500 hover:!bg-amber-600 !text-white !border-none !rounded-xl !py-1.5 !px-4 !text-xs !font-bold transition-all shrink-0 active:scale-95" 
              />
           </div>
        </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { subscriptionAPI } from '@/services/api'

const { t } = useI18n()
const toast = useToast()
const emit = defineEmits(['coupon-applied'])

const couponCode = ref('')
const applyingCoupon = ref(false)

const handleApplyCoupon = async () => {
  const code = couponCode.value.trim()
  if (!code) {
    toast.add({
      severity: 'warn',
      summary: t('common.confirm_title') || 'Ogohlantirish',
      detail: t('subscription.coupon_empty_warning'),
      life: 3000
    })
    return
  }

  applyingCoupon.value = true
  try {
    const response = await subscriptionAPI.applyCoupon({ code })
    const data = response.data || {}

    if (data.type === 'free_days') {
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('subscription.coupon_success_free_days', { days: data.discount_value }),
        life: 5000
      })
    } else {
      const formattedDiscount = new Intl.NumberFormat('uz-UZ').format(data.discount_value || 0)
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('subscription.coupon_success_discount', { amount: formattedDiscount }),
        life: 5000
      })
    }

    couponCode.value = ''
    emit('coupon-applied')
  } catch (err) {
    console.error('Coupon apply error:', err)
    const errMsg = err.response?.data?.detail || err.response?.data?.message || t('common.error_message')
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: errMsg,
      life: 5000
    })
  } finally {
    applyingCoupon.value = false
  }
}
</script>
