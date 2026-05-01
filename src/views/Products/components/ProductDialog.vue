<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[2000] grid place-items-center p-4 overflow-y-auto">
      <!-- Backdrop with blur -->
      <div 
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
        @click="$emit('update:visible', false)"
      ></div>
      
      <!-- Modern Creative Container -->
      <div class="relative w-full max-w-[850px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 border border-slate-100 dark:border-slate-800 animate-zoom-in overflow-hidden z-10 my-auto">
        <!-- Minimal Header -->
        <div class="flex items-center justify-between p-8 pb-0">
          <div class="flex items-center gap-4">
            <div class="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            <div class="space-y-0.5">
              <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-[0.1em]">
                {{ product._id || product.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot' }}
              </h3>
              <p class="text-[12px] font-bold text-slate-400 tracking-[0.2em]">Inventarizatsiya va ombor hisobi</p>
            </div>
          </div>
          <button 
            @click="$emit('update:visible', false)" 
            class="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 hover:text-rose-500 transition-all flex items-center justify-center"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
            <!-- Left: Image Management -->
            <div class="md:col-span-4 space-y-4">
              <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Mahsulot rasmi</label>
              <div 
                class="relative aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer shadow-inner"
                @click="fileInput.click()"
              >
                <img v-if="previewUrl || product.imageUrl" :src="previewUrl || product.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div v-else class="flex flex-col items-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                  <i class="pi pi-cloud-upload text-3xl mb-3"></i>
                  <span class="text-[11px] font-black tracking-[0.2em]">Rasm yuklash</span>
                </div>
                
                <!-- Action Overlays -->
                <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 scale-95 group-hover:scale-100 duration-300">
                  <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 shadow-xl">
                    <i class="pi pi-pencil text-white text-xs"></i>
                  </div>
                  <div v-if="previewUrl || product.imageUrl" class="w-10 h-10 rounded-2xl bg-rose-500/20 backdrop-blur-md flex items-center justify-center hover:bg-rose-500/40 shadow-xl" @click.stop="removeImage">
                    <i class="pi pi-trash text-white text-xs"></i>
                  </div>
                </div>
              </div>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelect" />
              <p class="text-[11px] text-slate-400 text-center font-bold tracking-tight opacity-60">JPG, PNG (MAX 5MB)</p>
            </div>

            <!-- Right: Details Form -->
            <div class="md:col-span-8 space-y-6">
              <!-- Row 1: Name -->
              <div class="space-y-2">
                <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Mahsulot nomi</label>
                <input 
                  v-model.trim="product.name"
                  type="text"
                  placeholder="Masalan: Pepsi 1.5L"
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/30 focus:shadow-xl focus:shadow-emerald-500/5"
                  :class="{ '!border-rose-500/30 !bg-rose-50/10': submitted && !product.name }"
                />
              </div>

              <!-- Row 2: Category & Barcode -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Kategoriya</label>
                  <Select 
                    v-model="product.category" 
                    :options="categories" 
                    optionLabel="name" 
                    :optionValue="(cat) => cat._id || cat.id" 
                    placeholder="Tanlang" 
                    class="modern-select"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Shtrix-kod</label>
                  <input 
                    v-model.trim="product.barcode"
                    type="text"
                    placeholder="478000..."
                    class="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/30"
                  />
                </div>
              </div>

              <!-- Row 3: Prices -->
              <div class="grid grid-cols-2 gap-4 p-5 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Kelish narxi</label>
                  <div class="relative">
                    <InputNumber v-model="product.purchase_price" class="modern-input-number" placeholder="0" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-slate-300 dark:text-slate-600 tracking-widest">UZS</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Sotish narxi</label>
                  <div class="relative">
                    <InputNumber v-model="product.sale_price" class="modern-input-number" placeholder="0" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-emerald-500 tracking-widest">UZS</span>
                  </div>
                </div>
              </div>

              <!-- Row 4: Stocks & Units -->
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">O'lchov</label>
                  <Select v-model="product.unit" :options="units" placeholder="Birlik" class="modern-select" />
                </div>
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Miqdori</label>
                  <InputNumber v-model="product.amount" class="modern-input-number" placeholder="0" />
                </div>
                <div class="space-y-2">
                  <label class="text-[12px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">Limit</label>
                  <InputNumber v-model="product.lowStockThreshold" class="modern-input-number" placeholder="10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Styled Footer -->
        <div class="p-8 pt-0 flex items-center justify-end gap-6">
          <button 
            @click="$emit('update:visible', false)"
            class="text-[13px] font-black tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            @click="onSave"
            :disabled="saving"
            class="h-14 px-12 bg-slate-900 dark:bg-emerald-500 text-white text-xs font-black tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 transition-all disabled:opacity-50"
          >
            <span v-if="saving">...</span>
            <span v-else>Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'

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

const units = ['dona', 'kg', 'g', 'litr', 'metr', 'm2', 'yashik', 'qop', 'quti']

const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Fayl hajmi 5MB dan oshmasligi kerak', life: 5000 })
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
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoom-in { 
  from { opacity: 0; transform: scale(0.95) translateY(20px); } 
  to { opacity: 1; transform: scale(1) translateY(0); } 
}

.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
.animate-zoom-in { animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Modern UI Overrides */
:deep(.modern-input-number), :deep(.modern-select) {
  width: 100% !important;
}

:deep(.p-inputtext), :deep(.p-select) {
  width: 100% !important;
  background-color: rgba(248, 250, 252, 1) !important;
  border: 2px solid transparent !important;
  padding: 0.8rem 1.25rem !important;
  border-radius: 1rem !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  transition: all 0.2s ease;
}

.dark :deep(.p-inputtext), .dark :deep(.p-select) {
  background-color: rgba(30, 41, 59, 0.5) !important;
  color: white !important;
}

:deep(.p-inputtext:focus), :deep(.p-select:not(.p-disabled).p-focus) {
  background-color: white !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.05) !important;
}

.dark :deep(.p-inputtext:focus), .dark :deep(.p-select:not(.p-disabled).p-focus) {
  background-color: rgba(15, 23, 42, 1) !important;
}

/* Select Panel Fix */
:global(.p-select-panel) {
  z-index: 3000 !important;
  border-radius: 1rem !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  box-shadow: 0 15px 40px -10px rgba(0,0,0,0.1) !important;
  margin-top: 5px !important;
}

:global(.p-select-option) {
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 0.75rem 1rem !important;
}
</style>


