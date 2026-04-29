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
      :draggable="false"
      class="stock-error-dialog"
      :style="{ width: '440px' }"
      :pt="{
        root: { class: '!bg-[#0f172a] !border-white/5 !rounded-[24px] !shadow-2xl overflow-hidden' },
        header: { class: '!bg-[#0f172a] !border-b !border-white/5 !p-5' },
        title: { class: '!text-sm !font-black !text-white !!tracking-[3px]' },
        content: { class: '!bg-[#0f172a] !p-6' },
        footer: { class: '!bg-[#0f172a] !border-t !border-white/5 !p-4' },
        closeButton: { class: '!bg-white/5 !rounded-full hover:!bg-white/10 !transition-all' }
      }"
      :header="$t('warehouse.validation.title')"
    >
      <div class="space-y-4">
        <!-- Main Error Banner -->
        <div v-if="stockErrors?.detail" class="px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/20">
            <i class="pi pi-exclamation-triangle text-rose-500 text-xs"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-rose-500 tracking-widest leading-none mb-1">{{ $t('warehouse.validation.error_header') }}</span>
            <p class="text-[11px] font-bold text-slate-300 leading-tight">{{ stockErrors.detail }}</p>
          </div>
        </div>

        <div class="space-y-2.5">
          <!-- Zero Stock Errors -->
          <div v-for="(err, i) in stockErrors?.zero_stock" :key="'z-'+i" class="flex gap-3 p-3 rounded-[14px] bg-slate-900/50 border border-white/5 group hover:border-rose-500/20 transition-all">
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-times-circle text-rose-500 text-[10px]"></i>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <span class="text-[8px] font-black text-rose-500/70 tracking-[2px] mb-0.5">{{ $t('warehouse.validation.no_stock') }}</span>
              <p class="text-[10px] font-bold text-slate-400 truncate tracking-tight">{{ err }}</p>
            </div>
          </div>

          <!-- Insufficient Stock Errors -->
          <div v-for="(err, i) in stockErrors?.insufficient_stock" :key="'in-'+i" class="flex gap-3 p-3 rounded-[14px] bg-slate-900/50 border border-white/5 group hover:border-amber-500/20 transition-all">
            <div class="w-[34px] h-[34px] rounded-lg bg-amber-500/10 border border-amber-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-exclamation-circle text-amber-500 text-[10px]"></i>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <span class="text-[8px] font-black text-amber-500/70 tracking-[2px] mb-0.5">{{ $t('warehouse.validation.low_stock') }}</span>
              <p class="text-[11px] font-bold text-slate-400 leading-snug">{{ err }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button 
          @click="stockErrors = null"
          class="w-full h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-950 text-[10px] font-black tracking-[3px] shadow-lg active:scale-[0.98] transition-all"
        >
          {{ $t('warehouse.validation.understand') }}
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
