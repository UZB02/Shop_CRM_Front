<template>
  <div class="space-y-4">

    <!-- Header -->
    <ProductPageHeader
      :totalProducts="totalProducts"
      :templateLoading="templateLoading.products"
      :importing="importing"
      :canImport="isManagerOrAbove()"
      @add-category="openCategoryDialog"
      @export-stocks="exportStocks()"
      @download-template="downloadTemplate('products')"
      @import="importData('products', $event, loadProducts)"
    />

    <!-- Category Management Dialog -->
    <CategoryDialog
      v-model:visible="categoryDialog"
      :category="category"
      :saving="cSaving"
      @save="saveCategory"
    />


    <!-- Import Result Dialog -->
    <ImportResultDialog
      v-model:visible="showResultDialog"
      :result="importResult"
      @reload="loadProducts"
    />

    <!-- Main layout -->
    <div class="flex flex-col lg:flex-row gap-4">

      <!-- Left: Categories -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <CategoryList
          :categories="categories"
          :selectedId="selectedCategory"
          :totalProducts="totalProducts"
          readonly
          @select="onCategorySelect"
        />
      </div>

      <!-- Right: Filters + Table -->
      <div class="flex-1 min-w-0 space-y-3">
        <ProductFilters
          v-model:searchQuery="searchQuery"
          v-model:selectedStatus="selectedStatus"
          v-model:selectedPromotion="selectedPromotion"
          v-model:selectedSubcategory="selectedSubcategory"
          :subcategories="subcategories"
          :loading="loading"
          @search="handleSearch"
          @change="currentPage = 1; loadProducts()"
          @refresh="loadProducts"
        />

        <ProductTable
          :products="products"
          :loading="loading"
          :totalRecords="totalProducts"
          :currentPage="currentPage"
          :rowsPerPage="rowsPerPage"
          @delete="confirmDeleteProduct"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductTable from './components/ProductTable.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import CategoryList from './components/CategoryList.vue'
import ProductPageHeader from './components/ProductPageHeader.vue'
import ProductFilters from './components/ProductFilters.vue'
import ImportResultDialog from '@/components/ImportResultDialog.vue'
import { useProducts } from './composables/useProducts'
import { useCategories } from './composables/useCategories'
import { useTemplateDownload } from '@/composables/useTemplateDownload'
import { useImport } from '@/composables/useImport'

const {
  loading, products, totalProducts, currentPage, rowsPerPage,
  searchQuery, selectedCategory, selectedSubcategory, selectedStatus, selectedPromotion,
  subcategories, fetchSubcategories, loadProducts, handleSearch,
  handlePageChange, confirmDeleteProduct, exportStocks
} = useProducts()

const {
  categories, cSaving, categoryDialog, category,
  loadData, openCategoryDialog, saveCategory
} = useCategories()

const { templateLoading, downloadTemplate } = useTemplateDownload()
const { importing, importResult, showResultDialog, isManagerOrAbove, importData } = useImport()


const onCategorySelect = (cat) => {
  selectedCategory.value = cat ? (cat.id ?? null) : null
  selectedSubcategory.value = null
  currentPage.value = 1
  fetchSubcategories(selectedCategory.value)
  loadProducts()
}

onMounted(() => {
  loadProducts()
  loadData()
})
</script>


