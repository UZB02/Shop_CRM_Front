<template>
  <div class="space-y-4">
    <!-- Header -->
    <BranchPageHeader
      :branch="branch"
      @edit="openEditModal"
      @transfer="openNewTransferHandler"
    />

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
        </Transition>
      </div>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBranchDetail } from './composables/useBranchDetail'
import { useI18n } from 'vue-i18n'

import BranchPageHeader from './components/BranchPageHeader.vue'
import BranchTabsSidebar from './components/BranchTabsSidebar.vue'
import BranchWorkersTab from './components/BranchWorkersTab.vue'
import BranchProductsTab from './components/BranchProductsTab.vue'
import BranchCustomersTab from './components/BranchCustomersTab.vue'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import BranchDialog from '../Stores/components/BranchDialog.vue'

const { t } = useI18n()
const router = useRouter()
const {
  branch, loading, tabLoading, activeTab,
  editModalVisible, branchForm, submitted, saving,
  openEditModal, handleSave
} = useBranchDetail()

const openNewTransferHandler = () => {
  router.push({
    name: 'branch-transfer-create',
    params: { id: branch.value?.id || branch.value?._id }
  })
}

// Prepare tabs with counts and icons
const navTabs = computed(() => [
  { id: 'workers', label: t('menu.workers'), icon: 'pi pi-users', count: branch.value?.workers?.length },
  { id: 'products', label: t('menu.products'), icon: 'pi pi-box', count: branch.value?.products?.length },
  { id: 'transfers', label: 'O\'tkazmalar', icon: 'pi pi-arrow-right-arrow-left' },
  { id: 'customers', label: t('menu.customers'), icon: 'pi pi-user', count: branch.value?.customers?.length },
])
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

