<template>
  <div class="bg-emerald-500 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
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
      <span class="text-white opacity-100">{{ product?.stock_total > 0 ? $t('products.detail.sufficient') + ' ✅' : $t('products.detail.out_of_stock') + ' ❌' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>
