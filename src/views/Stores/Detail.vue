<template>
  <div class="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12 px-4 sm:px-6">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
      <router-link to="/dashboard/stores" class="hover:text-emerald-500 transition-colors">Do'konlar</router-link>
      <i class="pi pi-chevron-right text-[8px]"></i>
      <span class="text-slate-600 dark:text-slate-300">{{ store?.name }}</span>
    </div>

    <!-- Professional Detail Header Component -->
    <StoreDetailHeader :store="store" v-if="!loading" />

    <!-- Content Tabs -->
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

      <div class="tabs-content">
        <BranchesTab v-if="activeTab === 'branches'" :branches="store?.branches" />
        <WorkersTab v-if="activeTab === 'workers'" :workers="store?.workers" :on-refresh="fetchDetails" />
        <SmenasTab v-if="activeTab === 'smenas'" :smenas="store?.open_smenas" />
        <SettingsTab v-if="activeTab === 'settings'" :store="store" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStoreDetail } from './composables/useStoreDetail'
import StoreDetailHeader from './components/detail/StoreDetailHeader.vue'
import BranchesTab from './components/detail/BranchesTab.vue'
import WorkersTab from './components/detail/WorkersTab.vue'
import SmenasTab from './components/detail/SmenasTab.vue'
import SettingsTab from './components/detail/SettingsTab.vue'

const { store, loading, activeTab, tabs, fetchDetails } = useStoreDetail()
</script>

<style scoped>
.animate-in { animation: fadeIn 0.7s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
