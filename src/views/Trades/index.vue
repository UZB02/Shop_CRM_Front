<template>
  <div class="px-3 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
    <!-- Premium Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pt-4">
      <div class="space-y-1">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-white/5">
            <i class="pi pi-receipt text-lg"></i>
          </div>
          <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{{ $t('menu.trades') }}</h1>
        </div>
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
          {{ totalRecords }} {{ $t('customers.trades.count', { count: '' }).trim() }} tizimda qayd etilgan
        </p>
      </div>

      <!-- Quick Stats / Actions Row -->
      <div class="flex items-center gap-3">
        <TradeFilter 
          v-model:searchQuery="searchQuery"
          :filters="filters"
          @update:filter="filters = { ...filters, ...$event }"
          @search="handleSearch"
          @reset="resetFilters"
        />
      </div>
    </div>

    <!-- Main Content: Trades Table -->
    <TradeTable 
      :trades="trades"
      :loading="loading"
      :total-records="totalRecords"
      :page="page"
      :page-size="pageSize"
      @view="viewTrade"
      @page-change="onPageChange"
    />

    <!-- Transaction Detail Modal -->
    <TradeDetailModal 
      v-if="selectedTrade"
      v-model:visible="displayDetail"
      :trade="selectedTrade"
    />
    
    <!-- Loading Overlay for Detail Fetch -->
    <div v-if="loadingDetail" class="fixed inset-0 z-[110] bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center">
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="6" />
    </div>
  </div>
</template>

<script setup>
import { useTrades } from './composables/useTrades'
import TradeTable from './components/TradeTable.vue'
import TradeFilter from './components/TradeFilter.vue'
import TradeDetailModal from '@/views/Customers/components/TradeDetailModal.vue'
import ProgressSpinner from 'primevue/progressspinner'

const {
  loading,
  trades,
  totalRecords,
  page,
  pageSize,
  searchQuery,
  filters,
  selectedTrade,
  displayDetail,
  loadingDetail,
  handleSearch,
  resetFilters,
  viewTrade,
  onPageChange
} = useTrades()
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
