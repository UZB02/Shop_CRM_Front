<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
    <!-- Category Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.category') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/10 shrink-0">
          <i class="pi pi-tag text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">{{ product?.category_name || '---' }}</p>
          <p class="text-[11px] font-bold text-slate-400 leading-none mt-0.5 truncate">{{ product?.subcategory_name || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- Store Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.store') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/5 text-sky-500 flex items-center justify-center border border-sky-100 dark:border-sky-500/10 shrink-0">
          <i class="pi pi-building text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight line-clamp-2" :title="product?.store_name">{{ product?.store_name || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- Purchase Price Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.purchase_price') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-500/10 shrink-0">
          <i class="pi pi-shopping-cart text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">
             {{ formatPrice(product?.purchase_price) }}
             <span class="text-[10px] font-bold text-slate-400 ml-1 capitalize">{{ product?.currency_code }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Sale Price Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center relative overflow-hidden">
      <!-- Active Promotion Indicator -->
      <div v-if="product?.active_promotion" class="absolute -right-1 -top-1 w-5 h-5 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
         <i class="pi pi-star-fill text-[9px]"></i>
      </div>
      
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.sale_price') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/10 shrink-0">
          <i class="pi pi-wallet text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">
             {{ formatPrice(product?.active_promotion ? product.active_promotion.discounted_price : product?.sale_price) }}
             <span class="text-[10px] font-bold text-slate-400 ml-1 capitalize">{{ product?.currency_code }}</span>
          </p>
          <div v-if="calculateMargin && Number(calculateMargin()) !== 0" class="text-[10px] font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
             <i class="pi pi-arrow-up-right text-[9px]"></i>
             {{ calculateMargin() }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Unit Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.unit') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/5 text-teal-500 flex items-center justify-center border border-teal-100 dark:border-teal-500/10 shrink-0">
          <i class="pi pi-info-circle text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">{{ product?.unit_display }} ({{ product?.unit }})</p>
        </div>
      </div>
    </div>

    <!-- Created Date Card -->
    <div class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.created_at') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/10 shrink-0">
          <i class="pi pi-calendar text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">{{ product?.created_on?.split('|')[0]?.trim() || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- IKPU Card -->
    <div v-if="product?.ikpu_code" class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest block mb-2">{{ $t('products.detail.ikpu') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-500/10 shrink-0">
          <i class="pi pi-shield text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-900 dark:text-white tracking-wider truncate">{{ product.ikpu_code }}</p>
        </div>
      </div>
    </div>

    <!-- Promotion Card -->
    <div v-if="product?.active_promotion" class="bg-white dark:bg-[#131d31] p-3.5 rounded-[16px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[10px] font-black text-rose-500 dark:text-rose-400 tracking-widest block mb-2 uppercase">{{ $t('products.detail.promo_duration') }}</span>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-500/10 shrink-0">
          <i class="pi pi-clock text-xs"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-black text-slate-800 dark:text-white leading-tight truncate">
            {{ formatDate(product.active_promotion.valid_to) }}
          </p>
          <p class="text-[10px] font-bold text-slate-400 leading-none mt-0.5 truncate">{{ $t('products.detail.promo_until') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  formatPrice: {
    type: Function,
    default: (val) => val
  },
  formatDate: {
    type: Function,
    default: (val) => val
  },
  calculateMargin: {
    type: Function,
    default: () => 0
  }
})
</script>


