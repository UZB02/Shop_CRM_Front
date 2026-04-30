<template>
  <div class="h-[100dvh] flex flex-col bg-slate-50 dark:bg-[#0f172a] animate-in fade-in duration-500 overflow-hidden font-outfit">
    
    <!-- Top Bar -->
    <TransferHeader 
      :source-name="sourceName"
      :loading="subLoading"
      :is-valid="isValid"
      @back="handleCancel"
      @submit="submitTransfer"
    />

    <!-- Main Workspace Area -->
    <div class="flex-1 flex overflow-hidden min-h-0 relative">
      
      <!-- Desktop & Large Tablet Layout (LG+) -->
      <div class="hidden lg:flex flex-1 overflow-hidden">
        <!-- Left: Selected Items (Work Area) -->
        <section class="flex-1 h-full relative overflow-hidden flex flex-col p-6 gap-6">
          <div class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
            <!-- Configuration Sidebar (Target Selection) -->
            <TransferSidebar
              v-model:target-type="targetType"
              :transfer-form="transferForm"
              :filtered-branches="filteredBranches"
              :filtered-warehouses="filteredWarehouses"
              :source-name="sourceName"
              :selected-destination-name="selectedDestinationName"
              :is-valid="isValid"
            />

            <!-- Product List (The "Cart") -->
            <TransferProductList
              :items="transferForm.items"
              @remove="removeItem"
            />
          </div>
        </section>

        <!-- Right: Available Products (Catalog Sidebar) -->
        <section class="w-[420px] flex-shrink-0 h-full border-l border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f1422] flex flex-col overflow-hidden shadow-2xl z-40">
          <TransferCatalog 
            :products="availableProducts"
            :items="transferForm.items"
            :source-name="sourceName"
            @add="addProduct"
          />
        </section>
      </div>

      <!-- Mobile & Small Tablet Layout (Tabbed) -->
      <div class="lg:hidden flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-hidden">
          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            :enter-from-class="activeTab === 'cart' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'"
            :leave-to-class="activeTab === 'cart' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'"
            mode="out-in"
          >
            <div :key="activeTab" class="h-full flex flex-col p-4 gap-4">
              <div v-if="activeTab === 'cart'" class="flex-1 flex flex-col gap-4 overflow-hidden">
                <TransferSidebar
                  v-model:target-type="targetType"
                  :transfer-form="transferForm"
                  :filtered-branches="filteredBranches"
                  :filtered-warehouses="filteredWarehouses"
                  :source-name="sourceName"
                  :selected-destination-name="selectedDestinationName"
                  :is-valid="isValid"
                />
                <TransferProductList 
                  :items="transferForm.items"
                  @remove="removeItem"
                />
              </div>
              <TransferCatalog 
                v-else
                :products="availableProducts"
                :items="transferForm.items"
                :source-name="sourceName"
                @add="addProduct"
              />
            </div>
          </transition>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="h-16 bg-white dark:bg-[#0f1422] border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[60]">
          <button 
            @click="activeTab = 'cart'"
            class="flex-1 flex flex-col items-center gap-1 transition-all relative"
            :class="activeTab === 'cart' ? 'text-emerald-500 scale-105' : 'text-slate-400'"
          >
            <div class="relative">
              <i class="pi pi-shopping-cart text-lg"></i>
              <span v-if="transferForm.items.length > 0" class="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white dark:border-slate-900 shadow-sm">
                {{ transferForm.items.length }}
              </span>
            </div>
            <span class="text-[8px] font-black uppercase tracking-widest">{{ $t('warehouse.transfer.items_list') || 'Ro\'yxat' }}</span>
          </button>

          <div class="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>

          <button 
            @click="activeTab = 'catalog'"
            class="flex-1 flex flex-col items-center gap-1 transition-all"
            :class="activeTab === 'catalog' ? 'text-emerald-500 scale-105' : 'text-slate-400'"
          >
            <i class="pi pi-th-large text-lg"></i>
            <span class="text-[8px] font-black uppercase tracking-widest">{{ $t('menu.products') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stock Validation Errors Modal -->
    <Dialog 
      :visible="!!stockErrors" 
      @update:visible="stockErrors = null"
      modal 
      :draggable="false"
      class="stock-error-dialog"
      :style="{ width: '92vw', maxWidth: '480px' }"
      :pt="{
        root: { class: '!bg-white dark:!bg-[#0f172a] !border-none !rounded-[32px] sm:!rounded-[40px] !shadow-2xl overflow-hidden' },
        header: { class: '!hidden' },
        content: { class: '!p-0' },
        mask: { class: 'backdrop-blur-xl bg-slate-900/60 p-4' }
      }"
    >
      <div class="p-8 space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10 shrink-0">
            <i class="pi pi-exclamation-triangle text-rose-500 text-lg"></i>
          </div>
          <div>
            <h3 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ $t('warehouse.validation.title') }}</h3>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.validation.error_header') }}</p>
          </div>
        </div>

        <div v-if="stockErrors?.detail" class="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10">
          <p class="text-[13px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{{ stockErrors.detail }}</p>
        </div>

        <div class="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
          <div v-for="(err, i) in stockErrors?.zero_stock" :key="'z-'+i" class="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-rose-500/30">
            <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-times-circle text-rose-500 text-[12px]"></i>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <span class="text-[9px] font-black text-rose-500 tracking-widest uppercase mb-1">{{ $t('warehouse.validation.no_stock') }}</span>
              <p class="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-snug">{{ err }}</p>
            </div>
          </div>

          <div v-for="(err, i) in stockErrors?.insufficient_stock" :key="'in-'+i" class="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-amber-500/30">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center shrink-0">
              <i class="pi pi-exclamation-circle text-amber-500 text-[12px]"></i>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <span class="text-[9px] font-black text-amber-500 tracking-widest uppercase mb-1">{{ $t('warehouse.validation.low_stock') }}</span>
              <p class="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-snug">{{ err }}</p>
            </div>
          </div>
        </div>

        <button 
          @click="stockErrors = null"
          class="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12px] font-black tracking-widest uppercase shadow-xl hover:opacity-90 active:scale-95 transition-all"
        >
          {{ $t('warehouse.validation.understand') }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransferHeader from './components/TransferCreate/TransferHeader.vue'
import TransferSidebar from './components/TransferCreate/TransferSidebar.vue'
import TransferProductList from './components/TransferCreate/TransferProductList.vue'
import TransferCatalog from './components/TransferCreate/TransferCatalog.vue'
import Dialog from 'primevue/dialog'
import { useTransferCreate } from './composables/useTransferCreate'

const activeTab = ref('cart')

const {
  router,
  targetType,
  sourceName,
  transferForm,
  subLoading,
  isValid,
  filteredBranches,
  filteredWarehouses,
  selectedDestinationName,
  availableProducts,
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
})

const handleCancel = () => {
  resetForm()
  router.back()
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
