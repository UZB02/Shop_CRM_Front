<template>
  <div class="max-w-[1200px] mx-auto pb-20">
    <!-- Header Section -->
    <ProductFormHeader 
      :isEdit="isEdit" 
      :saving="saving" 
      @save="onSave" 
    />

    <div class="grid grid-cols-12 gap-6 items-start">
      <!-- Loading Overlay -->
      <div v-if="loading" class="col-span-12 h-96 flex items-center justify-center">
        <i class="pi pi-spin pi-spinner text-3xl text-emerald-500"></i>
      </div>

      <template v-else>
        <!-- LEFT COLUMN (7/12) -->
        <div class="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <GeneralInfoCard 
            v-model="product"
            :categories="categories"
            :submitted="submitted"
          />

          <PricingInventoryCard 
            v-model="product"
            :units="units"
          />
        </div>

        <!-- RIGHT COLUMN (5/12) -->
        <div class="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <ImageUploadCard 
            :imageUrl="product.imageUrl"
            :previewUrl="previewUrl"
            @select="onFileSelect"
            @remove="removeImage"
          />

          <WarehouseStatusCard 
            v-model="product"
            :warehouses="warehouses"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductForm } from './composables/useProductForm'

// Components
import ProductFormHeader from './components/form/ProductFormHeader.vue'
import GeneralInfoCard from './components/form/GeneralInfoCard.vue'
import PricingInventoryCard from './components/form/PricingInventoryCard.vue'
import ImageUploadCard from './components/form/ImageUploadCard.vue'
import WarehouseStatusCard from './components/form/WarehouseStatusCard.vue'

const {
  loading,
  saving,
  product,
  categories,
  warehouses,
  units,
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
/* Page Animations */
.grid {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
