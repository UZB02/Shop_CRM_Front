<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/stores" class="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-building text-[11px]"></i>
          {{ $t('menu.stores') }}
        </router-link>
        <i class="pi pi-chevron-right text-[10px] text-slate-300"></i>
        <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-widest truncate">{{ branch?.name || '...' }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 w-full sm:w-auto">
      <button
        v-if="settingsStore.hasPlanExport"
        @click="$emit('export')"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-indigo-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-file-excel text-[12px] sm:text-xs"></i>
        <span>{{ $t('common.export') }}</span>
      </button>
      <button
        v-if="branch?.id && settingsStore.hasPlanQrBulk"
        @click="router.push({ name: 'branch-bulk', params: { id: branch.id } })"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm shadow-emerald-500/10"
      >
        <i class="pi pi-plus text-[12px] sm:text-xs"></i>
        <span>{{ $t('warehouse.detail.bulk_movement') }}</span>
      </button>
      <button
        v-if="branch?.id"
        @click="$emit('transfer')"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-arrow-right-arrow-left text-[12px] sm:text-xs text-emerald-500"></i>
        <span>{{ $t('warehouse.detail.new_transfer') }}</span>
      </button>
      <button
        @click="$emit('edit')"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-pencil text-[12px] sm:text-xs text-emerald-500"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/store/settings'
const router = useRouter()
const settingsStore = useSettingsStore()
defineProps({ branch: Object })
defineEmits(['edit', 'transfer', 'export'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


