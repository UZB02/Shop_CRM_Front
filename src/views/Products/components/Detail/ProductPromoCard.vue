<template>
  <div v-if="product?.active_promotion" class="bg-white dark:bg-[#131d31] rounded-2xl border border-slate-200 dark:border-transparent p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <span class="text-[10px] font-black text-rose-500 tracking-widest uppercase">{{ $t('products.detail.promo_duration') }}</span>
      <div class="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 text-[12px]">
        <i class="pi pi-clock"></i>
      </div>
    </div>
    
    <div class="space-y-1">
      <p class="text-sm font-black text-slate-700 dark:text-slate-200 tracking-tight">
        {{ formatDate(product.active_promotion.valid_to) }}
      </p>
      <p class="text-[10px] font-bold text-slate-400 tracking-wider">
        {{ $t('products.detail.promo_until') || 'gacha' }}
      </p>
    </div>

    <!-- Discount Info -->
    <div class="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-slate-400 tracking-widest uppercase">{{ $t('products.detail.discount') }}</span>
        <span class="text-xs font-black text-emerald-500">{{ product.active_promotion.discount_value }}{{ product.active_promotion.discount_type === 'percentage' ? '%' : ' UZS' }}</span>
      </div>
      <div class="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
         <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{{ $t('products.detail.active_promo') || 'FAOL' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  formatDate: Function
})
</script>
