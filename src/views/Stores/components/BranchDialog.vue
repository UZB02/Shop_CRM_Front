<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '450px' }" 
    :header="branch._id ? 'Filialni tahrirlash' : 'Yangi filial qo\'shish'" 
    :modal="true" 
    class="p-fluid"
    @hide="$emit('hide')"
  >
    <div class="field mb-4">
      <label for="b_name" class="font-bold block mb-2">Filial nomi</label>
      <InputText id="b_name" v-model.trim="branch.name" required="true" autofocus :class="{ 'p-invalid': submitted && !branch.name }" placeholder="Masalan: Chilonzor-1" />
      <small class="p-error" v-if="submitted && !branch.name">Filial nomi kiritilishi shart.</small>
    </div>
    <div class="field mb-4">
      <label for="parentStore" class="font-bold block mb-2">Asosiy Do'kon</label>
      <Dropdown id="parentStore" v-model="branch.store" :options="stores" optionLabel="name" optionValue="_id" placeholder="Asosiy do'konni tanlang" :class="{ 'p-invalid': submitted && !branch.store }" />
      <small class="p-error" v-if="submitted && !branch.store">Asosiy do'konni tanlash shart.</small>
    </div>
    <div class="field mb-4">
      <label for="b_location" class="font-bold block mb-2">Manzil (shahar/tuman)</label>
      <InputText id="b_location" v-model.trim="branch.location" required="true" :class="{ 'p-invalid': submitted && !branch.location }" placeholder="Masalan: Toshkent, Chilonzor" />
      <small class="p-error" v-if="submitted && !branch.location">Manzil kiritilishi shart.</small>
    </div>
    <div class="formgrid grid">
      <div class="field col mb-4">
        <label for="capacity" class="font-bold block mb-2">Sig'imi (max)</label>
        <InputNumber id="capacity" v-model="branch.capacity" mode="decimal" showButtons :min="0" />
      </div>
      <div class="field col mb-4 ml-2">
        <label for="b_status" class="font-bold block mb-2">Status</label>
        <Dropdown id="b_status" v-model="branch.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Statusni tanlang" />
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
  branch: Object,
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
