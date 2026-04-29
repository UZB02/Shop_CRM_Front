<template>
  <div class="md:col-span-2 bg-white dark:bg-[#131d31] rounded-[18px] border border-slate-200 dark:border-transparent p-6 sm:p-8 flex flex-col shadow-sm">
    <h3 class="text-[10px] font-black text-slate-900 dark:text-white tracking-[0.2em] flex items-center gap-3 mb-8">
      <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
      {{ $t('products.detail.pricing_title') }}
    </h3>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Buy Price -->
      <div class="space-y-1">
        <span class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('products.detail.purchase_price') }}</span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-black text-slate-700 dark:text-slate-300 tracking-tight">{{ formatPrice(product?.purchase_price) }}</span>
          <span class="text-[10px] font-black text-slate-400 tracking-widest">{{ product?.currency_code }}</span>
        </div>
      </div>

      <!-- Sell Price -->
      <div class="space-y-1">
        <span class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('products.detail.sale_price') }} 💰</span>
        <div class="space-y-1">
          <div class="flex items-baseline gap-2">
            <span 
              class="text-3xl font-black tracking-tight"
              :class="product?.active_promotion ? 'text-emerald-500' : 'text-slate-900 dark:text-white'"
            >
              {{ formatPrice(product?.active_promotion ? product.active_promotion.discounted_price : product?.sale_price) }}
            </span>
            <span class="text-[10px] font-black text-slate-400 tracking-widest">{{ product?.currency_code }}</span>
          </div>
          <div v-if="product?.active_promotion" class="flex items-center gap-2">
            <span class="text-[9px] font-bold text-slate-400 line-through opacity-70">{{ formatPrice(product?.sale_price) }}</span>
            <span class="text-[8px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md tracking-widest truncate max-w-[120px]">{{ product.active_promotion.name }}</span>
          </div>
        </div>
      </div>

      <!-- Margin -->
      <div class="pt-6 border-t border-slate-50 dark:border-slate-800">
        <span class="text-[9px] font-black text-slate-400 tracking-widest">{{ $t('products.detail.expected_margin') }}</span>
        <div class="flex items-center gap-3 mt-1 text-emerald-500">
          <span class="text-lg font-black">+{{ calculateMargin() }}%</span>
          <div class="h-1 flex-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full" :style="`width: ${Math.min(calculateMargin(), 100)}%`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  formatPrice: Function,
  calculateMargin: Function
})
</script>
