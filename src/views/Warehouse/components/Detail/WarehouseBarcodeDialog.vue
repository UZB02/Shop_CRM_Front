<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border-none !shadow-2xl" 
    header=" "
    :showHeader="false"
    pt:mask:class="backdrop-blur-sm bg-black/40"
  >
    <div v-if="product" class="p-8 flex flex-col items-center gap-6 w-full max-w-md min-w-[400px] sm:min-w-[460px]">
      <!-- Header -->
      <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <i class="pi pi-barcode text-sm"></i>
          </div>
          <div class="text-left">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">Shtrix-kod</h3>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skanerlash kodi</p>
          </div>
        </div>
        <button @click="$emit('update:visible', false)" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
          <i class="pi pi-times text-[12px]"></i>
        </button>
      </div>
      
      <!-- Crisp Barcode Image Container -->
      <div class="w-full bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center">
        <div class="bg-white p-4 rounded-2xl border border-slate-100/80 flex items-center justify-center w-full min-h-[260px] overflow-hidden">
          <img 
            :src="product.barcode_image_url" 
            class="w-full max-w-[420px] h-auto max-h-[230px] object-contain mix-blend-multiply scale-[1.08]" 
            alt="Barcode" 
          />
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex gap-3 w-full">
        <button 
          @click="$emit('download')"
          class="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-download text-xs"></i>
          Yuklab olish
        </button>
        <button 
          @click="printBarcode(product)"
          class="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-slate-950 border-none text-white text-[11px] font-black tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-none"
        >
          <i class="pi pi-print text-xs"></i>
          Chop etish
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import { useBarcodePrint } from '@/composables/useBarcodePrint'

defineProps({
  visible: { type: Boolean, required: true },
  product: { type: Object, default: null }
})

defineEmits(['update:visible', 'download'])

const { printBarcode: doPrintBarcode } = useBarcodePrint()

const printBarcode = (prod) => {
  if (!prod?.barcode_image_url) return
  doPrintBarcode(prod.barcode_image_url)
}
</script>
