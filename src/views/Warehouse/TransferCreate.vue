<template>
  <div class="flex flex-col h-[calc(100vh-72px)] max-w-[1400px] mx-auto">
    <!-- Top bar -->
    <TransferHeader
      :source-name="sourceName"
      :loading="subLoading"
      :is-valid="isValid"
      @back="router.back()"
      @submit="submitTransfer"
    />

    <!-- Body (2-col) -->
    <div class="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 py-5">
      <!-- LEFT: Config panel -->
      <TransferSidebar
        v-model:target-type="targetType"
        :transfer-form="transferForm"
        :filtered-branches="filteredBranches"
        :filtered-warehouses="filteredWarehouses"
        :source-name="sourceName"
        :selected-destination-name="selectedDestinationName"
        :is-valid="isValid"
      />

      <!-- RIGHT: Products panel -->
      <TransferProductList
        :items="transferForm.items"
        @remove="removeItem"
        @open-search="showProductSelect = true"
      />
    </div>

    <!-- Product selection dialog -->
    <ProductSelector
      v-model:visible="showProductSelect"
      v-model:product-search="productSearch"
      :source-name="sourceName"
      :products="filteredAvailableProducts"
      @add="addProduct"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TransferHeader from './components/TransferCreate/TransferHeader.vue'
import TransferSidebar from './components/TransferCreate/TransferSidebar.vue'
import TransferProductList from './components/TransferCreate/TransferProductList.vue'
import ProductSelector from './components/TransferCreate/ProductSelector.vue'
import { useTransferCreate } from './composables/useTransferCreate'

const {
  router,
  targetType,
  showProductSelect,
  productSearch,
  sourceName,
  transferForm,
  subLoading,
  isValid,
  filteredBranches,
  filteredWarehouses,
  selectedDestinationName,
  filteredAvailableProducts,
  addProduct,
  removeItem,
  loadSourceData,
  submitTransfer,
  fetchLocations,
  resetForm
} = useTransferCreate()

onMounted(() => {
  fetchLocations()
  loadSourceData()
  resetForm()
})
</script>

<style scoped>
/* Scoped styles relocated to components or keeping only essential layout here */
</style>
