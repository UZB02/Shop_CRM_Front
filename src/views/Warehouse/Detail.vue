<template>
  <div class="space-y-4 pb-[130px] lg:pb-0 relative min-h-[calc(100vh-4rem)]">
    <!-- Sticky Header Wrapper -->
    <div class="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-3 bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-xl lg:backdrop-blur-none lg:static lg:mx-0 lg:p-0 lg:bg-transparent dark:lg:bg-transparent shadow-sm lg:shadow-none border-b border-slate-200 dark:border-slate-800 lg:border-none dark:lg:border-none">
      <!-- Header -->
      <WarehouseDetailPageHeader
        :warehouse="warehouse"
        @movement="openMovementDialog"
        @transfer="openNewTransferHandler"
        @export="exportStocks"
      />
    </div>

    <!-- Main layout -->
    <div v-if="loading && !warehouse" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="warehouse" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <WarehouseTabsSidebar
          :tabs="navTabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0 relative">
        <!-- Tab Loading Progress -->
        <div v-if="tabLoading" class="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden rounded-full z-10">
          <div class="h-full bg-emerald-500/40 animate-loading translate-x-[-100%]"></div>
        </div>
        
        <Transition name="fade-slide" mode="out-in">
          <!-- ===== MAHSULOTLAR TAB ===== -->
          <WarehouseProductsTab
            v-if="activeTab === 'products'"
            key="products"
            v-model:search="productSearch"
            :products="filteredProducts"
            :total-products="warehouse?.products?.length ?? 0"
            @show-barcode="showBarcode"
            @open-wastage="openWastageModal"
          />

          <!-- ===== O'TKAZMALAR TAB ===== -->
          <div v-else-if="activeTab === 'transfers'" key="transfers">
            <TransfersTab
              :source-id="warehouse?.id || warehouse?._id"
              source-type="warehouse"
              :source-name="warehouse?.name"
              :available-products="warehouse?.products"
              @pending-count="pendingCount = $event"
            />
          </div>

          <!-- ===== KIRIM TARIXI TAB ===== -->
          <WarehouseIncomingTab
            v-else-if="activeTab === 'incoming'"
            key="incoming"
            :history="incomingHistory"
            :total="incomingTotal"
            :page="incomingPage"
            :rows="incomingRows"
            @page-change="onIncomingPageChange"
            @void="openVoidDialog"
          />

          <!-- ===== CHIQUITLAR TAB ===== -->
          <div v-else-if="activeTab === 'wastages'" key="wastages">
            <WastagesTab
              ref="wastagesTabRef"
              :location-id="warehouse?.id || warehouse?._id"
              location-type="warehouse"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Mobile Sticky Action Bar -->
    <div class="lg:hidden fixed bottom-[68px] left-0 right-0 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-around gap-2">
      <button
        @click="openMovementDialog"
        class="flex-1 h-12 rounded-xl text-[12px] font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-lg shadow-emerald-500/20"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>Kirim / Chiqim</span>
      </button>

      <button
        @click="openNewTransferHandler"
        class="flex-1 h-12 rounded-xl text-[12px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-sm"
      >
        <i class="pi pi-arrow-right-arrow-left text-xs text-emerald-500"></i>
        <span>O'tkazma</span>
      </button>

      <button
        v-if="settingsStore.hasPlanExport"
        @click="exportStocks"
        class="flex-none w-12 h-12 rounded-xl text-[12px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95"
      >
        <i class="pi pi-file-excel text-[14px]"></i>
      </button>
    </div>

    <!-- Wastage Modal -->
    <CreateWastageModal
      v-if="settingsStore.isWastageEnabled"
      v-model:visible="wastageModalVisible"
      :product="selectedProductForWastage"
      :location-id="warehouse?.id || warehouse?._id"
      location-type="warehouse"
      @saved="onWastageSaved"
    />

    <!-- Barcode Dialog -->
    <WarehouseBarcodeDialog
      v-model:visible="barcodeVisible"
      :product="selectedProduct"
      @download="downloadBarcode"
    />

    <!-- Void Confirmation Dialog -->
    <Dialog 
      v-model:visible="voidingDialogVisible"
      modal 
      class="!bg-white dark:!bg-slate-900 !rounded-[2rem] !border-none !shadow-2xl" 
      :showHeader="false"
      pt:mask:class="backdrop-blur-sm bg-slate-900/40 dark:bg-slate-950/60"
    >
      <div class="p-6 sm:p-8 flex flex-col gap-6 w-full max-w-md min-w-[340px] sm:min-w-[420px]">
        <!-- Header -->
        <div class="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <i class="pi pi-ban text-sm"></i>
            </div>
            <div class="text-left">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ $t('warehouse.detail.void_title') }}</h3>
              <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest">{{ $t('common.confirm_title') }}</p>
            </div>
          </div>
          <button @click="voidingDialogVisible = false" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </div>
        
        <!-- Info Alert -->
        <div class="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 text-left">
          <div class="text-amber-500 shrink-0">
            <i class="pi pi-exclamation-triangle text-sm mt-0.5"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">{{ $t('warehouse.detail.void_confirm') }}</h4>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {{ $t('warehouse.detail.void_warning_desc') }}
            </p>
          </div>
        </div>

        <!-- Reason Input -->
        <div class="field text-left">
          <label class="text-[12px] font-black tracking-widest text-slate-400 ml-1 mb-1.5 block">
            {{ $t('warehouse.detail.void_reason') }} <span class="text-rose-500">*</span>
          </label>
          <div class="custom-input-wrapper relative group/input flex items-start rounded-2xl bg-slate-50 dark:bg-slate-900/50 border !border-slate-200 dark:!border-slate-800 focus-within:!border-rose-400 focus-within:ring-4 focus-within:ring-rose-400/10 transition-all duration-300">
            <Textarea
              v-model="voidingReason"
              rows="3"
              :placeholder="$t('warehouse.detail.void_reason_placeholder')"
              class="w-full h-full"
              pt:root:class="!bg-transparent !border-none !shadow-none !w-full"
              pt:textarea:class="!bg-transparent !border-none !shadow-none !text-[14px] !font-semibold !p-4 !px-4 !w-full !text-slate-700 dark:!text-slate-200 !outline-none !resize-none !min-h-[80px]"
            />
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex gap-3 w-full">
          <button 
            @click="voidingDialogVisible = false"
            class="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            @click="confirmVoid"
            :disabled="voidingLoading"
            class="flex-[2] py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-900 text-[11px] font-black tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="voidingLoading" class="pi pi-spin pi-spinner text-xs"></i>
            <i v-else class="pi pi-check text-xs"></i>
            {{ voidingLoading ? $t('common.saving') : $t('warehouse.detail.void_btn') }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import WarehouseDetailPageHeader from './components/WarehouseDetailPageHeader.vue'
import WarehouseTabsSidebar from './components/WarehouseTabsSidebar.vue'
import WastagesTab from '@/components/Warehouse/WastagesTab.vue'
import CreateWastageModal from '@/components/Warehouse/CreateWastageModal.vue'

// Refactored Components
import WarehouseProductsTab from './components/Detail/WarehouseProductsTab.vue'
import WarehouseIncomingTab from './components/Detail/WarehouseIncomingTab.vue'
import WarehouseBarcodeDialog from './components/Detail/WarehouseBarcodeDialog.vue'

import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

// Composable
import { useWarehouseDetail } from './composables/useWarehouseDetail'

const settingsStore = useSettingsStore()

const {
  warehouse,
  loading,
  tabLoading,
  activeTab,
  barcodeVisible,
  selectedProduct,
  productSearch,
  pendingCount,
  incomingHistory,
  incomingTotal,
  incomingPage,
  incomingRows,
  wastageModalVisible,
  selectedProductForWastage,
  wastagesTabRef,
  filteredProducts,
  navTabs,
  showBarcode,
  downloadBarcode,
  openWastageModal,
  onWastageSaved,
  onIncomingPageChange,
  openMovementDialog,
  openNewTransferHandler,
  exportStocks,
  
  // Void exports
  voidingReason,
  voidingLoading,
  voidingDialogVisible,
  openVoidDialog,
  confirmVoid
} = useWarehouseDetail()
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
.animate-loading {
  animation: loading 1.5s infinite ease-in-out;
}

/* Universal shaffoflik va hamma effektlarni (border, shadow, outline) o'chirish */
.custom-input-wrapper :deep(*),
.custom-input-wrapper :deep(*:hover),
.custom-input-wrapper :deep(*:focus),
.custom-input-wrapper :deep(*::before),
.custom-input-wrapper :deep(*::after) {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  border-width: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.p-textarea) {
  font-family: inherit !important;
  width: 100% !important;
}
</style>

