<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{{ $t('stores.page_title') }}</h1>
    </div>

    <!-- ─── Store Info Card ─────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <template v-if="loading">
        <div class="p-6 sm:p-8 flex items-start gap-5 animate-pulse">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>
          <div class="flex-1 space-y-3">
            <div class="h-5 bg-slate-100 dark:bg-slate-800 rounded w-48"></div>
            <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-64"></div>
          </div>
        </div>
      </template>

      <template v-else-if="store.id || store._id">
        <div class="p-5 sm:p-8">
          <!-- Top row: icon + name + status + edit (always horizontal) -->
          <div class="flex items-center gap-3 sm:gap-5 mb-3 sm:mb-0">
            <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-building text-xl sm:text-2xl text-emerald-500"></i>
            </div>

            <!-- Name + details -->
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">
                {{ store.name }}
              </h2>
              <!-- Detail info - wraps on mobile -->
              <div class="mt-1 sm:mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span v-if="store.location" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <i class="pi pi-map-marker text-[9px] text-emerald-500"></i>{{ store.location }}
                </span>
                <span v-if="store.phone" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <i class="pi pi-phone text-[9px] text-emerald-500"></i>{{ store.phone }}
                </span>
                <span v-if="store.openingHours" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <i class="pi pi-clock text-[9px] text-emerald-500"></i>{{ store.openingHours }}
                </span>
                <span v-if="store.address" class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <i class="pi pi-home text-[9px] text-emerald-500"></i>{{ store.address }}
                </span>
              </div>
            </div>

            <!-- Status + Edit (always on the right) -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                store.status === 'active'
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              ]">
                {{ store.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
              </span>
              <button
                @click="openEditStoreDialog"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                :title="$t('stores.edit_store')"
              >
                <i class="pi pi-pencil text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="p-8 text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-building text-2xl text-slate-400"></i>
          </div>
          <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{{ $t('stores.no_store') }}</p>
          <button
            @click="openNewStoreDialog"
            class="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            <i class="pi pi-plus mr-2"></i>{{ $t('stores.add_store') }}
          </button>
        </div>
      </template>
    </div>

    <!-- ─── Branches Section ────────────────────────────── -->
    <div>
      <!-- Header row: title + add button -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <i class="pi pi-sitemap text-sm text-blue-500"></i>
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{{ $t('stores.branches_title') }}</h2>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {{ filteredBranches.length }}<template v-if="branchSearch"> / {{ branches.length }}</template> {{ $t('stores.count_suffix') }}
            </p>
          </div>
        </div>
        <button
          @click="openNewBranchDialog"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
        >
          <i class="pi pi-plus text-[10px]"></i>
          <span class="hidden sm:inline">{{ $t('stores.new_branch') }}</span>
          <span class="sm:hidden">{{ $t('stores.add_branch') }}</span>
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1 relative">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
          <input
            v-model="branchSearch"
            type="text"
            :placeholder="$t('stores.search_placeholder')"
            class="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
          />
          <button
            v-if="branchSearch"
            @click="branchSearch = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>
        
        <!-- Status Filter -->
        <div class="w-full sm:w-48">
          <Dropdown
            v-model="branchStatusFilter"
            :options="statusFilterOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full !rounded-2xl !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-sm custom-filter-dropdown"
          />
        </div>
      </div>

      <!-- Branches Table -->
      <BranchTable
        :branches="filteredBranches"
        :loading="loading"
        @edit="editBranch"
        @delete="confirmDeleteBranch"
      />
    </div>

    <!-- ─── Dialogs ─────────────────────────────────────── -->
    <StoreDialog
      v-model:visible="storeDialog"
      :store="storeForm"
      :submitted="submitted"
      :saving="saving"
      @save="saveStore"
      @hide="hideDialog"
    />

    <BranchDialog
      v-model:visible="branchDialog"
      :branch="branch"
      :submitted="branchSubmitted"
      :saving="saving"
      @save="saveBranch"
      @hide="hideBranchDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import Dropdown from 'primevue/dropdown'

import BranchTable from './components/BranchTable.vue'
import StoreDialog from './components/StoreDialog.vue'
import BranchDialog from './components/BranchDialog.vue'
import { storesAPI, branchesAPI } from '@/services/api'

const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const store = ref({})
const storeForm = ref({})
const branches = ref([])
const loading = ref(false)
const saving = ref(false)
const storeDialog = ref(false)
const branchDialog = ref(false)
const submitted = ref(false)
const branchSubmitted = ref(false)
const branchSearch = ref('')
const branchStatusFilter = ref('all')

const statusFilterOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('stores.status_active'), value: 'active' },
  { label: t('stores.status_inactive'), value: 'inactive' }
])

