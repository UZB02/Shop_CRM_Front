<template>
  <div class="space-y-6 max-w-md mx-auto md:max-w-none md:mx-0">
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 p-3 shadow-sm relative overflow-hidden group">
      <div class="relative aspect-square rounded-[1.5rem] overflow-hidden bg-white dark:bg-white flex items-center justify-center p-2 lg:p-4">
        <template v-if="!loading">
          <img 
            v-if="product?.image" 
            :src="product.image" 
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="flex flex-col items-center gap-2 text-slate-300">
            <i class="pi pi-image text-4xl opacity-50"></i>
            <span class="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">{{ $t('products.detail.no_image_tip') }}</span>
          </div>
        </template>
        <div v-else class="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
        
        <!-- Floating Badge -->
        <div v-if="product?.active_promotion" class="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg bg-rose-500 text-white shadow-xl shadow-rose-500/30 flex flex-col items-center rotate-[-4deg]">
          <span class="text-[7px] font-black uppercase tracking-widest leading-none mb-0.5 opacity-80">{{ $t('products.detail.promo_duration').split(' ')[0] }}</span>
          <span class="text-xs font-black leading-none">{{ Math.round(product.active_promotion.discount_pct) }}%</span>
        </div>
      </div>
    </div>

    <!-- Inventory Stats In-Place -->
    <div class="bg-emerald-500 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
      <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[9px] font-black uppercase tracking-widest opacity-70">{{ $t('products.detail.stock_label') }}</span>
        <i class="pi pi-box text-xs opacity-50"></i>
      </div>
      <div class="flex items-baseline gap-2">
        <h2 class="text-3xl font-black">{{ product?.stock_total || 0 }}</h2>
        <span class="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none">{{ product?.unit_display }}</span>
      </div>
      <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-60">
        <span>{{ $t('products.detail.stock_status') }}:</span>
        <span class="text-white opacity-100">{{ $t('products.detail.sufficient') }} ✅</span>
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
