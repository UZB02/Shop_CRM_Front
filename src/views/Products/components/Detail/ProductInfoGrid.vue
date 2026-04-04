<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
    <!-- Category Card -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">{{ $t('products.detail.category') }}</span>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
          <i class="pi pi-tag text-[10px]"></i>
        </div>
        <div>
          <p class="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight">{{ product?.category_name || '---' }}</p>
          <p class="text-[9px] font-bold text-slate-400 leading-none mt-0.5 truncate max-w-[120px]">{{ product?.subcategory_name || '---' }}</p>
        </div>
      </div>
    </div>

    <!-- Store Card -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">{{ $t('products.detail.store') }}</span>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-sky-500/5 text-sky-500 flex items-center justify-center border border-sky-500/10">
          <i class="pi pi-building text-[10px]"></i>
        </div>
        <p class="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight line-clamp-2">{{ product?.store_name || '---' }}</p>
      </div>
    </div>

    <!-- Unit Card -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">{{ $t('products.detail.unit') }}</span>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-500/10">
          <i class="pi pi-info-circle text-[10px]"></i>
        </div>
        <p class="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight">{{ product?.unit_display }} ({{ product?.unit }})</p>
      </div>
    </div>

    <!-- Created Date Card -->
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">{{ $t('products.detail.created_at') }}</span>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/5 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
          <i class="pi pi-calendar text-[10px]"></i>
        </div>
        <p class="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight">{{ product?.created_on?.split('|')[0] || '---' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>
