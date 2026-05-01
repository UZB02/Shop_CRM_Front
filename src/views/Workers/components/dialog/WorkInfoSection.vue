<template>
  <section class="font-inter">
    <SectionTitle :label="$t('workers.form.work_info')" color="slate" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
      <FormField :label="$t('workers.form.branch')">
        <Select v-model="worker.branch"
                  :options="branches"
                  optionLabel="name"
                  optionValue="id"
                  class="sr-select"
                  :placeholder="$t('workers.form.placeholder_branch')" />
      </FormField>
      <FormField :label="$t('workers.form.role')">
        <Select v-model="worker.role"
                  :options="localizedRoles"
                  optionLabel="label"
                  optionValue="value"
                  class="sr-select"
                  :placeholder="$t('common.choose')"
                  @change="handleRoleChange" />
      </FormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 mt-6">
      <FormField :label="$t('workers.form.salary')">
        <InputNumber v-model="worker.salary"
                     mode="decimal"
                     class="sr-number"
                     inputClass="!text-emerald-500 !font-black !py-3 !px-4"
                     placeholder="0" />
      </FormField>
      <FormField :label="$t('workers.form.status')">
        <Select v-model="worker.status"
                  :options="localizedStatuses"
                  optionLabel="label"
                  optionValue="value"
                  class="sr-select"
                  :placeholder="$t('common.choose')" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
import { WORKER_STATUSES as statuses, WORKER_ROLES as roles, ROLE_PERMISSIONS } from '../../composables/useWorkerForm.js'

const { t } = useI18n()

const props = defineProps({
  worker:   { type: Object, required: true },
  branches: { type: Array,  default: () => [] },
})

const localizedRoles = computed(() => roles.map(r => ({
  ...r,
  label: t(`workers.roles.${r.value}`)
})))

const localizedStatuses = computed(() => statuses.map(s => ({
  ...s,
  label: t(`workers.statuses.${s.value}`)
})))

const handleRoleChange = (e) => {
  const newRole = e.value
  if (newRole && ROLE_PERMISSIONS[newRole]) {
    props.worker.permissions = [...ROLE_PERMISSIONS[newRole]]
  }
}
</script>


