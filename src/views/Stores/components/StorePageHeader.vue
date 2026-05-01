<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('stores.page_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ storeName || '...' }} • {{ branchCount }} {{ $t('stores.count_suffix') }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="hasStore"
        @click="$emit('edit-store')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-pencil text-xs"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
      <button
        v-if="!hasStore"
        @click="notificationStore.canAddBranch ? $emit('add-store') : null"
        v-tooltip.bottom="limitTooltip"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        :class="[
          notificationStore.canAddBranch 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
        ]"
      >
        <i :class="notificationStore.canAddBranch ? 'pi pi-plus' : 'pi pi-lock'" class="text-xs"></i>
        <span>{{ $t('stores.add_store') }}</span>
      </button>
      <button
        v-if="hasStore && showAddBranch"
        @click="notificationStore.canAddBranch ? $emit('add-branch') : null"
        v-tooltip.bottom="limitTooltip"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        :class="[
          notificationStore.canAddBranch 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
        ]"
      >
        <i :class="notificationStore.canAddBranch ? 'pi pi-plus' : 'pi pi-lock'" class="text-xs"></i>
        <span>{{ $t('stores.new_branch') }}</span>
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
  const b = notificationStore.usage?.branches
  if (!b || b.can_add) return null
  return t('subscription.limit_reached', { used: b.used, limit: b.limit })
})

defineProps({
  storeName: String,
  branchCount: Number,
  hasStore: Boolean,
  showAddBranch: Boolean
})
defineEmits(['add-store', 'edit-store', 'add-branch'])
</script>


