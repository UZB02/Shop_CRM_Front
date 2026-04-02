<template>
  <div class="space-y-4">
    <!-- Header -->
    <StorePageHeader
      :storeName="storeDetail?.name"
      :branchCount="allStoreBranches?.length || 0"
      :hasStore="!!storeDetail"
      :showAddBranch="activeTab === 'branches'"
      @add-store="openNewStoreDialog"
      @edit-store="openEditStoreDialog"
      @add-branch="openNewBranchDialog"
    />

    <!-- Main layout -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-40"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="storeDetail" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <StoreTabsSidebar
          :tabs="tabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0 space-y-3">
        <BranchesTab
          v-if="activeTab === 'branches'"
          :branches="allStoreBranches"
          @edit="editBranch"
          @delete="confirmDeleteBranch"
        />
        <SmenasTab   
          v-if="activeTab === 'smenas'"   
          :openSmenas="storeDetail?.open_smenas" 
          :closedSmenas="storeDetail?.closed_smenas" 
        />
      </div>
    </div>

    <!-- No Store State -->
    <template v-else-if="!loading">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-building text-2xl text-slate-300"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">{{ $t('stores.no_store') }}</h3>
        <button
          @click="openNewStoreDialog"
          class="inline-flex items-center gap-2 h-9 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>{{ $t('stores.add_store') }}</span>
        </button>
      </div>
    </template>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStores } from './composables/useStores'
import { storesAPI } from '@/services/api'

import StorePageHeader from './components/StorePageHeader.vue'
import StoreTabsSidebar from './components/StoreTabsSidebar.vue'
import BranchesTab       from './components/detail/BranchesTab.vue'
import SmenasTab         from './components/detail/SmenasTab.vue'
import StoreDialog       from './components/StoreDialog.vue'
import BranchDialog      from './components/BranchDialog.vue'

const { t } = useI18n()

const {
  store, storeForm, storeDialog, submitted, loading, saving,
  openNewStoreDialog, openEditStoreDialog, saveStore,
  branches: allStoreBranches,
  branch, branchDialog, branchSubmitted,
  openNewBranchDialog, editBranch, saveBranch, confirmDeleteBranch,
} = useStores()

const storeDetail = ref(null)
const activeTab   = ref('branches')

const tabs = computed(() => [
  { id: 'branches', label: t('stores.detail.tab_branches'), icon: 'pi pi-sitemap' },
  { id: 'smenas',   label: t('stores.detail.tab_shifts'), icon: 'pi pi-clock' },
])

const loadDetail = async () => {
  if (!store.value?.id && !store.value?._id) return
  try {
    const res = await storesAPI.getById(store.value.id || store.value._id)
    storeDetail.value = res.data
  } catch (e) {
    console.error('Store detail fetch error:', e)
    storeDetail.value = store.value
  }
}

watch(store, (val) => {
  if (val?.id || val?._id) loadDetail()
}, { immediate: true })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

