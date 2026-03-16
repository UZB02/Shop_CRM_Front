<template>
  <!-- Responsive height: Fixed on desktop (lg+), auto on mobile -->
  <div class="lg:h-[calc(100vh-4rem)] flex flex-col p-4 md:p-5 lg:p-6 lg:pt-2 lg:overflow-hidden min-h-screen lg:min-h-0">
    <!-- Compact Sticky Header -->
    <ProductFormHeader 
      :isEdit="isEdit" 
      :saving="saving" 
      :product="product"
      @save="onSave" 
      class="shrink-0 mb-6"
    />

    <!-- Main Content Area -->
    <div class="flex-1 min-h-0 overflow-y-auto lg:overflow-visible custom-scrollbar-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="h-64 lg:h-full flex flex-col items-center justify-center gap-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 border-3 border-emerald-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Yuklanmoqda...</p>
      </div>

      <!-- Grid: 1 col on mobile, 1 col on md, 3 cols on lg (single screen) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-app-in pb-10 lg:pb-0">
        
        <!-- Column 1: Basic Info (4/12) -->
        <div class="lg:col-span-4 flex flex-col">
          <GeneralInfoCard 
            v-model="product"
            :categories="categories"
            :subcategories="subcategories"
            :submitted="submitted"
            class="h-full shrink-0 lg:shrink lg:overflow-y-auto custom-scrollbar-hidden"
          />
        </div>

        <!-- Column 2: Financials & Stock (4/12) -->
        <div class="lg:col-span-4 flex flex-col">
          <PricingInventoryCard 
            v-model="product"
            :units="units"
            :currencies="currencies"
            class="h-full shrink-0 lg:shrink lg:overflow-y-auto custom-scrollbar-hidden"
          />
        </div>

        <!-- Column 3: Media & Settings (4/12) -->
        <div class="lg:col-span-4 flex flex-col gap-5">
          <!-- Image Section -->
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductForm } from './composables/useProductForm'

// Professional Components
import ProductFormHeader from './components/form/ProductFormHeader.vue'
import GeneralInfoCard from './components/form/GeneralInfoCard.vue'
import PricingInventoryCard from './components/form/PricingInventoryCard.vue'
import ImageUploadCard from './components/form/ImageUploadCard.vue'

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
