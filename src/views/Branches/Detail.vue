<template>
  <div class="p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-[1600px] mx-auto min-h-screen pb-20">
    
    <!-- Header: Breadcrumbs, Actions and Info Card -->
    <BranchDetailHeader 
      :branch="branch" 
      :loading="loading" 
      @edit="openEditModal" 
    />

    <!-- Navigation Tabs -->
    <div class="space-y-6">
      <div class="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 sm:flex-none px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
          :class="activeTab === tab.id 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tabs-content min-h-[400px]">
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
            v-else 
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
import { useBranchDetail } from './composables/useBranchDetail'
import BranchDetailHeader from './components/BranchDetailHeader.vue'
import BranchWorkersTab from './components/BranchWorkersTab.vue'
import BranchProductsTab from './components/BranchProductsTab.vue'
import BranchCustomersTab from './components/BranchCustomersTab.vue'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import BranchDialog from '../Stores/components/BranchDialog.vue'

const {
  branch, loading, activeTab, tabs,
  editModalVisible, branchForm, submitted, saving,
  openEditModal, handleSave
} = useBranchDetail()

// Log branch data to console for debugging
import { watch } from 'vue'
watch(branch, (newVal) => {
  if (newVal) {
    console.group('🌿 Branch Detail Data')
    console.log('ID:', newVal.id || newVal._id)
    console.log('Name:', newVal.name)
    console.log('Full Object:', newVal)
    console.groupEnd()
  }
}, { immediate: true })
</script>

<style scoped>
.animate-in { animation: fadeIn 0.7s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
