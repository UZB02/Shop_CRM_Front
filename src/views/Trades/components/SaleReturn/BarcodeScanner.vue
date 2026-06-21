<template>
  <div class="space-y-3">
    <!-- Trigger button -->
    <button
      v-if="!scanMode"
      @click="activateScanner"
      class="w-full h-12 flex items-center justify-center gap-2.5 rounded-[14px] bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black tracking-widest transition-all hover:bg-indigo-100 dark:hover:bg-indigo-500/20 active:scale-95 shadow-sm"
    >
      <i class="pi pi-qrcode text-base" />
      Barcode orqali chekni toping
    </button>

    <!-- Active scan mode -->
    <div v-if="scanMode" class="relative">
      <div
        class="flex items-center gap-2 p-3 rounded-[14px] border-2 border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-[0_0_0_4px_rgba(99,102,241,0.12)] transition-all"
      >
        <i class="pi pi-qrcode text-indigo-500 text-base shrink-0" />
        <input
          ref="scanInput"
          v-model="scanBuffer"
          type="text"
          placeholder="Skanerlang yoki 13 raqam kiriting..."
          maxlength="20"
          @keyup.enter="onScanEnter"
          @blur="handleBlur"
          class="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-800 dark:text-slate-200 placeholder-indigo-300 dark:placeholder-indigo-600"
        />
        <button
          @click="cancelScan"
          class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 flex items-center justify-center text-indigo-400 transition-all active:scale-90"
        >
          <i class="pi pi-times text-[10px]" />
        </button>
      </div>

      <!-- Helper text -->
      <p class="text-[10px] text-indigo-400 dark:text-indigo-500 mt-1.5 ml-1 font-bold">
        <i class="pi pi-info-circle mr-1" />
        Skanerlab yoki raqamlarni terib Enter bosing
      </p>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex items-center gap-2 px-3 py-2.5 rounded-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
    >
      <i class="pi pi-spinner pi-spin text-indigo-500 text-sm" />
      <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Qidirilmoqda...</span>
    </div>

    <!-- Error state -->
    <div
      v-if="scanError"
      class="flex items-start gap-2.5 px-3 py-2.5 rounded-[12px] bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20"
    >
      <i class="pi pi-exclamation-triangle text-amber-500 text-sm shrink-0 mt-0.5" />
      <div class="flex-1">
        <p class="text-xs font-bold text-amber-700 dark:text-amber-300 leading-snug">{{ scanError }}</p>
        <button
          @click="retryScanning"
          class="mt-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 hover:underline tracking-widest"
        >
          QAYTADAN URINISH
        </button>
      </div>
      <button
        @click="scanError = ''"
        class="text-amber-400 hover:text-amber-600 transition-colors shrink-0"
      >
        <i class="pi pi-times text-[10px]" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { salesAPI } from '@/services/api'

const emit = defineEmits(['found', 'error'])

const scanMode = ref(false)
const scanBuffer = ref('')
const loading = ref(false)
const scanError = ref('')
const scanInput = ref(null)

// Barcode skaner focus yo'qotilishidan himoya
let blurTimeout = null

const activateScanner = async () => {
  scanMode.value = true
  scanError.value = ''
  await nextTick()
  scanInput.value?.focus()
}

const onScanEnter = async () => {
  const code = scanBuffer.value.trim()
  if (!code) return

  loading.value = true
  scanError.value = ''

  try {
    const res = await salesAPI.lookupBarcode(code)
    emit('found', res.data)
    cancelScan()
  } catch (err) {
    const status = err.response?.status
    if (status === 400) {
      scanError.value =
        "Bu chek barcode emas. Mahsulot barcode'ini skanerlagan bo'lishingiz mumkin — qaytadan skanerlang."
    } else if (status === 404) {
      scanError.value =
        "Sotuv topilmadi. Boshqa do'kon cheki yoki noto'g'ri kod bo'lishi mumkin."
    } else {
      scanError.value = "Server xatosi. Qaytadan urinib ko'ring."
    }
    emit('error', scanError.value)
    // Xato bo'lganda input focus da qolsin
    await nextTick()
    scanInput.value?.focus()
  } finally {
    loading.value = false
    scanBuffer.value = ''
  }
}

// Blur — faqat boshqa element bosish orqali chiqilganda bekor qiladi,
// lekin Enter orqali submit bo'layotgan vaqtda emas
const handleBlur = () => {
  blurTimeout = setTimeout(() => {
    if (scanMode.value && !loading.value && !scanError.value) {
      cancelScan()
    }
  }, 200)
}

const cancelScan = () => {
  clearTimeout(blurTimeout)
  scanMode.value = false
  scanBuffer.value = ''
}

const retryScanning = async () => {
  scanError.value = ''
  await nextTick()
  if (!scanMode.value) {
    scanMode.value = true
  }
  await nextTick()
  scanInput.value?.focus()
}
</script>
