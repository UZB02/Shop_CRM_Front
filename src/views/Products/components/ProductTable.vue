<template>
  <div class="space-y-3">

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ $t('products.col_product') }}</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ $t('products.form.barcode') }}</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ $t('products.col_price') }}</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">{{ $t('products.col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">

            <!-- Loading skeleton -->
            <tr v-if="loading" v-for="i in 8" :key="`sk-${i}`" class="animate-pulse">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0"></div>
                  <div class="space-y-1.5">
                    <div class="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div class="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5"><div class="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
              <td class="px-5 py-3.5"><div class="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
              <td class="px-5 py-3.5"><div class="h-7 w-20 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div></td>
            </tr>

            <!-- Rows -->
            <tr
              v-else
              v-for="item in products"
              :key="item.id || item._id"
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <!-- Product -->
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <!-- Image -->
                  <div class="relative shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                      <img
                        v-if="formatImageUrl(item.image) && !imageErrors[item.id]"
                        :src="formatImageUrl(item.image)"
                        @error="handleImageError(item.id)"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="pi pi-image text-slate-300 dark:text-slate-600"></i>
                    </div>
                    <div
                      v-if="item.status === 'active'"
                      class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                    ></div>
                  </div>
                  <!-- Info -->
                  <div class="min-w-0">
                    <router-link
                      :to="`/dashboard/products/${item.id || item._id}`"
                      class="font-medium text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate block"
                    >{{ item.name }}</router-link>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        {{ item.category_name }}
                      </span>
                      <span v-if="item.subcategory_name" class="text-[10px] text-slate-400 truncate max-w-[100px]">
                        {{ item.subcategory_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Barcode -->
              <td class="px-5 py-3">
                <code v-if="item.barcode" class="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                   {{ item.barcode }}
                </code>
                <span v-else class="text-xs text-slate-300 dark:text-slate-600 italic">—</span>
              </td>

              <!-- Price -->
              <td class="px-5 py-3">
                <div class="flex items-baseline gap-1">
                  <span class="text-xs text-slate-400 font-medium">{{ item.currency_code || 'UZS' }}</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{ formatNumber(item.sale_price) }}</span>
                </div>
                <div v-if="item.unit_display" class="text-[10px] text-slate-400 mt-0.5">
                  1 {{ item.unit_display }} uchun
                </div>
              </td>

              <!-- Actions -->
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-0.5">
                  <button
                    @click="router.push(`/dashboard/products/${item.id || item._id}`)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    v-tooltip.top="'Ko\'rish'"
                  >
                    <i class="pi pi-eye text-xs"></i>
                  </button>
                  <button
                    v-if="item.barcode"
                    @click="viewBarcode(item)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                    v-tooltip.top="'Shtrix-kod'"
                  >
                    <i class="pi pi-barcode text-xs"></i>
                  </button>
                  <button
                    @click="router.push(`/dashboard/products/edit/${item.id || item._id}`)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                    v-tooltip.top="'Tahrirlash'"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    @click="$emit('delete', item)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    v-tooltip.top="'O\'chirish'"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!loading && products.length === 0">
              <td colspan="4" class="py-20 text-center">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-box text-xl text-slate-300 dark:text-slate-600"></i>
                </div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('products.not_found') }}</p>
                <p class="text-xs text-slate-400 mt-1">Qidiruv yoki filtrni o'zgartiring</p>
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
    <TablePagination
      :currentPage="currentPage"
      :totalRecords="totalRecords"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
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

const {
  imageErrors, handleImageError, formatNumber, formatImageUrl,
  showBarcodeModal, selectedBarcodeItem, barcodeUrl, barcodeLoading, barcodeError,
  viewBarcode, closeBarcodeModal, downloadBarcode, printBarcode
} = useProductTable(products)

defineEmits(['edit', 'delete', 'page-change'])
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar { height: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }
</style>
