<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('products.detail.barcode') }}</span>
        <button @click="$emit('print')" class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all text-xs">
          <i class="pi pi-print"></i>
        </button>
      </div>
      
      <div class="flex flex-col items-center gap-4">
        <div v-if="product?.barcode_image_url" class="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 w-full flex items-center justify-center">
          <img :src="product.barcode_image_url" class="h-16 sm:h-20 w-auto grayscale contrast-125 transition-all hover:grayscale-0" />
        </div>
        <div v-else class="h-20 flex items-center justify-center text-slate-300">
          <i class="pi pi-barcode text-5xl opacity-20"></i>
        </div>
        <p class="font-mono text-xs font-black tracking-[0.3em] text-slate-500 dark:text-slate-400 select-all uppercase">
          {{ product?.barcode || '---' }}
        </p>
      </div>
    </div>

    <!-- Mini Promotion Detail -->
    <div v-if="product?.active_promotion" class="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
       <div class="flex items-center justify-between mb-2">
         <span class="text-[8px] font-black text-rose-500 uppercase tracking-widest">{{ $t('products.detail.promo_duration') }}</span>
         <i class="pi pi-clock text-[9px] text-rose-500"></i>
       </div>
       <p class="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
         {{ formatDate(product.active_promotion.valid_to) }} {{ $t('products.detail.promo_duration').includes('muddati') ? 'gacha' : 'гача' }}
       </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  formatDate: Function
})
defineEmits(['print'])
</script>
