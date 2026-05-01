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
    <div v-if="product" class="p-8 flex flex-col items-center gap-6 min-w-[320px]">
      <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="text-left">
          <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ product.product_name || product.name }}</h3>
          <p class="text-[12px] font-bold text-emerald-500 tracking-[0.2em]">{{ product.barcode }}</p>
        </div>
        <button @click="$emit('update:visible', false)" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
          <i class="pi pi-times text-[12px]"></i>
        </button>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-inner border border-slate-100">
        <img :src="product.barcode_image_url" class="max-w-full h-auto" />
      </div>
      
      <button 
        @click="$emit('download')"
        class="w-full py-3 rounded-xl bg-slate-900 border-none text-white text-[12px] font-black tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i class="pi pi-download"></i>
        {{ $t('common.download') || 'Yuklab olish' }} (PNG)
      </button>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: { type: Boolean, required: true },
  product: { type: Object, default: null }
})

defineEmits(['update:visible', 'download'])
</script>


