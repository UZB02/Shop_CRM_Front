<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
      <span class="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center">
        <i class="pi pi-briefcase text-blue-500" style="font-size:9px"></i>
      </span>
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('workers.form.work_info').toUpperCase() }}</span>
    </div>
    <div class="p-4 grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.branch') }} <span class="text-rose-500">*</span></label>
        <Select v-model="worker.branch" :options="branches" optionLabel="name" optionValue="id"
          size="small" class="sr-select w-full !text-sm"
          :class="{'!border-rose-400': submitted && !worker.branch}" :placeholder="$t('common.choose')" />
      </div>
      <div v-if="!isManager">
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.role') }}</label>
        <Select v-model="worker.role" :options="localizedRoles" optionLabel="label" optionValue="value"
          size="small" class="sr-select w-full !text-sm" @change="onRoleChange" />
      </div>
      <div v-if="!isManager">
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.salary') }}</label>
        <InputNumber v-model="worker.salary" mode="decimal" class="sr-number w-full"
          inputClass="!text-emerald-500 !font-black !text-sm !py-2" placeholder="0" />
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-400 mb-1">{{ $t('workers.form.status') }}</label>
        <Select v-model="worker.status" :options="localizedStatuses" optionLabel="label" optionValue="value"
          size="small" class="sr-select w-full !text-sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const isManager = computed(() => {
  const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
  return role === 'manager'
})

defineProps({
  worker: Object,
  submitted: Boolean,
  branches: Array,
  localizedRoles: Array,
  localizedStatuses: Array,
  onRoleChange: Function
})
</script>
