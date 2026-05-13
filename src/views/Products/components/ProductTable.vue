<template>
  <div class="space-y-4">
    <!-- Main Table Container -->
    <div class="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-4 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.col_product') }}</th>
              <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap text-center hidden md:table-cell">{{ $t('products.form.barcode') }}</th>
              <th class="px-4 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.col_price') }}</th>
              <th class="px-6 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap text-center hidden sm:table-cell">{{ $t('products.col_inventory') }}</th>
              <th class="px-4 py-3 text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('products.col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">

            <!-- Loading skeleton -->
            <tr v-if="loading" v-for="i in 8" :key="`sk-${i}`" class="animate-pulse">
              <td class="px-6 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0"></div>
                  <div class="space-y-1.5 w-full max-w-[140px]">
                    <div class="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div class="h-2 w-2/3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-3"><div class="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></td>
              <td class="px-6 py-3"><div class="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
              <td class="px-6 py-3"><div class="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></td>
              <td class="px-6 py-3"><div class="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div></td>
            </tr>

            <!-- Rows -->
            <tr
              v-else
              v-for="item in products"
              :key="item.id"
              class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all duration-200 border-b border-slate-50 dark:border-slate-800 last:border-none"
            >
              <!-- Product -->
              <td class="px-6 py-3.5">
                <div class="flex items-center gap-3">
                  <!-- Image Component -->
                  <div class="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden p-1 group-hover:scale-105 transition-transform">
                    <img
                      v-if="formatImageUrl(item.image) && !imageErrors[item.id]"
                      :src="formatImageUrl(item.image)"
                      @error="handleImageError(item.id)"
                      class="w-full h-full object-contain rounded-lg"
                      alt="Product Image"
                    />
                    <i v-else class="pi pi-image text-lg text-slate-200 dark:text-slate-600"></i>
                  </div>
                  
                  <!-- Text Information -->
                  <div class="min-w-0 flex flex-col justify-center">
                    <div class="flex items-center flex-wrap gap-2">
                      <router-link
                        :to="`/dashboard/products/${item.id}`"
                        class="text-[14px] font-black text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors tracking-tight leading-tight"
                      >
                        {{ item.name }}
                      </router-link>
                      
                      <div v-if="item.has_tur" class="flex items-center gap-1">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 tracking-widest uppercase">
                           {{ item.tur_name || $t('turlar.badge') }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-0.5 opacity-60">
                      <span v-if="item.category_name" class="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                        {{ item.category_name }}
                      </span>
                      <span v-if="item.barcode" class="md:hidden text-[11px] font-bold text-slate-500 tracking-tighter before:content-['#']">
                        {{ item.barcode }}
                      </span>
                      <span v-if="item.quantity !== undefined" class="sm:hidden text-[11px] font-bold" :class="Number(item.quantity) <= 0 ? 'text-rose-500' : 'text-slate-500'">
                        {{ item.quantity }} {{ item.unit_display }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Barcode -->
              <td class="px-6 py-3.5 align-middle text-center hidden md:table-cell">
                <div v-if="item.barcode" class="inline-flex items-center gap-2 group/barcode">
                   <i class="pi pi-barcode text-slate-300 dark:text-slate-700 group-hover/barcode:text-emerald-500 transition-colors text-[12px]"></i>
                   <code class="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-tight font-mono">{{ item.barcode }}</code>
                </div>
                <span v-else class="text-[11px] font-black text-slate-200 dark:text-slate-800 tracking-widest">—</span>
              </td>

              <!-- Price -->
              <td class="px-4 py-3.5 align-middle">
                  <template v-if="item.active_promotion">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-1">
                        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-600 line-through">{{ settingsStore.formatPrice(item.sale_price, item.currency_code) }}</span>
                        <span class="text-[9px] font-black text-rose-500 bg-rose-500/10 px-1 rounded">-{{ item.active_promotion.discount_pct }}%</span>
                      </div>
                      <span class="text-[14px] font-black text-slate-800 dark:text-white leading-tight">{{ settingsStore.formatPrice(item.active_promotion.discounted_price, item.currency_code) }}</span>
                    </div>
                  </template>

                  <template v-else>
                    <div class="flex flex-col">
                      <span class="text-[14px] font-black text-slate-800 dark:text-white leading-none">{{ settingsStore.formatPrice(item.sale_price, item.currency_code) }}</span>
                      <span class="text-[10px] font-bold text-slate-400 tracking-tighter mt-1 opacity-50">{{ item.unit_display || 'dona' }}</span>
                    </div>
                  </template>
              </td>

              <!-- Stock Quantity -->
              <td class="px-6 py-3.5 align-middle text-center hidden sm:table-cell">
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-[14px] font-black tracking-tight"
                      :class="(settingsStore.isLowStockEnabled && Number(item.quantity) <= (item.low_stock_threshold || settingsStore.lowStockThreshold)) ? 'text-rose-500' : 'text-slate-800 dark:text-white'"
                    >
                      {{ settingsStore.formatNumber(item.quantity) || 0 }}
                    </span>
                  </div>
                  <span class="text-[10px] font-black text-slate-400 tracking-widest mt-0.5 uppercase">{{ item.unit_display }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3.5 align-middle">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="router.push(`/dashboard/products/${item.id}`)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:text-sky-400 dark:hover:bg-sky-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Ko\'rish'"
                  >
                    <i class="pi pi-eye text-[16px]"></i>
                  </button>
                  <button
                    v-if="item.barcode"
                    @click="viewBarcode(item)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Shtrix-kod'"
                  >
                    <i class="pi pi-barcode text-[16px]"></i>
                  </button>
                  <button
                    @click="router.push(`/dashboard/products/edit/${item.id}`)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'Tahrirlash'"
                  >
                    <i class="pi pi-pencil text-[16px]"></i>
                  </button>
                  <button
                    @click="$emit('delete', item)"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-400/10 transition-all hover:scale-105"
                    v-tooltip.top="'O\'chirish'"
                  >
                    <i class="pi pi-trash text-[16px]"></i>
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
                <p class="text-[15px] text-slate-500 max-w-sm mx-auto">Hech qanday mahsulot topilmadi. Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.</p>
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
        :rowsPerPage="rowsPerPage"
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
  currentPage: { type: Number, default: 1 },
  rowsPerPage: { type: Number, default: 20 }
})

const { products } = toRefs(props)
const router = useRouter()
const settingsStore = useSettingsStore()

const {
  imageErrors, handleImageError, formatImageUrl,
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


