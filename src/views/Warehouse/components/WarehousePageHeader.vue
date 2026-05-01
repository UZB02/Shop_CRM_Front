<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard" class="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[11px]"></i>
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[10px] text-slate-300"></i>
        <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('warehouse.page_title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('warehouse.management_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('warehouse.page_subtitle') }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button 
        @click="notificationStore.canAddWarehouse ? $emit('add') : null"
        v-tooltip.bottom="limitTooltip"
        class="h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap"
        :class="[
          notificationStore.canAddWarehouse 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
        ]"
      >
        <i :class="notificationStore.canAddWarehouse ? 'pi pi-plus' : 'pi pi-lock'" class="text-[12px]"></i>
        <span>{{ $t('warehouse.new_warehouse') }}</span>
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
  const w = notificationStore.usage?.warehouses
  if (!w || w.can_add) return null
  return t('subscription.limit_reached', { used: w.used, limit: w.limit })
})

defineEmits(['add'])
</script>


