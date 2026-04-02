<template>
  <div class="flex flex-col gap-5 max-w-[1400px] mx-auto pb-16">

    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 text-xs text-slate-400">
      <router-link to="/dashboard/warehouse" class="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
        Omborlar
      </router-link>
      <i class="pi pi-chevron-right text-[9px]"></i>
      <span class="text-slate-600 dark:text-slate-300 font-medium">{{ warehouse?.name || '...' }}</span>
    </div>

    <!-- Header Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">

      <!-- Row 1: Icon + name + meta -->
      <div class="flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
          <i class="pi pi-box text-white text-base"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-base font-bold text-slate-900 dark:text-slate-100">
              {{ warehouse?.name ?? '...' }}
            </h1>
            <span
              v-if="warehouse"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
              :class="warehouse.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"
                :class="warehouse.status === 'active' ? 'animate-pulse' : ''"></span>
              {{ warehouse.status === 'active' ? 'Faol' : 'Nofaol' }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span v-if="warehouse?.store_name" class="flex items-center gap-1">
              <i class="pi pi-building text-[10px]"></i>{{ warehouse.store_name }}
            </span>
            <span v-if="warehouse?.store_name && warehouse?.address" class="text-slate-300 dark:text-slate-700">·</span>
            <span v-if="warehouse?.address" class="flex items-center gap-1">
              <i class="pi pi-map-marker text-[10px]"></i>{{ warehouse.address }}
            </span>
          </div>
        </div>
      </div>

      <!-- Row 2: Stats + Actions (divider line) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <!-- Stats chips -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <i class="pi pi-box text-xs text-emerald-500"></i>
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ warehouse?.products?.length ?? 0 }}</span>
            <span class="text-xs text-slate-400">mahsulot turi</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <i class="pi pi-arrows-h text-xs text-blue-500"></i>
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ pendingCount }}</span>
            <span class="text-xs text-slate-400">kutilmoqda</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <button
            @click="openMovementDialog"
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all"
          >
            <i class="pi pi-bolt text-[11px]"></i>
            Ommaviy harakat
          </button>
          <button
            @click="openNewTransferHandler"
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-all"
          >
            <i class="pi pi-plus text-[11px]"></i>
            Yangi o'tkazma
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === tab.id
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        <i class="pi" :class="tab.icon + ' text-sm'"></i>
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          class="px-1.5 py-0.5 rounded-full text-[11px] font-semibold"
          :class="activeTab === tab.id
            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'"
        >{{ tab.count }}</span>
        <!-- Active indicator -->
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full"
        ></span>
      </button>
    </div>

    <!-- Tab Content -->
    <Transition name="tab-fade" mode="out-in">

      <!-- ===== MAHSULOTLAR TAB ===== -->
      <div v-if="activeTab === 'products'" key="products">

        <!-- Loading skeleton -->
        <div v-if="loading" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800">
            <div class="h-8 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
            <div class="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            <div class="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            <div class="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

          <!-- Table toolbar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                v-model="productSearch"
                type="text"
                placeholder="Mahsulot qidirish..."
                class="h-9 pl-9 pr-4 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 w-64 transition-all"
              />
            </div>
            <div class="text-sm text-slate-400">
              {{ filteredProducts.length }} / {{ warehouse?.products?.length ?? 0 }} mahsulot
            </div>
          </div>

          <!-- Products table -->
          <div v-if="filteredProducts.length" class="overflow-x-auto">
            <table class="w-full text-sm text-left min-w-[700px]">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">№</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Mahsulot</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Shtrix-kod</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Miqdor</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Xarid narxi</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Sotuv narxi</th>
                  <th class="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Qo'shilgan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
                <tr
                  v-for="(item, index) in filteredProducts"
                  :key="item.product_id"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td class="px-6 py-3.5 text-xs text-slate-400 w-10">{{ index + 1 }}</td>
                  <td class="px-6 py-3.5">
                    <span class="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {{ item.product_name }}
                    </span>
                  </td>
                  <td class="px-6 py-3.5">
                    <code class="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {{ item.barcode || '—' }}
                    </code>
                  </td>
                  <td class="px-6 py-3.5 text-right">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                      {{ item.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-3.5 text-right text-slate-500 dark:text-slate-400 text-xs">
                    {{ Number(item.purchase_price || 0).toLocaleString() }}
                  </td>
                  <td class="px-6 py-3.5 text-right font-medium text-slate-800 dark:text-slate-200 text-xs">
                    {{ Number(item.sale_price || 0).toLocaleString() }}
                  </td>
                  <td class="px-6 py-3.5 text-right text-xs text-slate-400">
                    {{ item.added_on?.split('|')[0]?.trim() || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <i class="pi pi-inbox text-slate-400 text-xl"></i>
            </div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ productSearch ? 'Qidiruv natijasi topilmadi' : 'Omborda mahsulotlar mavjud emas' }}
            </p>
            <p v-if="productSearch" class="text-xs text-slate-400 mt-1">
              "{{ productSearch }}" bo'yicha hech narsa topilmadi
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI } from '@/services/api'
import TransfersTab from '@/components/Transfers/TransfersTab.vue'

const route = useRoute()
const router = useRouter()

const warehouse = ref(null)
const loading = ref(true)
const activeTab = ref('products')
const productSearch = ref('')

// Pending transfers count — TransfersTab manages its own state,
// so we expose a simple placeholder here (0 until transfers tab loaded)
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

const tabs = computed(() => [
  {
    id: 'products',
    label: 'Mahsulotlar',
    icon: 'pi-box',
    count: warehouse.value?.products?.length ?? 0
  },
  {
    id: 'transfers',
    label: "O'tkazmalar",
    icon: 'pi-arrows-h'
  }
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
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
