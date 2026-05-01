<template>
  <div class="bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-transparent p-4 shadow-sm flex flex-col justify-between h-full">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black text-slate-400 tracking-widest">{{ $t('products.detail.barcode') }}</span>
        <button @click="$emit('print')" class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all text-[12px]">
          <i class="pi pi-print"></i>
        </button>
      </div>
      
      <div class="flex flex-col items-center gap-3">
        <div v-if="product?.barcode_image_url" class="p-3 bg-white rounded-xl shadow-sm border border-slate-50 w-full flex items-center justify-center">
          <img :src="product.barcode_image_url" class="h-12 sm:h-14 w-auto grayscale contrast-125 transition-all hover:grayscale-0" />
        </div>
        <div v-else class="h-14 flex items-center justify-center text-slate-300">
          <i class="pi pi-barcode text-4xl opacity-20"></i>
        </div>
        <p class="font-mono text-[12px] font-black tracking-[0.2em] text-slate-500 dark:text-slate-400 select-all ">
          {{ product?.barcode || '---' }}
        </p>
      </div>
    </div>

    <!-- Mini Promotion Detail -->
    <div v-if="product?.active_promotion" class="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
       <div class="flex items-center justify-between mb-1.5">
         <span class="text-[9px] font-black text-rose-500 tracking-widest">{{ $t('products.detail.promo_duration') }}</span>
         <i class="pi pi-clock text-[10px] text-rose-500"></i>
       </div>
       <p class="text-[11px] font-black text-slate-700 dark:text-slate-300 tracking-tight">
         {{ formatDate(product.active_promotion.valid_to) }} {{ $t('products.detail.promo_duration').includes('muddati') ? 'gacha' : 'гаcha' }}
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