const branch = ref({ name: '', address: '', phone: '', status: 'active' })

const filteredBranches = computed(() => {
  let result = branches.value
  
  // Filter by status
  if (branchStatusFilter.value !== 'all') {
    result = result.filter(b => b.status === branchStatusFilter.value)
  }
  
  // Filter by search query
  const q = branchSearch.value.trim().toLowerCase()
  if (q) {
    result = result.filter(b =>
      (b.name || '').toLowerCase().includes(q) ||
      (b.phone || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q)
    )
  }
  
  return result
})

// ─── Load ─────────────────────────────────────────────────
const loadData = async () => {
  loading.value = true
  try {
    const [storesRes, branchesRes] = await Promise.all([
      storesAPI.getAll(),
      branchesAPI.getAll()
    ])
    const list = storesRes.data?.results ?? (Array.isArray(storesRes.data) ? storesRes.data : [])
    store.value = list.length > 0 ? list[0] : {}
    branches.value = branchesRes.data?.results ?? (Array.isArray(branchesRes.data) ? branchesRes.data : [])
  } catch {
    toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.load_error'), life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => loadData())

// ─── Store ─────────────────────────────────────────────────
const openNewStoreDialog = () => {
  storeForm.value = { name: '', location: '', phone: '', status: 'active' }
  submitted.value = false
  storeDialog.value = true
}

const openEditStoreDialog = () => {
  storeForm.value = { ...store.value }
  submitted.value = false
  storeDialog.value = true
}

const hideDialog = () => {
  storeDialog.value = false
  submitted.value = false
}

const saveStore = async () => {
  submitted.value = true
  if (!storeForm.value.name?.trim()) return
  saving.value = true
  try {
    const id = storeForm.value.id || storeForm.value._id
    if (id) {
      await storesAPI.update(id, storeForm.value)
      toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_updated'), life: 3000 })
    } else {
      await storesAPI.create(storeForm.value)
      toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_added'), life: 3000 })
    }
    storeDialog.value = false
    loadData()
  } catch {
    toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 3000 })
  } finally {
    saving.value = false
  }
}

// ─── Branch ────────────────────────────────────────────────
const openNewBranchDialog = () => {
  branch.value = { name: '', address: '', phone: '', status: 'active' }
  branchSubmitted.value = false
  branchDialog.value = true
}

const hideBranchDialog = () => {
  branchDialog.value = false
  branchSubmitted.value = false
}

const saveBranch = async () => {
  branchSubmitted.value = true
  if (!branch.value.name?.trim()) return
  saving.value = true
  try {
    const id = branch.value.id || branch.value._id
    const payload = { 
      name: branch.value.name, 
      address: branch.value.address, 
      phone: branch.value.phone,
      status: branch.value.status 
    }
    if (id) {
      await branchesAPI.update(id, payload)
      toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_updated'), life: 3000 })
    } else {
      await branchesAPI.create(payload)
      toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_added'), life: 3000 })
    }
    branchDialog.value = false
    loadData()
  } catch {
    toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 3000 })
  } finally {
    saving.value = false
  }
}

const editBranch = (data) => {
  branch.value = { ...data }
  branchDialog.value = true
}

const confirmDeleteBranch = (data) => {
  confirm.require({
    message: t('stores.branch_delete_confirm', { name: data.name }),
    header: t('stores.confirm_title'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await branchesAPI.delete(data.id || data._id)
        toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_deleted'), life: 3000 })
        loadData()
      } catch {
        toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.delete_error'), life: 3000 })
      }
    }
  })
}
</script>

<style scoped>
.animate-in { animation-duration: 0.4s; }
</style>
