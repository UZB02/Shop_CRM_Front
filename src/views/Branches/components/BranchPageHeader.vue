<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/stores" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-1">
          <i class="pi pi-building text-[9px]"></i>
          {{ $t('menu.stores') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest truncate">{{ branch?.name || '...' }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ branch?.name || '...' }}</h1>
      <p class="text-xs text-slate-400 mt-0.5 truncate">{{ branch?.address || '...' }} • {{ branch?.phone || '...' }}</p>
    </div>
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 w-full sm:w-auto">
      <button
        v-if="branch?.id"
        @click="$emit('transfer')"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-send text-[10px] sm:text-xs text-amber-500"></i>
        <span>{{ $t('warehouse.detail.new_transfer') }}</span>
      </button>
      <button
        v-if="branch?.id"
        @click="router.push({ name: 'branch-bulk', params: { id: branch.id } })"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-database text-[10px] sm:text-xs text-blue-500"></i>
        <span>{{ $t('warehouse.detail.bulk_movement') }}</span>
      </button>
      <button
        @click="$emit('edit')"
        class="flex-none h-8 px-3 rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900"
      >
        <i class="pi pi-pencil text-[10px] sm:text-xs text-emerald-500"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({ branch: Object })
defineEmits(['edit', 'transfer'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
