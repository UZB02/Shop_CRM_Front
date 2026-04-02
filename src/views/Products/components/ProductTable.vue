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
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showBarcodeModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeBarcodeModal"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeBarcodeModal"></div>

          <!-- Panel -->
          <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Shtrix-kod</h3>
                <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{{ selectedBarcodeItem?.name }}</p>
              </div>
              <button
                @click="closeBarcodeModal"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- Barcode image -->
            <div class="px-6 py-6 flex flex-col items-center gap-4">
              <div class="w-full bg-white rounded-xl border border-slate-200 flex items-center justify-center min-h-[160px] p-4">
                <div v-if="barcodeLoading" class="flex flex-col items-center gap-2">
                  <i class="pi pi-spin pi-spinner text-emerald-500 text-xl"></i>
                  <span class="text-xs text-slate-400">Yuklanmoqda...</span>
                </div>
                <div v-else-if="barcodeError" class="flex flex-col items-center gap-2 text-rose-500">
                  <i class="pi pi-exclamation-circle text-xl"></i>
                  <span class="text-xs">Shtrix-kod yuklanmadi</span>
                </div>
                <img
                  v-else-if="barcodeUrl"
                  :src="barcodeUrl"
                  :alt="selectedBarcodeItem?.barcode"
                  class="max-w-full h-auto"
                />
              </div>

              <code class="text-sm font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg tracking-widest border border-slate-200 dark:border-slate-700">
                {{ selectedBarcodeItem?.barcode }}
              </code>

              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                  {{ selectedBarcodeItem?.category_name }}
                </span>
                <span v-if="selectedBarcodeItem?.unit_display">1 {{ selectedBarcodeItem.unit_display }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex gap-2 px-5 pb-5">
              <button
                @click="downloadBarcode"
                :disabled="!barcodeUrl || barcodeLoading"
                class="flex-1 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="pi pi-download text-xs"></i>
                Yuklab olish
              </button>
              <button
                @click="printBarcode"
                :disabled="!barcodeUrl || barcodeLoading"
                class="flex-1 h-9 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="pi pi-print text-xs"></i>
                Chop etish
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Pagination -->
    <div
      v-if="totalRecords > 0"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
    >
      <p class="text-xs text-slate-400">
        {{ (currentPage - 1) * 10 + 1 }}–{{ Math.min(currentPage * 10, totalRecords) }}
        <span class="text-slate-300 dark:text-slate-600 mx-1">/</span>
        {{ totalRecords }} ta
      </p>

      <div class="flex items-center gap-1">
        <button
          :disabled="currentPage === 1"
          @click="changePage(1)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-angle-double-left text-xs"></i>
        </button>
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-angle-left text-xs"></i>
        </button>

        <button
          v-for="p in displayedPages"
          :key="p"
          @click="changePage(p)"
          class="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
          :class="p === currentPage
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'"
        >{{ p }}</button>

        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-angle-right text-xs"></i>
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(totalPages)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-angle-double-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({
  products: Array,
  loading: Boolean,
  totalRecords: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 }
})

const emit = defineEmits(['edit', 'delete', 'page-change'])

const router = useRouter()
const imageErrors = ref({})

const handleImageError = (id) => { imageErrors.value[id] = true }
watch(() => props.products, () => { imageErrors.value = {} })

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalRecords / 10)))

const displayedPages = computed(() => {
  const cur = props.currentPage, total = totalPages.value, pages = []
  let start = Math.max(1, cur - 1)
  let end = Math.min(total, start + 2)
  if (end === total) start = Math.max(1, end - 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', { page: page - 1, rows: 10 })
  }
}

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('uz-UZ').format(value)
}

const formatImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = 'https://shopcrmsystem-production.up.railway.app'
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

// Barcode modal state
const showBarcodeModal = ref(false)
const selectedBarcodeItem = ref(null)
const barcodeUrl = ref(null)
const barcodeLoading = ref(false)
const barcodeError = ref(false)

const viewBarcode = async (item) => {
  selectedBarcodeItem.value = item
  showBarcodeModal.value = true
  barcodeUrl.value = null
  barcodeError.value = false
  barcodeLoading.value = true
  try {
    const res = await api.get(
      `/warehouse/products/${item.id || item._id}/barcode/`,
      { responseType: 'blob' }
    )
    barcodeUrl.value = URL.createObjectURL(res.data)
  } catch {
    barcodeError.value = true
  } finally {
    barcodeLoading.value = false
  }
}

const closeBarcodeModal = () => {
  showBarcodeModal.value = false
  if (barcodeUrl.value) {
    URL.revokeObjectURL(barcodeUrl.value)
    barcodeUrl.value = null
  }
}

const downloadBarcode = () => {
  if (!barcodeUrl.value) return
  const a = document.createElement('a')
  a.href = barcodeUrl.value
  a.download = `barcode-${selectedBarcodeItem.value?.barcode || 'product'}.png`
  a.click()
}

const printBarcode = () => {
  if (!barcodeUrl.value) return
  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Shtrix-kod — ${selectedBarcodeItem.value?.name}</title>
    <style>
      body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: monospace; gap: 12px; }
      img { max-width: 300px; }
      p { font-size: 14px; letter-spacing: 4px; margin: 0; }
    </style></head>
    <body>
      <img src="${barcodeUrl.value}" />
      <p>${selectedBarcodeItem.value?.barcode || ''}</p>
      <script>window.onload = () => { window.print(); window.close() }<\/script>
    </body></html>
  `)
  win.document.close()
}
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar { height: 4px; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 9999px; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .relative, .modal-fade-leave-active .relative { transition: transform 0.18s ease; }
.modal-fade-enter-from .relative { transform: scale(0.96) translateY(8px); }
.modal-fade-leave-to .relative { transform: scale(0.96) translateY(8px); }
</style>
