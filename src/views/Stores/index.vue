<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{{ $t('stores.page_title') }}</h1>
    </div>

    <!-- Store Info Card -->
    <StoreInfoCard 
      :store="store" 
      :loading="loading" 
      @edit="openEditStoreDialog"
      @add="openNewStoreDialog" 
    />

    <!-- Branches Section -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <i class="pi pi-sitemap text-sm text-emerald-500"></i>
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{{ $t('stores.branches_title') }}</h2>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {{ branchTotalRecords }} {{ $t('stores.count_suffix') }}
            </p>
          </div>
        </div>
        <button
          @click="openNewBranchDialog"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
        >
          <i class="pi pi-plus text-[10px]"></i>
          <span class="hidden sm:inline">{{ $t('stores.new_branch') }}</span>
          <span class="sm:hidden">{{ $t('stores.add_branch') }}</span>
        </button>
      </div>

      <!-- Filters Component -->
      <BranchFilters 
        v-model:search="branchSearch" 
        v-model:status="branchStatusFilter" 
      />

      <!-- Branches Table -->
      <BranchTable
        v-model:page="branchPage"
        :branches="branches"
        :loading="loadingBranches"
        :total-records="branchTotalRecords"
        :page-size="branchPageSize"
        @edit="editBranch"
        @delete="confirmDeleteBranch"
        @page-change="loadBranches"
      />
    </div>

    <!-- Dialogs -->
    <StoreDialog
      v-model:visible="storeDialog"
      :store="storeForm"
      :submitted="submitted"
      :saving="saving"
      @save="saveStore"
      @hide="storeDialog = false"
    />

    <BranchDialog
      v-model:visible="branchDialog"
      :branch="branch"
      :submitted="branchSubmitted"
      :saving="saving"
      @save="saveBranch"
      @hide="branchDialog = false"
    />
  </div>
</template>

<script setup>
import StoreInfoCard from './components/StoreInfoCard.vue'
import BranchFilters from './components/BranchFilters.vue'
import BranchTable from './components/BranchTable.vue'
import StoreDialog from './components/StoreDialog.vue'
import BranchDialog from './components/BranchDialog.vue'
import { useStores } from './composables/useStores'

const {
  store, storeForm, storeDialog, submitted, loading, saving,
  openNewStoreDialog, openEditStoreDialog, saveStore,
  branches, branch, branchDialog, branchSubmitted, branchSearch, 
  branchStatusFilter, branchPage, branchPageSize, branchTotalRecords, 
  loadingBranches, loadBranches, openNewBranchDialog, editBranch, 
  saveBranch, confirmDeleteBranch
} = useStores()
</script>

<style scoped>
.animate-in { animation-duration: 0.4s; }
</style>
