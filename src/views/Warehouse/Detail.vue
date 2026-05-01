<template>
  <div class="space-y-4">
    <!-- Header -->
    <WarehouseDetailPageHeader
      :warehouse="warehouse"
      @movement="openMovementDialog"
      @transfer="openNewTransferHandler"
    />

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
  openNewTransferHandler
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
</style>

