<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '450px' }" 
    :header="store._id ? 'Do\'konni tahrirlash' : 'Yangi do\'kon qo\'shish'" 
    :modal="true" 
    class="p-fluid"
    @hide="$emit('hide')"
  >
    <div class="field mb-4">
      <label for="name" class="font-bold block mb-2">Do'kon nomi</label>
      <InputText id="name" v-model.trim="store.name" required="true" autofocus :class="{ 'p-invalid': submitted && !store.name }" placeholder="Masalan: Bosh Do'kon" />
      <small class="p-error" v-if="submitted && !store.name">Do'kon nomi kiritilishi shart.</small>
    </div>
    <div class="field mb-4">
      <label for="location" class="font-bold block mb-2">Shahar/Tuman</label>
      <InputText id="location" v-model.trim="store.location" required="true" :class="{ 'p-invalid': submitted && !store.location }" placeholder="Masalan: Toshkent, Chilonzor" />
      <small class="p-error" v-if="submitted && !store.location">Manzil (shahar/tuman) kiritilishi shart.</small>
    </div>
    <div class="field mb-4">
      <label for="address" class="font-bold block mb-2">To'liq manzili</label>
      <Textarea id="address" v-model="store.address" rows="3" placeholder="Masalan: 4-mavze, 21-uy, 14-do'kon" />
    </div>
    <div class="formgrid grid">
      <div class="field col mb-4">
        <label for="phone" class="font-bold block mb-2">Telefon raqami</label>
        <InputText id="phone" v-model="store.phone" placeholder="+998 90 123 45 67" />
      </div>
      <div class="field col mb-4 ml-2">
        <label for="status" class="font-bold block mb-2">Status</label>
        <Dropdown id="status" v-model="store.status" :options="statuses" optionLabel="label" optionValue="value" placeholder="Statusni tanlang" />
      </div>
    </div>
    <div class="field mb-4">
      <label for="openingHours" class="font-bold block mb-2">Ish vaqti</label>
      <InputText id="openingHours" v-model="store.openingHours" placeholder="Masalan: 09:00 - 21:00" />
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
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  visible: Boolean,
  store: Object,
  submitted: Boolean,
  saving: Boolean
})

defineEmits(['update:visible', 'save', 'hide'])

const statuses = [
  { label: 'Faol', value: 'Active' },
  { label: 'NoFaol', value: 'Inactive' }
]
</script>
