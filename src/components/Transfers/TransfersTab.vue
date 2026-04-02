<template>
  <div class="flex flex-col gap-4">

    <!-- Status filter tabs -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <button
        v-for="s in statusOptions"
        :key="s.id"
        @click="activeStatus = s.id"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
        :class="activeStatus === s.id
          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        {{ s.label }}
        <span
          class="text-xs px-1.5 py-0.5 rounded-full font-semibold"
          :class="activeStatus === s.id
            ? 'bg-white/20 dark:bg-black/20 text-inherit'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
        >{{ s.count }}</span>
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

      <!-- Loading overlay -->
      <div v-if="loading" class="divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="n in 4" :key="n" class="flex items-center gap-4 px-6 py-4">
          <div class="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
          <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
          <div class="h-4 flex-1 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
          <div class="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
          <div class="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!filteredTransfers.length"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <i class="pi pi-arrows-h text-slate-400 text-xl"></i>
        </div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">O'tkazmalar topilmadi</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {{ activeStatus !== 'all' ? 'Bu holatda o\'tkazmalar yo\'q' : 'Hali birorta o\'tkazma yaratilmagan' }}
        </p>
      </div>

      <!-- Transfers table -->
      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-sm text-left min-w-[780px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">ID / Sana</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Yo'nalish</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Mahsulot</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Xodim</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Holat</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">Amallar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
            <tr
              v-for="t in filteredTransfers"
              :key="t.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
            >
              <!-- ID / Date -->
              <td class="px-5 py-3.5">
                <div class="font-medium text-slate-700 dark:text-slate-300 text-xs">#{{ t.id }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ t.created_on }}</div>
              </td>

              <!-- Direction: From → To -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1.5">
                    <i class="pi text-xs"
                      :class="[
                        locationIcon(t.from_location_type),
                        t.from_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                      ]"
                    ></i>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ t.from_location_name }}</span>
                  </div>
                  <i class="pi pi-arrow-right text-[10px] text-slate-300 dark:text-slate-600 shrink-0"></i>
                  <div class="flex items-center gap-1.5">
                    <i class="pi text-xs"
                      :class="[
                        locationIcon(t.to_location_type),
                        t.to_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                      ]"
                    ></i>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">{{ t.to_location_name }}</span>
                  </div>
                </div>
              </td>

              <!-- Item count -->
              <td class="px-5 py-3.5 text-center">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {{ t.item_count ?? t.items?.length ?? 0 }} dona
                </span>
              </td>

              <!-- Worker -->
              <td class="px-5 py-3.5">
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ t.worker_name || '—' }}</span>
              </td>

              <!-- Status -->
              <td class="px-5 py-3.5">
                <div class="flex justify-center">
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="statusClass(t.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current"
                      :class="t.status === 'pending' ? 'animate-pulse' : ''"></span>
                    {{ t.status_display || t.status }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="viewDetail(t)"
                    v-tooltip.top="'Batafsil'"
                    class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                  >
                    <i class="pi pi-eye text-xs"></i>
                  </button>
                  <template v-if="t.status === 'pending'">
                    <button
                      @click="confirmAction(t)"
                      v-tooltip.top="'Tasdiqlash'"
                      class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all flex items-center justify-center"
                    >
                      <i class="pi pi-check text-xs"></i>
                    </button>
                    <button
                      @click="cancelAction(t)"
                      v-tooltip.top="'Bekor qilish'"
                      class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center"
                    >
                      <i class="pi pi-times text-xs"></i>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== DETAIL DIALOG ===== -->
    <Dialog
      v-model:visible="detailDialog"
      modal
      :showHeader="false"
      style="width: 100%; max-width: 520px;"
      pt:root:class="!rounded-2xl !border-none !shadow-2xl overflow-hidden"
      pt:mask:class="backdrop-blur-sm bg-black/40"
    >
      <div v-if="selectedTransfer" class="flex flex-col">

        <!-- Dialog Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold text-slate-800 dark:text-slate-100">O'tkazma #{{ selectedTransfer.id }}</span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="statusClass(selectedTransfer.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"
                  :class="selectedTransfer.status === 'pending' ? 'animate-pulse' : ''"></span>
                {{ selectedTransfer.status_display || selectedTransfer.status }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">{{ selectedTransfer.created_on }}</p>
          </div>
          <button
            @click="detailDialog = false"
            class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>

        <div class="p-6 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar">

          <!-- From → To flow -->
          <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
            <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
              <div class="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <i class="pi text-sm"
                  :class="[
                    locationIcon(selectedTransfer.from_location_type),
                    selectedTransfer.from_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                  ]"
                ></i>
              </div>
              <div>
                <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ selectedTransfer.from_location_name }}</div>
                <div class="text-[10px] text-slate-400 capitalize">{{ selectedTransfer.from_location_type }}</div>
              </div>
            </div>

            <div class="flex flex-col items-center gap-1 shrink-0">
              <div class="flex items-center gap-1">
                <div class="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
                <i class="pi pi-arrow-right text-[10px] text-slate-400"></i>
                <div class="w-8 h-px bg-slate-300 dark:bg-slate-600"></div>
              </div>
            </div>

            <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
              <div class="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <i class="pi text-sm"
                  :class="[
                    locationIcon(selectedTransfer.to_location_type),
                    selectedTransfer.to_location_type === 'branch' ? 'text-amber-500' : 'text-emerald-500'
                  ]"
                ></i>
              </div>
              <div>
                <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ selectedTransfer.to_location_name }}</div>
                <div class="text-[10px] text-slate-400 capitalize">{{ selectedTransfer.to_location_type }}</div>
              </div>
            </div>
          </div>

          <!-- Items list -->
          <div>
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Mahsulotlar ({{ selectedTransfer.items?.length ?? selectedTransfer.item_count ?? 0 }})
            </h4>
            <div class="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-400">Mahsulot</th>
                    <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-400">Miqdor</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                  <tr
                    v-for="item in selectedTransfer.items"
                    :key="item.product_id"
                    class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td class="px-4 py-2.5">
                      <span class="font-medium text-slate-700 dark:text-slate-200">{{ item.product_name }}</span>
                      <span v-if="item.product_unit" class="ml-1.5 text-xs text-slate-400">{{ item.product_unit }}</span>
                    </td>
                    <td class="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ item.quantity }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Meta info row -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div v-if="selectedTransfer.worker_name"
              class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
            >
              <div class="text-xs text-slate-400 mb-0.5">Xodim</div>
              <div class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTransfer.worker_name }}</div>
            </div>
            <div v-if="selectedTransfer.confirmed_at"
              class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
            >
              <div class="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">Tasdiqlangan vaqt</div>
              <div class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTransfer.confirmed_at }}</div>
            </div>
          </div>

          <!-- Note -->
          <div v-if="selectedTransfer.note"
            class="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20"
          >
            <i class="pi pi-info-circle text-amber-500 mt-0.5 shrink-0"></i>
            <p class="text-sm text-slate-600 dark:text-slate-300">{{ selectedTransfer.note }}</p>
          </div>
        </div>

        <!-- Footer actions -->
        <div v-if="selectedTransfer.status === 'pending'"
          class="flex items-center gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
        >
          <button
            @click="cancelAction(selectedTransfer); detailDialog = false"
            class="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 text-sm font-medium transition-all"
          >
            Bekor qilish
          </button>
          <button
            @click="confirmAction(selectedTransfer); detailDialog = false"
            class="flex-[2] h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </Dialog>

    <!-- New Transfer Dialog -->
    <TransferNewDialog
      v-model="transferDialog"
      :form="transferForm"
      :sub-loading="subLoading"
      :branches="branches"
      :warehouses="warehouses"
      :available-products="availableProducts"
      :source-name="sourceName"
      :source-id="sourceId"
      :source-type="sourceType"
      @submit="handleCreateTransfer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransfers } from '@/composables/useTransfers'
