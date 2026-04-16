<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">Mahsulotlar</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ $t('products.subtitle', { count: totalProducts }) }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="router.push('/dashboard/products/categories')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-folder text-xs"></i>
        <span>{{ $t('categories.title') }}</span>
      </button>

      <!-- Aksiyalar Button -->
      <button
        @click="router.push('/dashboard/products/promotions')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-percentage text-xs"></i>
        <span>Aksiyalar</span>
      </button>
      <button
        @click="router.push('/dashboard/products/create')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>{{ $t('products.new_product') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps({ totalProducts: Number })
defineEmits(['add-category', 'add-product'])
</script>
