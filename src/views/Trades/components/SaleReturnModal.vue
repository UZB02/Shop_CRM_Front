<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="visible" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" @click="close"></div>
        
        <div class="relative w-full max-w-[900px] bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                <i class="pi pi-refresh text-xl"></i>
              </div>
              <div>
                <h2 class="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase">Tovarni Qaytarish</h2>
                <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  {{ initialSale ? `Savdo #${initialSale.id} asosida` : 'Erkin qaytarish' }}
                </p>
              </div>
            </div>
            <button @click="close" class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-all">
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>

          <div class="flex flex-col md:flex-row flex-grow overflow-hidden">
            <!-- Left Side: Items Selection -->
            <div class="flex-grow p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              
              <!-- Product Search (Only if not from specific sale) -->
              <div v-if="!initialSale" class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mahsulotlarni qidirish</label>
                <div class="relative group">
                  <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input 
                    v-model="productQuery"
                    type="text"
                    placeholder="Nomi yoki barkodi bo'yicha..."
                    class="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    @input="onSearchProducts"
                  />
                  <!-- Search Results Dropdown -->
                  <div v-if="searchResults.length" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                    <div 
                      v-for="p in searchResults" 
                      :key="p.id"
                      @click="addProduct(p)"
                      class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 dark:border-slate-750 last:border-0"
                    >
                      <div class="flex flex-col">
                        <span class="text-[13px] font-bold text-slate-800 dark:text-white">{{ p.name }}</span>
                        <span class="text-[10px] text-slate-400">Qoldiq: {{ p.quantity }} {{ p.unit }}</span>
                      </div>
                      <span class="text-[12px] font-black text-slate-900 dark:text-emerald-400">{{ formatCurrency(p.selling_price) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Initial Sale Items List -->
              <div v-if="initialSale" class="space-y-4">
                 <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Savdodagi mahsulotlar</h3>
                 <div class="grid grid-cols-1 gap-2">
                    <div v-for="item in initialSale.items" :key="item.id" 
                         class="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-emerald-500/30 transition-all group">
                       <div class="flex flex-col">
                         <span class="text-[13px] font-bold text-slate-800 dark:text-white">{{ item.product_name }}</span>
                         <span class="text-[10px] text-slate-400">Sotilgan: {{ parseFloat(item.quantity) }} {{ item.unit }} | Narxi: {{ formatCurrency(item.unit_price) }}</span>
                       </div>
                       <button 
                        @click="addFromSale(item)"
                        :disabled="isAlreadyAdded(item.product_id)"
                        class="h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:grayscale transition-all"
                       >
                         {{ isAlreadyAdded(item.product_id) ? 'Qo\'shilgan' : 'Tanlash' }}
                       </button>
                    </div>
                 </div>
              </div>

              <!-- Selected Items (The Return Cart) -->
              <div class="mt-4 flex-grow flex flex-col min-h-0">
                <div class="flex items-center justify-between mb-4 px-1">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qaytariladigan mahsulotlar</h3>
                  <span class="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg">{{ returnItems.length }} xil</span>
                </div>
                
                <div class="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  <div v-if="!returnItems.length" class="h-full flex flex-col items-center justify-center opacity-30 py-20">
                    <i class="pi pi-box text-4xl mb-2"></i>
                    <p class="text-xs font-bold">Hech narsa tanlanmagan</p>
                  </div>

                  <div v-for="(item, idx) in returnItems" :key="idx" 
                       class="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 animate-in slide-in-from-left duration-200">
                    <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <i class="pi pi-box text-[10px]"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                      <h4 class="text-[12px] font-bold text-slate-800 dark:text-white truncate">{{ item.product_name }}</h4>
                      <p class="text-[9px] text-slate-400">Birlik narxi: {{ formatCurrency(item.unit_price) }}</p>
                    </div>
                    
                    <div class="flex items-center gap-2">
                       <button @click="updateQty(idx, -1)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
                         <i class="pi pi-minus text-[8px]"></i>
                       </button>
                       <input 
                         v-model="item.quantity"
                         type="number" 
                         step="0.01"
                         class="w-16 h-7 bg-transparent border-b border-slate-200 dark:border-slate-700 text-center text-[12px] font-black focus:outline-none focus:border-rose-500"
                       />
                       <button @click="updateQty(idx, 1)" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 transition-colors">
                         <i class="pi pi-plus text-[8px]"></i>
                       </button>
                    </div>

                    <div class="w-24 text-right">
                      <span class="text-[12px] font-black text-slate-900 dark:text-white">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
                    </div>

                    <button @click="removeItem(idx)" class="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 transition-colors">
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Confirmation & Details -->
            <div class="w-full md:w-[340px] bg-slate-50/50 dark:bg-slate-900/40 border-l border-slate-100 dark:border-slate-800 flex flex-col shrink-0 p-8 pt-6">
              
              <div class="flex-grow flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                <!-- Customer Section -->
                <div v-if="!initialSale" class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mijoz (Ixtiyoriy)</label>
                  <div class="relative group">
                    <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <select 
                      v-model="selectedCustomerId" 
                      class="w-full h-12 pl-11 pr-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 appearance-none transition-all"
                    >
                      <option :value="null">Noma'lum mijoz</option>
                      <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.full_name }}</option>
                    </select>
                    <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] pointer-events-none"></i>
                  </div>
                </div>
                <div v-else class="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <h5 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mijoz</h5>
                   <div class="flex items-center gap-2">
                     <i class="pi pi-user text-xs text-rose-500"></i>
                     <span class="text-[12px] font-bold">{{ initialSale.customer_name || 'Noma\'lum mijoz' }}</span>
                   </div>
                </div>

                <!-- Reason Section -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qaytarish Sababi</label>
                  <textarea 
                    v-model="reason"
                    placeholder="Masalan: Mahsulot nuqsonli chiqqan..."
                    class="w-full min-h-[100px] p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-2xl text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                  ></textarea>
                </div>

                <!-- Total Amount Summary -->
                <div class="p-6 bg-slate-900 rounded-[24px] text-white shadow-xl shadow-slate-900/10 dark:shadow-rose-500/5 mt-auto">
                   <div class="flex flex-col gap-1 mb-4">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami Qaytarish Summasi</span>
                     <span class="text-3xl font-black text-white tracking-tighter">{{ formatCurrency(totalAmount) }}</span>
                   </div>
                   <div class="space-y-2 pt-4 border-t border-white/10">
                     <div class="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Pozitsiyalar</span>
                        <span>{{ returnItems.length }} ta</span>
                     </div>
                     <div class="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Filial</span>
                        <span>Joriy filial</span>
                     </div>
                   </div>
                </div>
              </div>

              <!-- Finalize Button -->
              <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  @click="submitReturn"
                  :disabled="loading || !returnItems.length"
                  class="w-full h-14 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl text-[14px] font-black transition-all hover:shadow-lg hover:shadow-rose-500/30 active:scale-95 flex items-center justify-center gap-3"
                >
                  <i v-if="loading" class="pi pi-spinner pi-spin"></i>
                  <i v-else class="pi pi-check-circle"></i>
                  Tasdiqlash va Qaytarish
                </button>
                <p class="text-[9px] font-medium text-slate-400 text-center mt-3 px-4">"Tasdiqlash" tugmasini bossangiz, mahsulotlar stokga qaytadi va tranzaksiya saqlanadi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { productsAPI, customersAPI } from '@/services/api'
