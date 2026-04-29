<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i class="pi pi-search text-[10px] text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
      </div>
      <input 
        v-model="searchQuery"
        type="text" 
        :placeholder="$t('customers.search_placeholder')"
        class="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm group-hover:shadow-md"
      />
      <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <button @click="searchQuery = ''" class="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400">
          <i class="pi pi-times text-[8px]"></i>
        </button>
      </div>
    </div>

    <!-- Results Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
      <div v-if="!filteredProducts?.length" class="flex flex-col items-center justify-center py-20 opacity-40 text-center">
        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
          <i class="pi pi-inbox text-slate-400 text-lg"></i>
        </div>
        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
           {{ products?.length ? $t('common.no_results') : $t('stores.branch_detail.no_products') }}
        </p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest w-10">№</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest">{{ $t('products.form.barcode') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest text-center">{{ $t('products.col_inventory') || 'Qoldiq' }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.col_price') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 tracking-widest text-center w-12">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="(product, index) in filteredProducts" :key="product.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
              <td class="px-4 py-2 text-[10px] text-slate-400">{{ index + 1 }}</td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                    <i v-else class="pi pi-image text-slate-300 text-[10px]"></i>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center flex-wrap gap-2">
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors truncate max-w-[180px]">
                        {{ product.name }}
                      </span>
                        <TurBadge :tur-name="product.tur_name" :tur-color="product.tur_color" />
                    </div>
                    <span class="text-[9px] text-slate-400 tracking-widest mt-0.5">{{ product.category_name }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <code class="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    {{ product.barcode || '—' }}
                  </code>
                  <button 
                    v-if="product.barcode"
                    @click="showBarcode(product)"
                    class="w-5 h-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                    v-tooltip.right="$t('products.view_barcode') || 'Shtrix-kodni ko\'rish'"
                  >
                    <i class="pi pi-barcode text-[10px]"></i>
                  </button>
                </div>
              </td>
              <td class="px-4 py-2 text-center text-[10px]">
                <span 
                  class="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
                  :class="product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'"
                >
                  {{ product.quantity }} <span class="ml-1 opacity-60 font-medium">{{ $t('common.pcs') || 'dona' }}</span>
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  {{ Number(product.sale_price).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button 
                    v-if="settingsStore.isWastageEnabled"
                    @click="$emit('create-wastage', product)"
                    v-tooltip.left="$t('warehouse.wastage.create_title')"
                    class="w-7 h-7 rounded-lg bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-90"
                  >
                    <i class="pi pi-exclamation-circle text-[9px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Barcode Dialog -->
    <Dialog 
      v-model:visible="barcodeVisible" 
      modal 
      class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border-none !shadow-2xl" 
      header=" "
      :showHeader="false"
      pt:mask:class="backdrop-blur-sm bg-black/40"
    >
      <div v-if="selectedProduct" class="p-8 flex flex-col items-center gap-6 min-w-[320px]">
        <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="text-left">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ selectedProduct.name }}</h3>
            <p class="text-[10px] font-bold text-emerald-500 tracking-[0.2em]">{{ selectedProduct.barcode }}</p>
          </div>
          <button @click="barcodeVisible = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-inner border border-slate-100">
          <img :src="selectedProduct.barcode_image_url" class="max-w-full h-auto" />
        </div>
        
        <button 
          @click="downloadBarcode"
          class="w-full py-3 rounded-xl bg-slate-900 border-none text-white text-[10px] font-black tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-download"></i>
          Yuklab olish (PNG)
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import { useSettingsStore } from '@/store/settings'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  products: Array
})

const emit = defineEmits(['create-wastage'])

const settingsStore = useSettingsStore()
const barcodeVisible = ref(false)
const selectedProduct = ref(null)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.products
  
  return props.products?.filter(p => 
    (p.name || '').toLowerCase().includes(q) ||
    (p.barcode || '').toLowerCase().includes(q) ||
    (p.category_name || '').toLowerCase().includes(q)
  ) || []
})

const showBarcode = (product) => {
  selectedProduct.value = product
  barcodeVisible.value = true
}

const downloadBarcode = async () => {
  if (!selectedProduct.value?.barcode_image_url) return
  
  try {
    const response = await fetch(selectedProduct.value.barcode_image_url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `barcode_${selectedProduct.value.barcode || selectedProduct.value.id}.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Download error:', error)
  }
}
</script>
