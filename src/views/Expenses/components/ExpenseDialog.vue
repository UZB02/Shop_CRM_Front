<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" @click="$emit('update:visible', false)" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
    </Transition>

    <!-- Slide-over Panel -->
    <Transition
      enter-active-class="transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="visible" class="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col">

        <!-- Panel Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-sm font-black uppercase tracking-widest text-rose-500">
              {{ expense.id ? $t('expenses.edit') : $t('expenses.new') }}
            </span>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{{ $t('expenses.management') }}</p>
          </div>
          <button
            @click="$emit('update:visible', false)"
            class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-5 flex-1 overflow-y-auto">

          <!-- Category -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('expenses.category') }} <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300" :class="{ '!border-rose-500': submitted && !expense.category }">
              <i class="pi pi-tag absolute left-4 text-xs text-slate-400 group-focus-within/input:text-rose-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <Select
                v-model="expense.category"
                :options="categories"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('products.form.select_category')"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:label:class="!pl-12 !pr-4 !text-[13px] !font-semibold !flex !items-center !h-full !bg-transparent !w-full !text-slate-700 dark:!text-slate-200"
              />
            </div>
            <small v-if="submitted && !expense.category" class="text-[9px] font-bold text-rose-500 uppercase ml-1 mt-1 block">{{ $t('expenses.category_required') }}</small>
          </div>

          <!-- Branch (Optional) -->
          <div v-if="branches?.length > 0" class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('expenses.branch') }}
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300">
              <i class="pi pi-map-marker absolute left-4 text-xs text-slate-400 group-focus-within/input:text-rose-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <Select
                v-model="expense.branch"
                :options="branches"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('common.select')"
                class="flex-1 h-full w-full"
                showClear
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:label:class="!pl-12 !pr-4 !text-[13px] !font-semibold !flex !items-center !h-full !bg-transparent !w-full !text-slate-700 dark:!text-slate-200"
              />
            </div>
            <p class="text-[8px] font-bold text-slate-400 uppercase ml-1 mt-1 block">Ko'rsatmasangiz, o'z filialingiz avtomatik tanlanadi</p>
          </div>

          <!-- Amount -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('expenses.amount') }} (UZS) <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300" :class="{ '!border-rose-500': submitted && !expense.amount }">
              <i class="pi pi-wallet absolute left-4 text-xs text-slate-400 group-focus-within/input:text-rose-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <InputNumber
                v-model="expense.amount"
                mode="decimal"
                :useGrouping="true"
                placeholder="0"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[15px] !font-black !h-full !pl-12 !pr-4 !w-full !outline-none !text-slate-800 dark:!text-slate-100"
              />
            </div>
            <small v-if="submitted && !expense.amount" class="text-[9px] font-bold text-rose-500 uppercase ml-1 mt-1 block">{{ $t('expenses.amount_required') }}</small>
          </div>

          <!-- Date -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              {{ $t('expenses.date') }} <span class="text-rose-500">*</span>
            </label>
            <div class="custom-input-wrapper relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300">
              <i class="pi pi-calendar absolute left-4 text-xs text-slate-400 group-focus-within/input:text-rose-500 transition-colors pointer-events-none z-10 flex-shrink-0"></i>
              <DatePicker
                v-model="expense.date"
                dateFormat="yy-mm-dd"
                showIcon
                iconDisplay="input"
                class="flex-1 h-full w-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !h-full !w-full"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[13px] !font-semibold !h-full !pl-12 !pr-4 !w-full !text-slate-700 dark:!text-slate-200"
              />
            </div>
          </div>

          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('expenses.description') }}</label>
            <div class="custom-input-wrapper relative group/input flex items-start rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300">
              <Textarea
                v-model="expense.description"
                rows="4"
                placeholder="Xarajat haqida qo'shimcha ma'lumot..."
                class="w-full h-full"
                pt:root:class="!bg-transparent !border-none !shadow-none !w-full"
                pt:textarea:class="!bg-transparent !border-none !shadow-none !text-[13px] !font-semibold !p-4 !px-4 !w-full !text-slate-700 dark:!text-slate-200 !outline-none !resize-none !min-h-[100px]"
              />
            </div>
          </div>

          <!-- Receipt Image Upload -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('expenses.receipt') }}</label>

            <div class="flex items-start gap-4">
              <!-- Preview -->
              <div
                v-if="previewUrl || expense.receipt_image"
                class="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group/preview shrink-0 shadow-sm"
              >
                <img :src="previewUrl || expense.receipt_image" class="w-full h-full object-cover" alt="Chek" />
                <button
                  @click="clearImage"
                  class="absolute inset-0 bg-rose-500/80 opacity-0 group-hover/preview:opacity-100 transition-all flex items-center justify-center text-white backdrop-blur-[2px]"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>

              <!-- Upload zone -->
              <div
                @click="$refs.fileInput.click()"
                class="flex-1 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-all group/upload shadow-sm"
              >
                <input ref="fileInput" type="file" @change="onFileChange" accept="image/jpeg,image/png,image/webp" class="hidden" />
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover/upload:bg-rose-100 dark:group-hover/upload:bg-rose-900/30 transition-colors">
                  <i class="pi pi-cloud-upload text-slate-400 group-hover/upload:text-rose-500 transition-colors"></i>
                </div>
                <div class="text-center">
                  <span class="text-[9px] font-black text-slate-400 group-hover/upload:text-rose-500 uppercase tracking-widest transition-colors block">{{ $t('expenses.upload_image') }}</span>
                  <span class="text-[8px] text-slate-300 dark:text-slate-600 font-bold">JPG, PNG, WEBP</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Panel Footer -->
        <div class="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex gap-3">
            <button
              @click="$emit('update:visible', false)"
              class="flex-1 h-10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="handleSave"
              :disabled="saving"
              class="flex-[2] h-10 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-check text-xs"></i>
              {{ saving ? $t('common.saving') : $t('common.save') }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  expense: Object,
  categories: Array,
  branches: { type: Array, default: () => [] },
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])

