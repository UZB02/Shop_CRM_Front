<template>
  <div>
    <!-- Desktop Filters / Mobile Search trigger -->
    <div class="flex items-center gap-2">
       <div class="relative flex-1">
         <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none"></i>
         <input
           :value="searchQuery"
           @input="onSearch($event.target.value)"
           @keyup.enter="handleEnter"
           @focus="$event.target.select()"
           type="text"
           :placeholder="$t('products.search_placeholder')"
           class="w-full h-11 sm:h-9 pl-9 pr-8 text-[13px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
         />
       </div>
       
       <button @click="filterSidebar = true" class="md:hidden w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 shadow-sm active:scale-95 transition-transform">
         <i class="pi pi-sliders-h"></i>
       </button>
       
       <!-- Desktop Filter Drops (Hidden on mobile) -->
       <div class="hidden md:flex items-center gap-2">
         <!-- Promotion filter -->
         <select
           :value="selectedPromotion"
           @change="$emit('update:selectedPromotion', $event.target.value); $emit('change')"
           class="h-10 sm:h-9 px-3 text-[12px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all appearance-none pr-8 min-w-[130px] shadow-sm"
         >
           <option value="">{{ $t('products.filter_all_prices') }}</option>
           <option value="true">{{ $t('products.filter_promo') }}</option>
           <option value="false">{{ $t('products.filter_no_promo') }}</option>
         </select>

         <!-- Status filter -->
         <select
           :value="selectedStatus"
           @change="$emit('update:selectedStatus', $event.target.value || null); $emit('change')"
           class="h-10 sm:h-9 px-3 text-[12px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all appearance-none pr-8 min-w-[110px] shadow-sm"
         >
           <option value="">{{ $t('common.status') }}</option>
           <option value="active">Faol</option>
           <option value="inactive">Nofaol</option>
         </select>

         <!-- Refresh -->
         <button
           @click="$emit('refresh')"
           :disabled="loading"
           class="w-10 h-10 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all disabled:opacity-50 shrink-0 shadow-sm"
         >
           <i class="pi pi-refresh text-[14px]" :class="{ 'animate-spin': loading }"></i>
         </button>
       </div>
    </div>

    <!-- Mobile Bottom Sheet (PrimeVue Sidebar) -->
    <Sidebar v-model:visible="filterSidebar" position="bottom" style="height: auto" class="!h-auto rounded-t-[24px] dark:bg-slate-900" :showCloseIcon="false">
       <div class="p-4 space-y-5 pb-8">
         <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-2"></div>
         <div class="flex items-center justify-between">
           <h3 class="text-lg font-black text-slate-800 dark:text-white">Filtrlar</h3>
           <button @click="filterSidebar = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              <i class="pi pi-times text-xs"></i>
           </button>
         </div>
         
         <div class="space-y-3">
             <label class="text-xs font-bold text-slate-500">Aksiyalar bo'yicha</label>
             <select :value="selectedPromotion" @change="$emit('update:selectedPromotion', $event.target.value)" class="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <option value="">Barchasi</option>
                <option value="true">Aksiya</option>
                <option value="false">Aksiyasiz</option>
             </select>
         </div>

         <div class="space-y-3">
             <label class="text-xs font-bold text-slate-500">Status bo'yicha</label>
             <select :value="selectedStatus" @change="$emit('update:selectedStatus', $event.target.value || null)" class="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <option value="">Barchasi</option>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
             </select>
         </div>

         <button @click="filterSidebar = false; $emit('change')" class="w-full h-12 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
            Natijalarni ko'rsatish
         </button>
       </div>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from 'primevue/sidebar'

const filterSidebar = ref(false)

const props = defineProps({
  searchQuery: String,
  selectedStatus: [String, null],
  selectedPromotion: [String, Boolean, null],
  selectedSubcategory: [String, Number, null],
  subcategories: { type: Array, default: () => [] },
  loading: Boolean
})

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedStatus',
  'update:selectedPromotion',
  'update:selectedSubcategory',
  'change',
  'refresh',
  'search'
])

let searchTimeout = null
const onSearch = (val) => {
  emit('update:searchQuery', val)
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => emit('search', val), 400)
}

const handleEnter = (e) => {
  clearTimeout(searchTimeout)
  emit('search', props.searchQuery)
  e.target.select()
}
</script>


