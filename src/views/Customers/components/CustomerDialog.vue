<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '500px' }" 
    :header="customer.id ? $t('customers.form.edit') : $t('customers.form.add')" 
    :modal="true" 
    class="p-fluid"
    @hide="$emit('hide')"
  >
    <div class="space-y-4 pt-4">
      <div class="field">
        <label for="name" class="font-bold block mb-2 text-slate-600">{{ $t('customers.form.full_name') }} <span class="text-rose-500">*</span></label>
        <InputText id="name" v-model.trim="customer.name" required="true" autofocus :class="{ '!border-rose-500': submitted && !customer.name }" :placeholder="$t('customers.form.name_placeholder')" class="sr-input" />
        <small class="p-error text-[10px]" v-if="submitted && !customer.name">{{ $t('customers.form.name_required') }}</small>
      </div>

      <div class="field">
        <label for="phone" class="font-bold block mb-2 text-slate-600">{{ $t('customers.form.phone') }} <span class="text-rose-500">*</span></label>
        <InputMask id="phone" v-model="customer.phone" mask="+999999999999" placeholder="+998" :class="{ '!border-rose-500': submitted && !customer.phone }" class="sr-input" />
        <small class="p-error text-[10px]" v-if="submitted && !customer.phone">{{ $t('customers.form.phone_required') }}</small>
      </div>

      <div class="field">
        <label for="group" class="font-bold block mb-2 text-slate-600">{{ $t('customers.form.group') }}</label>
        <Select 
          id="group" 
          v-model="customer.group" 
          :options="groups" 
          optionLabel="name" 
          optionValue="id" 
          :placeholder="$t('customers.form.group_placeholder')" 
          class="sr-select"
        />
      </div>

      <div class="field">
        <label for="address" class="font-bold block mb-2 text-slate-600">{{ $t('customers.form.address') }}</label>
        <InputText id="address" v-model="customer.address" :placeholder="$t('customers.form.address_placeholder')" class="sr-input" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-4">
        <Button :label="$t('common.cancel')" icon="pi pi-times" text @click="$emit('update:visible', false)" />
        <Button :label="$t('common.save')" icon="pi pi-check" :loading="saving" severity="success" @click="$emit('save')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Select from 'primevue/select'

const props = defineProps({
  visible: Boolean,
  customer: Object,
  groups: Array,
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])
</script>
