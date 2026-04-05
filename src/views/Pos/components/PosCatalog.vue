<template>
  <div class="flex-1 flex flex-col gap-4 overflow-hidden">
    <!-- Category Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar flex-shrink-0">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="selectedCategoryId = cat.id"
        class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border"
        :class="selectedCategoryId === cat.id 
          ? 'bg-emerald-500 text-white border-emerald-500' 
          : 'bg-white dark:bg-[#0f172a] text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 hover:border-slate-200'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Compact Grid -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center opacity-40">
      <div class="w-8 h-8 border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="flex-1 flex flex-col items-center justify-center opacity-20">
       <i class="pi pi-search text-5xl mb-3"></i>
       <p class="font-black text-[10px] uppercase tracking-widest">Ma'lumot topilmadi</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start content-start custom-scrollbar">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-minimal-card"
        @click="(product.amount === undefined || product.amount > 0) && $emit('add-to-cart', product)"
      >
        <div class="relative bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:-translate-y-1 hover:shadow-lg cursor-pointer min-h-[220px]"
             :class="{'opacity-40 grayscale': product.amount !== undefined && product.amount <= 0}">
          
          <!-- Image Section -->
          <div class="h-28 w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 transition-colors">
            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" :alt="product.name">
            <i v-else class="pi pi-box text-3xl text-slate-200 dark:text-slate-800"></i>
            
            <!-- Promotion Badge -->
            <div v-if="product.active_promotion" class="absolute top-2 right-2 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
              SALE
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-4 flex flex-col flex-1">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-xs text-slate-800 dark:text-slate-100 font-outfit uppercase tracking-tight line-clamp-2">
                {{ product.name }}
              </h3>
            </div>

            <!-- Price & Stock -->
            <div class="flex items-end justify-between mt-auto">
              <div class="flex flex-col leading-none">
                <!-- Promo Price Logic -->
                <div v-if="product.active_promotion" class="flex flex-col">
                  <span class="text-[9px] text-slate-400 line-through mb-0.5">{{ formatCurrency(product.sale_price) }}</span>
                  <span class="text-base font-black text-rose-500 font-outfit">{{ formatCurrency(product.active_promotion.discounted_price) }}</span>
                </div>
                <div v-else class="flex flex-col">
                  <span class="text-base font-black text-emerald-500 font-outfit">{{ formatCurrency(product.sale_price) }}</span>
                </div>
                <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">{{ product.unit_display || product.unit }}</span>
              </div>

              <div v-if="product.amount !== undefined && product.amount > 0" class="px-2 py-1 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-500/10">
                 <span class="text-[8px] font-black text-orange-400 dark:text-orange-500 uppercase tracking-widest flex flex-col text-center">
                   {{ product.amount }} left
                 </span>
              </div>
              <div v-else-if="product.amount !== undefined && product.amount <= 0" class="px-2 py-1 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-[8px] font-black text-rose-400 uppercase">
                 Fin
              </div>
              <div v-else class="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-[8px] font-black text-emerald-500 uppercase">
                 Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { productsAPI, categoriesAPI } from '@/services/api'

const props = defineProps(['externalSearch'])
const emit = defineEmits(['add-to-cart', 'focus-barcode'])

const products = ref([])
const categories = ref([{ id: 'all', name: 'All' }])
const loading = ref(false)
const selectedCategoryId = ref('all')

// Debounce helper
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const fetchCategories = async () => {
  try {
    const res = await categoriesAPI.getAll()
    const rawCats = res.data.results || res.data
    categories.value = [{ id: 'all', name: 'All' }, ...rawCats]
  } catch (error) { console.error('Categories Error:', error) }
}

const fetchProducts = async (search = '', categoryId = 'all') => {
  loading.value = true
  try {
    const params = { search, limit: 100 }
    if (categoryId !== 'all') {
      params.category = categoryId
    }
    const res = await productsAPI.getAll(params)
    products.value = res.data.results || res.data
  } catch (error) { console.error('Products Error:', error) } 
  finally { loading.value = false }
}

// Create debounced version of fetch
const debouncedFetch = debounce((search, catId) => {
  fetchProducts(search, catId)
}, 500)

const filteredProducts = computed(() => products.value)

watch(() => props.externalSearch, (newVal) => {
  debouncedFetch(newVal, selectedCategoryId.value)
})

watch(selectedCategoryId, (newId) => {
  // Category changes should usually be instant for better UX
  fetchProducts(props.externalSearch, newId)
})

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 40px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.product-minimal-card { cursor: pointer; -webkit-tap-highlight-color: transparent; }
.product-minimal-card:active { transform: scale(0.98); }
</style>
