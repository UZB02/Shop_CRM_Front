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
              {{ expense.id ? 'Xarajatni tahrirlash' : 'Yangi xarajat' }}
            </span>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Xarajatlar bo'limi</p>
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
              Kategoriya <span class="text-rose-500">*</span>
            </label>
            <div class="relative group/input">
              <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-rose-500 transition-colors pointer-events-none z-10"></i>
              <select
                v-model="expense.category"
                class="w-full h-11 pl-9 pr-4 text-sm font-semibold rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 appearance-none"
                :class="{ '!border-rose-400': submitted && !expense.category }"
              >
                <option :value="null" disabled>Kategoriyani tanlang</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none"></i>
            </div>
            <small v-if="submitted && !expense.category" class="text-[9px] font-bold text-rose-500 uppercase ml-1 mt-1 block">Kategoriya tanlash majburiy</small>
          </div>

          <!-- Amount -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              Summa (UZS) <span class="text-rose-500">*</span>
            </label>
            <div class="relative group/input">
              <i class="pi pi-wallet absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-rose-500 transition-colors pointer-events-none"></i>
              <input
                v-model="expense.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full h-11 pl-9 pr-4 text-sm font-black rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                :class="{ '!border-rose-400': submitted && !expense.amount }"
              />
            </div>
            <small v-if="submitted && !expense.amount" class="text-[9px] font-bold text-rose-500 uppercase ml-1 mt-1 block">Summa kiritish majburiy</small>
          </div>

          <!-- Date -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">
              Sana <span class="text-rose-500">*</span>
            </label>
            <div class="relative group/input">
              <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 group-focus-within/input:text-rose-500 transition-colors pointer-events-none"></i>
              <input
                v-model="expense.date"
                type="date"
                class="w-full h-11 pl-9 pr-4 text-sm font-semibold rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">Izoh (ixtiyoriy)</label>
            <textarea
              v-model="expense.description"
              rows="3"
              placeholder="Xarajat haqida qo'shimcha ma'lumot..."
              class="w-full p-4 text-sm font-medium rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 resize-none placeholder:text-slate-400"
            ></textarea>
          </div>

          <!-- Receipt Image Upload -->
          <div class="field">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">Chek yoki rasm (ixtiyoriy)</label>

            <div class="flex items-start gap-3">
              <!-- Preview -->
              <div
                v-if="previewUrl || expense.receipt_image"
                class="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group/preview shrink-0"
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
                class="flex-1 h-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-500/5 transition-all group/upload"
              >
                <input ref="fileInput" type="file" @change="onFileChange" accept="image/jpeg,image/png,image/webp" class="hidden" />
                <i class="pi pi-cloud-upload text-lg text-slate-400 group-hover/upload:text-rose-500 transition-colors"></i>
                <span class="text-[9px] font-bold text-slate-400 group-hover/upload:text-rose-500 uppercase tracking-widest transition-colors">Rasm yuklash</span>
                <span class="text-[8px] text-slate-300 dark:text-slate-600">JPG, PNG, WEBP</span>
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
              Bekor qilish
            </button>
            <button
              @click="handleSave"
              :disabled="saving"
              class="flex-[2] h-10 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
              <i v-else class="pi pi-check text-xs"></i>
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  expense: Object,
  categories: Array,
  saving: Boolean,
  submitted: Boolean
})

const emit = defineEmits(['update:visible', 'save', 'hide'])

const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)

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
