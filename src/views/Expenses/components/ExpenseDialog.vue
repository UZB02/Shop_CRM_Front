<template>
  <Dialog 
      :visible="visible" 
      @update:visible="$emit('update:visible', $event)"
      :style="{width: '500px'}" 
      :header="expense._id ? 'Xarajatni Tahrirlash' : 'Yangi Xarajat Qo\'shish'" 
      :modal="true" 
      class="p-fluid"
      @hide="$emit('hide')"
  >
    <div class="space-y-4 pt-2">
      <div class="field">
          <label for="name" class="font-bold text-sm block mb-2 text-slate-600">Xarajat nomi <span class="text-rose-500">*</span></label>
          <InputText id="name" v-model.trim="expense.name" required="true" autofocus :class="{'p-invalid': submitted && !expense.name}" placeholder="Masalan: Uy ijarasi" />
          <small class="p-error" v-if="submitted && !expense.name">Ism kiritish majburiy.</small>
      </div>

      <div class="grid grid-cols-2 gap-4">
          <div class="field">
              <label for="category" class="font-bold text-sm block mb-2 text-slate-600">Kategoriya</label>
              <Dropdown id="category" v-model="expense.category" :options="categories" placeholder="Tanlang" />
          </div>
          <div class="field">
              <label for="amount" class="font-bold text-sm block mb-2 text-slate-600">Summa <span class="text-rose-500">*</span></label>
              <InputNumber id="amount" v-model="expense.amount" mode="decimal" placeholder="0 UZS" :class="{'p-invalid': submitted && !expense.amount}" />
              <small class="p-error" v-if="submitted && !expense.amount">Summa kiritish majburiy.</small>
          </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
          <div class="field">
              <label for="date" class="font-bold text-sm block mb-2 text-slate-600">Sana</label>
              <Calendar id="date" v-model="expense.date" dateFormat="dd.mm.yy" showIcon />
          </div>
          <div class="field">
              <label for="seller" class="font-bold text-sm block mb-2 text-slate-600">Mas'ul</label>
              <InputText id="seller" v-model="expense.seller" placeholder="Ism sharif" />
          </div>
      </div>

      <div class="field">
          <label for="description" class="font-bold text-sm block mb-2 text-slate-600">Tavsif (Optional)</label>
          <Textarea id="description" v-model="expense.description" rows="3" placeholder="Xarajat haqida batafsil ma'lumot..." />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 pt-4">
          <Button label="Bekor qilish" icon="pi pi-times" text @click="$emit('update:visible', false)" />
          <Button label="Saqlash" icon="pi pi-check" :loading="saving" severity="danger" @click="$emit('save')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  expense: Object,
  categories: Array,
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])
</script>
