<template>
  <div class="space-y-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10 px-4 pt-4">
    
    <!-- Top Navigation -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <router-link to="/dashboard" class="hover:text-emerald-500 transition-colors">{{ $t('menu.dashboard') }}</router-link>
          <i class="pi pi-chevron-right text-[8px]"></i>
          <router-link to="/dashboard/products" class="hover:text-emerald-500 transition-colors">{{ $t('menu.products') }}</router-link>
          <i class="pi pi-chevron-right text-[8px]"></i>
          <span class="text-slate-600 dark:text-slate-300">{{ product?.name }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 v-if="!loading" class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
            {{ product?.name }}
          </h1>
          <div v-if="loading" class="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          
          <div 
            v-if="!loading && product?.status" 
            class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5"
            :class="product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
          >
            <div class="w-1 h-1 rounded-full" :class="product.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></div>
            {{ product.status_display || product.status }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="router.push(`/dashboard/products/edit/${product?.id}`)"
          class="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <i class="pi pi-pencil text-[10px]"></i>
          <span>Tahrirlash</span>
        </button>
        <button 
          @click="confirmDelete"
          class="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm flex items-center justify-center"
        >
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Main Grid Dashboard -->
    <div class="grid grid-cols-12 gap-6">
      
      <!-- Photo and Status Column -->
      <ProductHero :product="product" :loading="loading" />

      <!-- Main Data Column -->
      <div class="col-span-12 sm:col-span-8 xl:col-span-9 space-y-6">
        
        <!-- Specs Grid -->
        <ProductInfoGrid :product="product" />

        <!-- Financial & Barcode Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  <ConfirmDialog pt:root:class="!rounded-[2rem] !border-none !shadow-2xl !bg-white dark:!bg-slate-900" />
</template>

<script setup>
import { useProductDetail } from './composables/useProductDetail'
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
