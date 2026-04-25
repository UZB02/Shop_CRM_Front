<template>
  <div class="space-y-4">
    <!-- Header -->
    <WarehouseDetailPageHeader
      :warehouse="warehouse"
      @movement="openMovementDialog"
      @transfer="openNewTransferHandler"
    />

    <!-- Main layout -->
    <div v-if="loading && !warehouse" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="warehouse" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <WarehouseTabsSidebar
          :tabs="navTabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0 relative">
        <!-- Tab Loading Progress -->
        <div v-if="tabLoading" class="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden rounded-full z-10">
          <div class="h-full bg-emerald-500/40 animate-loading translate-x-[-100%]"></div>
        </div>
        
        <Transition name="fade-slide" mode="out-in">

          <!-- ===== MAHSULOTLAR TAB ===== -->
          <div v-if="activeTab === 'products'" key="products" class="space-y-3">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <!-- Table toolbar -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                <div class="relative">
                  <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    v-model="productSearch"
                    type="text"
                    :placeholder="$t('warehouse.detail.search_products')"
                    class="h-8 pl-8 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 w-64 transition-all"
                  />
                </div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ filteredProducts.length }} / {{ warehouse?.products?.length ?? 0 }} {{ $t('products.title') }}
                </div>
              </div>

              <!-- Products table -->
              <div v-if="filteredProducts.length" class="overflow-x-auto">
                <table class="w-full text-left min-w-[700px]">
                  <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">№</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('products.col_product') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('products.form.barcode') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.amount') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.col_price') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('common.date') }}</th>
                      <th v-if="settingsStore.isWastageEnabled" class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-12">{{ $t('common.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <tr
                      v-for="(item, index) in filteredProducts"
                      :key="item.product_id"
                      class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td class="px-4 py-2 text-[10px] text-slate-400">{{ index + 1 }}</td>
                      <td class="px-4 py-2">
                        <span class="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">
                          {{ item.product_name }}
                        </span>
                      </td>
                      <td class="px-4 py-2">
                        <code class="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                          {{ item.barcode || '—' }}
                        </code>
                      </td>
                      <td class="px-4 py-2 text-right">
                        <span 
                          class="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold text-[10px]"
                          :class="settingsStore.isLowStockEnabled && item.quantity <= settingsStore.lowStockThreshold 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'"
                         >
                          {{ item.quantity }}
                        </span>
                      </td>
                      <td class="px-4 py-2 text-right text-[10px] text-slate-500 dark:text-slate-400">
                        {{ Number(item.purchase_price || 0).toLocaleString() }}
                      </td>
                      <td class="px-4 py-2 text-right font-medium text-slate-700 dark:text-slate-200 text-xs">
                        {{ Number(item.sale_price || 0).toLocaleString() }}
                      </td>
                      <td class="px-4 py-2 text-right text-[10px] text-slate-400">
                        {{ item.added_on?.split('|')[0]?.trim() || '—' }}
                      </td>
                      <td v-if="settingsStore.isWastageEnabled" class="px-4 py-2 text-center">
                        <button 
                          @click="openWastageModal(item)"
                          v-tooltip.left="$t('warehouse.wastage.create_title')"
                          class="w-7 h-7 rounded-lg bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-90"
                        >
                          <i class="pi pi-exclamation-circle text-[9px]"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                  <i class="pi pi-inbox text-slate-400 text-lg"></i>
                </div>
                <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {{ productSearch ? $t('warehouse.detail.no_search_results') : $t('warehouse.detail.no_warehouse_products') }}
                </p>
              </div>
            </div>
          </div>

          <!-- ===== O'TKAZMALAR TAB ===== -->
          <div v-else-if="activeTab === 'transfers'" key="transfers">
            <TransfersTab
              :source-id="warehouse?.id || warehouse?._id"
              source-type="warehouse"
              :source-name="warehouse?.name"
              :available-products="warehouse?.products"
              @pending-count="pendingCount = $event"
            />
          </div>

          <!-- ===== KIRIM TARIXI TAB ===== -->
          <div v-else-if="activeTab === 'incoming'" key="incoming" class="space-y-3">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <!-- Table header info -->
              <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.incoming_title') }}</h3>
                <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {{ $t('warehouse.detail.total_count', { count: incomingTotal }) }}
                </span>
              </div>

              <!-- Incoming table -->
              <div v-if="incomingHistory.length" class="overflow-x-auto">
                <table class="w-full text-left min-w-[900px]">
                  <thead>
                    <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('products.col_product') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.amount') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('common.all') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.col_description') }}</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('common.date') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <tr
                      v-for="item in incomingHistory"
                      :key="item.id"
                      class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td class="px-4 py-2.5">
                        <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                            {{ item.product_name }}
                          </span>
                          <span class="text-[9px] font-medium text-slate-400">
                             {{ item.product_barcode }} | {{ item.product_unit }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-2.5 text-right">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          {{ item.quantity }}
                        </span>
                      </td>
                      <td class="px-4 py-2.5 text-right text-[10px] text-slate-500 dark:text-slate-400">
                        {{ Number(item.unit_cost).toLocaleString() }}
                      </td>
                      <td class="px-4 py-2.5 text-right font-black text-slate-800 dark:text-slate-100 text-[10px]">
                        {{ Number(item.total_cost).toLocaleString() }}
                      </td>
                      <td class="px-4 py-2.5">
                        <div class="flex items-center gap-1.5">
                          <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                            {{ item.worker_name?.charAt(0) }}
                          </div>
                          <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                            {{ item.worker_name }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-2.5">
                        <span class="text-[10px] text-slate-400 italic">
                          {{ item.description || '—' }}
                        </span>
                      </td>
                      <td class="px-4 py-2.5 text-right text-[10px] text-slate-400">
                        {{ item.created_on }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                  <i class="pi pi-history text-slate-400 text-lg"></i>
                </div>
                <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {{ $t('warehouse.detail.no_incoming') }}
                </p>
              </div>

              <!-- Pagination -->
              <div class="border-t border-slate-100 dark:border-slate-800">
                <TablePagination
                  :currentPage="incomingPage"
                  :totalRecords="incomingTotal"
                  :rowsPerPage="incomingRows"
                  @page-change="onIncomingPageChange"
                />
              </div>
            </div>
          </div>

          <!-- ===== CHIQUITLAR TAB ===== -->
          <div v-else-if="activeTab === 'wastages'" key="wastages">
            <WastagesTab
              ref="wastagesTabRef"
              :location-id="warehouse?.id || warehouse?._id"
              location-type="warehouse"
            />
          </div>

        </Transition>
      </div>
    </div>

    <!-- Wastage Modal -->
    <CreateWastageModal
      v-if="settingsStore.isWastageEnabled"
      v-model:visible="wastageModalVisible"
      :product="selectedProductForWastage"
      :location-id="warehouse?.id || warehouse?._id"
      location-type="warehouse"
      @saved="onWastageSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import TablePagination from '@/components/TablePagination.vue'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import WarehouseDetailPageHeader from './components/WarehouseDetailPageHeader.vue'
import WarehouseTabsSidebar from './components/WarehouseTabsSidebar.vue'
import WastagesTab from '@/components/Warehouse/WastagesTab.vue'
import CreateWastageModal from '@/components/Warehouse/CreateWastageModal.vue'
import i18n from '@/i18n'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

const warehouse = ref(null)
const loading = ref(true)
const tabLoading = ref(false)
const activeTab = ref('products')

// Refresh only the relevant tab when changed
watch(activeTab, (tab) => {
  if (tab === 'transfers') return // TransfersTab has its own fetch logic
  fetchWarehouseDetails(tab)
})
const productSearch = ref('')
const pendingCount = ref(0)
const incomingHistory = ref([])
const incomingTotal = ref(0)
const incomingPage = ref(1)
const incomingRows = ref(10)

const filteredProducts = computed(() => {
  const products = warehouse.value?.products ?? []
  if (!productSearch.value.trim()) return products
  const q = productSearch.value.toLowerCase()
  return products.filter(p =>
    p.product_name?.toLowerCase().includes(q) ||
    p.barcode?.toLowerCase().includes(q)
  )
})

// Prepare tabs
const navTabs = computed(() => {
  const tabs = [
    { id: 'products', label: i18n.global.t('warehouse.detail.products'), icon: 'pi-box', count: warehouse.value?.products?.length ?? 0 },
    { id: 'transfers', label: i18n.global.t('warehouse.detail.transfers'), icon: 'pi-arrows-h', count: pendingCount.value > 0 ? pendingCount.value : undefined },
    { id: 'incoming', label: i18n.global.t('warehouse.detail.incoming_history'), icon: 'pi-history', count: incomingHistory.value?.length > 0 ? incomingHistory.value.length : undefined },
  ]

  if (settingsStore.isWastageEnabled) {
    tabs.push({ id: 'wastages', label: i18n.global.t('warehouse.wastage.title'), icon: 'pi-exclamation-triangle' })
  }

  return tabs
})

const wastageModalVisible = ref(false)
const selectedProductForWastage = ref(null)
const wastagesTabRef = ref(null)

const openWastageModal = (product) => {
  selectedProductForWastage.value = product
  wastageModalVisible.value = true
}

const onWastageSaved = () => {
  // Refresh warehouse data to update stock
  fetchWarehouseDetails()
  // If we are currently on the wastages tab, refresh it too
  if (activeTab.value === 'wastages' && wastagesTabRef.value) {
    wastagesTabRef.value.refresh()
  }
}

const fetchWarehouseDetails = async (tab = null) => {
  if (tab) tabLoading.value = true
  else if (!warehouse.value) loading.value = true
  
  try {
    const params = tab === 'incoming' ? { page: incomingPage.value } : (tab ? { tab } : {})
    const res = await (tab === 'incoming' 
      ? warehousesAPI.getIncoming(route.params.id, params)
      : warehousesAPI.getById(route.params.id, params)
    )
    
    if (tab && warehouse.value) {
      if (tab === 'incoming') {
        incomingHistory.value = res.data.results || res.data
        incomingTotal.value = res.data.count || (Array.isArray(res.data) ? res.data.length : 0)
      } else if (res.data[tab]) {
        warehouse.value[tab] = res.data[tab]
      } else {
        warehouse.value = res.data
      }
    } else {
      warehouse.value = res.data
      // Also fetch counts if needed
      if (!tab) {
         const incRes = await warehousesAPI.getIncoming(route.params.id, { page: 1 })
         incomingHistory.value = incRes.data.results || incRes.data
         incomingTotal.value = incRes.data.count || (Array.isArray(incRes.data) ? incRes.data.length : 0)
      }
    }
  } catch (error) {
    console.error('Error fetching warehouse details:', error)
  } finally {
    loading.value = false
    tabLoading.value = false
  }
}

const onIncomingPageChange = (event) => {
  incomingPage.value = event.page + 1
  fetchWarehouseDetails('incoming')
}

const openMovementDialog = () => {
  if (warehouse.value) {
    router.push({
      name: 'warehouse-bulk',
      params: { id: warehouse.value.id || warehouse.value._id }
    })
  }
}

const openNewTransferHandler = () => {
  router.push({
    name: 'warehouse-transfer-create',
    params: { id: warehouse.value?.id || warehouse.value?._id }
  })
}

onMounted(() => {
  fetchWarehouseDetails()
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
.animate-loading {
  animation: loading 1.5s infinite ease-in-out;
}
</style>