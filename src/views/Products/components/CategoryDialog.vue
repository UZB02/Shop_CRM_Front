<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '400px' }" 
    header="Kategoriya boshqaruvi" 
    :modal="true" 
    class="p-fluid"
  >
    <div class="field mb-4 pt-4">
      <label for="c_name" class="font-bold block mb-2 text-slate-600 font-sm">Kategoriya nomi</label>
      <InputText id="c_name" v-model.trim="category.name" required="true" autofocus :class="{ 'p-invalid': submitted && !category.name }" placeholder="Masalan: Ichimliklar" />
      <small class="p-error" v-if="submitted && !category.name">Nom kiritilishi shart.</small>
    </div>
    <div class="field mb-4">
      <label for="c_desc" class="font-bold block mb-2 text-slate-600 font-sm">Tavsif</label>
      <Textarea id="c_desc" v-model="category.description" rows="3" placeholder="Ixtiyoriy..." />
    </div>
    
    <div v-if="categories.length" class="mt-6">
      <p class="text-sm font-bold text-slate-500 mb-3 ml-1">Mavjud kategoriyalar:</p>
      <div class="max-h-40 overflow-y-auto border border-slate-100 rounded-lg p-2 space-y-1">
        <div v-for="cat in categories" :key="cat._id" class="flex justify-between items-center p-2 hover:bg-slate-50 rounded group">
          <span class="text-sm text-slate-700">{{ cat.name }}</span>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button icon="pi pi-pencil" text rounded size="small" @click="$emit('edit', cat)" />
            <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="$emit('delete', cat)" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Yopish" icon="pi pi-times" text @click="$emit('update:visible', false)" />
      <Button :label="category._id ? 'Yangilash' : 'Qo\'shish'" icon="pi pi-check" :loading="saving" @click="onSave" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  category: Object,
  categories: Array,
  saving: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'edit', 'delete'])

const submitted = ref(false)

const onSave = () => {
  submitted.value = true
  if (props.category.name?.trim()) {
    emit('save', props.category)
  }
}

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    submitted.value = false
  }
})
</script>

<style scoped>
.font-sm { font-size: 0.875rem; }
</style>
