<template>
  <div class="space-y-4">
    <!-- Header -->
    <WorkerPageHeader
      :totalWorkers="totalRecords"
    />

    <!-- Main layout -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Branches -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <BranchSidebar
          :branches="branches"
          :selectedId="filters.branch"
          :totalWorkers="totalRecords"
          @select="onBranchSelect"
        />
      </div>

      <!-- Right: Filters + Table -->
      <div class="flex-1 min-w-0 space-y-3">
        <WorkerFilters
          v-model="filters"
          :role-options="roleOptions"
          :status-options="statusOptions"
          :branches="branches"
          :loading-locations="storesLoading"
        />

        <WorkerTable
          :workers="workers"
          :loading="loading"
          :total-records="totalRecords"
          v-model:page="page"
          v-model:pageSize="pageSize"
          @edit="editWorker"
          @delete="confirmDeleteWorker"
          @open-target="openTargetModal"
          @page-change="loadWorkers"
        />
      </div>
    </div>

    <!-- KPI Target Modal -->
    <SetTargetModal 
      v-model="targetModalVisible" 
      :kpi="selectedKpi"
      @saved="loadWorkers"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Components
import WorkerTable from './components/WorkerTable.vue'
import WorkerFilters from './components/WorkerFilters.vue'
import WorkerPageHeader from './components/WorkerPageHeader.vue'
import BranchSidebar from './components/BranchSidebar.vue'
import SetTargetModal from './components/SetTargetModal.vue'

// Composables
import { useWorkers } from './composables/useWorkers'
import { useWorkerActions } from './composables/useWorkerActions'

const router = useRouter()
const route = useRoute()

// List & Filters Logic
const {
    workers,
    totalRecords,
    page,
    pageSize,
    loading,
    filters,
    branches,
    storesLoading,
    roleOptions,
    statusOptions,
    loadWorkers,
    loadLocations
} = useWorkers()

// Actions Logic (Edit, Save, Delete)
const {
    worker,
    workerDialog,
    saving,
    submitted,
    createLogin,
    editWorker: legacyEditWorker,
    saveWorker,
    confirmDeleteWorker,
    hideDialog,
    targetModalVisible,
    selectedKpi,
    openTargetModal
} = useWorkerActions(loadWorkers)

const editWorker = (w) => {
    router.push({ name: 'worker-edit', params: { id: w.id || w._id } })
}

const onBranchSelect = (branchId) => {
  filters.value.branch = branchId
  page.value = 1
  loadWorkers()
}

// Initialization
onMounted(async () => {
    await Promise.all([loadWorkers(), loadLocations()])
    
    // Check for edit query param
    if (route.query.edit) {
        const id = route.query.edit
        router.push({ name: 'worker-edit', params: { id } })
    }
})
</script>

<style scoped>
/* Core layout styles remain minimal as logic and component-specific styles were moved */
</style>



