<template>
  <div class="space-y-4 pb-[80px] lg:pb-0 relative min-h-[calc(100vh-4rem)]">
    <!-- Sticky Header Wrapper -->
    <div class="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-3 bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-xl lg:backdrop-blur-none lg:static lg:mx-0 lg:p-0 lg:bg-transparent dark:lg:bg-transparent shadow-sm lg:shadow-none border-b border-slate-200 dark:border-slate-800 lg:border-none dark:lg:border-none">
      <BranchPageHeader
        :branch="branch"
        @edit="openEditModal"
        @transfer="openNewTransferHandler"
        @export="exportStocks"
      />
    </div>

    <!-- Main layout -->
    <div v-if="loading && !branch" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="branch" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <BranchTabsSidebar
          :tabs="navTabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0 space-y-3 relative">
        <!-- Tab Loading Progress -->
        <div v-if="tabLoading" class="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden rounded-full z-10">
          <div class="h-full bg-emerald-500/40 animate-loading translate-x-[-100%]"></div>
        </div>
        
        <Transition name="fade-slide" mode="out-in">
          <BranchWorkersTab 
            v-if="activeTab === 'workers'" 
            key="workers" 
            :workers="branch?.workers" 
          />
          <BranchProductsTab 
            v-else-if="activeTab === 'products'" 
            key="products" 
            :products="branch?.products" 
            @create-wastage="openWastageModal"
          />
          <TransfersTab 
            v-else-if="activeTab === 'transfers'" 
            key="transfers" 
            :source-id="branch?.id || branch?._id"
            source-type="branch"
            :source-name="branch?.name"
            :available-products="branch?.products"
          />
          <BranchCustomersTab 
            v-else-if="activeTab === 'customers'"
            key="customers" 
            :customers="branch?.customers" 
          />

          <BranchIncomingTab 
            v-else-if="activeTab === 'incoming'" 
            key="incoming" 
            :branch-id="branch?.id || branch?._id"
          />

          <WastagesTab 
            v-else-if="activeTab === 'wastages'" 
            key="wastages" 
            ref="wastagesTabRef"
            :location-id="branch?.id || branch?._id"
            location-type="branch"
          />
        </Transition>
      </div>
    </div>

    <!-- Mobile Sticky Action Bar -->
    <div v-if="branch" class="lg:hidden fixed bottom-[68px] left-0 right-0 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-around gap-2">
      <!-- Edit Branch Button -->
      <button
        @click="openEditModal"
        class="w-11 h-11 shrink-0 rounded-xl text-[12px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all flex items-center justify-center active:scale-95 shadow-sm"
      >
        <i class="pi pi-pencil text-xs"></i>
      </button>

      <!-- Transfer Button -->
      <button
        @click="openNewTransferHandler"
        class="w-11 h-11 shrink-0 rounded-xl text-[12px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all flex items-center justify-center active:scale-95 shadow-sm"
      >
        <i class="pi pi-arrow-right-arrow-left text-xs"></i>
      </button>

      <!-- Bulk Movement Button -->
      <button
        @click="router.push({ name: 'branch-bulk', params: { id: branch.id || branch._id } })"
        class="flex-1 h-11 rounded-xl text-[11px] sm:text-[12px] font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-emerald-500/20"
      >
        <i class="pi pi-plus text-xs"></i>
        <span class="truncate">{{ $t('warehouse.detail.bulk_movement') }}</span>
      </button>

      <!-- Export Stocks Button -->
      <button
        v-if="activeTab === 'products'"
        @click="exportStocks"
        class="w-11 h-11 shrink-0 rounded-xl text-[12px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center active:scale-95"
      >
        <i class="pi pi-file-excel text-xs"></i>
      </button>
    </div>

    <!-- Edit Dialog -->
    <BranchDialog
      v-model:visible="editModalVisible"
      :branch="branchForm"
      :submitted="submitted"
      :saving="saving"
      @save="handleSave"
      @hide="editModalVisible = false"
    />

    <!-- Wastage Modal -->
    <CreateWastageModal
      v-if="settingsStore.isWastageEnabled"
      v-model:visible="wastageModalVisible"
      :product="selectedProductForWastage"
      :location-id="branch?.id || branch?._id"
      location-type="branch"
      @saved="onWastageSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBranchDetail } from './composables/useBranchDetail'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

import BranchPageHeader from './components/BranchPageHeader.vue'
import BranchTabsSidebar from './components/BranchTabsSidebar.vue'
import BranchWorkersTab from './components/BranchWorkersTab.vue'
import BranchProductsTab from './components/BranchProductsTab.vue'
import BranchIncomingTab from './components/BranchIncomingTab.vue'
import BranchCustomersTab from './components/BranchCustomersTab.vue'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import BranchDialog from '../Stores/components/BranchDialog.vue'
import WastagesTab from '@/components/Warehouse/WastagesTab.vue'
import CreateWastageModal from '@/components/Warehouse/CreateWastageModal.vue'

const { t } = useI18n()
const router = useRouter()
const settingsStore = useSettingsStore()
const {
  branch, loading, tabLoading, activeTab,
  editModalVisible, branchForm, submitted, saving,
  openEditModal, handleSave, fetchDetail: fetchBranch, exportStocks
} = useBranchDetail()

const openNewTransferHandler = () => {
  router.push({
    name: 'branch-transfer-create',
    params: { id: branch.value?.id || branch.value?._id }
  })
}

// Prepare tabs with counts and icons
const navTabs = computed(() => {
  const tabs = [
    { id: 'products', label: t('menu.products'), icon: 'pi pi-box', count: branch.value?.products?.length },
    { id: 'workers', label: t('menu.workers'), icon: 'pi pi-users', count: branch.value?.workers?.length },
    { id: 'transfers', label: t('warehouse.detail.transfers'), icon: 'pi pi-arrow-right-arrow-left' },
    { id: 'incoming', label: t('warehouse.detail.incoming_history'), icon: 'pi pi-history' },
  ]

  if (settingsStore.isWastageEnabled) {
    tabs.push({ id: 'wastages', label: t('warehouse.wastage.title'), icon: 'pi pi-exclamation-triangle' })
  }

  tabs.push({ id: 'customers', label: t('menu.customers'), icon: 'pi pi-user', count: branch.value?.customers?.length })
  
  return tabs
})

const wastageModalVisible = ref(false)
const selectedProductForWastage = ref(null)
const wastagesTabRef = ref(null)

const openWastageModal = (product) => {
  selectedProductForWastage.value = product
  wastageModalVisible.value = true
}

const onWastageSaved = () => {
  // Refresh branch data to update stock
  fetchBranch()
  // If we are currently on the wastages tab, refresh it too
  if (activeTab.value === 'wastages' && wastagesTabRef.value) {
    wastagesTabRef.value.refresh()
  }
}

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