import TransferNewDialog from './TransferNewDialog.vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  sourceId: [Number, String],
  sourceType: String,
  sourceName: String,
  availableProducts: Array
})

const emit = defineEmits(['pending-count'])

const {
  transfers, loading, subLoading,
  transferDialog, transferForm,
  warehouses, branches,
  fetchTransfers, fetchWarehouseTransfers,
  createTransfer, confirmTransfer, cancelTransfer, openNewTransfer
} = useTransfers()

const activeStatus = ref('all')
const detailDialog = ref(false)
const selectedTransfer = ref(null)

const statusOptions = computed(() => {
  const pending = transfers.value.filter(t => t.status === 'pending').length
  emit('pending-count', pending)
  return [
    { id: 'all',       label: 'Barchasi',       count: transfers.value.length },
    { id: 'pending',   label: 'Kutilmoqda',     count: pending },
    { id: 'confirmed', label: 'Tasdiqlangan',   count: transfers.value.filter(t => t.status === 'confirmed').length },
    { id: 'cancelled', label: 'Bekor qilingan', count: transfers.value.filter(t => t.status === 'cancelled').length }
  ]
})

const filteredTransfers = computed(() => {
  if (activeStatus.value === 'all') return transfers.value
  return transfers.value.filter(t => t.status === activeStatus.value)
})

const loadTransfers = () => {
  if (props.sourceType === 'warehouse' && props.sourceId) {
    fetchWarehouseTransfers(props.sourceId)
  } else {
    fetchTransfers()
  }
}

const handleCreateTransfer = async () => {
  const success = await createTransfer()
  if (success) loadTransfers()
}

const confirmAction = async (t) => {
  const success = await confirmTransfer(t.id)
  if (success) loadTransfers()
}

const cancelAction = async (t) => {
  const success = await cancelTransfer(t.id)
  if (success) loadTransfers()
}

const viewDetail = (t) => {
  selectedTransfer.value = t
  detailDialog.value = true
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr
}

const locationIcon = (locationType) => {
  return locationType === 'branch' ? 'pi-building' : 'pi-box'
}

const locationIconBg = (locationType) => {
  return locationType === 'branch' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
}

const statusClass = (status) => {
  switch (status) {
    case 'pending':   return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
    case 'confirmed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'cancelled': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
    default:          return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
  }
}

onMounted(() => {
  loadTransfers()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
