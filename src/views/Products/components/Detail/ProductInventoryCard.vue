<template>
  <div class="bg-emerald-500 rounded-2xl p-4 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden group">
    <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-[10px] font-black tracking-widest opacity-70">{{ $t('products.detail.stock_label') }}</span>
      <i class="pi pi-box text-[12px] opacity-50"></i>
    </div>
    <div class="flex items-baseline gap-1.5">
      <h2 class="text-2xl font-black">{{ product?.stock_total || 0 }}</h2>
      <span class="text-[11px] font-bold tracking-widest opacity-80 leading-none">{{ product?.unit_display }}</span>
    </div>
    <div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-black tracking-widest opacity-60">
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


