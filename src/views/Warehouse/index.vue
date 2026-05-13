<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <WarehousePageHeader @add="openNewDialog" @export="exportStocks" />

    <!-- Stats, Search & View Toggle -->
    <WarehouseMinimalFilters
      v-model:searchQuery="searchQuery"
      v-model:viewMode="viewMode"
      :count="warehouses.length"
    />

    <!-- Main Content -->
    <div class="relative min-h-[400px]">
      <!-- Loading State -->
      <div v-if="loading && !warehouses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-64 rounded-xl bg-white dark:bg-slate-900 animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredWarehouses.length" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-all">
        <div class="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
          <i class="pi pi-box text-2xl text-emerald-500/30"></i>
        </div>
        <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {{ warehouses.length ? $t('warehouse.no_results') : $t('warehouse.no_warehouses') }}
        </h3>
        <p class="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-6 text-center px-4">
          {{ searchQuery ? $t('warehouse.search_no_data') : $t('warehouse.no_warehouses_desc') }}
        </p>
        <button
          @click="searchQuery = ''"
          v-if="searchQuery"
          class="flex items-center gap-2 h-9 px-6 rounded-lg bg-white dark:bg-slate-800 text-emerald-500 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <i class="pi pi-times text-[12px]"></i>
          {{ $t('warehouse.clear_filter') }}
        </button>
        <button
          v-else
          @click="notificationStore.canAddWarehouse ? openNewDialog() : null"
          v-tooltip.bottom="limitTooltip"
          class="flex items-center gap-2 h-9 px-6 rounded-lg text-xs font-semibold transition-all shadow-sm"
          :class="[
            notificationStore.canAddWarehouse 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale bg-opacity-50'
          ]"
        >
          <i :class="notificationStore.canAddWarehouse ? 'pi pi-plus' : 'pi pi-lock'" class="text-[12px]"></i>
          {{ $t('warehouse.add_first') }}
        </button>
      </div>

      <!-- Grid Display -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
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
      <div v-else class="pb-12 h-full">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-full">
           <WarehouseTable
              :warehouses="filteredWarehouses"
              @edit="editWarehouse"
              @delete="confirmDelete"
              @move="goToBulk"
           />
        </div>
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
      <div v-if="loading && warehouses.length" class="absolute inset-0 bg-white/20 dark:bg-black/10 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
        <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
          <i class="pi pi-spin pi-spinner text-emerald-500"></i>
        </div>
      </div>
    </div>

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
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Paginator from 'primevue/paginator'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/store/notifications'

import WarehousePageHeader from './components/WarehousePageHeader.vue'
import WarehouseMinimalFilters from './components/WarehouseMinimalFilters.vue'
import WarehouseCard from './components/WarehouseCard.vue'
import WarehouseTable from './components/WarehouseTable.vue'
import WarehouseDialog from './components/WarehouseDialog.vue'

import { useWarehouses } from './composables/useWarehouses'

const router = useRouter()
const notificationStore = useNotificationStore()

const {
  warehouses, loading, saving, warehouseDialog, submitted,
  viewMode, searchQuery, currentPage, rows, totalRecords,
  warehouse, filteredWarehouses,
  loadWarehouses, saveWarehouse, confirmDelete, openNewDialog, editWarehouse, onPageChange, exportStocks
} = useWarehouses()

const { t } = useI18n()

const limitTooltip = computed(() => {
  const w = notificationStore.usage?.warehouses
  if (!w || w.can_add) return null
  return t('subscription.limit_reached', { used: w.used, limit: w.limit })
})

const goToBulk = (w) => {
  router.push({ name: 'warehouse-bulk', params: { id: w.id || w._id } })
}

onMounted(() => loadWarehouses())
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

/* Custom Emerald Paginator Styles */
:deep(.custom-paginator .p-paginator-page),
:deep(.custom-paginator .p-paginator-first),
:deep(.custom-paginator .p-paginator-prev),
:deep(.custom-paginator .p-paginator-next),
:deep(.custom-paginator .p-paginator-last) {
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 0.5rem !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  transition: all 0.3s ease !important;
  border: 1px solid #e2e8f0 !important;
  background-color: white !important;
  color: #64748b !important;
  margin: 0.125rem !important;
}

.dark :deep(.custom-paginator .p-paginator-page),
.dark :deep(.custom-paginator .p-paginator-first),
.dark :deep(.custom-paginator .p-paginator-prev),
.dark :deep(.custom-paginator .p-paginator-next),
.dark :deep(.custom-paginator .p-paginator-last) {
  background-color: #0f172a !important;
  border-color: #1e293b !important;
  color: #94a3b8 !important;
}

:deep(.custom-paginator .p-paginator-page.p-highlight) {
  background-color: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}

:deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #f8fafc !important;
  color: #10b981 !important;
  border-color: #10b981 !important;
}

.dark :deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #1e293b !important;
}
</style>


