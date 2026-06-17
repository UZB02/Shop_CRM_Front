<template>
  <div class="space-y-4 animate-in fade-in duration-500 font-inter">
    <!-- Management Header -->
    <CategoryHeader 
      :total-categories="categories.length"
      :templateLoading="templateLoading.subcategories"
      v-model:search-query="searchQuery"
      :can-import="isManagerOrAbove()"
      :importing="importing"
      @add="openAddMode"
      @download-template="downloadTemplate('subcategories')"
      @import="handleImport"
    />

    <!-- Main Content Area -->
    <div class="relative min-h-[500px]">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div v-for="i in 6" :key="i" class="h-28 bg-white dark:bg-slate-900 animate-pulse rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-all opacity-60">
        <div class="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
          <i class="pi pi-folder-open text-2xl text-emerald-500/30"></i>
        </div>
        <p class="text-[12px] font-black tracking-[0.3em] text-slate-400">{{ $t('common.no_results') }}</p>
        <button @click="openAddMode" class="mt-6 h-8 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all">
           {{ $t('common.add') }}
        </button>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start pb-12">
        <CategoryCard 
          v-for="c in filteredCategories" 
          :key="c.id || c._id"
          :category="c"
          :is-expanded="expandedId === (c.id || c._id)"
          :sub-count="settingsStore.isSubcategoryEnabled ? getSubcategories(c.id || c._id).length : 0"
          :show-expand="settingsStore.isSubcategoryEnabled"
          @expand="toggleExpand"
          @edit="startEdit"
          @delete="confirmDeleteCategory"
        >
          <template #expanded v-if="settingsStore.isSubcategoryEnabled">
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
      v-if="settingsStore.isSubcategoryEnabled"
      v-model:visible="subPanelVisible"
      :is-editing="isEditingSub"
      :subcategory="activeSubcategory"
      :category-name="currentCategoryName"
      :saving="savingSub"
      @submit="handleSubSubmit"
    />

    <ImportResultDialog
      v-model:visible="showResultDialog"
      :result="importResult"
      @reload="loadData"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoryManager } from './composables/useCategoryManager'
import { useSettingsStore } from '@/store/settings'
import { useTemplateDownload } from '@/composables/useTemplateDownload'
import { useImport } from '@/composables/useImport'

const settingsStore = useSettingsStore()

// Components
import CategoryHeader from './components/categories/CategoryHeader.vue'
import CategoryCard from './components/categories/CategoryCard.vue'
import SubcategoryList from './components/categories/SubcategoryList.vue'
import CategorySlideOver from './components/categories/CategorySlideOver.vue'
import SubcategorySlideOver from './components/categories/SubcategorySlideOver.vue'
import ImportResultDialog from '@/components/ImportResultDialog.vue'

const {
  loading, saving, categories, expandedId,
  searchQuery, subSearchQuery, filteredCategories,
  panelVisible, isEditing, activeCategory,
  subPanelVisible, isEditingSub, savingSub, activeSubcategory,
  currentCategoryName, getSubcategories, toggleExpand,
  loadData, openAddMode, startEdit, handleCategorySubmit, confirmDeleteCategory,
  openAddSubMode, startEditSub, handleSubSubmit, confirmDeleteSub
} = useCategoryManager()

const { templateLoading, downloadTemplate } = useTemplateDownload()

const {
  importing,
  importResult,
  showResultDialog,
  isManagerOrAbove,
  importData
} = useImport()

const handleImport = async (file) => {
  await importData('subcategories', file, loadData)
}

onMounted(loadData)
</script>

<style scoped>
</style>


