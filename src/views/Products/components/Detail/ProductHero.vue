<template>
  <div class="space-y-6 max-w-md mx-auto md:max-w-none md:mx-0">
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 p-3 shadow-sm relative overflow-hidden group">
      <div class="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-white flex items-center justify-center p-2 lg:p-4">
        <template v-if="!loading">
          <img 
            v-if="product?.image" 
            :src="product.image" 
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="flex flex-col items-center gap-2 text-slate-300">
            <i class="pi pi-image text-4xl opacity-50"></i>
            <span class="text-[8px] font-black tracking-[0.2em] opacity-50">{{ $t('products.detail.no_image_tip') }}</span>
          </div>
        </template>
        <div v-else class="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
        
        <!-- Floating Badge -->
        <div v-if="product?.active_promotion" class="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg bg-rose-500 text-white shadow-xl shadow-rose-500/30 flex flex-col items-center rotate-[-4deg] max-w-[120px] text-center">
          <span class="text-[7px] font-black tracking-widest leading-tight mb-0.5 opacity-80 line-clamp-2">{{ product.active_promotion.name }}</span>
          <span class="text-xs font-black leading-none">{{ Math.round(product.active_promotion.discount_pct) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  loading: Boolean
})
</script>
