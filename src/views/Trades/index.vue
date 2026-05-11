<template>
  <div class="space-y-4 animate-in">
    <!-- Premium Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i :class="activeTab === 'sales' ? 'pi pi-receipt' : 'pi pi-refresh'" class="text-emerald-500"></i>
          {{ activeTab === 'sales' ? ($t('menu.trades') || 'Savdolar') : 'Qaytarishlar' }}
          <span class="text-[11px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">
            {{ activeTab === 'sales' ? totalRecords : returnRecords }} ta
          </span>
        </h1>
        <p class="text-xs text-slate-400 mt-0.5 tracking-widest font-bold text-[11px]">
          {{ activeTab === 'sales' ? 'Barcha amalga oshirilgan savdolar' : 'Mijozlardan qaytarilgan tovarlar tarixi' }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Sales export buttons (only visible when in sales tab) -->
        <template v-if="activeTab === 'sales'">
          <Button 
            @click="exportSales('excel')"
            :loading="exportLoadingType === 'excel'"
            :disabled="!!exportLoadingType"
            icon="pi pi-file-excel"
            label="Excel"
            class="!text-[12px] !font-bold !rounded-lg !border-slate-200 dark:!border-slate-800 hover:!bg-slate-100 dark:hover:!bg-slate-800 !px-3 !py-2 text-slate-700 dark:text-slate-200"
            severity="secondary"
            outlined
          />
          <Button 
            @click="exportSales('pdf')"
            :loading="exportLoadingType === 'pdf'"
            :disabled="!!exportLoadingType"
            icon="pi pi-file-pdf"
            label="PDF"
            class="!text-[12px] !font-bold !rounded-lg !border-slate-200 dark:!border-slate-800 hover:!bg-slate-100 dark:hover:!bg-slate-800 !px-3 !py-2 text-slate-700 dark:text-slate-200"
            severity="secondary"
            outlined
          />
        </template>

        <Button 
          v-if="settingsStore.isSaleReturnEnabled"
          @click="openReturnModal"
          icon="pi pi-plus"
          label="Yangi Qaytarish"
          class="!text-[12px] !font-bold !!tracking-widest !rounded-lg !bg-emerald-500 !border-none !px-4 !py-2 !shadow-sm hover:!bg-emerald-600 active:scale-95 transition-all text-white"
        />
      </div>
    </div>

    <!-- Tab Switcher & Main Content -->
    <div class="space-y-4">
      <Tabs v-model:value="activeTab" class="!bg-transparent border-none">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabList class="!bg-slate-100/80 dark:!bg-slate-800/80 !p-1 !rounded-xl !border-none !inline-flex">
            <Tab value="sales" class="!text-[12px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
              <i class="pi pi-receipt mr-2 !text-[11px]"></i>
              Savdolar
            </Tab>
            <Tab v-if="settingsStore.isSaleReturnEnabled" value="returns" class="!text-[12px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
              <i class="pi pi-refresh mr-2 !text-[11px]"></i>
              Qaytarishlar
            </Tab>
          </TabList>

          <!-- Search & Filter Container Integrated into same row as Tabs -->
          <div class="flex-grow max-w-[500px] w-full">
            <TradeFilter 
              v-if="activeTab === 'sales'"
              v-model:searchQuery="searchQuery"
              :filters="filters"
              @update:filter="filters = { ...filters, ...$event }"
              @search="handleSearch"
              @reset="resetFilters"
            />
            <div v-else class="relative group">
              <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                v-model="returnSearch"
                type="text"
                placeholder="Qaytarishlardan qidirish..."
                class="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        <TabPanels class="!bg-transparent !p-0">
          <!-- Tab: Sales -->
          <TabPanel value="sales">
            <TradeTable 
              :trades="trades"
              :loading="loading"
              :total-records="totalRecords"
              :page="page"
              :page-size="pageSize"
              @view="viewTrade"
              @page-change="onPageChange"
            />
          </TabPanel>

          <!-- Tab: Returns -->
          <TabPanel v-if="settingsStore.isSaleReturnEnabled" value="returns">
            <ReturnTable 
              :returns="returns"
              :loading="returnLoading"
              :total-records="returnRecords"
              :page="returnPage"
              :page-size="returnPageSize"
              @view="viewReturnItem"
              @page-change="onReturnPageChange"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- Transaction Detail Modals -->
    <TradeDetailModal 
      v-if="selectedTrade"
      v-model:visible="displayDetail"
      :trade="selectedTrade"
      @init-return="handleInitReturn"
      @trade-cancelled="loadTrades"
    />

    <ReturnDetailModal 
      v-if="selectedReturn"
      v-model:visible="displayReturnDetail"
      :return-item="selectedReturn"
    />

    <SaleReturnModal 
      v-model:visible="displayCreateReturn"
      :initial-sale="returnInitialSale"
      @success="handleReturnSuccess"
    />
    
    <!-- Loading Overlay for Detail Fetch -->
    <div v-if="loadingDetail || returnLoadingDetail" class="fixed inset-0 z-[110] bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center">
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="6" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'

import { useTrades } from './composables/useTrades'
import { useSaleReturns } from './composables/useSaleReturns'
import { useSettingsStore } from '@/store/settings'

import TradeTable from './components/TradeTable.vue'
import ReturnTable from './components/ReturnTable.vue'
import TradeFilter from './components/TradeFilter.vue'
import TradeDetailModal from '@/views/Customers/components/TradeDetailModal.vue'
import SaleReturnModal from './components/SaleReturnModal.vue'
import ReturnDetailModal from './components/ReturnDetailModal.vue'

const settingsStore = useSettingsStore()
const activeTab = ref('sales')

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
  onPageChange,
  loadTrades,
  exportLoadingType,
  exportSales
} = useTrades()

const {
  loading: returnLoading,
  returns,
  totalRecords: returnRecords,
  page: returnPage,
  pageSize: returnPageSize,
  searchQuery: returnSearch,
  selectedReturn,
  displayDetail: displayReturnDetail,
  loadingDetail: returnLoadingDetail,
  loadReturns,
  viewReturn: viewReturnItem,
  onPageChange: onReturnPageChange
} = useSaleReturns()

const displayCreateReturn = ref(false)
const returnInitialSale = ref(null)

const openReturnModal = () => {
  returnInitialSale.value = null
  displayCreateReturn.value = true
}

const handleInitReturn = (sale) => {
  returnInitialSale.value = sale
  displayDetail.value = false
  displayCreateReturn.value = true
}

const handleReturnSuccess = () => {
  if (activeTab.value === 'returns') {
    loadReturns()
  } else {
    loadTrades()
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'returns' && returns.value.length === 0) {
    loadReturns()
  }
})
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


