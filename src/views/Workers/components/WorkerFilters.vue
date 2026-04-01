<template>
  <div class="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div class="relative w-full">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
          <i class="pi pi-search"></i>
        </span>
        <InputText 
          v-model="modelValue.search" 
          :placeholder="$t('common.search') + '...'" 
          class="w-full !pl-11 !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 focus:!ring-2 focus:!ring-emerald-500/20 transition-all text-sm !text-slate-700 dark:!text-white"
        />
      </div>

      <!-- Role Filter -->
      <Select 
        v-model="modelValue.role" 
        :options="roleOptions" 
        optionLabel="label" 
        optionValue="value" 
        showClear 
        :placeholder="$t('workers.role')" 
        class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm !text-slate-700 dark:!text-white"
      />

      <!-- Status Filter -->
      <Select 
        v-model="modelValue.status" 
        :options="statusOptions" 
        optionLabel="label" 
        optionValue="value" 
        showClear 
        :placeholder="$t('common.status')" 
        class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm !text-slate-700 dark:!text-white"
      />

      <!-- Branch Filter -->
      <Select 
        v-model="modelValue.branch" 
        :options="branches" 
        optionLabel="name" 
        optionValue="id" 
        showClear 
        :placeholder="$t('workers.branch')" 
        :loading="loadingLocations"
        class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm !text-slate-700 dark:!text-white"
      />
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  roleOptions: Array,
  statusOptions: Array,
  branches: Array,
  loadingLocations: Boolean
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* LIGHT MODE */
:deep(.p-inputtext::placeholder),
:deep(.p-dropdown-label.p-placeholder) {
  color: #64748b !important;
}

:deep(.p-inputtext),
:deep(.p-dropdown-label) {
  color: #1e293b !important;
  font-weight: 500;
}

/* DARK MODE - DEEP WHITE ENFORCEMENT */
.dark :deep(.p-inputtext),
.dark :deep(.p-inputtext::placeholder),
.dark :deep(.p-dropdown-label),
.dark :deep(.p-dropdown-label.p-placeholder),
.dark :deep(.p-dropdown-clear-icon),
.dark :deep(.p-dropdown-trigger),
.dark :deep(.p-dropdown-trigger-icon) {
  color: #ffffff !important; /* PURE WHITE */
  opacity: 1 !important;
  -webkit-text-fill-color: #ffffff !important;
}

/* Lighten the filter boxes for better contrast */
.dark .p-inputtext,
.dark .p-dropdown {
  background: #334155 !important; /* solid slate-700 */
  border-color: #475569 !important; /* slate-600 */
}

/* Ensure selected label is white */
.dark :deep(.p-dropdown .p-dropdown-label:not(.p-placeholder)) {
  color: #ffffff !important;
}

/* Panel/Overlay Styling */
.dark :deep(.p-dropdown-panel) {
  background: #1e293b !important; /* slate-800 */
  border: 1px solid #475569 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}

.dark :deep(.p-dropdown-item) {
  color: #f8fafc !important; /* slate-50 */
}

.dark :deep(.p-dropdown-item.p-highlight) {
  background: #10b981 !important; /* emerald-500 */
  color: #ffffff !important;
}

.dark :deep(.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  background: #334155 !important;
}
</style>
