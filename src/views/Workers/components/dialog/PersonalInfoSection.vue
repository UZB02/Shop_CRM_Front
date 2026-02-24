<template>
  <section>
    <SectionTitle label="Shaxsiy ma'lumotlar" color="emerald" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormField label="Ism" required>
        <InputText v-model.trim="worker.first_name"
                   class="w-full field-input"
                   :class="{ '!border-rose-500': submitted && !worker.first_name }"
                   placeholder="Alisher" />
      </FormField>
      <FormField label="Familiya" required>
        <InputText v-model.trim="worker.last_name"
                   class="w-full field-input"
                   :class="{ '!border-rose-500': submitted && !worker.last_name }"
                   placeholder="Navoiy" />
      </FormField>
    </div>

    <FormField label="Elektron pochta" class="mt-5">
      <div class="p-input-icon-left w-full">
        <InputText v-model.trim="worker.email"
                   class="w-full field-input"
                   placeholder="email@example.com" />
      </div>
    </FormField>

    <div class="grid grid-cols-2 gap-5 mt-5">
      <FormField label="Telefon raqami" required>
        <div class="p-input-icon-left w-full">
          <InputMask v-model="worker.phone1"
                     mask="+998 (99) 999-99-99"
                     :unmask="true"
                     class="w-full field-input"
                     :class="{ '!border-rose-500': submitted && !worker.phone1 }"
                     placeholder="+998 (__) ___-__-__" />
        </div>
      </FormField>
      <FormField label="Lavozim">
        <Dropdown v-model="worker.role"
                  :options="roles"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full field-input flex items-center"
                  placeholder="Tanlang" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Dropdown from 'primevue/dropdown'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
import { WORKER_ROLES as roles } from '../../composables/useWorkerForm.js'

defineProps({
  worker: { type: Object, required: true },
  submitted: Boolean,
})
</script>
