<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '450px' }" 
    :header="warehouse._id ? 'omborni tahrirlash' : 'Yangi ombor qo\'shish'" 
    :modal="true" 
    class="p-fluid"
    @hide="$emit('hide')"
  >
    <div class="field mb-4">
      <label for="name" class="font-bold block mb-2">ombor nomi <span class="text-rose-500">*</span></label>
      <InputText id="name" v-model.trim="warehouse.name" required="true" autofocus :class="{ 'p-invalid': submitted && !warehouse.name }" placeholder="Masalan: Markaziy ombor" />
      <small class="p-error" v-if="submitted && !warehouse.name">ombor nomi kiritilishi shart.</small>
    </div>
    
    <div class="field mb-4">
      <label for="store" class="font-bold block mb-2">Biriktirilgan do'kon (ixtiyoriy)</label>
      <Dropdown id="store" v-model="warehouse.store" :options="stores" optionLabel="name" optionValue="_id" placeholder="Do'konni tanlang" showClear />
    </div>

    <div class="field mb-4">
      <label for="location" class="font-bold block mb-2">Manzil</label>
      <InputText id="location" v-model.trim="warehouse.location" placeholder="Masalan: Toshkent sh, Yunusobod" />
    </div>

    <div class="formgrid grid">
      <div class="field col mb-4">
        <label for="capacity" class="font-bold block mb-2">Umumiy sig'imi</label>
        <InputNumber id="capacity" v-model="warehouse.capacity" mode="decimal" showButtons :min="0" />
      </div>
      <div class="field col mb-4 ml-2">
        <label for="status" class="font-bold block mb-2">Status</label>
        <Dropdown id="status" v-model="warehouse.status" :options="statuses" optionLabel="label" optionValue="value" />
      </div>
    </div>

    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" text @click="$emit('update:visible', false)" />
      <Button label="Saqlash" icon="pi pi-check" @click="$emit('save')" :loading="saving" />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  visible: Boolean,
  warehouse: Object,
  stores: Array,
  submitted: Boolean,
  saving: Boolean
})

defineEmits(['update:visible', 'save', 'hide'])

const statuses = [
  { label: 'Faol', value: 'Active' },
  { label: 'NoFaol', value: 'Inactive' }
]
</script>