import { useSaleReturns } from '../composables/useSaleReturns'
import { useSettingsStore } from '@/store/settings'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: Boolean,
  initialSale: Object
})

const emit = defineEmits(['update:visible', 'success'])

const settingsStore = useSettingsStore()
const toast = useToast()
const { createReturn, loading } = useSaleReturns()

const productQuery = ref('')
const searchResults = ref([])
const returnItems = ref([])
const reason = ref('')
const selectedCustomerId = ref(null)
const customers = ref([])

const formatCurrency = (val) => settingsStore.formatPrice(val)

const totalAmount = computed(() => {
  return returnItems.value.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
})

// Lifecycle & Init
watch(() => props.visible, (newVal) => {
  if (newVal) {
    reason.value = ''
    returnItems.value = []
    productQuery.value = ''
    searchResults.value = []
    
    if (props.initialSale) {
      selectedCustomerId.value = props.initialSale.customer_id
    } else {
      selectedCustomerId.value = null
      loadCustomers()
    }
  }
})

const loadCustomers = async () => {
    try {
        const response = await customersAPI.getAll({ page_size: 100 })
        customers.value = response.data.results || []
    } catch (e) {
        console.error('Failed to load customers')
    }
}

// Search Logic
let searchTimeout = null
const onSearchProducts = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!productQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      const response = await productsAPI.getAll({ search: productQuery.value, page_size: 5 })
      searchResults.value = response.data.results || []
    } catch (e) {
      console.error('Search failed')
    }
  }, 400)
}

// Add Item Logic
const addProduct = (p) => {
  const existing = returnItems.value.find(item => item.product === p.id)
  if (existing) {
    existing.quantity += 1
  } else {
    returnItems.value.push({
      product: p.id,
      product_name: p.name,
      quantity: 1,
      unit_price: p.selling_price,
      unit: p.unit
    })
  }
  productQuery.value = ''
  searchResults.value = []
}

const addFromSale = (saleItem) => {
    returnItems.value.push({
      product: saleItem.product_id,
      product_name: saleItem.product_name,
      quantity: parseFloat(saleItem.quantity),
      unit_price: parseFloat(saleItem.unit_price),
      unit: saleItem.unit || 'dona',
      max_qty: parseFloat(saleItem.quantity) // Track original qty to prevent over-returning if needed
    })
}

const isAlreadyAdded = (productId) => {
    return returnItems.value.some(item => item.product === productId)
}

const removeItem = (idx) => {
  returnItems.value.splice(idx, 1)
}

const updateQty = (idx, delta) => {
  const item = returnItems.value[idx]
  const newVal = parseFloat(item.quantity) + delta
  if (newVal > 0) {
    item.quantity = newVal
  }
}

const submitReturn = async () => {
  if (!returnItems.value.length) return
  
  const payload = {
    sale: props.initialSale?.id || null,
    customer: selectedCustomerId.value,
    reason: reason.value,
    items: returnItems.value.map(it => ({
      product: it.product,
      quantity: it.quantity.toString(),
      unit_price: it.unit_price.toString()
    }))
  }

  try {
    await createReturn(payload)
    emit('success')
    close()
  } catch (e) {
    // Error handled in composable toast
  }
}

const close = () => {
  emit('update:visible', false)
}

const formatDate = (d) => new Date(d).toLocaleString()

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }

.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
