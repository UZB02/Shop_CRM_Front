<template>
  <div class="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-12 px-4 sm:px-6">

    <!-- Store Info Header -->
    <div v-if="loading" class="bg-white dark:bg-slate-900/80 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 animate-pulse flex items-center gap-5">
      <div class="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 shrink-0"></div>
      <div class="flex-1 space-y-3">
        <div class="h-6 bg-slate-100 dark:bg-slate-800 rounded w-48"></div>
        <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-64"></div>
      </div>
    </div>

    <template v-else-if="storeDetail">
      <!-- Store Header Card with Edit Button -->
      <StoreDetailHeader :store="storeDetail" @edit="openEditStoreDialog" />

      <div class="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <!-- Tabs -->
        <div class="flex-1 min-w-0 flex items-center p-1.5 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
            :class="activeTab === tab.id
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Add Button (Compact on Mobile) -->
        <button
          v-if="activeTab === 'branches'"
          @click="openNewBranchDialog"
          class="shrink-0 w-11 h-11 sm:w-auto sm:px-5 sm:py-3 rounded-2xl sm:rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <i class="pi pi-plus text-xs sm:text-[10px]"></i>
          <span class="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{{ $t('stores.new_branch') }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div>
        <BranchesTab
          v-if="activeTab === 'branches'"
          :branches="storeDetail?.branches"
          @edit="editBranch"
          @delete="confirmDeleteBranch"
        />
        <SmenasTab   v-if="activeTab === 'smenas'"   :smenas="storeDetail?.open_smenas" />
        <SettingsTab v-if="activeTab === 'settings'" :store="storeDetail" />
      </div>
    </template>

    <!-- No Store State -->
    <template v-else>
      <div class="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 text-center">
        <div class="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
          <i class="pi pi-building text-3xl text-slate-300"></i>
        </div>
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">{{ $t('stores.no_store') }}</h3>
        <button @click="openNewStoreDialog" class="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20">
          <i class="pi pi-plus font-bold"></i>{{ $t('stores.add_store') }}
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStores } from './composables/useStores'
import { storesAPI } from '@/services/api'

import StoreDetailHeader from './components/detail/StoreDetailHeader.vue'
import BranchesTab       from './components/detail/BranchesTab.vue'
import SmenasTab         from './components/detail/SmenasTab.vue'
import SettingsTab       from './components/detail/SettingsTab.vue'
import StoreDialog       from './components/StoreDialog.vue'
import BranchDialog      from './components/BranchDialog.vue'

const { t } = useI18n()

const {
  store, storeForm, storeDialog, submitted, loading, saving,
  openNewStoreDialog, openEditStoreDialog, saveStore,
  branch, branchDialog, branchSubmitted,
  openNewBranchDialog, editBranch, saveBranch, confirmDeleteBranch,
} = useStores()

// ── Detail state (loaded separately via getById for full nested data) ──────
const storeDetail = ref(null)
const activeTab   = ref('branches')

const tabs = computed(() => [
  { id: 'branches', label: t('stores.detail.tab_branches') },
  { id: 'smenas',   label: t('stores.detail.tab_shifts') },
  { id: 'settings', label: t('stores.detail.tab_settings') },
])

const loadDetail = async () => {
  // Wait until useStores has fetched the basic store info
  if (!store.value?.id && !store.value?._id) return
  try {
    const res = await storesAPI.getById(store.value.id || store.value._id)
    console.log('🏪 Store Detail:', res.data)
    storeDetail.value = res.data
  } catch (e) {
    console.error('Store detail fetch error:', e)
    storeDetail.value = store.value // fallback to list data
  }
}

// Watch for store to be populated, then load detail
import { watch } from 'vue'
watch(store, (val) => {
  if (val?.id || val?._id) loadDetail()
}, { immediate: true })
</script>

<style scoped>
.animate-in { animation: fadeIn 0.7s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
