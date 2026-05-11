<template>
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
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const { t } = useI18n()

const props = defineProps({
  subscription: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

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

const getStatusLabel = (status) => {
    const s = String(status || '').toLowerCase()
    const days = remainingDays.value
    
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
