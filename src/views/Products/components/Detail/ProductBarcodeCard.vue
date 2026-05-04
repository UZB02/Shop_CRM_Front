<template>
  <div class="bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-transparent p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group">
    <!-- Background Decor -->
    <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full blur-2xl opacity-50 group-hover:bg-emerald-500/5 transition-all"></div>
    
    <div class="absolute top-4 left-6 right-6 flex items-center justify-between z-10">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">{{ $t('products.detail.barcode') }}</span>
      <button 
        @click="$emit('print')" 
        class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all shadow-sm active:scale-90"
        v-tooltip.top="$t('common.print')"
      >
        <i class="pi pi-print text-xs"></i>
      </button>
    </div>
    
    <div class="w-full mt-8 flex flex-col items-center gap-6 z-10">
      <!-- Barcode Container -->
      <div 
        v-if="product?.barcode_image_url" 
        class="w-full p-6 bg-white dark:bg-white/95 rounded-[2rem] shadow-sm border border-slate-100/50 flex items-center justify-center min-h-[100px] transition-transform hover:scale-[1.02] duration-500 cursor-zoom-in"
        @click="showPreview = true"
      >
        <img 
          :src="product.barcode_image_url" 
          class="h-16 sm:h-20 w-auto object-contain mix-blend-multiply transition-all group-hover:contrast-125" 
          alt="Barcode"
        />
      </div>
      
      <div v-else class="h-24 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2">
        <i class="pi pi-barcode text-5xl opacity-10"></i>
        <span class="text-[10px] font-bold tracking-widest">{{ $t('common.no_data') }}</span>
      </div>

      <!-- Barcode Text -->
      <div class="text-center space-y-1">
        <p class="font-mono text-[15px] font-black tracking-[0.3em] text-slate-700 dark:text-slate-200 select-all hover:text-emerald-500 transition-colors">
          {{ product?.barcode || '---' }}
        </p>
        <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
          <span class="text-[9px] font-black text-slate-400 tracking-widest uppercase">Double click to copy</span>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Dialog 
      v-model:visible="showPreview" 
      modal 
      :header="$t('products.detail.barcode')" 
      class="w-full max-w-lg"
      :pt="{ 
        root: { class: 'dark:bg-slate-900 border-none rounded-3xl shadow-2xl overflow-hidden' },
        header: { class: 'px-8 pt-8 pb-2 dark:bg-slate-900 border-none font-black tracking-widest uppercase text-xs text-slate-400' },
        content: { class: 'px-8 pb-8 pt-4 dark:bg-slate-900' }
      }"
    >
      <div class="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-inner border border-slate-50 flex flex-col items-center gap-8">
        <img 
          :src="product?.barcode_image_url" 
          class="w-full h-auto object-contain mix-blend-multiply" 
          alt="Full Barcode"
        />
        <p class="font-mono text-xl sm:text-2xl font-black tracking-[0.4em] text-slate-800 select-all">
          {{ product?.barcode }}
        </p>
      </div>
      <div class="mt-6 flex justify-center">
        <button 
          @click="$emit('print')"
          class="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[12px] font-black tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <i class="pi pi-print"></i>
          {{ $t('common.print') }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  product: Object,
  formatDate: Function
})

const emit = defineEmits(['print'])
const showPreview = ref(false)
</script>




