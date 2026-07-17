<template>
  <!-- Responsive wrapper -->
  <div class="lg:h-[calc(100vh-4rem)] flex flex-col p-4 md:p-5 lg:p-6 lg:pt-2 lg:overflow-hidden min-h-screen lg:min-h-0 pb-[88px] lg:pb-0 relative">
    
    <!-- Compact Sticky Header -->
    <ProductFormHeader 
      :isEdit="isEdit" 
      :saving="saving" 
      :product="product"
      @save="onSave" 
      class="shrink-0 mb-6 lg:mb-6"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-h-0 overflow-y-auto lg:overflow-visible custom-scrollbar-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="h-64 lg:h-full flex flex-col items-center justify-center gap-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 border-3 border-emerald-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-[12px] font-black tracking-[0.2em] text-slate-400">Yuklanmoqda...</p>
      </div>

      <!-- Grid Layout -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-app-in pb-4 lg:pb-0">
        
        <!-- Column 1: Basic Info -->
        <div class="lg:col-span-4 flex flex-col">
          <GeneralInfoCard 
            v-model="product"
            :categories="categories"
            :subcategories="subcategories"
            :submitted="submitted"
            class="h-full shrink-0 lg:shrink lg:overflow-y-auto custom-scrollbar-hidden"
          />
        </div>

        <!-- Column 2: Financials & Stock -->
        <div class="lg:col-span-4 flex flex-col">
          <PricingInventoryCard 
            v-model="product"
            :units="units"
            :currencies="currencies"
            class="h-full shrink-0 lg:shrink lg:overflow-y-auto custom-scrollbar-hidden"
          />
        </div>

        <!-- Column 3: Media & Settings -->
        <div class="lg:col-span-4 flex flex-col gap-5">
          <div class="h-full min-h-0">
            <ImageUploadCard 
              :imageUrl="product.imageUrl"
              :previewUrl="previewUrl"
              @select="onFileSelect"
              @remove="removeImage"
              class="h-full shrink-0 lg:shrink lg:overflow-y-auto custom-scrollbar-hidden"
            />
          </div>
        </div>

        <!-- Row 2: Boshlang'ich qoldiq (faqat yangi mahsulotda) -->
        <div v-if="!isEdit" class="lg:col-span-12">
          <InitialStockCard
            v-model="product.initialStock"
            :submitted="submitted"
          />
        </div>
      </div>
    </div>

    <!-- Sticky Mobile Save Bar -->
    <div class="lg:hidden fixed bottom-[68px] left-0 right-0 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
       <Button 
        :label="isEdit ? $t('products.form.save') : $t('products.form.add')" 
        icon="pi pi-check" 
        @click="onSave" 
        :loading="saving"
        class="w-full !rounded-xl !bg-emerald-500 hover:!bg-emerald-600 !border-none !h-12 !text-[14px] !font-black !text-white !shadow-lg !shadow-emerald-500/30 transition-all active:scale-[0.98] !flex !items-center !justify-center !gap-2"
        pt:icon:class="!text-sm"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { useProductForm } from './composables/useProductForm'

// Professional Components
import ProductFormHeader from './components/form/ProductFormHeader.vue'
import GeneralInfoCard from './components/form/GeneralInfoCard.vue'
import PricingInventoryCard from './components/form/PricingInventoryCard.vue'
import ImageUploadCard from './components/form/ImageUploadCard.vue'
import InitialStockCard from './components/form/InitialStockCard.vue'

const {
  loading,
  saving,
  product,
  categories,
  subcategories,
  units,
  currencies,
  previewUrl,
  isEdit,
  submitted,
  fetchData,
  onFileSelect,
  removeImage,
  onSave
} = useProductForm()

onMounted(fetchData)
</script>

<style scoped>
.animate-app-in {
  opacity: 0;
  animation: app-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes app-in {
  from { opacity: 0; transform: scale(0.98); filter: blur(10px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}

.custom-scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>


