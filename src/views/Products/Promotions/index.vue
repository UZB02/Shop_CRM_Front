<template>
  <div class="space-y-4 animate-in fade-in duration-500 font-inter">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white dark:bg-slate-900 px-6 py-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none gap-4">
      <div>
        <h2 class="text-2xl font-black font-outfit uppercase tracking-tighter text-slate-800 dark:text-white">Aksiyalar (Promotions)</h2>
        <p class="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-[0.2em]">Chegirma kampaniyalarini markazlashgan boshqarish</p>
      </div>
      <button @click="openCreate" class="h-11 px-8 rounded-xl bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30 active:scale-95 flex items-center gap-3">
        <i class="pi pi-bolt" /> Aksiya Yaratish
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center h-64 shadow-sm">
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
        <span class="text-[10px] font-black tracking-widest uppercase text-slate-400 animate-pulse">Ma'lumotlar yuklanmoqda...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="promotions.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all opacity-80">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800/30">
          <i class="pi pi-tags text-2xl text-indigo-500"></i>
        </div>
        <p class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Joriy aksiyalar mavjud emas</p>
    </div>

    <!-- Promotions Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
       <div v-for="item in promotions" :key="item.id" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden flex flex-col">
          <!-- Status Banner -->
          <div class="absolute top-0 left-0 right-0 h-1" 
             :class="item.is_currently_active ? 'bg-emerald-400' : (item.is_active ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-700')">
          </div>
          
          <div class="flex items-start justify-between mb-4">
             <div class="flex flex-col">
                <span class="text-lg font-black font-outfit uppercase text-slate-800 dark:text-white truncate pr-2" :title="item.name">{{ item.name }}</span>
                <span class="text-[10px] uppercase tracking-widest font-bold mt-1" 
                  :class="item.is_currently_active ? 'text-emerald-500' : (item.is_active ? 'text-amber-500' : 'text-slate-400')">
                  {{ item.is_currently_active ? '✅ Ayni paytda faol' : (item.is_active ? '⏳ Kutilmoqda / Tugagan' : '🔴 Deaktiv qilingan') }}
                </span>
             </div>
             
             <!-- Discount Badge -->
             <div class="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/50 min-w-[60px]">
                <span class="text-[9px] font-bold text-indigo-400 uppercase">Chegirma</span>
                <span class="text-base font-black text-indigo-600 dark:text-indigo-400">-{{ parseFloat(item.discount_pct) }}%</span>
             </div>
          </div>

          <!-- Validity Dates -->
          <div class="flex flex-col space-y-2 mb-6 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
             <div class="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-calendar text-slate-400 text-opacity-80"></i>
                <div class="flex w-full justify-between">
                   <span>Boshlanish:</span>
                   <span class="font-bold text-slate-700 dark:text-slate-200">{{ new Date(item.valid_from).toLocaleString() }}</span>
                </div>
             </div>
             <div class="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <i class="pi pi-flag-fill text-slate-400 text-opacity-80"></i>
                <div class="flex w-full justify-between">
                   <span>Tugash:</span>
                   <span class="font-bold text-slate-700 dark:text-slate-200">{{ new Date(item.valid_to).toLocaleString() }}</span>
                </div>
             </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
             <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <i class="pi pi-box"></i> Qamrov: {{ item.product_count || 0 }} tovar
             </div>

             <div class="flex gap-2">
                <button @click="openEdit(item)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center">
                   <i class="pi pi-pencil text-sm"></i>
                </button>
                <button @click="toggleStatus(item)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors flex items-center justify-center" :title="item.is_active ? 'Deaktiv qilish' : 'Aktivlashtirish'">
                   <i class="pi" :class="item.is_active ? 'pi-pause' : 'pi-play'"></i>
                </button>
                <button @click="confirmDelete(item.id)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center">
                   <i class="pi pi-trash text-sm"></i>
                </button>
             </div>
          </div>
       </div>
    </div>

    <!-- Slide-over Modal -->
    <PromotionSlideOver 
      v-model:visible="isSlideOverOpen"
      :is-editing="isEditing"
      :saving="formsaving"
      :fetching-deps="isFetchingDeps"
      :form="activeItem"
      :categories="fetchedCategories"
      :subcategories="fetchedSubcategories"
      :products="fetchedProducts"
      @submit="submitForm"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePromotionManager } from './composables/usePromotionManager'
import PromotionSlideOver from './components/PromotionSlideOver.vue'

const {
  loading, formsaving, promotions,
  isSlideOverOpen, isEditing, activeItem,
  fetchedCategories, fetchedSubcategories, fetchedProducts, isFetchingDeps,
  loadData, openCreate, openEdit, confirmDelete, toggleStatus, submitForm
} = usePromotionManager()

// Start loading list
onMounted(loadData)
</script>
