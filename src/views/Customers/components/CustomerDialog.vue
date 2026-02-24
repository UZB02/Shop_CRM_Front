<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '500px' }" 
    :header="customer._id ? 'Mijozni Tahrirlash' : 'Yangi Mijoz Qo\'shish'" 
    :modal="true" 
    class="p-fluid"
    @hide="$emit('hide')"
  >
    <div class="space-y-4 pt-4">
      <div class="field">
        <label for="name" class="font-bold block mb-2 text-slate-600">F.I.SH. <span class="text-rose-500">*</span></label>
        <InputText id="name" v-model.trim="customer.name" required="true" autofocus :class="{ 'p-invalid': submitted && !customer.name }" placeholder="Mijozning to'liq ismi" />
        <small class="p-error" v-if="submitted && !customer.name">F.I.SH. kiritilishi shart.</small>
      </div>

      <div class="field">
        <label for="phone" class="font-bold block mb-2 text-slate-600">Telefon raqami <span class="text-rose-500">*</span></label>
        <InputMask id="phone" v-model="customer.phone" mask="+998 (99) 999-99-99" placeholder="+998 (__) ___-__-__" :class="{ 'p-invalid': submitted && !customer.phone }" />
        <small class="p-error" v-if="submitted && !customer.phone">Telefon raqami kiritilishi shart.</small>
      </div>

      <div class="field">
        <label for="branch" class="font-bold block mb-2 text-slate-600">Filial</label>
        <InputText id="branch" v-model="customer.branch" placeholder="Filial nomi" />
      </div>

      <div class="field">
        <label for="address" class="font-bold block mb-2 text-slate-600">Manzil</label>
        <InputText id="address" v-model="customer.address" placeholder="Yashash manzili" />
      </div>

      <div class="field">
        <label for="notes" class="font-bold block mb-2 text-slate-600">Eslatmalar</label>
        <Textarea id="notes" v-model="customer.notes" rows="3" placeholder="Qo'shimcha izohlar..." />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-4">
        <Button label="Bekor qilish" icon="pi pi-times" text @click="$emit('update:visible', false)" />
        <Button label="Saqlash" icon="pi pi-check" :loading="saving" severity="success" @click="$emit('save')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  customer: Object,
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])
</script>
