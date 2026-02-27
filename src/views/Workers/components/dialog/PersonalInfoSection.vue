<template>
  <section>
    <SectionTitle :label="$t('workers.form.personal_info')" color="emerald" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <FormField :label="$t('workers.form.phone')" required>
        <div class="relative flex items-center w-full">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm pointer-events-none select-none z-10">+998</span>
          <InputText v-model="worker.phone1"
                     class="w-full field-input !pl-14 !h-10"
                     :class="{ '!border-rose-500': submitted && !worker.phone1 }"
                     maxlength="9"
                     @input="worker.phone1 = worker.phone1.replace(/\D/g, '')"
                     placeholder="901234567" />
        </div>
      </FormField>
      <FormField :label="$t('workers.form.email')">
        <InputText v-model.trim="worker.email"
                   class="w-full field-input !h-10"
                   placeholder="email@example.com" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
// Removed: import { WORKER_ROLES as roles } from '../../composables/useWorkerForm.js'

const { t } = useI18n()

// Removed: localizedRoles computed property

defineProps({
  worker: { type: Object, required: true },
  submitted: Boolean,
})
</script>
