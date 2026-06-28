<template>
  <div class="space-y-3">
    <!-- Results Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
      <!-- Table toolbar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
        <div class="relative flex-shrink-0">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            @focus="$event.target.select()"
            :placeholder="$t('warehouse.detail.search_products')"
            class="h-8 pl-8 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 w-64 transition-all"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-start md:justify-end flex-1">
          <!-- Jami zaxira tannarxi -->
          <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl">
            <span class="text-[9px] font-black text-emerald-600/70 dark:text-emerald-400/60 uppercase tracking-[0.12em]">Zaxira tannarxi</span>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 font-outfit">{{ settingsStore.formatPrice(totalStockValue) }}</span>
          </div>

          <!-- Jami sotish qiymati -->
          <div class="flex items-center gap-2 px-3 py-1 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 rounded-xl">
            <span class="text-[9px] font-black text-blue-600/70 dark:text-blue-400/60 uppercase tracking-[0.12em]">Sotish qiymati</span>
            <span class="text-xs font-black text-blue-600 dark:text-blue-400 font-outfit">{{ settingsStore.formatPrice(totalSaleValue) }}</span>
          </div>

          <div class="text-[12px] font-bold text-slate-400 tracking-widest pl-1">
            {{ filteredProducts?.length || 0 }} / {{ products?.length || 0 }} {{ $t('products.title') }}
          </div>
        </div>
      </div>
      <div v-if="!filteredProducts?.length" class="flex flex-col items-center justify-center py-20 opacity-40 text-center">
        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
          <i class="pi pi-inbox text-slate-400 text-lg"></i>
        </div>
        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
           {{ products?.length ? $t('common.no_results') : $t('stores.branch_detail.no_products') }}
        </p>
      </div>
      <div v-else class="w-full">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left min-w-[700px]">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap w-10">№</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.col_product') }}</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.form.barcode') }}</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center">{{ $t('products.form.amount') }}</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('products.form.purchase_price') }}</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('products.col_price') }}</th>
                <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center">{{ $t('common.created_at') }}</th>
                <th v-if="settingsStore.isWastageEnabled" class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center w-12">{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr v-for="(product, index) in filteredProducts" :key="product.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                <td class="px-4 py-2 text-[12px] text-slate-400">{{ index + 1 }}</td>
                <td class="px-4 py-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                      <i v-else class="pi pi-image text-slate-300 text-[12px]"></i>
                    </div>
                    <div class="flex flex-col min-w-0">
                      <div class="flex items-center flex-wrap gap-2">
                        <span class="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors truncate max-w-[180px]">
                          {{ product.name }}
                        </span>
                          <TurBadge :tur-name="product.tur_name" :tur-color="product.tur_color" />
                      </div>
                      <span class="text-[11px] text-slate-400 tracking-widest mt-0.5">{{ product.category_name }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2">
                  <div class="flex items-center gap-2">
                    <code class="text-[12px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                      {{ product.barcode || '—' }}
                    </code>
                    <button 
                      v-if="product.barcode"
                      @click="showBarcode(product)"
                      class="w-5 h-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                      v-tooltip.right="$t('products.view_barcode') || 'Shtrix-kodni ko\'rish'"
                    >
                      <i class="pi pi-barcode text-[12px]"></i>
                    </button>
                  </div>
                </td>
                <td class="px-4 py-2 text-center text-[12px]">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
                    :class="product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'"
                  >
                    {{ product.quantity }} <span class="ml-1 opacity-60 font-medium">{{ $t('common.pcs') || 'dona' }}</span>
                  </span>
                </td>
                <td class="px-4 py-2 text-right">
                  <span class="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
                    {{ Number(product.purchase_price).toLocaleString() }}
                  </span>
                </td>
                <td class="px-4 py-2 text-right">
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                    {{ Number(product.sale_price).toLocaleString() }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {{ product.added_on || '—' }}
                </td>
                <td v-if="settingsStore.isWastageEnabled" class="px-4 py-2 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button 
                      @click="$emit('create-wastage', product)"
                      v-tooltip.left="$t('warehouse.wastage.create_title')"
                      class="w-7 h-7 rounded-lg bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-90"
                    >
                      <i class="pi pi-exclamation-circle text-[11px]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          <div 
            v-for="(product, index) in filteredProducts" 
            :key="`mob-${product.id}`" 
            class="p-4 bg-white dark:bg-slate-900 transition-colors"
          >
            <!-- Header: Image, Title, Category, Badge -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                  <i v-else class="pi pi-image text-slate-300 text-[14px]"></i>
                </div>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center flex-wrap gap-1.5 mb-0.5">
                    <h4 class="text-[14px] font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">{{ product.name }}</h4>
                    <TurBadge :tur-name="product.tur_name" :tur-color="product.tur_color" />
                  </div>
                  <span class="text-[11px] font-bold text-slate-400 tracking-widest uppercase">{{ product.category_name }}</span>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-1">
                <button 
                  v-if="settingsStore.isWastageEnabled"
                  @click="$emit('create-wastage', product)"
                  class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                >
                  <i class="pi pi-exclamation-circle text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Barcode & Quantity -->
            <div class="flex items-center justify-between mb-3 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <div class="flex items-center gap-2">
                <code class="text-[11px] font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                  {{ product.barcode || '—' }}
                </code>
                <button 
                  v-if="product.barcode"
                  @click="showBarcode(product)"
                  class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 active:scale-90 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <i class="pi pi-barcode text-[11px]"></i>
                </button>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('products.form.amount') }}</span>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-lg font-bold text-[13px]"
                  :class="product.quantity > 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'"
                >
                  {{ product.quantity }} <span class="ml-1 opacity-60 font-medium text-[10px]">{{ $t('common.pcs') || 'dona' }}</span>
                </span>
              </div>
            </div>

            <!-- Pricing Grid -->
            <div class="grid grid-cols-2 gap-4 items-center">
              <div>
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('products.form.purchase_price') }}</span>
                <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400">{{ Number(product.purchase_price).toLocaleString() }} <span class="text-[9px] font-medium opacity-70">UZS</span></span>
              </div>
              <div class="text-right">
                <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('products.col_price') }}</span>
                <span class="text-[14px] font-black text-slate-800 dark:text-slate-100">{{ Number(product.sale_price).toLocaleString() }} <span class="text-[9px] font-bold text-slate-400">UZS</span></span>
              </div>
            </div>
          </div>
        </div>
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
      <div v-if="selectedProduct" class="p-8 flex flex-col items-center gap-6 w-full max-w-md min-w-[400px] sm:min-w-[460px]">
        <!-- Header -->
        <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <i class="pi pi-barcode text-sm"></i>
            </div>
            <div class="text-left">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">Shtrix-kod</h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skanerlash kodi</p>
            </div>
          </div>
          <button @click="barcodeVisible = false" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </div>
        
        <!-- Crisp Barcode Image Container -->
        <div class="w-full bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center">
          <div class="bg-white p-4 rounded-2xl border border-slate-100/80 flex items-center justify-center w-full min-h-[260px] overflow-hidden">
            <img 
              :src="selectedProduct.barcode_image_url" 
              class="w-full max-w-[420px] h-auto max-h-[230px] object-contain mix-blend-multiply scale-[1.08]" 
              alt="Barcode" 
            />
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex gap-3 w-full">
          <button 
            @click="downloadBarcode"
            class="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i class="pi pi-download text-xs"></i>
            Yuklab olish
          </button>
          <button 
            @click="printBarcode(selectedProduct)"
            class="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-slate-950 border-none text-white text-[11px] font-black tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-none"
          >
            <i class="pi pi-print text-xs"></i>
            Chop etish
          </button>
        </div>
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

const totalStockValue = computed(() => {
  if (!props.products) return 0
  return props.products.reduce((acc, p) => acc + ((parseFloat(p.purchase_price) || 0) * (parseFloat(p.quantity) || 0)), 0)
})

const totalSaleValue = computed(() => {
  if (!props.products) return 0
  return props.products.reduce((acc, p) => acc + ((parseFloat(p.sale_price) || 0) * (parseFloat(p.quantity) || 0)), 0)
})

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

const printBarcode = (product) => {
  if (!product) return
  const printWindow = window.open('', '_blank')
  const barcodeImgUrl = product.barcode_image_url

  printWindow.document.write(`
    <html>
      <head>
        <title>Shtrix-kod</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #fff;
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="\${barcodeImgUrl}" />
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
</script>