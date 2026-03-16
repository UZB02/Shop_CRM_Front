<template>
  <div class="max-w-6xl mx-auto relative min-h-[80vh]">
    <div class="space-y-6 animate-in fade-in duration-700">
      
      <!-- Management Header -->
      <CategoryHeader 
        :total-categories="categories.length"
        v-model:search-query="searchQuery"
        @add="openAddMode"
      />

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 6" :key="i" class="h-24 bg-white/50 dark:bg-slate-900/50 animate-pulse rounded-[2rem] border border-slate-100 dark:border-slate-800/50"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-32 opacity-20">
        <div class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <i class="pi pi-folder-open text-5xl"></i>
        </div>
        <p class="text-xs font-black uppercase tracking-[0.4em] text-center">{{ $t('common.no_results') }}</p>
      </div>

      <!-- Categories List -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 items-start">
        <CategoryCard 
          v-for="c in filteredCategories" 
          :key="c.id || c._id"
          :category="c"
          :is-expanded="expandedId === (c.id || c._id)"
          :sub-count="getSubcategories(c.id || c._id).length"
          @expand="toggleExpand"
          @edit="startEdit"
          @delete="confirmDeleteCategory"
        >
          <template #expanded>
            <SubcategoryList 
              :subcategories="getSubcategories(c.id || c._id)"
              v-model:search-query="subSearchQuery"
              @add="openAddSubMode(c)"
              @edit="startEditSub"
              @delete="confirmDeleteSub"
            />
          </template>
        </CategoryCard>
      </div>
    </div>

    <!-- Slide-over Panels -->
    <CategorySlideOver 
      v-model:visible="panelVisible"
      :is-editing="isEditing"
      :category="activeCategory"
      :saving="saving"
      @submit="handleCategorySubmit"
    />

    <SubcategorySlideOver 
      v-model:visible="subPanelVisible"
      :is-editing="isEditingSub"
      :subcategory="activeSubcategory"
      :category-name="currentCategoryName"
      :saving="savingSub"
      @submit="handleSubSubmit"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoryManager } from './composables/useCategoryManager'

// Components
import CategoryHeader from './components/categories/CategoryHeader.vue'
import CategoryCard from './components/categories/CategoryCard.vue'
import SubcategoryList from './components/categories/SubcategoryList.vue'
import CategorySlideOver from './components/categories/CategorySlideOver.vue'
import SubcategorySlideOver from './components/categories/SubcategorySlideOver.vue'

const {
  loading, saving, categories, expandedId,
  searchQuery, subSearchQuery, filteredCategories,
  panelVisible, isEditing, activeCategory,
  subPanelVisible, isEditingSub, savingSub, activeSubcategory,
  currentCategoryName, getSubcategories, toggleExpand,
  loadData, openAddMode, startEdit, handleCategorySubmit, confirmDeleteCategory,
  openAddSubMode, startEditSub, handleSubSubmit, confirmDeleteSub
} = useCategoryManager()

onMounted(loadData)
</script>

<style scoped>
@reference "../../assets/styles/main.css";
/* Essential page container styles if any, most moved to components */
</style>
