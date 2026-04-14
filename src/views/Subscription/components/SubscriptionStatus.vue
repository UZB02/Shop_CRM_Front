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
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ subscription.store_name }}</span>
                  </div>
                  <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{{ displayPlanName }}</h2>
                  <p class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ subscription.plan?.plan_type_display }}</p>
               </div>
               <Tag :value="getStatusLabel(subscription.status)" :severity="getStatusSeverity(subscription.status)" class="!text-[9px] !font-black !px-3 !py-1 !rounded-md" />
            </div>

            <div class="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
               <div v-if="remainingDays !== null" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <i class="pi pi-clock text-amber-500 dark:text-amber-400 text-[10px]" />
                  <span class="text-[10px] font-black text-amber-700 dark:text-amber-200">{{ $t('subscription.days_left', { days: remainingDays }) }}</span>
               </div>
               <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <i class="pi pi-calendar text-emerald-500 dark:text-emerald-400 text-[10px]" />
                  <span class="text-[10px] font-black text-emerald-700 dark:text-emerald-200">{{ formatDate(subscription.end_date) }}</span>
               </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Usage Limits -->
      <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl p-4 flex-1">
        <template #content>
           <div class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div v-for="(label, key) in limits" :key="key" class="space-y-1">
                 <div class="flex justify-between text-[9px] font-bold uppercase tracking-tight text-slate-400 dark:text-slate-500">
                    <span>{{ label }}</span>
                    <span class="text-slate-900 dark:text-slate-100">{{ subscription.plan?.[key] === 0 ? '∞' : subscription.plan?.[key] }}</span>
                 </div>
                 <div class="h-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" :style="{ width: subscription.plan?.[key] === 0 ? '100%' : '65%' }" />
                 </div>
              </div>
           </div>
        </template>
      </Card>
    </div>

    <!-- Right Column: Features Grid -->
    <div class="lg:col-span-12 xl:col-span-8">
      <Card class="border-none shadow-sm !bg-white dark:!bg-slate-900 !rounded-2xl h-full">
        <template #title>
          <div class="px-2 pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2 mb-2">
            <i class="pi pi-star-fill text-amber-500 text-[8px]" />
            {{ $t('subscription.features.title') }}
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                <i :class="[getFeatureIcon(key), 'text-[9px]']" />
              </div>
              <span class="text-[9px] font-bold leading-tight uppercase tracking-tighter truncate" :class="subscription.plan?.[key] ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300'">
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

const { t } = useI18n()

const props = defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const limits = {
  max_branches: t('subscription.limits.max_branches'),
  max_products: t('subscription.limits.max_products'),
  max_warehouses: t('subscription.limits.max_warehouses'),
  max_workers: t('subscription.limits.max_workers')
}

const featureLabels = {
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
}

const displayPlanName = computed(() => props.subscription.plan?.name || t('common.loading'))
const remainingDays = computed(() => props.subscription.days_left ?? null)

const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
        const d = new Date(dateString)
        const day = d.getDate().toString().padStart(2, '0')
        const months = ['Yan', 'Feb', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
        return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`
    } catch (e) {
        return dateString
    }
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
    switch(s) {
        case 'active': return t('subscription.status_active')
        case 'warning': return t('subscription.status_warning')
        default: return t('subscription.status_expired')
    }
}

const getStatusSeverity = (status) => {
    const s = String(status || '').toLowerCase()
    switch(s) {
        case 'active': return 'success'
        case 'warning': return 'warning'
        default: return 'danger'
    }
}
</script>
