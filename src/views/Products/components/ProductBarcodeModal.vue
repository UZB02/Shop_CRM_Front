<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">Shtrix-kod</h3>
              <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{{ product?.name }}</p>
            </div>
            <button
              @click="$emit('close')"
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Professional Barcode Sticker Preview -->
          <div class="px-6 py-6 flex flex-col items-center gap-5">
            <div class="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
              <div class="bg-white p-4 rounded-2xl border border-slate-100/80 flex items-center justify-center w-full min-h-[260px] overflow-hidden">
                <div v-if="loading" class="flex-1 flex flex-col items-center justify-center gap-2 py-6">
                  <i class="pi pi-spin pi-spinner text-emerald-500 text-lg"></i>
                  <span class="text-[10px] text-slate-400">Yuklanmoqda...</span>
                </div>
                <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center gap-2 py-6 text-rose-500">
                  <i class="pi pi-exclamation-circle text-lg"></i>
                  <span class="text-[10px]">Yuklashda xatolik</span>
                </div>
                <template v-else-if="barcodeUrl">
                  <img 
                    :src="barcodeUrl" 
                    class="w-full max-w-[420px] h-auto max-h-[230px] object-contain mix-blend-multiply scale-[1.08]" 
                    alt="Barcode" 
                  />
                </template>
              </div>
            </div>

            <!-- Barcode details badge -->
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black text-[10px] tracking-widest uppercase">
                {{ product?.category_name || 'Kategoriya' }}
              </span>
              <span v-if="product?.unit_display" class="text-[10px] font-bold">{{ product.unit_display }}</span>
            </div>
          </div>

          <!-- Chop etish sozlamalari (faqat Electron desktopда) -->
          <div v-if="isEl" class="px-5 pb-1 space-y-3">
            <!-- Barcode printeri -->
            <div v-if="printers.length">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barcode printeri</label>
              <select
                :value="barcodePrinter || ''"
                @change="setBarcodePrinter($event.target.value)"
                class="w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
              >
                <option v-for="p in printers" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <!-- Yorliq o'lchami + nusxa -->
            <div class="flex items-end gap-2">
              <div class="flex-1">
                <label class="text-[10px] text-slate-400">Kenglik (mm)</label>
                <input v-model="labelW" @change="applySize" type="number" min="10" max="120"
                  class="w-full mt-0.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400" />
              </div>
              <div class="flex-1">
                <label class="text-[10px] text-slate-400">Balandlik (mm)</label>
                <input v-model="labelH" @change="applySize" type="number" min="10" max="200"
                  class="w-full mt-0.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400" />
              </div>
              <div class="w-20">
                <label class="text-[10px] text-slate-400">Nusxa</label>
                <input v-model="copies" type="number" min="1" max="100"
                  class="w-full mt-0.5 px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[12px] font-black text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-400" />
              </div>
            </div>

            <!-- Yo'nalish -->
            <div class="flex gap-2">
              <button @click="setBarcodeOrientation('horizontal')"
                class="flex-1 py-1.5 rounded-lg text-[11px] font-black border transition-all"
                :class="barcodeOrient === 'horizontal' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-indigo-200 dark:border-indigo-800' : 'text-slate-500 border-slate-200 dark:border-slate-700'">
                ↔ Gorizontal
              </button>
              <button @click="setBarcodeOrientation('vertical')"
                class="flex-1 py-1.5 rounded-lg text-[11px] font-black border transition-all"
                :class="barcodeOrient === 'vertical' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-indigo-200 dark:border-indigo-800' : 'text-slate-500 border-slate-200 dark:border-slate-700'">
                ↕ Vertikal
              </button>
            </div>

            <!-- TSPL sinovi (printer to'g'ri chiqarishini tekshirish) -->
            <button @click="runTsplTest" :disabled="tsplTesting"
              class="w-full py-1.5 rounded-lg text-[11px] font-black border border-dashed transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              :class="tsplResult === 'ok' ? 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20'
                    : tsplResult === 'err' ? 'text-rose-600 border-rose-300 bg-rose-50 dark:bg-rose-950/20'
                    : 'text-slate-500 border-slate-300 dark:border-slate-600'">
              <i :class="tsplTesting ? 'pi pi-spin pi-spinner' : tsplResult === 'ok' ? 'pi pi-check' : tsplResult === 'err' ? 'pi pi-times' : 'pi pi-bolt'" class="text-[10px]"></i>
              {{ tsplTesting ? 'Yuborilmoqda...' : tsplResult === 'ok' ? 'Yuborildi — yorliqni tekshiring' : tsplResult === 'err' ? (tsplError || 'Xato') : '🧪 TSPL sinov yorlig\'i' }}
            </button>
          </div>

          <!-- Footer -->
          <div class="flex gap-2 px-5 pb-5 pt-3">
            <button
              @click="$emit('download')"
              :disabled="!barcodeUrl || loading"
              class="flex-1 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i class="pi pi-download text-xs"></i>
              Yuklab olish
            </button>
            <button
              @click="$emit('print', Number(copies) || 1)"
              :disabled="!barcodeUrl || loading"
              class="flex-1 h-9 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i class="pi pi-print text-xs"></i>
              Chop etish{{ isEl && Number(copies) > 1 ? ` (${copies})` : '' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { usePrinter } from '@/composables/usePrinter'
import { useBarcodePrint } from '@/composables/useBarcodePrint'
import { isElectron } from '@/utils/platform'

const props = defineProps({
  visible: Boolean,
  product: Object,
  barcodeUrl: String,
  loading: Boolean,
  error: Boolean
})

defineEmits(['close', 'download', 'print'])

const settingsStore = useSettingsStore()

const isEl = isElectron()
const {
  printers, barcodePrinter, barcodeLabelW, barcodeLabelH, barcodeOrient,
  connect, setBarcodePrinter, setBarcodeLabelSize, setBarcodeOrientation,
} = usePrinter()

const { testTspl } = useBarcodePrint()

const labelW = ref(barcodeLabelW.value)
const labelH = ref(barcodeLabelH.value)
const copies = ref(1)

// TSPL sinovi holati
const tsplTesting = ref(false)
const tsplResult = ref('') // '' | 'ok' | 'err'
const tsplError = ref('')

const runTsplTest = async () => {
  tsplTesting.value = true
  tsplResult.value = ''
  tsplError.value = ''
  try {
    await testTspl()
    tsplResult.value = 'ok'
  } catch (e) {
    tsplResult.value = 'err'
    tsplError.value = e?.message || 'Xato'
  } finally {
    tsplTesting.value = false
    setTimeout(() => { tsplResult.value = ''; tsplError.value = '' }, 6000)
  }
}

const applySize = () => {
  const w = Math.min(120, Math.max(10, Number(labelW.value) || 58))
  const h = Math.min(200, Math.max(10, Number(labelH.value) || 40))
  labelW.value = w
  labelH.value = h
  setBarcodeLabelSize(w, h)
}

onMounted(() => {
  if (isEl) connect() // printerlar ro'yxatini yuklab qo'yamiz
})
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .relative, .modal-fade-leave-active .relative { transition: transform 0.18s ease; }
.modal-fade-enter-from .relative { transform: scale(0.96) translateY(8px); }
.modal-fade-leave-to .relative { transform: scale(0.96) translateY(8px); }
</style>


