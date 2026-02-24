<template>
  <section>
    <SectionTitle label="Ish faoliyati" color="slate" />

    <FormField label="Filial / Do'kon">
      <div class="p-input-icon-left w-full">
        <Dropdown v-model="worker.branch"
                  :options="stores"
                  optionLabel="name"
                  optionValue="id"
                  class="w-full !bg-slate-100/50 dark:!bg-slate-800/30 !border-slate-200 dark:!border-slate-700 !h-12 !rounded-xl flex items-center"
                  :loading="storesLoading"
                  placeholder="Filialni tanlang" />
      </div>
    </FormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
      <FormField label="Oylik Maosh (UZS)">
        <InputNumber v-model="worker.salary"
                     mode="decimal"
                     class="w-full rounded-xl"
                     inputClass="w-full !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !h-11 !rounded-xl text-emerald-600 font-black"
                     placeholder="0" />
      </FormField>
      <FormField label="Status">
        <Dropdown v-model="worker.status"
                  :options="statuses"
                  class="w-full field-input flex items-center"
                  placeholder="Tanlang" />
      </FormField>
    </div>
  </section>
</template>

<script setup>
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import SectionTitle from './SectionTitle.vue'
import FormField from './FormField.vue'
import { WORKER_STATUSES as statuses } from '../../composables/useWorkerForm.js'

defineProps({
  worker:        { type: Object,  required: true },
  stores:        { type: Array,   default: () => [] },
  storesLoading: Boolean,
})
</script>
