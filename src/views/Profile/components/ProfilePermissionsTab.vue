<template>
  <div class="permissions-main-card animate-fade-up">
    <div class="flex items-center gap-4 mb-10">
      <div class="icon-box-amber">
        <i class="pi pi-shield"></i>
      </div>
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">{{ $t('profile.permissions.title') }}</h3>
        <p class="text-sm text-slate-500 font-medium">{{ $t('profile.permissions.subtitle') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="perm in permissions" :key="perm" class="perm-tag-item">
        <div class="perm-check-icon">
          <i class="pi pi-check text-xs"></i>
        </div>
        <span class="text-[14px] font-bold text-slate-700 dark:text-slate-200 capitalize tracking-tight">{{ getPermLabel(perm) }}</span>
      </div>

      <div v-if="!permissions?.length" class="col-span-full py-16 text-center opacity-40">
        <i class="pi pi-lock text-5xl text-slate-300 block mb-4"></i>
        <p class="text-lg font-black text-slate-400 tracking-widest uppercase">{{ $t('profile.permissions.no_permissions') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { PERMISSIONS_LIST } from '@/views/Workers/composables/useWorkerForm.js'

const { t } = useI18n()

defineProps({
  permissions: Array
})

// Map raw backend codes → human-readable labels
const PERM_LABEL_MAP = Object.fromEntries(PERMISSIONS_LIST.map(p => [p.value, p.label]))

function getPermLabel(code) {
  return PERM_LABEL_MAP[code] || code
}
</script>

<style scoped>
.permissions-main-card {
  background-color: white;
  border: 1px solid #f1f5f9;
  border-radius: 0.75rem; /* Matched with WorkerPermissionsTab (rounded-xl) */
  padding: 2.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dark .permissions-main-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.icon-box-amber {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.perm-tag-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(248, 250, 252, 0.5);
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  transition: all 0.3s;
}
.dark .perm-tag-item {
  background-color: rgba(30, 41, 59, 0.3);
  border-color: rgba(51, 65, 85, 0.5);
}
.perm-tag-item:hover {
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.05);
}

.perm-check-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  background-color: white;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}
.dark .perm-check-icon {
  background-color: #334155;
  border-color: #475569;
}
.perm-tag-item:hover .perm-check-icon {
  transform: scale(1.1);
}
</style>