const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)

const formatDateToString = (date) => {
  if (!date || typeof date === 'string') return date
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

watch(() => props.expense?.date, (val) => {
  if (val instanceof Date) {
    props.expense.date = formatDateToString(val)
  }
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const clearImage = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleSave = () => {
  const data = { ...props.expense }

  if (selectedFile.value) {
    const fd = new FormData()
    fd.append('category', data.category)
    if (data.branch) fd.append('branch', data.branch)
    fd.append('amount', data.amount)
    fd.append('date', data.date)
    if (data.description) fd.append('description', data.description)
    fd.append('receipt_image', selectedFile.value)
    if (data.id) fd.append('id', data.id)
    emit('save', fd)
  } else {
    emit('save', { ...data })
  }
}

watch(() => props.visible, (val) => {
  if (!val) {
    clearImage()
    emit('hide')
  }
})
</script>

<style scoped>
/* Ikonkalar markazlashuvi */
.custom-input-wrapper i {
  z-index: 20;
  position: absolute !important;
  left: 1rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}

/* Universal shaffoflik va hamma effektlarni (border, shadow, outline) o'chirish */
.custom-input-wrapper :deep(*),
.custom-input-wrapper :deep(*:hover),
.custom-input-wrapper :deep(*:focus),
.custom-input-wrapper :deep(*::before),
.custom-input-wrapper :deep(*::after) {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Professional darajadagi ichki elementlar sozlamasi */
:deep(.p-select-label), 
:deep(.p-inputnumber-input), 
:deep(.p-datepicker-input),
:deep(.p-inputtext) {
  padding-left: 3rem !important; /* pl-12 equivalent */
  padding-right: 1rem !important;
  font-family: inherit !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

/* Dark mode matn ranglari */
.dark :deep(.p-inputtext),
.dark :deep(.p-select-label) {
  color: #f8fafc !important;
}

:deep(.p-select-dropdown) {
  width: 2.5rem !important;
}
</style>
