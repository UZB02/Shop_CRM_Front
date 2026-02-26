<template>
  <section>
    <SectionTitle :label="$t('workers.form.work_info')" color="slate" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      <FormField :label="$t('workers.form.role')">
        <Dropdown v-model="worker.role"
                  :options="localizedRoles"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full field-input !h-10 flex items-center"
                  :placeholder="$t('common.choose')" />
      </FormField>
      <FormField :label="$t('workers.form.branch')">
        <Dropdown v-model="worker.branch"
                  :options="stores"
                  optionLabel="name"
                  optionValue="id"
                  class="w-full !bg-white !border-slate-200 !h-10 !rounded-xl flex items-center"
                  :loading="storesLoading"
                  :placeholder="$t('workers.form.placeholder_branch')" />
      </FormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <FormField :label="$t('workers.form.salary')">
        <InputNumber v-model="worker.salary"
                     mode="decimal"
                     class="w-full rounded-xl"
                     inputClass="w-full !bg-white !border-slate-200 !h-10 !rounded-xl text-emerald-600 font-black"
                     placeholder="0" />
      </FormField>
      <FormField :label="$t('workers.form.status')">
        <Dropdown v-model="worker.status"
                  :options="localizedStatuses"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full field-input !h-10 flex items-center"
                  :placeholder="$t('common.choose')" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
import { WORKER_STATUSES as statuses, WORKER_ROLES as roles } from '../../composables/useWorkerForm.js'

const { t } = useI18n()

const localizedRoles = computed(() => roles.map(r => ({
  ...r,
  label: t(`workers.roles.${r.value}`)
})))

const localizedStatuses = computed(() => statuses.map(s => ({
  ...s,
  label: t(`workers.statuses.${s.value}`)
})))

defineProps({
  worker:        { type: Object,  required: true },
  stores:        { type: Array,   default: () => [] },
  storesLoading: Boolean,
})
</script>
