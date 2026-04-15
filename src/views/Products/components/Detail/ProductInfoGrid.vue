<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
    <!-- Category Card -->
    <div class="bg-white dark:bg-[#131d31] p-5 rounded-[18px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">{{ $t('products.detail.category') }}</span>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/10 shrink-0">
          <i class="pi pi-tag text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight truncate">{{ product?.category_name || '---' }}</p>
          <p class="text-[10px] font-bold text-slate-400 leading-none mt-1 truncate">{{ product?.subcategory_name || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- Store Card -->
    <div class="bg-white dark:bg-[#131d31] p-5 rounded-[18px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">{{ $t('products.detail.store') }}</span>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/5 text-sky-500 flex items-center justify-center border border-sky-100 dark:border-sky-500/10 shrink-0">
          <i class="pi pi-building text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight line-clamp-2" :title="product?.store_name">{{ product?.store_name || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- Unit Card -->
    <div class="bg-white dark:bg-[#131d31] p-5 rounded-[18px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">{{ $t('products.detail.unit') }}</span>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-500/10 shrink-0">
          <i class="pi pi-info-circle text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight truncate">{{ product?.unit_display }} ({{ product?.unit }})</p>
        </div>
      </div>
    </div>

    <!-- Created Date Card -->
    <div class="bg-white dark:bg-[#131d31] p-5 rounded-[18px] border border-slate-200 dark:border-transparent shadow-sm flex flex-col justify-center">
      <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">{{ $t('products.detail.created_at') }}</span>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/10 shrink-0">
          <i class="pi pi-calendar text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight truncate">{{ product?.created_on?.split('|')[0]?.trim() || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- IKPU Card -->
    <div v-if="product?.ikpu_code" class="bg-white dark:bg-[#131d31] p-5 rounded-[18px] border border-slate-200 dark:border-transparent shadow-sm col-span-1 sm:col-span-2 flex flex-col justify-center">
      <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">{{ $t('products.detail.ikpu') }}</span>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-500/10 shrink-0">
          <i class="pi pi-shield text-sm"></i>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-black text-slate-900 dark:text-white tracking-wider truncate">{{ product.ikpu_code }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>
