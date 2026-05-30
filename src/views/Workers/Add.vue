<template>
  <div class="font-inter">
    <!-- TOP NAV BAR -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button @click="router.back()"
          class="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition-all shadow-sm">
          <i class="pi pi-arrow-left text-xs"></i>
        </button>
        <div>
          <p class="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
            <router-link :to="{ name:'workers' }" class="hover:text-emerald-500 transition-colors">{{ $t('workers.title') }}</router-link>
            <i class="pi pi-angle-right text-[9px]"></i>
            <span>{{ isEdit ? $t('workers.actions.edit') : $t('workers.new_worker') }}</span>
          </p>
          <h1 class="text-sm font-black text-slate-800 dark:text-white leading-none">{{ isEdit ? $t('workers.actions.edit') : $t('workers.actions.add') }}</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <router-link :to="{ name:'workers' }"
          class="h-8 px-4 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center">
          {{ $t('common.cancel') }}
        </router-link>
        <button @click="handleSave" :disabled="saving"
          class="h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5">
          <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="text-[10px]"></i>
          {{ $t('common.save_worker') }}
        </button>
      </div>
    </div>

    <!-- MAIN GRID: Left (wide) | Right (compact sticky) -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
      <!-- ══════════════ LEFT COLUMN ══════════════ -->
      <div class="space-y-3">
        <WorkerPersonalInfo :worker="worker" :submitted="submitted" />
        
        <WorkerWorkInfo 
          :worker="worker" 
          :submitted="submitted" 
          :branches="branches" 
          :localizedRoles="localizedRoles" 
          :localizedStatuses="localizedStatuses" 
          :onRoleChange="onRoleChange" />
          
        <WorkerSystemAccess 
          :worker="worker" 
          v-model:createLogin="createLogin"
          :PERMISSIONS_LIST="PERMISSIONS_LIST"
          :allSelected="allSelected"
          :isSelected="isSelected"
          :togglePerm="togglePerm"
          :toggleAll="toggleAll" />
      </div>

      <!-- ══════════════ RIGHT COLUMN (sticky compact) ══════════════ -->
      <WorkerPreviewSidebar 
        :worker="worker"
        :avatarStyle="avatarStyle"
        :getStatusLabel="getStatusLabel"
        :checklist="checklist"
        :fillPercent="fillPercent" />
    </div>
  </div>
</template>

<script setup>
import { useWorkerEdit } from './composables/useWorkerEdit'
import WorkerPersonalInfo from './components/WorkerPersonalInfo.vue'
import WorkerWorkInfo from './components/WorkerWorkInfo.vue'
import WorkerSystemAccess from './components/WorkerSystemAccess.vue'
import WorkerPreviewSidebar from './components/WorkerPreviewSidebar.vue'

const {
  isEdit,
  worker,
  branches,
  saving,
  submitted,
  createLogin,
  localizedRoles,
  localizedStatuses,
  getStatusLabel,
  onRoleChange,
  isSelected,
  allSelected,
  togglePerm,
  toggleAll,
  avatarStyle,
  fillPercent,
  checklist,
  handleSave,
  router,
  PERMISSIONS_LIST
} = useWorkerEdit()
</script>

<style scoped>
/* 
  PrimeVue components (Select, InputNumber, InputText) have global styles 
  with '!important' padding in main.css. Here we override them locally 
  using scoped :deep() selectors to make the entire form perfectly uniform and compact.
*/
:deep(.sr-input) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-select.sr-select),
:deep(.p-select) {
  border-radius: 0.75rem !important;
  height: 38px !important;
  min-height: 38px !important;
}

:deep(.p-select-label) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  line-height: 1.4 !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

:deep(.sr-number) {
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-inputnumber-input),
:deep(.p-inputnumber .p-inputtext) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  height: 100% !important;
}

:deep(.p-select-option) {
  font-size: 0.825rem !important;
  padding: 0.4rem 0.75rem !important;
}
</style>

<style scoped>
/* 
  PrimeVue components (Select, InputNumber, InputText) have global styles 
  with '!important' padding in main.css. Here we override them locally 
  using scoped :deep() selectors to make the entire form perfectly uniform and compact.
*/
:deep(.sr-input) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-select.sr-select),
:deep(.p-select) {
  border-radius: 0.75rem !important;
  height: 38px !important;
  min-height: 38px !important;
}

:deep(.p-select-label) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  line-height: 1.4 !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

:deep(.sr-number) {
  border-radius: 0.75rem !important;
  height: 38px !important;
}

:deep(.p-inputnumber-input),
:deep(.p-inputnumber .p-inputtext) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.825rem !important;
  height: 100% !important;
}

:deep(.p-select-option) {
  font-size: 0.825rem !important;
  padding: 0.4rem 0.75rem !important;
}
</style>
