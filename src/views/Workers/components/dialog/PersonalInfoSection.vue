<template>
  <section>
    <SectionTitle :label="$t('workers.form.personal_info')" color="emerald" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormField :label="$t('workers.form.first_name')" required>
        <InputText v-model.trim="worker.first_name"
                   class="w-full field-input"
                   :class="{ '!border-rose-500': submitted && !worker.first_name }"
                   placeholder="Alisher" />
      </FormField>
      <FormField :label="$t('workers.form.last_name')" required>
        <InputText v-model.trim="worker.last_name"
                   class="w-full field-input"
                   :class="{ '!border-rose-500': submitted && !worker.last_name }"
                   placeholder="Navoiy" />
      </FormField>
    </div>

    <FormField :label="$t('workers.form.email')" class="mt-5">
      <div class="p-input-icon-left w-full">
        <InputText v-model.trim="worker.email"
                   class="w-full field-input"
                   placeholder="email@example.com" />
      </div>
    </FormField>

    <div class="grid grid-cols-2 gap-5 mt-5">
      <FormField :label="$t('workers.form.phone')" required>
        <div class="p-input-icon-left w-full">
          <InputMask v-model="worker.phone1"
                     mask="+998 (99) 999-99-99"
                     :unmask="true"
                     class="w-full field-input"
                     :class="{ '!border-rose-500': submitted && !worker.phone1 }"
                     placeholder="+998 (__) ___-__-__" />
        </div>
      </FormField>
      <FormField :label="$t('workers.form.role')">
        <Dropdown v-model="worker.role"
                  :options="localizedRoles"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full field-input flex items-center"
                  :placeholder="$t('common.choose')" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Dropdown from 'primevue/dropdown'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
import { WORKER_ROLES as roles } from '../../composables/useWorkerForm.js'

const { t } = useI18n()

const localizedRoles = computed(() => roles.map(r => ({
  ...r,
  label: t(`workers.roles.${r.value}`)
})))

defineProps({
  worker: { type: Object, required: true },
  submitted: Boolean,
})
</script>
