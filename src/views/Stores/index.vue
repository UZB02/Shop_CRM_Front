<template>
  <div class="space-y-4 pb-[80px] lg:pb-0 relative min-h-[calc(100vh-4rem)]">
    <!-- Sticky Header Wrapper -->
    <div class="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-3 bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-xl lg:backdrop-blur-none lg:static lg:mx-0 lg:p-0 lg:bg-transparent dark:lg:bg-transparent shadow-sm lg:shadow-none border-b border-slate-200 dark:border-slate-800 lg:border-none dark:lg:border-none">
      <StorePageHeader
        :storeName="storeDetail?.name"
        :branchCount="allStoreBranches?.length || 0"
        :hasStore="!!storeDetail"
        :showAddBranch="activeTab === 'branches'"
        @add-store="openNewStoreDialog"
        @edit-store="openEditStoreDialog"
        @add-branch="openNewBranchDialog"
      />
    </div>

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
          @select="setActiveTab"
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
          @click="notificationStore.canAddBranch ? openNewStoreDialog() : null"
          v-tooltip.bottom="limitTooltip"
          class="inline-flex items-center gap-2 h-9 px-6 rounded-lg text-sm font-medium transition-all"
          :class="[
            notificationStore.canAddBranch 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
          ]"
        >
          <i :class="notificationStore.canAddBranch ? 'pi pi-plus' : 'pi pi-lock'" class="text-xs"></i>
          <span>{{ $t('stores.add_store') }}</span>
        </button>
      </div>
    </template>

    <!-- Mobile Sticky Action Bar -->
    <div v-if="storeDetail" class="lg:hidden fixed bottom-[68px] left-0 right-0 z-40 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-around gap-2">
      <button
        @click="openEditStoreDialog"
        class="flex-[0.5] h-12 rounded-xl text-[12px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-sm"
      >
        <i class="pi pi-pencil text-xs"></i>
      </button>

      <button
        v-if="activeTab === 'branches'"
        @click="notificationStore.canAddBranch ? openNewBranchDialog() : null"
        :disabled="!notificationStore.canAddBranch"
        class="flex-[2] h-12 rounded-xl text-[12px] font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale"
      >
        <div class="flex items-center gap-2">
          <i :class="notificationStore.canAddBranch ? 'pi pi-plus' : 'pi pi-lock'" class="text-xs"></i>
          <span>{{ $t('stores.new_branch') }}</span>
        </div>
      </button>
    </div>

    <!-- Dialogs -->
    <StoreDialog
      v-model:visible="storeDialog"
      :store="storeForm"
      :regions="regions"
      :submitted="submitted"
      :saving="saving"
      @save="saveStore"
      @hide="storeDialog = false"
    />

    <BranchDialog
      v-model:visible="branchDialog"
      :branch="branch"
      :regions="regions"
      :submitted="branchSubmitted"
      :saving="saving"
      @save="saveBranch"
      @hide="branchDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStores } from './composables/useStores'
import { storesAPI } from '@/services/api'

import StorePageHeader from './components/StorePageHeader.vue'
import StoreTabsSidebar from './components/StoreTabsSidebar.vue'
import BranchesTab       from './components/detail/BranchesTab.vue'
import SmenasTab         from './components/detail/SmenasTab.vue'
import StoreDialog       from './components/StoreDialog.vue'
import BranchDialog      from './components/BranchDialog.vue'

import { useSettingsStore } from '@/store/settings'
import { useNotificationStore } from '@/store/notifications'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const notificationStore = useNotificationStore()

const limitTooltip = computed(() => {
  if (notificationStore.canAddBranch) return null
  const b = notificationStore.usage?.branches
  if (!b) return null
  return t('subscription.limit_reached', { used: b.used, limit: b.limit })
})

const {
  store, storeForm, storeDialog, submitted, loading, saving,
  regions,
  openNewStoreDialog, openEditStoreDialog, saveStore,
  branches: allStoreBranches,
  branch, branchDialog, branchSubmitted,
  openNewBranchDialog, editBranch, saveBranch, confirmDeleteBranch,
} = useStores()

const storeDetail = ref(null)

// Initialize activeTab from URL query params (default: 'branches')
const activeTab = ref(route.query.tab && ['branches', 'smenas'].includes(route.query.tab) ? route.query.tab : 'branches')

// Keep activeTab in sync when browser query changes (e.g. back/forward navigation)
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && ['branches', 'smenas'].includes(newTab) && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  }
)

// Update URL query parameter when activeTab changes
const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
  router.replace({
    query: {
      ...route.query,
      tab: tabKey
    }
  })
}

const tabs = computed(() => {
  const list = [
    { id: 'branches', label: t('stores.detail.tab_branches'), icon: 'pi pi-sitemap' }
  ]
  if (settingsStore.isShiftEnabled) {
    list.push({ id: 'smenas', label: t('stores.detail.tab_shifts'), icon: 'pi pi-clock' })
  }
  return list
})

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



