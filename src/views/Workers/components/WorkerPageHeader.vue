<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('workers.management_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('workers.worker_count', { count: totalWorkers }) }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <router-link
        v-if="settingsStore.isKpiEnabled && settingsStore.hasPlanKpi"
        :to="{ name: 'workers-kpi' }"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm active:scale-95"
      >
        <i class="pi pi-chart-bar text-xs"></i>
        <span>{{ $t('kpi.title') }}</span>
      </router-link>

      <!-- Navigate to /workers/add page instead of modal -->
      <router-link
        v-if="notificationStore.canAddWorker"
        :to="{ name: 'worker-add' }"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95"
      >
        <i class="pi pi-user-plus text-xs"></i>
        <span>{{ $t('workers.new_worker') }}</span>
      </router-link>

      <!-- Limit reached: show disabled button -->
      <span
        v-else
        v-tooltip.bottom="limitTooltip"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 whitespace-nowrap bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50"
      >
        <i class="pi pi-lock text-xs"></i>
        <span>{{ $t('workers.new_worker') }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notifications'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()

const limitTooltip = computed(() => {
  if (notificationStore.canAddWorker) return null
  const w = notificationStore.usage?.workers
  if (!w) return null
  return t('subscription.limit_reached', { used: w.used, limit: w.limit })
})

defineProps({ totalWorkers: Number })
</script>
