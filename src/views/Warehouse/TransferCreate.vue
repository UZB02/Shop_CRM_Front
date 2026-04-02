<template>
  <div class="flex flex-col h-[calc(100vh-72px)] max-w-[1400px] mx-auto">

    <!-- ── Top bar ── -->
    <div class="flex items-center justify-between gap-4 px-1 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <i class="pi pi-arrow-left text-sm"></i>
        </button>
        <div>
          <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            <span class="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" @click="router.back()">O'tkazmalar</span>
            <i class="pi pi-chevron-right text-[9px]"></i>
            <span class="text-slate-600 dark:text-slate-300">Yangi o'tkazma</span>
          </div>
          <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">
            {{ sourceName || '...' }} → O'tkazma yaratish
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="router.back()"
          class="h-8 px-4 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Bekor qilish
        </button>
        <button
          @click="submitTransfer"
          :disabled="subLoading || !isValid"
          class="h-8 px-4 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i v-if="subLoading" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-send text-xs"></i>
          Yuborish
        </button>
      </div>
    </div>

    <!-- ── Body (2-col) ── -->
    <div class="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 py-5">

      <!-- ── LEFT: Config panel ── -->
      <div class="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar">

        <!-- Destination card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Qabul qiluvchi</h3>
            <span class="text-xs text-rose-500 font-medium">* Majburiy</span>
          </div>

          <!-- Branch / Warehouse toggle -->
          <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              @click="targetType = 'branch'; transferForm.to_warehouse = null"
              class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
              :class="targetType === 'branch'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            >
              <i class="pi pi-building text-[11px]"></i>
              Filial
            </button>
            <button
              @click="targetType = 'warehouse'; transferForm.to_branch = null"
              class="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all"
              :class="targetType === 'warehouse'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            >
              <i class="pi pi-box text-[11px]"></i>
              Ombor
            </button>
          </div>

          <!-- Select dropdown -->
          <div class="relative">
            <select
              v-if="targetType === 'branch'"
              v-model="transferForm.to_branch"
              class="w-full h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 appearance-none transition-all"
              :class="!transferForm.to_branch ? 'text-slate-400' : ''"
            >
              <option :value="null" disabled>Filialni tanlang...</option>
              <option v-for="b in filteredBranches" :key="b.id" :value="b.id || b._id">{{ b.name }}</option>
            </select>
            <select
              v-else
              v-model="transferForm.to_warehouse"
              class="w-full h-9 pl-3 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 appearance-none transition-all"
              :class="!transferForm.to_warehouse ? 'text-slate-400' : ''"
            >
              <option :value="null" disabled>Omborni tanlang...</option>
              <option v-for="w in filteredWarehouses" :key="w.id" :value="w.id || w._id">{{ w.name }}</option>
            </select>
            <i class="pi pi-chevron-down text-[10px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>

          <!-- Selected destination preview -->
          <div
            v-if="selectedDestinationName"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-sm"
          >
            <i class="pi text-emerald-500 text-xs"
              :class="targetType === 'branch' ? 'pi-building' : 'pi-box'"></i>
            <span class="font-medium text-emerald-700 dark:text-emerald-400">{{ selectedDestinationName }}</span>
          </div>
        </div>

        <!-- Transfer summary -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Xulosa</h3>

          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Manba</span>
              <span class="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <i class="pi pi-box text-[11px] text-emerald-500"></i>
                {{ sourceName || '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Manzil</span>
              <span class="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <i class="pi text-[11px] text-amber-500"
                  :class="targetType === 'branch' ? 'pi-building' : 'pi-box'"></i>
                {{ selectedDestinationName || '—' }}
              </span>
            </div>
            <div class="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Mahsulotlar</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ transferForm.items.length }} tur</span>
            </div>
          </div>

          <!-- Validation hints -->
          <div v-if="!isValid" class="space-y-1.5 pt-1">
            <div
              v-if="!selectedDestinationName"
              class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
            >
              <i class="pi pi-exclamation-circle text-[11px]"></i>
              Qabul qiluvchi tanlanmagan
            </div>
            <div
              v-if="!transferForm.items.length"
              class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
            >
              <i class="pi pi-exclamation-circle text-[11px]"></i>
              Kamida 1 mahsulot qo'shing
            </div>
          </div>
        </div>

        <!-- Note card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
            Izoh
            <span class="text-xs text-slate-400 font-normal">Ixtiyoriy</span>
          </label>
          <textarea
            v-model="transferForm.note"
            rows="4"
            placeholder="O'tkazma haqida qo'shimcha ma'lumot..."
            class="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 p-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none transition-all"
          ></textarea>
        </div>
      </div>

      <!-- ── RIGHT: Products panel ── -->
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col min-h-0 overflow-hidden">

        <!-- Panel toolbar -->
        <div class="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Mahsulotlar</h3>
            <span
              v-if="transferForm.items.length"
              class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            >{{ transferForm.items.length }}</span>
          </div>
          <button
            @click="showProductSelect = true"
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium hover:opacity-90 transition-all"
          >
            <i class="pi pi-plus text-[11px]"></i>
            Mahsulot qo'shish
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="!transferForm.items.length"
          class="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8"
        >
          <div class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <i class="pi pi-inbox text-2xl text-slate-300 dark:text-slate-600"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Mahsulotlar qo'shilmagan</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Yuqoridagi tugma orqali mahsulot tanlang</p>
          </div>
          <button
            @click="showProductSelect = true"
            class="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
          >
            <i class="pi pi-plus text-xs"></i>
            Mahsulot qo'shish
          </button>
        </div>

        <!-- Products table -->
        <div v-else class="flex-1 overflow-y-auto no-scrollbar">
          <table class="w-full text-sm text-left">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide w-8">#</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Mahsulot</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Shtrix-kod</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center w-36">Mavjud</th>
                <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center w-36">Miqdor</th>
                <th class="px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
              <tr
                v-for="(item, idx) in transferForm.items"
                :key="idx"
                class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td class="px-5 py-3.5 text-xs text-slate-400">{{ idx + 1 }}</td>
                <td class="px-5 py-3.5">
                  <span class="font-medium text-slate-700 dark:text-slate-200">
                    {{ item.product.product_name || item.product.name }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <code class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {{ item.product.barcode || '—' }}
                  </code>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {{ item.product.quantity ?? '—' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <!-- Minus -->
                    <button
                      @click="item.quantity = Math.max(1, Number(item.quantity) - 1)"
                      class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <i class="pi pi-minus text-[9px]"></i>
                    </button>
                    <input
                      v-model="item.quantity"
                      type="number"
                      step="0.01"
                      min="0.01"
                      class="w-16 h-7 text-center text-sm font-semibold rounded-lg border transition-all outline-none"
                      :class="item.quantity > 0
                        ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                        : 'border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600'"
                    />
                    <!-- Plus -->
                    <button
                      @click="item.quantity = Number(item.quantity) + 1"
                      class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <i class="pi pi-plus text-[9px]"></i>
                    </button>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <button
                    @click="removeItem(idx)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Table footer summary -->
          <div class="sticky bottom-0 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 backdrop-blur-sm flex items-center justify-between">
            <span class="text-xs text-slate-400">
              Jami {{ transferForm.items.length }} turdagi mahsulot
            </span>
            <button
              @click="showProductSelect = true"
              class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <i class="pi pi-plus text-[10px]"></i>
              Yana qo'shish
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Product selection dialog ── -->
    <Dialog
      v-model:visible="showProductSelect"
      modal
      :showHeader="false"
      style="width: 100%; max-width: 480px;"
      pt:root:class="!rounded-2xl !border-none !shadow-2xl overflow-hidden"
      pt:mask:class="backdrop-blur-sm bg-black/40"
    >
      <div class="flex flex-col max-h-[80vh]">

        <!-- Dialog header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Mahsulot tanlang</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ sourceName }} omboridagi mahsulotlar</p>
          </div>
          <button
            @click="showProductSelect = false"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div class="relative">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              v-model="productSearch"
              type="text"
              placeholder="Nomi yoki shtrix kodi..."
              class="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              autofocus
            />
          </div>
        </div>

        <!-- Product list -->
        <div class="overflow-y-auto flex-1 custom-scrollbar">
          <!-- Empty search result -->
          <div
            v-if="!filteredAvailableProducts?.length"
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <i class="pi pi-search text-slate-400"></i>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">Mahsulot topilmadi</p>
          </div>

          <!-- Product rows -->
          <div v-else class="divide-y divide-slate-50 dark:divide-slate-800/60">
            <button
              v-for="p in filteredAvailableProducts"
              :key="p.product_id || p.id"
              @click="addProduct(p)"
              class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 text-left transition-colors group"
            >
              <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                <i class="pi pi-box text-slate-400 group-hover:text-emerald-500 text-xs transition-colors"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate transition-colors">
                  {{ p.product_name || p.name }}
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <code v-if="p.barcode" class="text-xs text-slate-400">{{ p.barcode }}</code>
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">{{ p.quantity }} mavjud</span>
                </div>
              </div>
              <i class="pi pi-plus text-xs text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0"></i>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import { warehousesAPI, branchesAPI } from '@/services/api'
import { useTransfers } from '@/composables/useTransfers'

const route = useRoute()
const router = useRouter()
const entityId = route.params.id
const isBranch = computed(() => route.path.includes('/branches/'))

const targetType = ref('branch')
const showProductSelect = ref(false)
const productSearch = ref('')
const sourceName = ref('')
const availableProducts = ref([])

const {
  transferForm,
  subLoading,
  branches,
  warehouses,
  fetchLocations,
  createTransfer
} = useTransfers()

const isValid = computed(() => {
  const hasTarget = targetType.value === 'branch'
    ? !!transferForm.value.to_branch
    : !!transferForm.value.to_warehouse
  return hasTarget && transferForm.value.items.length > 0 && transferForm.value.items.every(i => i.quantity > 0)
})

const filteredBranches = computed(() =>
  branches.value.filter(b => String(b.id || b._id) !== String(entityId))
)
const filteredWarehouses = computed(() =>
  warehouses.value.filter(w => String(w.id || w._id) !== String(entityId))
)

const selectedDestinationName = computed(() => {
  if (targetType.value === 'branch' && transferForm.value.to_branch) {
    return filteredBranches.value.find(b => (b.id || b._id) == transferForm.value.to_branch)?.name
  }
  if (targetType.value === 'warehouse' && transferForm.value.to_warehouse) {
    return filteredWarehouses.value.find(w => (w.id || w._id) == transferForm.value.to_warehouse)?.name
  }
  return null
})

const filteredAvailableProducts = computed(() => {
  if (!productSearch.value.trim()) return availableProducts.value
  const q = productSearch.value.toLowerCase()
  return availableProducts.value.filter(p =>
    (p.product_name || p.name || '').toLowerCase().includes(q) ||
    (p.barcode || '').includes(q)
  )
})

const addProduct = (p) => {
  const existing = transferForm.value.items.find(
    i => (i.product.product_id || i.product.id) === (p.product_id || p.id)
  )
  if (existing) {
    existing.quantity = Number(existing.quantity) + 1
  } else {
    transferForm.value.items.push({ product: p, quantity: 1, note: '' })
  }
  showProductSelect.value = false
  productSearch.value = ''
}

const removeItem = (idx) => {
  transferForm.value.items.splice(idx, 1)
}

const loadSourceData = async () => {
  try {
    const api = isBranch.value ? branchesAPI : warehousesAPI
    const res = await api.getById(entityId)
    if (res.data) {
      sourceName.value = res.data.name
      availableProducts.value = res.data.products || []
      if (isBranch.value) {
        transferForm.value.from_branch = entityId
        transferForm.value.from_warehouse = null
      } else {
        transferForm.value.from_warehouse = entityId
        transferForm.value.from_branch = null
      }
    }
  } catch (e) {
    console.error('Error fetching source data', e)
  }
}

const submitTransfer = async () => {
  if (!isValid.value) return
  const success = await createTransfer()
  if (success) router.back()
}

onMounted(() => {
  fetchLocations()
  loadSourceData()
  transferForm.value.items = []
  transferForm.value.note = ''
  transferForm.value.to_branch = null
  transferForm.value.to_warehouse = null
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
