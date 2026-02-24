<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '700px' }" 
    :header="header" 
    :modal="true" 
    class="p-fluid" 
    @hide="onHide"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      <!-- Image Upload Section -->
      <div class="col-span-1">
        <label class="font-bold block mb-3 text-slate-600 font-sm">Mahsulot rasmi</label>
        <div 
          class="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden group hover:border-emerald-400 transition-colors cursor-pointer"
          @click="fileInput.click()"
        >
          <img v-if="previewUrl || product.imageUrl" :src="previewUrl || product.imageUrl" class="w-full h-full object-cover" />
          <div v-else class="flex flex-col items-center text-slate-400">
            <i class="pi pi-cloud-upload text-3xl mb-2"></i>
            <span class="text-xs font-medium uppercase tracking-wider">Rasm yuklash</span>
          </div>
          
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button icon="pi pi-pencil" text rounded severity="secondary" size="small" class="bg-white/20 backdrop-blur-md" />
            <Button v-if="previewUrl || product.imageUrl" icon="pi pi-trash" text rounded severity="danger" size="small" class="bg-white/20 backdrop-blur-md" @click.stop="removeImage" />
          </div>
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelect" />
        <p class="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-tighter">JPG, PNG formatlari (Max 5MB)</p>
      </div>

      <!-- Form Section -->
      <div class="col-span-2 space-y-4">
        <div class="field">
          <label for="p_name" class="font-bold block mb-2 text-slate-600 font-sm">Mahsulot nomi</label>
          <InputText id="p_name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" placeholder="Masalan: Pepsi 1.5L" />
          <small class="p-error" v-if="submitted && !product.name">Nomi kiritilishi shart.</small>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="p_category" class="font-bold block mb-2 text-slate-600 font-sm">Kategoriya</label>
            <Dropdown id="p_category" v-model="product.category" :options="categories" optionLabel="name" optionValue="name" placeholder="Kategoriyani tanlang" :class="{ 'p-invalid': submitted && !product.category }" />
          </div>

          <div class="field">
            <label for="p_barcode" class="font-bold block mb-2 text-slate-600 font-sm">Barcode / Artikula</label>
            <InputText id="p_barcode" v-model.trim="product.barcode" required="true" :class="{ 'p-invalid': submitted && !product.barcode }" placeholder="Masalan: 478000..." />
          </div>

          <div class="field">
            <label for="p_warehouse" class="font-bold block mb-2 text-slate-600 font-sm">Sklad</label>
            <Dropdown id="p_warehouse" v-model="product.warehouse" :options="warehouses" optionLabel="name" optionValue="_id" placeholder="Skladni tanlang" />
          </div>

          <div class="field">
            <label for="p_unit" class="font-bold block mb-2 text-slate-600 font-sm">O'lchov birligi</label>
            <Dropdown id="p_unit" v-model="product.unit" :options="units" placeholder="Dona, kg, litr..." />
          </div>

          <div class="field">
            <label for="p_purchase" class="font-bold block mb-2 text-slate-600 font-sm">Kelish narxi (UZS)</label>
            <InputNumber id="p_purchase" v-model="product.purchasePrice" mode="decimal" placeholder="0" />
          </div>

          <div class="field">
            <label for="p_sale" class="font-bold block mb-2 text-slate-600 font-sm">Sotish narxi (UZS)</label>
            <InputNumber id="p_sale" v-model="product.salePrice" mode="decimal" placeholder="0" />
          </div>

          <div class="field">
            <label for="p_amount" class="font-bold block mb-2 text-slate-600 font-sm">Miqdori</label>
            <InputNumber id="p_amount" v-model="product.amount" mode="decimal" showButtons :min="0" />
          </div>

          <div class="field">
            <label for="p_threshold" class="font-bold block mb-2 text-slate-600 font-sm">Ogohlantirish</label>
            <InputNumber id="p_threshold" v-model="product.lowStockThreshold" mode="decimal" showButtons :min="0" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" text @click="$emit('update:visible', false)" />
      <Button label="Saqlash" icon="pi pi-check" :loading="saving" @click="onSave" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  visible: Boolean,
  product: Object,
  categories: Array,
  warehouses: Array,
  saving: Boolean,
  header: String
})

const emit = defineEmits(['update:visible', 'save', 'hide'])
const toast = useToast()

const submitted = ref(false)
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)

const units = ['dona', 'kg', 'litr', 'metr', 'blok', 'quti']

const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Fayl hajmi 5MB dan oshmasligi kerak', life: 3000 })
      return
    }
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = null
  props.product.imageUrl = ''
  if (fileInput.value) fileInput.value.value = ''
}

const onHide = () => {
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
  submitted.value = false
  emit('hide')
}

const onSave = () => {
  submitted.value = true
  if (props.product.name?.trim() && props.product.barcode?.trim() && props.product.category) {
    emit('save', { product: props.product, file: selectedFile.value })
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
