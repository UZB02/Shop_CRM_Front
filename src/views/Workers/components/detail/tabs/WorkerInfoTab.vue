<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    
    <!-- Personal Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <i class="pi pi-user text-xs"></i>
        </div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Shaxsiy ma'lumotlar</h3>
      </div>
      <div class="p-6 space-y-5">
        <div v-for="key in ['full_name', 'username', 'status', 'created_at']" :key="key">
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{{ getLabel(key) }}</p>
          <div class="flex items-center gap-2">
            <span v-if="key === 'status'" class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">
              {{ getValue(key) }}
            </span>
            <p v-else class="text-[12px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">{{ getValue(key) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
          <i class="pi pi-phone text-xs"></i>
        </div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Aloqa ma'lumotlari</h3>
      </div>
      <div class="p-6 space-y-5">
        <div v-for="key in ['phone1', 'phone2', 'email']" :key="key">
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{{ getLabel(key) }}</p>
          <p class="text-[12px] font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
            <i v-if="key.includes('phone')" class="pi pi-phone text-[10px] opacity-20"></i>
            <i v-if="key === 'email'" class="pi pi-envelope text-[10px] opacity-20"></i>
            {{ getValue(key) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Work Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
      <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <i class="pi pi-briefcase text-xs"></i>
        </div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Ish faoliyati</h3>
      </div>
      <div class="p-6 space-y-5">
        <div v-for="key in ['role', 'branch']" :key="key">
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{{ getLabel(key) }}</p>
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-emerald-500 shadow-inner">
              <i :class="key === 'role' ? 'pi pi-id-card' : 'pi pi-map-marker'" class="text-[10px]"></i>
            </div>
            <p class="text-[12px] font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">{{ getValue(key) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useWorkerDetail } from '../../../composables/useWorkerDetail'

const props = defineProps({
  worker: Object
})

const { t } = useI18n()
const { formatDate } = useWorkerDetail()

const getLabel = (key) => {
  const labels = {
    full_name: t('workers.full_name'),
    username: t('workers.username'),
    status: t('common.status'),
    created_at: t('workers.created_at'),
    phone1: t('workers.form.phone1'),
    phone2: t('workers.form.phone2'),
    email: t('workers.email'),
    role: t('workers.role'),
    branch: t('workers.branch')
  }
  return labels[key] || key
}

const getValue = (key) => {
  if (key === 'status') return props.worker?.status ? t(`workers.statuses.${props.worker.status}`) : '—'
  if (key === 'created_at') return formatDate(props.worker?.created_on)
  if (key === 'role') return props.worker?.role_display
  if (key === 'branch') return props.worker?.branch_name
  return props.worker?.[key] || '—'
}
</script>
