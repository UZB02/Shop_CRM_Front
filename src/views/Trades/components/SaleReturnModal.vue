<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div v-if="visible" class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
        <!-- Minimalist Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 dark:bg-[#040814]/80 backdrop-blur-sm transition-opacity" @click="close"></div>
        
        <!-- Premium Modal Wrapper -->
        <div class="relative w-full max-w-[900px] bg-white dark:bg-[#0f1524] rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 flex flex-col max-h-[92vh]">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-white/[0.02]">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-[12px] bg-rose-50 dark:bg-[#131d31] flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/10 shadow-sm">
                <i class="pi pi-refresh text-lg"></i>
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-3">
                  <h2 class="text-sm font-bold text-slate-800 dark:text-white leading-none">TOVARNI QAYTARISH</h2>
                  <span v-if="initialSale" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-none">SAVDO #{{ initialSale.id }} ASOSIDA</span>
                </div>
              </div>
            </div>
            
            <button 
              @click="close"
              class="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95 border border-transparent dark:border-white/5"
            >
              <i class="pi pi-times text-[11px] font-bold"></i>
            </button>
          </div>

          <!-- Layout Body -->
          <div class="flex flex-col md:flex-row flex-grow overflow-hidden relative">
            
            <!-- Left Side: Items Selection -->
            <div class="flex-grow p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar h-full">
              
              <!-- Product Search (Only if not from specific sale) -->
              <div v-if="!initialSale" class="space-y-2">
                <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Mahsulotlarni qidirish</h3>
                <div class="relative group">
                  <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input 
                    v-model="productQuery"
                    type="text"
                    placeholder="Nomi yoki barkodi bo'yicha..."
                    class="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-transparent border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/50 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
                    @input="onSearchProducts"
                  />
                  <!-- Search Results Dropdown -->
                  <div v-if="searchResults.length" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#131d31] rounded-[16px] shadow-xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
                    <div 
                      v-for="p in searchResults" 
                      :key="p.id"
                      @click="addProduct(p)"
                      class="p-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer flex justify-between items-center transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-800 dark:text-white">{{ p.name }}</span>
                        <span class="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Qoldiq: {{ p.quantity }} {{ p.unit }}</span>
                      </div>
                      <span class="text-[11px] font-black text-slate-900 dark:text-emerald-400">{{ formatCurrency(p.selling_price) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Initial Sale Items List -->
              <div v-if="initialSale" class="space-y-3">
                 <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Savdodagi mahsulotlar</h3>
                 <div class="grid grid-cols-1 gap-2.5">
                    <div v-for="item in initialSale.items" :key="item.id" 
                         class="p-3 rounded-[14px] border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/[0.02] shadow-sm transition-all group">
                       <div class="flex flex-col">
                         <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ item.product_name }}</span>
                         <span class="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Sotilgan: {{ parseFloat(item.quantity) }} {{ item.unit }} <span class="mx-1 text-slate-300 dark:text-slate-600">|</span> Narxi: {{ formatCurrency(item.unit_price) }}</span>
                       </div>
                       <button 
                         @click="addFromSale(item)"
                         :disabled="isAlreadyAdded(item.product_id || item.product)"
                         class="h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                disabled:opacity-50 disabled:grayscale 
                                bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white 
                                border border-emerald-100 dark:border-emerald-500/10"
                       >
                         {{ isAlreadyAdded(item.product_id || item.product) ? 'Qo\'shilgan' : 'Tanlash' }}
                       </button>
                    </div>
                 </div>
              </div>

              <!-- Selected Items (The Return Cart) -->
              <div class="mt-2 flex-grow flex flex-col min-h-0">
                <div class="flex items-center justify-between mb-3 shrink-0">
                  <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Qaytariladigan mahsulotlar</h3>
                  <span class="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md border border-rose-100 dark:border-rose-500/10 leading-none">{{ returnItems.length }} xil</span>
                </div>
                
                <div class="space-y-2.5 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                  <div v-if="!returnItems.length" class="h-full flex flex-col items-center justify-center opacity-40 py-16">
                    <i class="pi pi-box text-3xl mb-3 dark:text-slate-500"></i>
                    <p class="text-[11px] font-bold dark:text-slate-400">Hech narsa tanlanmagan</p>
                  </div>

                  <div v-for="(item, idx) in returnItems" :key="idx" 
                       class="group flex items-center gap-3 p-3 rounded-[14px] transition-all duration-200 border border-slate-100 dark:border-white/5 bg-white dark:bg-transparent shadow-sm">
                    <div class="w-9 h-9 rounded-[10px] bg-slate-50 dark:bg-[#1a2333] flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-200/50 dark:border-white/5">
                      <i class="pi pi-box text-xs"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                      <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mb-0.5">{{ item.product_name }}</h4>
                      <p class="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Birlik: {{ formatCurrency(item.unit_price) }}</p>
                    </div>
                    
                    <div class="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-slate-50 dark:bg-[#131d31] rounded-lg border border-slate-100 dark:border-white/5">
                       <button @click="updateQty(idx, -1)" class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition-colors">
                         <i class="pi pi-minus text-[8px] font-bold"></i>
                       </button>
                       <input 
                         v-model="item.quantity"
                         type="number" 
                         step="0.01"
                         class="w-12 h-6 bg-transparent text-center text-xs font-black text-slate-800 dark:text-white focus:outline-none"
                       />
                       <button @click="updateQty(idx, 1)" class="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-white/5 text-slate-400 hover:text-emerald-500 transition-colors">
                         <i class="pi pi-plus text-[8px] font-bold"></i>
                       </button>
                    </div>

                    <div class="w-20 text-right shrink-0">
                      <span class="text-[12px] font-black text-slate-900 dark:text-white leading-none">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
                    </div>

                    <button @click="removeItem(idx)" class="w-7 h-7 rounded-lg text-slate-300 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 shrink-0 flex items-center justify-center ml-1">
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Confirmation & Details -->
            <div class="w-full md:w-[320px] lg:w-[340px] bg-[#f8fafc]/50 dark:bg-[#0c121e] border-l border-slate-100 dark:border-white/5 flex flex-col shrink-0">
              <div class="flex-grow flex flex-col gap-6 overflow-y-auto custom-scrollbar p-6">
                
                <!-- Customer Section -->
                <div v-if="!initialSale" class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Mijoz (Ixtiyoriy)</label>
                  <div class="relative group">
                    <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <select 
                      v-model="selectedCustomerId" 
                      class="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#131d31] border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 appearance-none transition-all text-slate-800 dark:text-slate-200 shadow-sm"
                    >
                      <option :value="null">Noma'lum mijoz</option>
                      <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.full_name }}</option>
                    </select>
                    <i class="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 text-[9px] pointer-events-none"></i>
                  </div>
                </div>
                <!-- Customer Display (Static) -->
                <div v-else class="p-3 rounded-[14px] bg-white dark:bg-[#131d31] border border-slate-100 dark:border-white/5 shadow-sm">
                   <h5 class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Mijoz</h5>
                   <div class="flex items-center gap-2.5 px-1 pb-1">
                     <div class="w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                        <i class="pi pi-user text-[10px] text-rose-500"></i>
                     </div>
                     <span class="text-[12px] font-bold text-slate-800 dark:text-slate-200">{{ initialSale.customer_name || 'Noma\'lum mijoz' }}</span>
                   </div>
                </div>

                <!-- Reason Section -->
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Qaytarish Sababi</label>
                  <textarea 
                    v-model="reason"
                    placeholder="Masalan: Mahsulot nuqsonli chiqqan..."
                    class="w-full min-h-[90px] p-3.5 bg-white dark:bg-[#131d31] border border-slate-200 dark:border-white/10 rounded-[14px] text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none shadow-sm placeholder-slate-400"
                  ></textarea>
                </div>

                <!-- Spacer -->
                <div class="flex-grow"></div>

                <!-- Total Amount Summary & Finalize -->
                <div class="space-y-4">
                  <div class="space-y-3 px-1">
                     <h3 class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Jami summa</h3>
                     <div class="flex justify-between items-baseline pt-1">
                        <span class="text-[24px] font-black text-slate-900 dark:text-white tracking-tighter leading-none">{{ formatCurrency(totalAmount) }}</span>
                     </div>
                  </div>

                  <button 
                    @click="submitReturn"
                    :disabled="loading || !returnItems.length"
                    class="w-full h-12 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500/90 dark:hover:bg-rose-500 disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 text-white rounded-[14px] text-xs font-black uppercase tracking-widest transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2 border border-rose-600/20 leading-none"
                  >
                    <i v-if="loading" class="pi pi-spinner pi-spin"></i>
                    <i v-else class="pi pi-check-circle"></i>
                    Tasdiqlash va Qaytarish
                  </button>
                  <p class="text-[9px] font-medium text-slate-400 dark:text-slate-500 text-center leading-relaxed">"Tasdiqlash" tugmasini bossangiz, mahsulotlar stokga qaytadi va tranzaksiya saqlanadi.</p>
                </div>

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
      product: saleItem.product_id || saleItem.product,
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
    reason: reason.value || undefined,
    items: returnItems.value.map(it => ({
      product: it.product,
      quantity: it.quantity.toString(),
      unit_price: it.unit_price.toString()
    }))
  }
  
  if (props.initialSale?.id) payload.sale = props.initialSale.id
  if (selectedCustomerId.value) payload.customer = selectedCustomerId.value

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
