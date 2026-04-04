<template>
  <div class="space-y-4">
    <!-- Header -->
    <ProductDetailPageHeader
      :product="product"
      @edit="router.push(`/dashboard/products/edit/${product?.id}`)"
      @delete="confirmDelete"
    />

    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-12 gap-4 lg:gap-6">
      <div class="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 min-h-[300px] md:min-h-[400px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
      <div class="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-6">
        <div class="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
           <div class="md:col-span-2 h-64 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
           <div class="h-64 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Main Grid Dashboard -->
    <div v-else-if="product" class="grid grid-cols-12 gap-4 lg:gap-6">
      
      <!-- Photo and Status Column -->
      <ProductHero class="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3" :product="product" :loading="loading" />

      <!-- Main Data Column -->
      <div class="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-4 lg:space-y-6">
        
        <!-- Specs Grid -->
        <ProductInfoGrid :product="product" />

        <!-- Financial & Barcode Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 lg:items-start">
          <ProductPricingCard 
             :product="product" 
             :formatPrice="formatPrice" 
             :calculateMargin="calculateMargin" 
          />
          <ProductBarcodeCard 
             :product="product" 
             :formatDate="formatDate" 
             @print="printBarcode"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog pt:root:class="!rounded-[1.5rem] !border-none !shadow-2xl !bg-white dark:!bg-slate-900" />
</template>

<script setup>
import { useProductDetail } from './composables/useProductDetail'
import ProductDetailPageHeader from './components/ProductDetailPageHeader.vue'
import ProductHero from './components/Detail/ProductHero.vue'
import ProductInfoGrid from './components/Detail/ProductInfoGrid.vue'
import ProductPricingCard from './components/Detail/ProductPricingCard.vue'
import ProductBarcodeCard from './components/Detail/ProductBarcodeCard.vue'
import ConfirmDialog from 'primevue/confirmdialog'

const {
  product,
  loading,
  router,
  formatPrice,
  formatDate,
  calculateMargin,
  printBarcode,
  confirmDelete
} = useProductDetail()
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
