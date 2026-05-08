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
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .relative, .modal-fade-leave-active .relative { transition: transform 0.18s ease; }
.modal-fade-enter-from .relative { transform: scale(0.96) translateY(8px); }
.modal-fade-leave-to .relative { transform: scale(0.96) translateY(8px); }
</style>


