<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('workers.management_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('workers.worker_count', { count: totalWorkers }) }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="notificationStore.canAddWorker ? $emit('add') : null"
        v-tooltip.bottom="limitTooltip"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        :class="[
          notificationStore.canAddWorker 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
        ]"
      >
        <i :class="notificationStore.canAddWorker ? 'pi pi-user-plus' : 'pi pi-lock'" class="text-xs"></i>
        <span>{{ $t('workers.new_worker') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notifications'

const { t } = useI18n()
const notificationStore = useNotificationStore()

const limitTooltip = computed(() => {
  const w = notificationStore.usage?.workers
  if (!w || w.can_add) return null
  return t('subscription.limit_reached', { used: w.used, limit: w.limit })
})

defineProps({ totalWorkers: Number })
defineEmits(['add'])
</script>
