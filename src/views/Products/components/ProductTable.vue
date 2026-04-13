<template>
  <div class="space-y-4">
    <!-- Main Table Container -->
    <div class="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-[#0b1120]/50 border-b border-slate-200 dark:border-slate-800/60">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">{{ $t('products.col_product') }}</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">{{ $t('products.form.barcode') }}</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">{{ $t('products.col_price') }}</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">{{ $t('products.col_inventory') }}</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">{{ $t('products.col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">

            <!-- Loading skeleton -->
            <tr v-if="loading" v-for="i in 8" :key="`sk-${i}`" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                  <div class="space-y-2 w-full max-w-[140px]">
                    <div class="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div class="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><div class="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div class="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div class="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </td>
              <td class="px-6 py-4"><div class="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
              <td class="px-6 py-4"><div class="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div></td>
            </tr>

            <!-- Rows -->
            <tr
              v-else
              v-for="item in products"
              :key="item.id"
              class="group hover:bg-slate-50/80 dark:hover:bg-[#131c31]/50 transition-colors duration-200"
            >
              <!-- Product -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <!-- Image Component -->
                  <div class="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden p-1 transition-transform duration-300 group-hover:scale-105">
                    <img
                      v-if="formatImageUrl(item.image) && !imageErrors[item.id]"
                      :src="formatImageUrl(item.image)"
                      @error="handleImageError(item.id)"
                      class="w-full h-full object-contain rounded-lg"
                      alt="Product Image"
                    />
                    <i v-else class="pi pi-image text-xl text-slate-300 dark:text-slate-500"></i>
                  </div>
                  
                  <!-- Status Indicator floating top right of image relative container (not wrapper) -->
                  <div
                    v-if="item.status === 'active'"
                    class="absolute -translate-y-[8px] -translate-x-[16px] w-[11px] h-[11px] bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full z-10 hidden"
                  ></div>

                  <!-- Text Information -->
                  <div class="min-w-0 flex flex-col justify-center">
                    <router-link
                      :to="`/dashboard/products/${item.id}`"
                      class="text-[15px] font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 block truncate transition-colors"
                    >
                      {{ item.name }}
                    </router-link>
                    
                    <div class="flex items-center gap-2 mt-1">
                      <span v-if="item.category_name" class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 dark:ring-emerald-500/30">
                        {{ item.category_name }}
                      </span>
                      <span v-if="item.subcategory_name && settingsStore.isSubcategoryEnabled" class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                        {{ item.subcategory_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Barcode -->
              <td class="px-6 py-4 align-middle">
                <div v-if="item.barcode" class="inline-flex items-center font-mono text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50">
                   {{ item.barcode }}
                </div>
                <span v-else class="text-sm text-slate-400 dark:text-slate-500">—</span>
              </td>

              <!-- Price -->
              <td class="px-6 py-4 align-middle">
                <!-- If there is a promotion -->
                  <template v-if="item.active_promotion">
                  <div class="flex flex-col">
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-500 line-through">{{ formatNumber(item.sale_price) }}</span>
                      <span class="text-xs font-semibold text-rose-500 dark:text-rose-400">(-{{ item.active_promotion.discount_pct }}%)</span>
                    </div>
                    <div class="flex items-baseline gap-1 mt-0.5">
                      <span class="text-xs font-medium text-slate-400">{{ item.currency_code || settingsStore.currency }}</span>
                      <span class="text-base font-bold text-slate-900 dark:text-white">{{ formatNumber(item.active_promotion.discounted_price) }}</span>
                    </div>
                  </div>
                </template>

                <!-- Normal Price -->
                <template v-else>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-xs font-medium text-slate-400 dark:text-slate-400">{{ item.currency_code || settingsStore.currency }}</span>
                    <span class="text-base font-bold text-slate-900 dark:text-white">{{ formatNumber(item.sale_price) }}</span>
                  </div>
                </template>

                <div v-if="item.unit_display" class="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  1 {{ item.unit_display }} uchun
                </div>
              </td>

              <!-- Stock Quantity -->
              <td class="px-6 py-4 align-middle">
                <div class="flex flex-col">
                  <span 
                    class="text-[15px] font-black tracking-tight"
                    :class="(settingsStore.get.low_stock_enabled && Number(item.quantity) <= (item.low_stock_threshold || settingsStore.get.low_stock_threshold || 5)) ? 'text-rose-500' : 'text-slate-900 dark:text-white'"
                  >
                    {{ formatNumber(item.quantity) || 0 }}
                  </span>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ item.unit_display }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 align-middle">
                <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="router.push(`/dashboard/products/${item.id}`)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:text-sky-400 dark:hover:bg-sky-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Ko\'rish'"
                  >
                    <i class="pi pi-eye text-[15px]"></i>
                  </button>
                  <button
                    v-if="item.barcode"
                    @click="viewBarcode(item)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Shtrix-kod'"
                  >
                    <i class="pi pi-barcode text-[15px]"></i>
                  </button>
                  <button
                    @click="router.push(`/dashboard/products/edit/${item.id}`)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Tahrirlash'"
                  >
                    <i class="pi pi-pencil text-[15px]"></i>
                  </button>
                  <button
                    @click="$emit('delete', item)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'O\'chirish'"
                  >
                    <i class="pi pi-trash text-[15px]"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!loading && products.length === 0">
              <td colspan="5" class="py-24 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                  <i class="pi pi-box text-2xl text-slate-300 dark:text-slate-600"></i>
                </div>
                <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{{ $t('products.not_found') }}</h3>
                <p class="text-[13px] text-slate-500 max-w-sm mx-auto">Hech qanday mahsulot topilmadi. Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Barcode Modal -->
    <ProductBarcodeModal
      :visible="showBarcodeModal"
      :product="selectedBarcodeItem"
      :barcodeUrl="barcodeUrl"
      :loading="barcodeLoading"
      :error="barcodeError"
      @close="closeBarcodeModal"
      @download="downloadBarcode"
      @print="printBarcode"
    />

    <!-- Pagination -->
    <div class="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm flex items-center justify-between">
      <TablePagination
        :currentPage="currentPage"
        :totalRecords="totalRecords"
        @page-change="$emit('page-change', $event)"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/store/settings'
import ProductBarcodeModal from './ProductBarcodeModal.vue'
import TablePagination from '@/components/TablePagination.vue'
import { useProductTable } from '../composables/useProductTable'

const props = defineProps({
  products: Array,
  loading: Boolean,
  totalRecords: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 }
})

const { products } = toRefs(props)
const router = useRouter()
const settingsStore = useSettingsStore()

const {
  imageErrors, handleImageError, formatNumber, formatImageUrl,
  showBarcodeModal, selectedBarcodeItem, barcodeUrl, barcodeLoading, barcodeError,
  viewBarcode, closeBarcodeModal, downloadBarcode, printBarcode
} = useProductTable(products)

defineEmits(['edit', 'delete', 'page-change'])
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
.dark .overflow-x-auto::-webkit-scrollbar-thumb { background: #334155; }
</style>
