<template>
  <section>
    <SectionTitle :label="$t('workers.form.personal_info')" color="emerald" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField :label="$t('workers.form.first_name')" required>
        <InputText v-model.trim="worker.first_name"
                   class="sr-input"
                   :class="{ '!border-rose-500': submitted && !worker.first_name }"
                   placeholder="Alisher" />
      </FormField>
      <FormField :label="$t('workers.form.last_name')" required>
        <InputText v-model.trim="worker.last_name"
                   class="sr-input"
                   :class="{ '!border-rose-500': submitted && !worker.last_name }"
                   placeholder="Navoiy" />
      </FormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <FormField :label="$t('workers.form.phone1')" required>
        <div class="relative flex items-center w-full">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm pointer-events-none select-none z-10">+998</span>
          <InputText v-model="worker.phone1"
                     class="sr-input !pl-14"
                     :class="{ '!border-rose-500': submitted && !worker.phone1 }"
                     maxlength="9"
                     inputmode="numeric"
                     type="tel"
                     @keydown="onPhoneKeydown"
                     @paste="onPhonePaste($event, 'phone1')"
                     @input="worker.phone1 = worker.phone1.replace(/\D/g, '').slice(0, 9)"
                     placeholder="901234567" />
        </div>
      </FormField>
      <FormField :label="$t('workers.form.phone2')">
        <div class="relative flex items-center w-full">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm pointer-events-none select-none z-10">+998</span>
          <InputText v-model="worker.phone2"
                     class="sr-input !pl-14"
                     maxlength="9"
                     inputmode="numeric"
                     type="tel"
                     @keydown="onPhoneKeydown"
                     @paste="onPhonePaste($event, 'phone2')"
                     @input="worker.phone2 = worker.phone2.replace(/\D/g, '').slice(0, 9)"
                     placeholder="901234567" />
        </div>
      </FormField>
    </div>

    <div class="mt-4">
      <FormField :label="$t('workers.form.email')" required>
        <InputText v-model.trim="worker.email"
                   class="sr-input"
                   :class="{ '!border-rose-500': submitted && !worker.email }"
                   placeholder="email@example.com" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'

const props = defineProps({
  worker: { type: Object, required: true },
  submitted: Boolean,
})

// Faqat raqam tugmalariga ruxsat beradi
const ALLOWED_KEYS = [
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End'
]
const onPhoneKeydown = (e) => {
  // Ctrl/Cmd kombinatsiyalari (copy, paste, select all) ruxsat
  if (e.ctrlKey || e.metaKey) return
  // Ruxsat etilgan maxsus tugmalar
  if (ALLOWED_KEYS.includes(e.key)) return
  // Faqat 0-9 raqamlar
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

// Paste da faqat raqamlarni qoldiradi
const onPhonePaste = (e, field) => {
  e.preventDefault()
  const text = (e.clipboardData || window.clipboardData).getData('text')
  const digits = text.replace(/\D/g, '').slice(0, 9)
  props.worker[field] = digits
}
</script>
