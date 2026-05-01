<template>
  <div class="space-y-4 animate-in fade-in duration-500 font-inter max-w-[1200px] mx-auto pb-10">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm transition-all overflow-hidden relative">
      <div class="relative z-10">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <i class="pi pi-percentage text-indigo-500 text-[16px]"></i>
          </div>
          <div>
            <h2 class="text-base font-black text-slate-800 dark:text-white tracking-tight leading-none">
              {{ $t('products.promotions.title') || 'Aksiyalar Boshqaruvi' }}
            </h2>
            <div class="flex items-center gap-2 mt-1.5 grayscale opacity-70">
               <span class="text-[12px] font-black text-slate-400 tracking-widest border-r border-slate-200 dark:border-slate-800 pr-2">Marketing</span>
               <span class="text-[12px] font-bold text-slate-400 tracking-widest">Markazlashgan tizim</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-2 sm:mt-0">
         <!-- View Switcher -->
         <div class="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mr-2">
            <button 
              @click="viewMode = 'table'" 
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
            >
              <i class="pi pi-list text-xs"></i>
            </button>
            <button 
              @click="viewMode = 'grid'" 
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
            >
              <i class="pi pi-th-large text-xs"></i>
            </button>
         </div>

         <button 
           @click="openCreate" 
           class="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-black tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2.5"
         >
           <i class="pi pi-plus" /> Yangi Aksiya
         </button>
      </div>
    </div>

    <!-- Quick Insights -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
       <div class="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <p class="text-[12px] font-black text-slate-400 tracking-[0.15em] mb-1.5">Jami Aksiyalar</p>
          <div class="flex items-end gap-2">
            <span class="text-xl font-black text-slate-800 dark:text-white leading-none">{{ promotions.length }}</span>
            <span class="text-[12px] font-bold text-slate-400 pb-0.5 ">ta</span>
          </div>
       </div>
       <div class="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <p class="text-[12px] font-black text-slate-400 tracking-[0.15em] mb-1.5">Ayni paytda faol</p>
          <div class="flex items-end gap-2">
            <span class="text-xl font-black text-emerald-500 leading-none">{{ promotions.filter(p => p.is_currently_active).length }}</span>
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mb-1"></div>
          </div>
       </div>
       <div class="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <p class="text-[12px] font-black text-slate-400 tracking-[0.15em] mb-1.5">Qamrab olingan tovarlar</p>
          <div class="flex items-end gap-2">
            <span class="text-xl font-black text-indigo-500 leading-none">{{ promotions.reduce((acc, p) => acc + (p.product_count || 0), 0) }}</span>
            <span class="text-[12px] font-bold text-slate-400 pb-0.5 ">dona</span>
          </div>
       </div>
       <div class="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
          <p class="text-[12px] font-black text-slate-400 tracking-[0.15em] mb-1.5">O'rtacha chegirma</p>
          <div class="flex items-end gap-2">
            <span class="text-xl font-black text-rose-500 leading-none">{{ promotions.length ? (promotions.reduce((acc, p) => acc + parseFloat(p.discount_pct), 0) / promotions.length).toFixed(0) : 0 }}%</span>
            <i class="pi pi-chart-line text-rose-500/50 mb-1"></i>
          </div>
       </div>
    </div>

    <!-- MAIN VIEW -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
       <div v-for="i in 6" :key="i" class="h-32 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/60 animate-pulse"></div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else-if="viewMode === 'table' && promotions.length > 0" class="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden">
      <div class="overflow-x-auto overflow-y-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-[#0b1120]/50 border-b border-slate-200 dark:border-slate-800/60">
              <th class="px-6 py-4 text-[12px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] whitespace-nowrap">Aksiya Ma'lumotlari</th>
              <th class="px-6 py-4 text-[12px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] whitespace-nowrap">Qiymat</th>
              <th class="px-6 py-4 text-[12px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] text-center whitespace-nowrap">Holati</th>
              <th class="px-6 py-4 text-[12px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] whitespace-nowrap">Amal Qilish Vaqti</th>
              <th class="px-6 py-4 text-[12px] font-extrabold text-slate-400 dark:text-slate-500 tracking-[0.2em] text-right whitespace-nowrap">Amallar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
            <tr v-for="item in promotions" :key="item.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
              <td class="px-6 py-4">
                <div class="flex flex-col min-w-[220px]">
                  <span class="text-[16px] font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{{ item.name }}</span>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[11px] font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-500/20">
                      <i class="pi pi-box text-[10px] opacity-70"></i> 
                      {{ item.product_count || 0 }} Tovar biriktirilgan
                    </span>

                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="inline-flex flex-col">
                  <span class="text-[16px] font-black text-rose-600 dark:text-rose-400 leading-none">-{{ parseFloat(item.discount_pct) }}%</span>
                  <span class="text-[11px] font-bold text-slate-400 tracking-widest mt-1">Sotuvda</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                 <div class="flex items-center justify-center">
                    <span v-if="item.is_currently_active" class="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-black bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                      FAOL
                    </span>
                    <span v-else-if="item.is_active" class="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-black bg-amber-400 text-amber-900">
                      KUTILMOQDA
                    </span>
                    <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-black bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                      O'PLANGAN
                    </span>
                 </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-2.5 min-w-[180px]">
                  <div class="flex items-center justify-between text-[13px] leading-none group/date">
                    <div class="flex items-center gap-2">
                       <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                       <span class="text-slate-400 font-black tracking-widest text-[11px]">Boshlanish</span>
                    </div>
                    <span class="text-slate-700 dark:text-slate-200 font-bold tabular-nums">{{ formatDate(item.valid_from) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[13px] leading-none group/date">
                    <div class="flex items-center gap-2">
                       <div class="w-1.5 h-1.5 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
                       <span class="text-slate-400 font-black tracking-widest text-[11px]">Tugash</span>
                    </div>
                    <span class="text-rose-500 dark:text-rose-400 font-black tabular-nums">{{ formatDate(item.valid_to) }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-30 group-hover:opacity-100 transition-all">
                  <button @click="openEdit(item)" class="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all duration-300" v-tooltip.top="'Tahrirlash'"><i class="pi pi-pencil text-[13px]"></i></button>
                  <button @click="toggleStatus(item)" class="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white transition-all duration-300"><i class="pi text-[13px]" :class="item.is_active ? 'pi-pause' : 'pi-play'"></i></button>
                  <button @click="confirmDelete(item.id)" class="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-all duration-300" v-tooltip.top="'O\'chirish'"><i class="pi pi-trash text-[13px]"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- GRID VIEW -->
    <div v-else-if="viewMode === 'grid' && promotions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
       <div v-for="item in promotions" :key="item.id" class="group bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 border-b-4 transition-all duration-300 rounded-2xl p-5 shadow-sm hover:translate-y-[-4px] flex flex-col min-h-[190px]" :class="item.is_currently_active ? 'border-b-emerald-500' : (item.is_active ? 'border-b-amber-400' : 'border-b-slate-300 dark:border-b-slate-700')">
          <div class="flex items-start justify-between gap-3 mb-4">
             <div class="min-w-0">
                <h3 class="text-base font-black text-slate-800 dark:text-slate-100 truncate tracking-tight leading-tight">{{ item.name }}</h3>

             </div>
             <div class="bg-rose-500 text-white px-2.5 py-1.5 rounded-xl font-black text-sm shadow-lg shadow-rose-500/20">
                -{{ parseFloat(item.discount_pct) }}%
             </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-5">
             <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120]/60 border border-slate-100 dark:border-slate-800/60">
                <p class="text-[11px] font-black text-slate-400 mb-1">Qamrov</p>
                <div class="flex items-center gap-1.5">
                   <i class="pi pi-box text-indigo-500 text-[12px]"></i>
                   <span class="text-xs font-black text-slate-700 dark:text-slate-300">{{ item.product_count || 0 }} Tovar</span>
                </div>
             </div>
             <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120]/60 border border-slate-100 dark:border-slate-800/60 text-center">
                <p class="text-[11px] font-black text-slate-400 mb-1">Holat</p>
                <span class="text-[11px] font-black" :class="item.is_currently_active ? 'text-emerald-500' : (item.is_active ? 'text-amber-500' : 'text-slate-400')">
                   {{ item.is_currently_active ? 'FAOL' : (item.is_active ? 'NAVBTDA' : 'DEAKTIV') }}
                </span>
             </div>
          </div>

          <div class="flex flex-col gap-1.5 text-[12px] font-bold text-slate-500 mb-5 pl-1 italic border-l-2 border-slate-100 dark:border-slate-800/60 translate-x-1">
             <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-[11px] opacity-40"></i>
                <span>{{ formatDate(item.valid_from) }} <span class="opacity-50 mx-1">→</span> {{ formatDate(item.valid_to) }}</span>
             </div>
          </div>

          <div class="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <span class="text-[11px] font-bold text-slate-400 tracking-widest italic opacity-60">
                 Kritilgan: {{ formatDate(item.created_on).split(' ')[0] }}
              </span>
              <div class="flex gap-2">
                 <button @click="openEdit(item)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"><i class="pi pi-pencil text-xs"></i></button>
                 <button @click="toggleStatus(item)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"><i class="pi text-xs" :class="item.is_active ? 'pi-pause' : 'pi-play'"></i></button>
                 <button @click="confirmDelete(item.id)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"><i class="pi pi-trash text-xs"></i></button>
              </div>
          </div>
       </div>
    </div>

    <div v-else-if="promotions.length === 0 && !loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
        <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
           <i class="pi pi-tags text-2xl text-slate-300"></i>
        </div>
        <p class="text-xs font-black tracking-[0.2em] text-slate-400">Joriy aksiyalar mavjud emas</p>
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
import { ref, onMounted } from 'vue'
import { usePromotionManager } from './composables/usePromotionManager'
import PromotionSlideOver from './components/PromotionSlideOver.vue'

const viewMode = ref('table')

const {
  loading, formsaving, promotions,
  isSlideOverOpen, isEditing, activeItem,
  fetchedCategories, fetchedSubcategories, fetchedProducts, isFetchingDeps,
  loadData, openCreate, openEdit, confirmDelete, toggleStatus, submitForm
} = usePromotionManager()

/**
 * Format date string from API.
 * Handles standard ISO and custom "YYYY-MM-DD | HH:mm" formats.
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    // Handle the custom "YYYY-MM-DD | HH:mm" format by replacing the pipe
    const cleanStr = dateStr.replace(' | ', ' ')
    const date = new Date(cleanStr)
    
    if (isNaN(date.getTime())) return dateStr // Return raw if still invalid but don't crash
    
    return date.toLocaleDateString('uz-UZ', {
       year: 'numeric',
       month: '2-digit',
       day: '2-digit'
    }) + ' ' + date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch (e) {
    return dateStr || '-'
  }
}

onMounted(loadData)
</script>

<style scoped>
.font-black { font-weight: 900; }
.tracking-tight { letter-spacing: -0.025em; }
</style>


