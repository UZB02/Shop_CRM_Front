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
        <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Shtrix-kod</h3>
              <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{{ product?.name }}</p>
            </div>
            <button
              @click="$emit('close')"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <!-- Barcode image -->
          <div class="px-6 py-6 flex flex-col items-center gap-4">
            <div class="w-full bg-white rounded-xl border border-slate-200 flex items-center justify-center min-h-[160px] p-4">
              <div v-if="loading" class="flex flex-col items-center gap-2">
                <i class="pi pi-spin pi-spinner text-emerald-500 text-xl"></i>
                <span class="text-xs text-slate-400">Yuklanmoqda...</span>
              </div>
              <div v-else-if="error" class="flex flex-col items-center gap-2 text-rose-500">
                <i class="pi pi-exclamation-circle text-xl"></i>
                <span class="text-xs">Shtrix-kod yuklanmadi</span>
              </div>
              <img
                v-else-if="barcodeUrl"
                :src="barcodeUrl"
                :alt="product?.barcode"
                class="max-w-full h-auto"
              />
            </div>

            <div class="flex flex-col items-center gap-1">
              <span v-if="settingsStore.showNameOnBarcode" class="text-xs font-bold text-slate-800 dark:text-white text-center">
                {{ product?.name }}
              </span>
              <code class="text-sm font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700">
                {{ product?.barcode }}
              </code>
              <span v-if="settingsStore.showPriceOnBarcode" class="text-sm font-black text-emerald-500">
                {{ formatNumber(product?.sale_price) }} {{ settingsStore.currency }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                {{ product?.category_name }}
              </span>
              <span v-if="product?.unit_display">{{ product.unit_display }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-2 px-5 pb-5">
            <button
              @click="$emit('download')"
              :disabled="!barcodeUrl || loading"
              class="flex-1 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i class="pi pi-download text-xs"></i>
              Yuklab olish
            </button>
            <button
              @click="$emit('print')"
              :disabled="!barcodeUrl || loading"
              class="flex-1 h-9 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i class="pi pi-print text-xs"></i>
              Chop etish
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  visible: Boolean,
  product: Object,
  barcodeUrl: String,
  loading: Boolean,
  error: Boolean
})

defineEmits(['close', 'download', 'print'])

const settingsStore = useSettingsStore()

const formatNumber = (val) => new Intl.NumberFormat('uz-UZ').format(val || 0)
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .relative, .modal-fade-leave-active .relative { transition: transform 0.18s ease; }
.modal-fade-enter-from .relative { transform: scale(0.96) translateY(8px); }
.modal-fade-leave-to .relative { transform: scale(0.96) translateY(8px); }
</style>
