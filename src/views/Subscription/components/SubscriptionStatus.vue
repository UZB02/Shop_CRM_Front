<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
    <!-- Left Column: Primary Status & Limits -->
    <div class="lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
      <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !rounded-2xl overflow-hidden relative flex-1 min-h-[160px]">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-emerald-500/[0.03] dark:from-indigo-500/10 dark:to-emerald-500/10" />
        <template #content>
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="flex justify-between items-start">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-1.5 mb-1">
                    <span 
                        class="w-1.5 h-1.5 rounded-full" 
                        :class="{
                            'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]': getStatusSeverity(subscription) === 'success',
                            'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]': getStatusSeverity(subscription) === 'warning',
                            'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]': getStatusSeverity(subscription) === 'danger'
                        }"
                    />
                    <span class="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500">{{ subscription.store_name }}</span>
                  </div>
                  <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{{ displayPlanName }}</h2>
                  <div class="flex items-center gap-2">
                     <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest">{{ subscription.plan?.plan_type_display }}</p>
                     <span v-if="subscription.plan" class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] uppercase font-bold text-slate-500">
                        {{ subscription.is_yearly ? $t('subscription.yearly') : $t('subscription.monthly') }}
                     </span>
                  </div>
               </div>
               <Tag :value="subscription.status_display || getStatusLabel(subscription.status)" :severity="getStatusSeverity(subscription)" class="!text-[11px] !font-black !px-3 !py-1 !rounded-md" />
            </div>

            <div class="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
               <div v-if="remainingDays !== null" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors" :class="{
                  'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20': subscription.expires_soon || remainingDays <= 0,
                  'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5': !subscription.expires_soon && remainingDays > 0
               }">
                  <i class="pi pi-clock text-[12px]" :class="(subscription.expires_soon || remainingDays <= 0) ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'" />
                  <span class="text-[12px] font-black" :class="(subscription.expires_soon || remainingDays <= 0) ? 'text-rose-700 dark:text-rose-200' : 'text-amber-700 dark:text-amber-200'">{{ $t('subscription.days_left', { days: remainingDays }) }}</span>
               </div>
               <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <i class="pi pi-calendar text-emerald-500 dark:text-emerald-400 text-[12px]" />
                  <span class="text-[12px] font-black text-emerald-700 dark:text-emerald-200">
                     {{ subscription.start_date }} - {{ subscription.end_date }}
                  </span>
               </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Middle Column: Limits & Billing -->
    <div class="lg:col-span-6 xl:col-span-4 flex flex-col gap-4">
      <!-- Usage Limits -->
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

      <!-- Balance & Billing Summary -->
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
    </div>

    <!-- Right Column: Features Grid -->
    <div class="lg:col-span-6 xl:col-span-4 flex flex-col gap-4">
      <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl h-full">
        <template #title>
          <div class="px-2 pt-2 flex items-center gap-2 text-[12px] font-bold text-slate-500 tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2 mb-2">
            <i class="pi pi-star-fill text-amber-500 text-[10px]" />
            {{ $t('subscription.features.title') }}
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div 
              v-for="(label, key) in featureLabels" 
              :key="key"
              class="flex items-center gap-2 p-2 rounded-xl border transition-all duration-300"
              :class="subscription.plan?.[key] 
                ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10' 
                : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 opacity-20'"
            >
              <div 
                class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="subscription.plan?.[key] ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'"
              >
                <i :class="[getFeatureIcon(key), 'text-[11px]']" />
              </div>
              <span class="text-[11px] font-bold leading-tight tracking-tighter truncate" :class="subscription.plan?.[key] ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300'">
                {{ label }}
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notifications'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()

const formatCurrency = (val) => settingsStore.formatPrice(val)

const props = defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Detailed labels from translation
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

const featureLabels = computed(() => ({
  has_subcategory: t('subscription.features.has_subcategory'),
  has_sale_return: t('subscription.features.has_sale_return'),
  has_wastage: t('subscription.features.has_wastage'),
  has_stock_audit: t('subscription.features.has_stock_audit'),
  has_kpi: t('subscription.features.has_kpi'),
  has_multi_currency: t('subscription.features.has_multi_currency'),
  has_supplier: t('subscription.features.has_supplier'),
  has_export: t('subscription.features.has_export'),
  has_dashboard: t('subscription.features.has_dashboard'),
  has_qr_bulk: t('subscription.features.has_qr_bulk'),
  has_audit_log: t('subscription.features.has_audit_log'),
  has_telegram: t('subscription.features.has_telegram')
}))

const displayPlanName = computed(() => props.subscription.plan?.name || t('common.loading'))
const remainingDays = computed(() => {
    if (!props.subscription.end_date) return props.subscription.days_left ?? 0;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const endDate = new Date(props.subscription.end_date);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
})

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

const getFeatureIcon = (key) => {
    const icons = {
        has_subcategory: 'pi pi-folder',
        has_sale_return: 'pi pi-replay',
        has_wastage: 'pi pi-trash',
        has_stock_audit: 'pi pi-search',
        has_kpi: 'pi pi-chart-line',
        has_multi_currency: 'pi pi-dollar',
        has_supplier: 'pi pi-truck',
        has_export: 'pi pi-file-export',
        has_dashboard: 'pi pi-th-large',
        has_qr_bulk: 'pi pi-qrcode',
        has_audit_log: 'pi pi-history',
        has_telegram: 'pi pi-send'
    }
    return icons[key] || 'pi pi-check'
}

const getStatusLabel = (status) => {
    const s = String(status || '').toLowerCase()
    const days = remainingDays.value
    
    // Logic: Even if status is unknown, if we have days left, it's NOT expired
    if (s === 'active' || s === 'trial' || s === 'trialing' || (days > 0)) {
        return t('subscription.status_active')
    }
    
    if (s === 'warning' || (days > 0 && days <= 3)) {
        return t('subscription.status_warning')
    }
    
    return t('subscription.status_expired')
}

const getStatusSeverity = (sub) => {
    const s = String(sub.status || '').toLowerCase()
    const days = remainingDays.value
    
    if (sub.expires_soon || (days > 0 && days <= 3)) {
        return 'warning'
    }

    if (s === 'active' || s === 'trial' || s === 'trialing' || (days > 0)) {
        return 'success'
    }
    
    return 'danger'
}
</script>


