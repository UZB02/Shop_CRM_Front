<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header & Stats -->
    <div class="flex flex-col gap-5 sm:gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <ProductPageHeader 
        :totalProducts="totalProducts"
        @add-category="openCategoryDialog"
      />

      <!-- Quick Stats -->
      <ProductStats 
        :totalProducts="totalProducts"
        :categoriesCount="categories.length"
        :warehousesCount="warehouses.length"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Left Sidebar: Categories -->
      <div class="col-span-12 lg:col-span-3">
        <CategoryList 
          :categories="categories" 
          :selectedId="selectedCategory"
          :totalProducts="totalProducts"
          @select="onCategorySelect"
          @add="openCategoryDialog"
          @edit="editCategory"
          @delete="confirmDeleteCategory"
        />
      </div>

      <!-- Right Main: Products -->
      <div class="col-span-12 lg:col-span-9 space-y-4">
        <!-- Filters and Search -->
        <ProductFilters 
          v-model:searchQuery="searchQuery"
          v-model:selectedWarehouse="selectedWarehouse"
          :warehouses="warehouses"
          :loading="loading"
          @search="loadProducts"
          @change="loadProducts"
          @refresh="loadProducts"
        />

        <!-- Products Table Component -->
        <ProductTable 
          :products="products" 
          :loading="loading" 
          :totalRecords="totalProducts" 
          :currentPage="currentPage"
          @delete="confirmDeleteProduct"
          @page-change="handlePageChange"
        />
      </div>
    </div>



    <!-- Category Dialog Component -->
    <CategoryDialog 
      v-model:visible="categoryDialog"
      :category="category"
      :categories="categories"
      :saving="cSaving"
      @save="saveCategory"
      @edit="editCategory"
      @delete="confirmDeleteCategory"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Components
import ProductTable from './components/ProductTable.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import CategoryList from './components/CategoryList.vue'
import ProductStats from './components/ProductStats.vue'
import ProductPageHeader from './components/ProductPageHeader.vue'
import ProductFilters from './components/ProductFilters.vue'

// Composables
import { useProducts } from './composables/useProducts'
import { useCategories } from './composables/useCategories'

const {
  loading,
  products,
  totalProducts,
  currentPage,
  searchQuery,
  selectedWarehouse,
  selectedCategory,
  loadProducts,
  handlePageChange,
  confirmDeleteProduct
} = useProducts()

const {
  categories,
  warehouses,
  cSaving,
  categoryDialog,
  category,
  loadData,
  openCategoryDialog,
  editCategory,
  saveCategory,
  confirmDeleteCategory
} = useCategories()

const onCategorySelect = (cat) => {
  // API numeric id qaytaradi: cat.id
  selectedCategory.value = cat ? (cat.id ?? null) : null
  currentPage.value = 1
  loadProducts()
}

onMounted(() => {
  loadProducts()
  loadData()
})
</script>

<style scoped>
@keyframes slide-in-top {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: slide-in-top 0.5s ease-out forwards;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Common PrimeVue Deep Styles for consistency */
:deep(.p-datatable-custom) .p-datatable-thead > tr > th {
  background-color: rgba(248, 250, 252, 0.5);
  color: #94a3b8;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid #f1f5f9;
  padding: 1rem 1.5rem;
}
</style>
