<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Page Header -->
    <WarehouseHeader @add="openNewDialog" />

    <!-- Stats, Search & View Toggle -->
    <WarehouseFilters
      v-model:searchQuery="searchQuery"
      v-model:viewMode="viewMode"
      :count="warehouses.length"
    />

    <!-- Main Content -->
    <div class="relative min-h-[400px]">
      <!-- Loading State -->
      <div v-if="loading && !warehouses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredWarehouses.length" class="flex flex-col items-center justify-center py-32 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all">
        <div class="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 animate-bounce">
          <i class="pi pi-box text-4xl text-emerald-500/30"></i>
        </div>
        <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">
          {{ warehouses.length ? $t('warehouse.no_results') : $t('warehouse.no_warehouses') }}
        </h3>
        <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 text-center px-4">
          {{ searchQuery ? $t('warehouse.search_no_data') : $t('warehouse.no_warehouses_desc') }}
        </p>
        <button
          @click="searchQuery = ''"
          v-if="searchQuery"
          class="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg border border-slate-200 dark:border-slate-700 text-[11px] font-black uppercase tracking-widest active:scale-95"
        >
          <i class="pi pi-times"></i>
          {{ $t('warehouse.clear_filter') }}
        </button>
        <button
          v-else
          @click="openNewDialog"
          class="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg border border-slate-200 dark:border-slate-700 text-[11px] font-black uppercase tracking-widest active:scale-95"
        >
          <i class="pi pi-plus"></i>
          {{ $t('warehouse.add_first') }}
        </button>
      </div>

      <!-- Grid Display -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <WarehouseCard
          v-for="w in filteredWarehouses"
          :key="w.id || w._id"
          :warehouse="w"
          @edit="editWarehouse"
          @delete="confirmDelete"
          @move="goToBulk(w)"
        />
      </div>

      <!-- Table Display -->
      <div v-else class="pb-20">
        <WarehouseTable
          :warehouses="filteredWarehouses"
          @edit="editWarehouse"
          @delete="confirmDelete"
          @move="goToBulk"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalRecords > rows" class="flex justify-center pt-8 pb-12">
        <Paginator
          :rows="rows"
          :totalRecords="totalRecords"
          :first="(currentPage - 1) * rows"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="!bg-transparent !border-none !p-0 custom-paginator"
        />
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading && warehouses.length" class="absolute inset-0 bg-white/20 dark:bg-black/10 backdrop-blur-[2px] rounded-[3rem] flex items-center justify-center z-10">
        <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
          <i class="pi pi-spin pi-spinner text-emerald-500"></i>
        </div>
      </div>
    </div>

    <!-- Warehouse Dialog -->
    <WarehouseDialog
      v-model:visible="warehouseDialog"
      :warehouse="warehouse"
      :submitted="submitted"
      :saving="saving"
      @save="saveWarehouse"
    />

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Paginator from 'primevue/paginator'

import WarehouseHeader from './components/WarehouseHeader.vue'
import WarehouseFilters from './components/WarehouseFilters.vue'
import WarehouseCard from './components/WarehouseCard.vue'
import WarehouseTable from './components/WarehouseTable.vue'
import WarehouseDialog from './components/WarehouseDialog.vue'

import { useWarehouses } from './composables/useWarehouses'

const router = useRouter()
const {
  warehouses, loading, saving, warehouseDialog, submitted,
  viewMode, searchQuery, currentPage, rows, totalRecords,
  warehouse, filteredWarehouses,
  loadWarehouses, saveWarehouse, confirmDelete, openNewDialog, editWarehouse, onPageChange
} = useWarehouses()

const goToBulk = (w) => {
  router.push({ name: 'warehouse-bulk', params: { id: w.id || w._id } })
}

onMounted(() => loadWarehouses())
</script>

<style scoped>
.animate-in { animation: fadeIn 0.7s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom Emerald Paginator Styles */
:deep(.custom-paginator .p-paginator-page),
:deep(.custom-paginator .p-paginator-first),
:deep(.custom-paginator .p-paginator-prev),
:deep(.custom-paginator .p-paginator-next),
:deep(.custom-paginator .p-paginator-last) {
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 0.75rem !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  transition: all 0.3s ease !important;
  border: none !important;
  background-color: white !important;
  color: #94a3b8 !important;
  margin: 0.25rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.dark :deep(.custom-paginator .p-paginator-page),
.dark :deep(.custom-paginator .p-paginator-first),
.dark :deep(.custom-paginator .p-paginator-prev),
.dark :deep(.custom-paginator .p-paginator-next),
.dark :deep(.custom-paginator .p-paginator-last) {
  background-color: #1e293b !important;
}

:deep(.custom-paginator .p-paginator-page.p-highlight) {
  background-color: #10b981 !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2) !important;
  transform: scale(1.1) !important;
}

:deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #ecfdf5 !important;
  color: #10b981 !important;
}

.dark :deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #334155 !important;
}

:deep(.custom-paginator .p-link:focus) {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
}
</style>
