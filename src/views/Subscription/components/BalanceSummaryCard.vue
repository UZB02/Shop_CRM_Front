<template>
  <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl p-4 flex-1">
    <template #content>
        <div class="space-y-4">
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-slate-500">
                 <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <i class="pi pi-wallet text-emerald-500 text-sm"></i>
                 </div>
                 <span class="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">{{ $t('subscription.balance') }}</span>
              </div>
              <span class="text-lg font-black text-slate-900 dark:text-white">{{ formatCurrency(subscription.balance || 0) }}</span>
           </div>
           
           <div class="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
           
           <!-- Total Savings from Coupons -->
           <div v-if="totalSavings > 0" class="flex items-center justify-between bg-emerald-50/40 dark:bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
              <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                 <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <i class="pi pi-ticket text-emerald-600 dark:text-emerald-400 text-sm"></i>
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[10px] font-bold tracking-widest uppercase">{{ $t('subscription.total_savings') || "Tejalgan jami mablag'" }}</span>
                    <span class="text-[10px] font-medium opacity-85">{{ $t('subscription.via_coupons') || "kuponlar orqali" }}</span>
                 </div>
              </div>
              <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">+{{ formatCurrency(totalSavings) }}</span>
           </div>

           <div v-if="totalSavings > 0" class="h-px w-full bg-slate-100 dark:bg-slate-800"></div>

           <div class="flex items-center justify-between" v-if="subscription.last_payment_amount">
              <div class="flex items-center gap-2 text-slate-500">
                 <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <i class="pi pi-credit-card text-indigo-500 text-sm"></i>
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">{{ $t('subscription.last_payment') }}</span>
                    <span class="text-[11px] font-medium text-slate-400">{{ subscription.last_payment_date }}</span>
                 </div>
              </div>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ formatCurrency(subscription.last_payment_amount) }}</span>
           </div>
           <div v-else class="flex items-center justify-center py-2">
              <span class="text-[11px] font-bold tracking-widest text-slate-400">{{ $t('subscription.no_payment_history') }}</span>
           </div>
        </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()
const formatCurrency = (val) => settingsStore.formatPrice(val)

const props = defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  },
  coupons: {
    type: Array,
    default: () => []
  }
})

const totalSavings = computed(() => {
  return props.coupons.reduce((total, coupon) => {
    if (coupon.type === 'fixed' || (coupon.type_display && coupon.type_display.toLowerCase().includes('summa'))) {
      return total + parseFloat(coupon.discount_value || 0)
    }
    return total
  }, 0)
})
</script>
