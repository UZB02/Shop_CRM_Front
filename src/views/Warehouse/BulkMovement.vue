<script setup>
import { ref, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import { useBulkMovement } from './composables/useBulkMovement'
import BulkMovementHeader from './components/BulkMovement/BulkMovementHeader.vue'
import BulkMovementCatalog from './components/BulkMovement/BulkMovementCatalog.vue'
import BulkMovementCart from './components/BulkMovement/BulkMovementCart.vue'
import { useTemplateDownload } from '@/composables/useTemplateDownload'

const activeTab = ref('cart') // 'cart' or 'catalog'

const {
  warehouseName,
  products,
  loadingProducts,
  loadProducts,
  saving,
  bulkItems,
  movement_type,
  note,
  validItemsCount,
  addItem,
  removeBulkItem,
  updateQty,
  updatePrice,
  handleSave,
  handleCancel,
  scanAndAdd,
  router,
  supplier,
  suppliersList,
  paidAmount,
  paymentType
} = useBulkMovement()

const { templateLoading, downloadTemplate } = useTemplateDownload()

const turDialog = ref(false)
const selectedProductForTur = ref(null)
const turlar = ref([])
const loadingTurlar = ref(false)

const handleScan = async (code) => {
  try {
    const result = await scanAndAdd(code)
    if (result === true) {
      // Success, added to cart
    } else if (result && result.needs_tur) {
      openTurDialog(result.product)
    }
  } catch (err) {
    const { useToast } = await import('primevue/usetoast')
    const { getErrorMessage } = await import('@/services/axios')
    const toast = useToast()
    toast.add({ severity: 'error', summary: 'Xatolik', detail: getErrorMessage(err), life: 3000 })
  }
}

const openTurDialog = async (product) => {
  selectedProductForTur.value = product
  turDialog.value = true
  loadingTurlar.value = true
  try {
    const { productsAPI } = await import('@/services/api')
    const res = await productsAPI.getTurlar(product.id)
    turlar.value = res.data
  } catch (err) {
    console.error('Fetch turlar error:', err)
  } finally {
    loadingTurlar.value = false
  }
}

const selectTur = (tur) => {
  const productWithTur = {
    ...selectedProductForTur.value,
    tur_id: tur.id,
    tur_name: tur.name,
    tur_color: tur.color,
    barcode: tur.barcode || selectedProductForTur.value.barcode
  }
  addItem(productWithTur)
  turDialog.value = false
}
</script>

<template>
  <div class="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden px-4 md:px-0">
    
    <!-- Top Bar Component -->
    <BulkMovementHeader 
      :warehouseName="warehouseName"
      :validCount="validItemsCount"
      :totalCount="bulkItems.length"
      :saving="saving"
      :type="movement_type"
      :templateLoading="templateLoading.movements"
      @back="handleCancel"
      @save="handleSave"
      @download-template="downloadTemplate('movements')"
    />

    <!-- Main Content Area: Responsive POS Layout -->
    <div class="flex-1 flex overflow-hidden min-h-0 relative">
      
      <!-- Desktop & Large Tablet: Side-by-Side (Visible from LG breakpoint) -->
      <div class="hidden lg:flex flex-1 overflow-hidden">
        <!-- Left/Center: Selected Items (Work Area) -->
        <section class="flex-1 h-full relative overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
          <BulkMovementCart 
            :items="bulkItems"
            v-model:type="movement_type"
            v-model:note="note"
            v-model:supplier="supplier"
            v-model:paidAmount="paidAmount"
            v-model:paymentType="paymentType"
            :suppliers="suppliersList"
            @remove="removeBulkItem"
            @update-qty="updateQty"
            @update-price="updatePrice"
            @save="handleSave"
            :saving="saving"
            :validCount="validItemsCount"
          />
        </section>

        <!-- Right: Product Selector (Catalog Sidebar) -->
        <section class="w-[420px] flex-shrink-0 h-full border-l border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f1422] flex flex-col overflow-hidden shadow-2xl">
          <BulkMovementCatalog 
            :items="bulkItems"
            @add="addItem"
            @search="loadProducts"
            @scan="handleScan"
          />
        </section>
      </div>

      <!-- Mobile & Small Tablet: Tabbed Navigation (Hidden from LG breakpoint) -->
      <div class="lg:hidden flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-hidden">
          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            :enter-from-class="activeTab === 'cart' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'"
            :leave-to-class="activeTab === 'cart' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'"
            mode="out-in"
          >
            <div :key="activeTab" class="h-full">
              <BulkMovementCart 
                v-if="activeTab === 'cart'"
                :items="bulkItems"
                v-model:type="movement_type"
                v-model:note="note"
                v-model:supplier="supplier"
                v-model:paidAmount="paidAmount"
                v-model:paymentType="paymentType"
                :suppliers="suppliersList"
                @remove="removeBulkItem"
                @update-qty="updateQty"
                @update-price="updatePrice"
                @save="handleSave"
                :saving="saving"
                :validCount="validItemsCount"
              />
              <BulkMovementCatalog 
                v-else
                :items="bulkItems"
                @add="addItem"
                @search="loadProducts"
                @scan="handleScan"
              />
            </div>
          </transition>
        </div>

        <!-- Mobile Bottom Tabs -->
        <div class="h-16 bg-white dark:bg-[#0f1422] border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[60]">
          <button 
            @click="activeTab = 'cart'"
            class="flex-1 flex flex-col items-center gap-1 transition-all relative"
            :class="activeTab === 'cart' ? 'text-emerald-500 scale-110' : 'text-slate-400'"
          >
            <div class="relative">
              <i class="pi pi-shopping-cart text-lg"></i>
              <span v-if="validItemsCount > 0" class="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-sm">
                {{ validItemsCount }}
              </span>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('warehouse.bulk.products_list') }}</span>
          </button>

          <div class="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>

          <button 
            @click="activeTab = 'catalog'"
            class="flex-1 flex flex-col items-center gap-1 transition-all"
            :class="activeTab === 'catalog' ? 'text-emerald-500 scale-110' : 'text-slate-400'"
          >
            <i class="pi pi-th-large text-lg"></i>
            <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('menu.products') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay Loading -->
    <div v-if="saving" class="fixed inset-0 z-[100] bg-white/60 dark:bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
      <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <i class="pi pi-spin pi-spinner text-blue-500 text-2xl"></i>
      </div>
      <p class="text-[12px] font-black text-slate-900 dark:text-slate-100 tracking-widest">{{ $t('warehouse.bulk.saving') }}</p>
    </div>
    
    <!-- Tur Selection Modal -->
    <Dialog 
      v-model:visible="turDialog" 
      :header="selectedProductForTur?.name" 
      modal 
      class="w-full max-w-lg"
      :pt="{ 
        root: { class: 'dark:bg-slate-900 border-none rounded-3xl shadow-2xl overflow-hidden' },
        header: { class: 'px-8 pt-8 pb-4 dark:bg-slate-900 border-none font-black tracking-tighter text-xl' },
        content: { class: 'px-8 pb-8 pt-2 dark:bg-slate-900' }
      }"
    >
      <div v-if="loadingTurlar" class="flex flex-col gap-3 py-4">
        <div v-for="i in 3" :key="i" class="h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
        <button 
          v-for="tur in turlar" 
          :key="tur.id"
          @click="selectTur(tur)"
          class="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-all group relative overflow-hidden"
        >
          <span class="text-sm font-black text-slate-800 dark:text-slate-200 mb-1 tracking-tight">{{ tur.name }}</span>
          <span v-if="tur.color" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ tur.color }}</span>
          
          <div class="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <i class="pi pi-plus-circle text-emerald-500"></i>
          </div>
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.2);
  border-radius: 10px;
}

.animate-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
