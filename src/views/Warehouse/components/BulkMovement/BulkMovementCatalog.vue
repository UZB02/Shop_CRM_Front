<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#0f172a]">
    <!-- Compact Header -->
    <div class="p-4 border-b border-slate-100 dark:border-slate-800/50 space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">{{ $t('menu.products') }}</h4>
        <div v-if="loading" class="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>

      <!-- Search -->
      <div class="relative group">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-emerald-500 transition-colors text-[14px]" />
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="$t('common.search') + '...'" 
          @keyup.enter="handleSearchEnter"
          @focus="$event.target.select()"
          class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg pl-10 pr-4 py-1.5 text-[13px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-300 transition-all"
        />
      </div>

      <!-- Categories Pills (Horizontal Scroll) -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="selectCategory(cat)"
          class="px-4 py-1.5 rounded-lg text-[11px] font-black tracking-widest transition-all whitespace-nowrap border"
          :class="selectedCategoryId === cat.id 
            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' 
            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Product List (Vertical Scroll) -->
    <div class="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
      <div v-if="filteredProducts.length === 0 && !loading" class="h-full flex flex-col items-center justify-center opacity-20 py-10">
         <i class="pi pi-search text-2xl mb-2"></i>
         <p class="font-black text-[12px] tracking-widest uppercase">{{ $t('common.no_data') }}</p>
      </div>

      <div v-else class="space-y-1.5">
        <div 
          v-for="product in filteredProducts" 
          :key="`${product.id}-${product.tur_id || 0}`" 
          class="group cursor-pointer"
          @click="$emit('add', product)"
        >
          <div class="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-emerald-500/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-200">
            <!-- Mini Thumb -->
            <div class="relative shrink-0">
              <div class="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <img v-if="product.image" :src="product.image" class="w-full h-full object-contain p-1" />
                <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-sm"></i>
              </div>
              
              <div v-if="getItemQty(product)" class="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-emerald-500 text-white rounded-full flex items-center justify-center text-[12px] font-black shadow-lg border-2 border-white dark:border-slate-900 z-[20]">
                {{ getItemQty(product) }}
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <h5 class="text-[13px] font-black text-slate-700 dark:text-slate-300 truncate tracking-tight">{{ product.name }}</h5>
              <div class="flex items-center gap-2 mt-0.5">
                <TurBadge v-if="product.tur_name" :tur-name="product.tur_name" :tur-color="product.tur_color" class="scale-[0.65] origin-left" />
                <span class="text-[11px] font-bold text-slate-400 tracking-tighter truncate">{{ product.barcode }}</span>
              </div>
            </div>

            <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
              <i class="pi pi-plus text-[12px]"></i>
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
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  items: Array
})

const emit = defineEmits(['add', 'search', 'scan'])

const products = ref([])
const categories = ref([{ id: 'all', name: 'Barchasi' }])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategoryId = ref('all')

const getItemQty = (product) => {
  const item = props.items.find(i => i.product.id === product.id && i.product.tur_id === product.tur_id)
  return item ? item.quantity : 0
}

const selectCategory = (cat) => {
  selectedCategoryId.value = cat.id
}

const fetchCategories = async () => {
  try {
    const res = await categoriesAPI.getAll()
    categories.value = [{ id: 'all', name: 'Barchasi' }, ...(res.data.results || res.data)]
  } catch (error) { console.error('Categories Error:', error) }
}

const fetchProducts = async (search = '', categoryId = 'all') => {
  loading.value = true
  try {
    const params = { search, limit: 100 }
    if (categoryId !== 'all') params.category = categoryId
    const res = await productsAPI.getAll(params)
    products.value = res.data.results || res.data
  } catch (error) { console.error('Fetch Products Error:', error) }
  finally { loading.value = false }
}

const filteredProducts = computed(() => products.value)

let searchTimeout = null
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts(newVal, selectedCategoryId.value)
  }, 400)
})

watch(selectedCategoryId, (newVal) => {
  fetchProducts(searchQuery.value, newVal)
})

const handleSearchEnter = (e) => {
  const query = searchQuery.value.trim()
  if (!query) return
  
  // If it looks like a barcode (only digits and 5-18 chars)
  if (/^\d{5,18}$/.test(query)) {
    emit('scan', query)
    searchQuery.value = ''
  } else {
    e.target.select()
  }
}

onMounted(async () => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
</style>


