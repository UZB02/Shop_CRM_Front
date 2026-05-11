<template>
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
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'

const { t } = useI18n()

defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

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
</script>
