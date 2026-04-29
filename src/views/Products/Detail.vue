<template>
  <div class="space-y-4">
    <!-- Header -->
    <ProductDetailPageHeader
      :product="product"
      @edit="router.push(`/dashboard/products/edit/${product?.id}`)"
      @delete="confirmDelete"
    />

    <!-- Skeleton Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
      <div class="md:col-span-4 lg:col-span-3 min-h-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
      <div class="md:col-span-8 lg:col-span-9 space-y-6">
        <div class="h-12 w-1/3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
        <div class="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 animate-pulse"></div>
      </div>
    </div>

    <!-- Main Grid Dashboard -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start">
      
      <!-- Left Column: Sticky Hero -->
      <div class="md:col-span-4 lg:col-span-3 flex flex-col gap-4 lg:gap-6 sticky top-4">
        <ProductHero :product="product" :loading="loading" />
      </div>

      <!-- Right Column: Tabbed Data -->
      <div class="md:col-span-8 lg:col-span-9 animate-in">
        <Tabs v-model:value="activeTab" class="!bg-transparent border-none">
            <TabList class="!bg-slate-100/80 dark:!bg-slate-800/80 !p-1 !rounded-xl !border-none !inline-flex !mb-4 overflow-x-auto hide-scrollbar max-w-full">
                <Tab value="overview" class="!text-[10px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm whitespace-nowrap">
                   <i class="pi pi-box mr-2 !text-[9px]"></i>
                   {{ $t('products.detail.tabs.overview') }}
                </Tab>
                <Tab value="stock" class="!text-[10px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm whitespace-nowrap">
                   <i class="pi pi-map-marker mr-2 !text-[9px]"></i>
                   {{ $t('products.detail.tabs.inventory') }}
                </Tab>
                <Tab value="financial" class="!text-[10px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm whitespace-nowrap">
                   <i class="pi pi-dollar mr-2 !text-[9px]"></i>
                   {{ $t('products.detail.tabs.financial') }}
                </Tab>
                <Tab value="turlar" class="!text-[10px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm whitespace-nowrap">
                   <i class="pi pi-tags mr-2 !text-[9px]"></i>
                   {{ $t('products.detail.tabs.turlar') }}
                </Tab>
            </TabList>

            <TabPanels class="!bg-transparent !p-0">
                <TabPanel value="overview">
                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      <div class="flex flex-col gap-4 lg:gap-6 md:col-span-1 border border-transparent">
                         <ProductInventoryCard :product="product" />
                         <ProductBarcodeCard 
                            :product="product" 
                            :formatDate="formatDate" 
                            @print="printBarcode"
                         />
                      </div>
                      <div class="md:col-span-1 lg:col-span-2">
                          <ProductInfoGrid 
                             :product="product" 
                             :formatPrice="formatPrice" 
                             :calculateMargin="calculateMargin" 
                          />
                      </div>
                   </div>
                </TabPanel>

                <TabPanel value="stock">
                   <ProductStockLocations :product="product" />
                </TabPanel>

                <TabPanel value="financial">
                   <ProductPricingCard 
                      :product="product" 
                      :formatPrice="formatPrice" 
                      :calculateMargin="calculateMargin" 
                   />
                </TabPanel>

                <TabPanel value="turlar">
                   <ProductTurlarTab 
                      :product="product" 
                      @refresh="fetchProduct"
                   />
                </TabPanel>
            </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductDetail } from './composables/useProductDetail'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import ProductDetailPageHeader from './components/ProductDetailPageHeader.vue'
import ProductHero from './components/Detail/ProductHero.vue'
import ProductInfoGrid from './components/Detail/ProductInfoGrid.vue'
import ProductInventoryCard from './components/Detail/ProductInventoryCard.vue'
import ProductPricingCard from './components/Detail/ProductPricingCard.vue'
import ProductBarcodeCard from './components/Detail/ProductBarcodeCard.vue'
import ProductStockLocations from './components/Detail/ProductStockLocations.vue'
import ProductTurlarTab from './components/Detail/ProductTurlarTab.vue'

const activeTab = ref('overview')

const {
  product,
  loading,
  router,
  formatPrice,
  formatDate,
  calculateMargin,
  fetchProduct,
  printBarcode,
  confirmDelete
} = useProductDetail()
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
