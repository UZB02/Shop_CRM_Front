<template>
  <div class="space-y-4">
    <!-- Header -->
    <WarehouseDetailPageHeader
      :warehouse="warehouse"
      @movement="openMovementDialog"
      @transfer="openNewTransferHandler"
    />

    <!-- Main layout -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-4">
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
      <div class="flex-1 min-w-0">
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
                    placeholder="Mahsulot qidirish..."
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
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mahsulot</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shtrix-kod</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Miqdor</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Xarid narxi</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Sotuv narxi</th>
                      <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Sana</th>
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
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
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
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Empty state -->
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                  <i class="pi pi-inbox text-slate-400 text-lg"></i>
                </div>
                <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {{ productSearch ? 'Qidiruv natijasi topilmadi' : 'Omborda mahsulotlar mavjud emas' }}
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

        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI } from '@/services/api'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'
import WarehouseDetailPageHeader from './components/WarehouseDetailPageHeader.vue'
import WarehouseTabsSidebar from './components/WarehouseTabsSidebar.vue'

const route = useRoute()
const router = useRouter()

const warehouse = ref(null)
const loading = ref(true)
const activeTab = ref('products')
const productSearch = ref('')
const pendingCount = ref(0)

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
const navTabs = computed(() => [
  { id: 'products', label: 'Mahsulotlar', icon: 'pi-box', count: warehouse.value?.products?.length ?? 0 },
  { id: 'transfers', label: "O'tkazmalar", icon: 'pi-arrows-h', count: pendingCount.value > 0 ? pendingCount.value : undefined }
])

const fetchWarehouseDetails = async () => {
  loading.value = true
  try {
    const res = await warehousesAPI.getById(route.params.id)
    warehouse.value = res.data
  } catch (error) {
    console.error('Error fetching warehouse details:', error)
  } finally {
    loading.value = false
  }
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
</style>


