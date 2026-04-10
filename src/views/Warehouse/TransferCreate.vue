<template>
  <div class="flex flex-col h-[calc(100vh-72px)] max-w-[1400px] mx-auto">
    <!-- Top bar -->
    <TransferHeader
      :source-name="sourceName"
      :loading="subLoading"
      :is-valid="isValid"
      @back="router.back()"
      @submit="submitTransfer"
    />

    <!-- Body (2-col) -->
    <div class="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 py-5">
      <!-- LEFT: Config panel -->
      <TransferSidebar
        v-model:target-type="targetType"
        :transfer-form="transferForm"
        :filtered-branches="filteredBranches"
        :filtered-warehouses="filteredWarehouses"
        :source-name="sourceName"
        :selected-destination-name="selectedDestinationName"
        :is-valid="isValid"
      />

      <!-- RIGHT: Products panel -->
      <TransferProductList
        :items="transferForm.items"
        @remove="removeItem"
        @open-search="showProductSelect = true"
      />
    </div>

    <!-- Product selection dialog -->
    <ProductSelector
      v-model:visible="showProductSelect"
      v-model:product-search="productSearch"
      :source-name="sourceName"
      :products="filteredAvailableProducts"
      @add="addProduct"
    />

    <!-- Stock Validation Errors Modal -->
    <Dialog 
      :visible="!!stockErrors" 
      @update:visible="stockErrors = null"
      modal 
      header="Ombor qoldig'i tekshiruvi" 
      :style="{ width: '500px' }"
      class="stock-error-dialog"
      :pt="{
        header: { class: 'dark:bg-slate-900 border-b dark:border-slate-800' },
        content: { class: 'dark:bg-slate-900' },
        footer: { class: 'dark:bg-slate-900 border-t dark:border-slate-800' }
      }"
    >
      <div class="space-y-4 py-2">
        <div v-if="stockErrors?.detail" class="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
          <p class="text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <i class="pi pi-exclamation-triangle"></i>
            {{ stockErrors.detail }}
          </p>
        </div>

        <div class="space-y-3">
          <!-- Zero Stock Errors -->
          <div v-for="(err, i) in stockErrors?.zero_stock" :key="'z-'+i" class="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
              <i class="pi pi-times-circle text-rose-500"></i>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">Qoldiq yo'q</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ err }}</p>
            </div>
          </div>

          <!-- Insufficient Stock Errors -->
          <div v-for="(err, i) in stockErrors?.insufficient_stock" :key="'in-'+i" class="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <i class="pi pi-exclamation-circle text-amber-500"></i>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">Qoldiq yetarli emas</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ err }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button 
          @click="stockErrors = null"
          class="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Tushunarli
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TransferHeader from './components/TransferCreate/TransferHeader.vue'
import TransferSidebar from './components/TransferCreate/TransferSidebar.vue'
import TransferProductList from './components/TransferCreate/TransferProductList.vue'
import ProductSelector from './components/TransferCreate/ProductSelector.vue'
import Dialog from 'primevue/dialog'
import { useTransferCreate } from './composables/useTransferCreate'

const {
  router,
  targetType,
  showProductSelect,
  productSearch,
  sourceName,
  transferForm,
  subLoading,
  isValid,
  filteredBranches,
  filteredWarehouses,
  selectedDestinationName,
  filteredAvailableProducts,
  addProduct,
  removeItem,
  loadSourceData,
  submitTransfer,
  fetchLocations,
  resetForm,
  stockErrors
} = useTransferCreate()

onMounted(() => {
  fetchLocations()
  loadSourceData()
  resetForm()
})
</script>

<style scoped>
/* Scoped styles relocated to components or keeping only essential layout here */
</style>
