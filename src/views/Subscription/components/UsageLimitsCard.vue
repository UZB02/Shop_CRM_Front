<template>
  <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl p-4 flex-1">
    <template #content>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
           <div v-for="(item, key) in limits" :key="key" class="space-y-1.5">
              <div class="flex justify-between items-center text-[11px] font-bold tracking-tight">
                 <span class="text-slate-400 dark:text-slate-500">{{ item.label }}</span>
                 <span class="text-slate-900 dark:text-slate-100 flex items-center gap-1">
                   {{ item.data?.used || 0 }} 
                   <span class="text-slate-300 dark:text-slate-700 italic font-medium">/</span> 
                   {{ item.data?.unlimited ? '∞' : (item.data?.limit || 0) }}
                 </span>
              </div>
              <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   class="h-full rounded-full transition-all duration-1000 ease-out" 
                   :class="getUsageColor(item.data)"
                   :style="{ width: item.data?.unlimited ? '100%' : getUsagePercentage(item.data) + '%' }" 
                 />
              </div>
           </div>
        </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import { useNotificationStore } from '@/store/notifications'

const { t } = useI18n()
const notificationStore = useNotificationStore()

const limits = computed(() => ({
  max_branches: {
      label: t('subscription.limits.max_branches'),
      data: notificationStore.usage.branches
  },
  max_products: {
      label: t('subscription.limits.max_products'),
      data: notificationStore.usage.products
  },
  max_warehouses: {
      label: t('subscription.limits.max_warehouses'),
      data: notificationStore.usage.warehouses
  },
  max_workers: {
      label: t('subscription.limits.max_workers'),
      data: notificationStore.usage.workers
  }
}))

const getUsagePercentage = (data) => {
    if (!data || data.unlimited) return 0
    if (data.limit === 0) return 0
    return Math.min(Math.round((data.used / data.limit) * 100), 100)
}

const getUsageColor = (data) => {
    const pct = getUsagePercentage(data)
    if (pct >= 90) return 'bg-rose-500'
    if (pct >= 70) return 'bg-amber-500'
    return 'bg-emerald-500'
}
</script>
