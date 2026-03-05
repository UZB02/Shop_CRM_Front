<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{{ $t('workers.management_title') }}</h1>
        <p class="text-slate-500 text-sm mt-1">{{ $t('workers.management_subtitle') }}</p>
      </div>
      <Button 
        :label="$t('workers.new_worker')" 
        icon="pi pi-user-plus" 
        severity="success" 
        class="shadow-sm w-full sm:w-auto" 
        @click="openNew" 
      />
    </div>

    <!-- Filters Section -->
    <WorkerFilters 
      v-model="filters"
      :role-options="roleOptions"
      :status-options="statusOptions"
      :stores="stores"
      :stores-loading="storesLoading"
    />

    <!-- Workers Table Component -->
    <WorkerTable 
      :workers="workers" 
      :loading="loading" 
      :total-records="totalRecords"
      v-model:page="page"
      v-model:pageSize="pageSize"
      @edit="editWorker" 
      @delete="confirmDeleteWorker" 
      @page-change="loadWorkers"
    />

    <!-- Worker Dialog Component -->
    <WorkerDialog 
      v-model:visible="workerDialog"
      v-model:createLogin="createLogin"
      :worker="worker"
      :branches="branches"
      :saving="saving"
      :submitted="submitted"
      @save="saveWorker"
      @hide="hideDialog"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'

// Components
import WorkerTable from './components/WorkerTable.vue'
import WorkerDialog from './components/WorkerDialog.vue'
import WorkerFilters from './components/WorkerFilters.vue'

// Composables
import { useWorkers } from './composables/useWorkers'
import { useWorkerActions } from './composables/useWorkerActions'

const route = useRoute()

// List & Filters Logic
const {
    workers,
    totalRecords,
    page,
    pageSize,
    loading,
    filters,
    stores,
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
    openNew,
    editWorker,
    saveWorker,
    confirmDeleteWorker,
    hideDialog
} = useWorkerActions(loadWorkers)

// Initialization
onMounted(async () => {
    await Promise.all([loadWorkers(), loadLocations()])
    
    // Check for edit query param
    if (route.query.edit) {
        const id = route.query.edit
        const workerToEdit = workers.value.find(w => (w.id || w._id).toString() === id.toString())
        if (workerToEdit) {
            editWorker(workerToEdit)
        } else {
            // If not in current list (already handled in editWorker with API call internally)
            editWorker({ id })
        }
    }
})
</script>

<style scoped>
/* Core layout styles remain minimal as logic and component-specific styles were moved */
</style>
