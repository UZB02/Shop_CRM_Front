<template>
  <!-- QZ Tray Status Indicator -->
  <div class="flex items-center gap-2 relative">
    <!-- Status Badge -->
    <button
      @click="togglePanel"
      :title="statusLabel"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider transition-all border"
      :class="badgeClass"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
      <i class="pi pi-print text-xs" />
      <span class="hidden sm:inline">{{ statusLabel }}</span>
    </button>

    <!-- Settings Dropdown Panel -->
    <Transition name="fade-down">
      <div
        v-if="showPanel"
        v-click-outside="closePanel"
        class="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-print text-slate-500 dark:text-slate-400 text-sm" />
            <span class="text-xs font-black text-slate-700 dark:text-slate-200 tracking-wide">
              Printer Sozlamalari
            </span>
          </div>
          <button @click="closePanel" class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- QZ Status -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">QZ Tray Holati</span>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-slate-300 dark:bg-slate-700'" />
              <span class="text-[11px] font-black" :class="isConnected ? 'text-emerald-500' : 'text-slate-400'">
                {{ isConnected ? 'Ulangan' : 'Ulanmagan' }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!isConnected"
              @click="handleConnect"
              :disabled="isConnecting"
              class="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black tracking-wider transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              <i class="pi pi-link mr-1" />
              {{ isConnecting ? 'Ulanmoqda...' : 'Ulash' }}
            </button>
            <button
              v-else
              @click="handleDisconnect"
              class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-black tracking-wider transition-all"
            >
              <i class="pi pi-times mr-1" />
              Uzish
            </button>
          </div>

          <!-- QZ xato -->
          <p v-if="qzError && !isConnected" class="mt-2 text-[10px] text-rose-400 font-bold leading-tight">
            <i class="pi pi-exclamation-triangle mr-1" />
            {{ qzError }}
          </p>
        </div>

        <!-- Chek Printeri Tanlash -->
        <div v-if="isConnected && printers.length" class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Chek Printeri</p>
          <div class="space-y-1 max-h-36 overflow-y-auto pr-1">
            <button
              v-for="p in printers"
              :key="p"
              @click="selectPrinter(p)"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[11px] font-bold transition-all"
              :class="defaultPrinter === p
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <i class="pi pi-print text-xs" :class="defaultPrinter === p ? 'text-emerald-500' : 'text-slate-400'" />
              <span class="flex-1 truncate">{{ p }}</span>
              <i v-if="defaultPrinter === p" class="pi pi-check text-xs text-emerald-500" />
            </button>
          </div>
        </div>

        <!-- Barcode Printeri Tanlash (label qog'ozi uchun alohida) -->
        <div v-if="isConnected && printers.length" class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Barcode Printeri</p>
          <div class="space-y-1 max-h-36 overflow-y-auto pr-1">
            <button
              v-for="p in printers"
              :key="'bc-' + p"
              @click="selectBarcodePrinter(p)"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[11px] font-bold transition-all"
              :class="barcodePrinter === p
                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <i class="pi pi-qrcode text-xs" :class="barcodePrinter === p ? 'text-indigo-500' : 'text-slate-400'" />
              <span class="flex-1 truncate">{{ p }}</span>
              <i v-if="barcodePrinter === p" class="pi pi-check text-xs text-indigo-500" />
            </button>
          </div>
          <p class="text-[10px] text-slate-400 mt-2 leading-tight">
            * Barcode label qog'ozi uchun alohida printer tanlang (masalan Xprinter-Barcode)
          </p>

          <!-- Yorliq o'lchami (mm) -->
          <div class="mt-3">
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Yorliq o'lchami (mm)</p>
            <div class="flex items-center gap-2">
              <div class="flex-1">
                <label class="text-[10px] text-slate-400">Kenglik</label>
                <input
                  v-model="labelW"
                  @change="applyLabelSize"
                  type="number" min="10" max="120" step="1"
                  class="w-full mt-0.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <span class="text-slate-400 mt-4">×</span>
              <div class="flex-1">
                <label class="text-[10px] text-slate-400">Balandlik</label>
                <input
                  v-model="labelH"
                  @change="applyLabelSize"
                  type="number" min="10" max="200" step="1"
                  class="w-full mt-0.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-1.5 leading-tight">
              * Yorlig'ingizni o'lchab kiriting. Drayver material o'lchami ham shunga mos bo'lsin.
            </p>
          </div>

          <!-- Barcode yo'nalishi -->
          <div class="mt-3">
            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Yo'nalish</p>
            <div class="flex gap-2">
              <button
                @click="setBarcodeOrientation('horizontal')"
                class="flex-1 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all border flex items-center justify-center gap-1.5"
                :class="barcodeOrient === 'horizontal'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'
                  : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
              >
                <i class="pi pi-arrows-h text-xs" /> Gorizontal
              </button>
              <button
                @click="setBarcodeOrientation('vertical')"
                class="flex-1 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all border flex items-center justify-center gap-1.5"
                :class="barcodeOrient === 'vertical'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'
                  : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'"
              >
                <i class="pi pi-arrows-v text-xs" /> Vertikal
              </button>
            </div>
            <p class="text-[10px] text-slate-400 mt-1.5 leading-tight">
              * Agar barcode teskari (burilib) chiqsa, boshqa yo'nalishni tanlang.
            </p>
          </div>
        </div>



        <!-- QZ yuklab olish havolasi -->
        <div v-if="!isConnected" class="px-4 py-3">
          <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-2">
            Silent chop etish uchun kompyuteringizga <strong class="text-slate-600 dark:text-slate-300">QZ Tray</strong> ilovasini o'rnating.
          </p>
          <a
            href="https://qz.io/download/"
            target="_blank"
            class="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-black text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-all"
          >
            <i class="pi pi-download text-xs" />
            QZ Tray yuklab olish
          </a>
          <p class="text-[10px] text-slate-400 mt-2 text-center">
            * O'rnatmasangiz ham, oddiy dialog orqali chop etiladi
          </p>
        </div>

        <!-- Actions -->
        <div class="px-4 py-3 space-y-2">
          <button
            v-if="isConnected"
            @click="testPrint"
            :disabled="isPrinting"
            class="w-full py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-black text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all disabled:opacity-60 flex items-center justify-center"
          >
            <i class="pi pi-print mr-2" />
            {{ isPrinting ? 'Chop etilmoqda...' : 'Test chek chiqarish (QZ Tray)' }}
          </button>
          
          <button
            @click="openBrowserPrint"
            class="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-black text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center"
          >
            <i class="pi pi-cog mr-2" />
            Brauzer orqali test
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePrinter } from '@/composables/usePrinter'

const {
  isConnected,
  isConnecting,
  printers,
  defaultPrinter,
  barcodePrinter,
  barcodeLabelW,
  barcodeLabelH,
  barcodeOrient,
  qzError,
  connect,
  disconnect,
  setDefaultPrinter,
  setBarcodePrinter,
  setBarcodeLabelSize,
  setBarcodeOrientation,
  print,
  loadPrinters
} = usePrinter()

const showPanel = ref(false)
const isPrinting = ref(false)

// Yorliq o'lchami inputlari (usePrinter'dagi qiymatlar bilan boshlanadi)
const labelW = ref(barcodeLabelW.value)
const labelH = ref(barcodeLabelH.value)
const applyLabelSize = () => {
  const w = Math.min(120, Math.max(10, Number(labelW.value) || 58))
  const h = Math.min(200, Math.max(10, Number(labelH.value) || 40))
  labelW.value = w
  labelH.value = h
  setBarcodeLabelSize(w, h)
}

const togglePanel = () => { showPanel.value = !showPanel.value }
const closePanel = () => { showPanel.value = false }

// Badge reng sinflari
const badgeClass = computed(() => {
  if (isConnected.value) {
    return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
  }
  if (isConnecting.value) {
    return 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-800 text-amber-500 animate-pulse'
  }
  if (qzError.value) {
    return 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-800 text-rose-500'
  }
  return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
})

const dotClass = computed(() => {
  if (isConnected.value) return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
  if (isConnecting.value) return 'bg-amber-400 animate-pulse'
  if (qzError.value) return 'bg-rose-400'
  return 'bg-slate-300 dark:bg-slate-700'
})

const statusLabel = computed(() => {
  if (isConnecting.value) return 'Ulanmoqda...'
  if (isConnected.value) return defaultPrinter.value ? defaultPrinter.value.split('\\').pop() : 'Ulangan'
  if (qzError.value) return 'Xato'
  return 'QZ Tray'
})

// Auto-connect — sahifa ochilganda urinib ko'radi
onMounted(async () => {
  await connect()
})

// Ulash — avval disconnect qilib, keyin qayta ulanish
const handleConnect = async () => {
  // Agar isConnecting stuck qolsa — avval reset qilamiz
  await disconnect()
  await connect()
}

const handleDisconnect = async () => {
  await disconnect()
}

const selectPrinter = (printerName) => {
  setDefaultPrinter(printerName)
}

const selectBarcodePrinter = (printerName) => {
  setBarcodePrinter(printerName)
}

// Test chek
const testPrint = async () => {
  isPrinting.value = true
  try {
    const testHtml = buildTestHtml()
    await print({ htmlContent: testHtml })
  } catch (err) {
    console.error('Test print xato:', err)
  } finally {
    isPrinting.value = false
  }
}

const openBrowserPrint = () => {
  const testHtml = buildTestHtml()
  const iframe = document.createElement('iframe')
  iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:100%;max-width:80mm;border:none;visibility:hidden;`
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow.document
  doc.open()
  doc.write(testHtml)
  doc.close()
  setTimeout(() => {
    iframe.contentWindow.focus()
    iframe.contentWindow.onafterprint = () => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }
    iframe.contentWindow.print()
    
    // Agar onafterprint ushlamasa, ehtiyot shart 5 daqiqadan keyin o'chiramiz
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }, 300000)
  }, 300)
}

const buildTestHtml = () => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  @page { margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:"Inter",system-ui,sans-serif;font-size:12px;color:#000;background:#fff;padding:8px 12px;width:100%;max-width:80mm;margin:0 auto;}
  body *{color:#000 !important;font-weight:bold !important;}
  .text-center{text-align:center;}
  .flex{display:flex;} .justify-between{justify-content:space-between;}
  .border-t{border-top:1.5px dashed #000;margin:6px 0;padding-top:6px;}
</style>
</head><body>
<div class="text-center" style="padding:8px 0;">
  <p style="letter-spacing:0.2em;margin-bottom:4px;">★ ★ ★</p>
  <h2 style="font-size:18px;font-weight:900;">TEST CHEKI</h2>
  <p style="font-size:11px;margin-top:4px;">QZ Tray muvaffaqiyatli ishlayapti!</p>
</div>
<div class="border-t">
  <div class="flex justify-between"><span>Sana:</span><span>${new Date().toLocaleString('uz-UZ')}</span></div>
</div>
<div class="border-t" style="margin-top:8px;text-align:center;">
  <p style="font-size:11px;">★ ★ ★</p>
</div>
</body></html>`

// v-click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._clickOutside, true)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside, true)
  }
}
</script>

<style scoped>
.fade-down-enter-active { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-down-leave-active { transition: all 0.15s ease; }
.fade-down-enter-from { opacity: 0; transform: translateY(-8px) scale(0.97); }
.fade-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
