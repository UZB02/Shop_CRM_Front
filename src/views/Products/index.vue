<template>
  <div class="space-y-4 relative min-h-[calc(100vh-6rem)]">

    <!-- Mobile FAB -->
    <div class="md:hidden fixed bottom-20 right-4 z-40">
      <button @click="router.push('/dashboard/products/create')" class="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[16px] shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-95 transition-transform">
        <i class="pi pi-plus text-xl"></i>
      </button>
    </div>

    <!-- Sticky Header Wrapper for Mobile -->
    <div class="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-0 border-b border-slate-200/50 dark:border-slate-800/50 sm:border-none sm:bg-transparent sm:backdrop-blur-none">
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
    </div>

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
          :subcategories="subcategories"
          :selectedSubcategoryId="selectedSubcategory"
          readonly
          @select="onCategorySelect"
          @select-sub="onSubcategorySelect"
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
import { useRouter } from 'vue-router'
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
const router = useRouter()


const onCategorySelect = (cat) => {
  selectedCategory.value = cat ? (cat.id ?? null) : null
  selectedSubcategory.value = null
  currentPage.value = 1
  fetchSubcategories(selectedCategory.value)
  loadProducts()
}

const onSubcategorySelect = (subId) => {
  selectedSubcategory.value = subId
  currentPage.value = 1
  loadProducts()
}

onMounted(() => {
  loadProducts()
  loadData()
})
</script>


