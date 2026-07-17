<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">

    <!-- Card Header (always visible — toggle here) -->
    <button
      type="button"
      @click="toggleCard"
      class="flex items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 shrink-0 w-full text-left transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300"
          :class="isEnabled
            ? 'bg-emerald-500 shadow-emerald-500/20'
            : 'bg-slate-200 dark:bg-slate-700 shadow-none'"
        >
          <i class="pi pi-box text-white text-[12px]"></i>
        </div>
        <div>
          <h2 class="text-[12px] font-black tracking-widest text-slate-800 dark:text-slate-100">
            {{ $t('products.initial_stock.title') }}
          </h2>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            <span v-if="isEnabled && modelValue.quantity > 0">
              {{ formatNumber(modelValue.quantity) }} {{ $t('products.initial_stock.quantity_unit') }}
              <span v-if="modelValue.unit_cost"> · {{ formatNumber(modelValue.unit_cost) }} UZS</span>
            </span>
            <span v-else>{{ $t('products.initial_stock.hint') }}</span>
          </p>
        </div>
      </div>

      <!-- Toggle switch visual -->
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[10px] font-black tracking-widest uppercase"
          :class="isEnabled ? 'text-emerald-500' : 'text-slate-400'"
        >
          {{ isEnabled ? $t('common.active') : $t('common.inactive') }}
        </span>
        <div
          class="w-11 h-6 rounded-full transition-all duration-300 relative"
          :class="isEnabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
        >
          <div
            class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
            :class="isEnabled ? 'left-6' : 'left-1'"
          ></div>
        </div>
        <i
          class="pi text-slate-400 text-[11px] transition-transform duration-300"
          :class="isEnabled ? 'pi-chevron-up' : 'pi-chevron-down'"
        ></i>
      </div>
    </button>

    <!-- Card Body (collapsible) -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isEnabled" class="overflow-hidden">
        <div class="p-6 space-y-5">

          <!-- has_tur warning -->
          <div
            v-if="hasTur"
            class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20"
          >
            <i class="pi pi-exclamation-triangle text-amber-500 text-sm mt-0.5 shrink-0"></i>
            <p class="text-[12px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
              {{ $t('products.initial_stock.tur_warning') }}
            </p>
          </div>

          <template v-if="!hasTur">
            <!-- Row 1: Miqdor + Tannarx -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Miqdor -->
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  {{ $t('products.initial_stock.quantity') }}
                  <span class="text-rose-400 ml-0.5">*</span>
                </label>
                <div class="relative">
                  <input
                    :value="formatNumber(modelValue.quantity)"
                    @input="handleQtyInput"
                    type="text"
                    inputmode="decimal"
                    placeholder="0"
                    class="w-full h-11 px-4 rounded-xl text-[14px] font-black text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    :class="{ '!border-rose-400 !ring-rose-400/10': submitted && !modelValue.quantity }"
                  />
                </div>
              </div>

              <!-- Tannarx -->
              <div class="flex flex-col gap-2">
                <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  {{ $t('products.initial_stock.unit_cost') }}
                </label>
                <div class="relative">
                  <input
                    :value="formatNumber(modelValue.unit_cost)"
                    @input="handleCostInput"
                    type="text"
                    inputmode="decimal"
                    placeholder="0"
                    class="w-full h-11 px-4 pr-14 rounded-xl text-[14px] font-black text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-white bg-blue-500 px-2 py-0.5 rounded shadow">UZS</span>
                </div>
              </div>
            </div>

            <!-- Row 2: Joy turi -->
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                {{ $t('products.initial_stock.location_type') }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="update('location_type', 'branch')"
                  class="h-10 rounded-xl text-[12px] font-black transition-all border flex items-center justify-center gap-2"
                  :class="modelValue.location_type === 'branch'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50'"
                >
                  <i class="pi pi-building text-[11px]"></i>
                  <span>{{ $t('products.initial_stock.type_branch') }}</span>
                </button>
                <button
                  type="button"
                  @click="update('location_type', 'warehouse')"
                  class="h-10 rounded-xl text-[12px] font-black transition-all border flex items-center justify-center gap-2"
                  :class="modelValue.location_type === 'warehouse'
                    ? 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-500/50'"
                >
                  <i class="pi pi-warehouse text-[11px]"></i>
                  <span>{{ $t('products.initial_stock.type_warehouse') }}</span>
                </button>
              </div>
            </div>

            <!-- Row 3: Joy tanlash (branch yoki warehouse) -->
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                {{ $t('products.initial_stock.location') }}
              </label>
              <div v-if="loadingLocations" class="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <Select
                v-else
                :modelValue="modelValue.location_id"
                @update:modelValue="update('location_id', $event)"
                :options="locationOptions"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('products.initial_stock.location_default')"
                showClear
                class="w-full"
                pt:root:class="!h-11 !rounded-xl !border-[1.5px] !border-slate-200 dark:!border-slate-700/60 !bg-slate-50 dark:!bg-slate-800/40 !shadow-none"
                pt:label:class="!text-[12px] !font-black !text-slate-700 dark:!text-slate-200 !py-0 !flex !items-center !h-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <i :class="modelValue.location_type === 'warehouse' ? 'pi pi-warehouse' : 'pi pi-building'" class="text-emerald-500 text-[12px]"></i>
                    <span class="text-[12px] font-black">{{ locationOptions.find(l => l.id === slotProps.value)?.name }}</span>
                  </div>
                  <div v-else class="flex items-center gap-2 text-slate-400">
                    <i class="pi pi-building text-[12px]"></i>
                    <span class="text-[12px] font-medium italic">{{ $t('products.initial_stock.location_default') }}</span>
                  </div>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2 text-[12px] font-bold">
                    <i :class="modelValue.location_type === 'warehouse' ? 'pi pi-warehouse' : 'pi pi-building'" class="text-slate-400 text-[11px]"></i>
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </Select>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                {{ $t('products.initial_stock.location_hint') }}
              </p>
            </div>

            <!-- Row 4: Yetkazib beruvchi -->
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                {{ $t('products.initial_stock.supplier') }}
                <span class="text-slate-300 dark:text-slate-600 font-medium normal-case tracking-normal ml-1">({{ $t('common.optional') }})</span>
              </label>
              <div v-if="loadingSuppliers" class="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <Select
                v-else
                :modelValue="modelValue.supplier_id"
                @update:modelValue="update('supplier_id', $event)"
                :options="suppliers"
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('products.initial_stock.supplier_placeholder')"
                :filter="suppliers.length > 5"
                showClear
                class="w-full"
                pt:root:class="!h-11 !rounded-xl !border-[1.5px] !border-slate-200 dark:!border-slate-700/60 !bg-slate-50 dark:!bg-slate-800/40 !shadow-none"
                pt:label:class="!text-[12px] !font-black !text-slate-700 dark:!text-slate-200 !py-0 !flex !items-center !h-full"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-2">
                    <i class="pi pi-truck text-emerald-500 text-[12px]"></i>
                    <span class="text-[12px] font-black">{{ suppliers.find(s => s.id === slotProps.value)?.name }}</span>
                  </div>
                  <div v-else class="flex items-center gap-2 text-slate-400">
                    <i class="pi pi-truck text-[12px]"></i>
                    <span class="text-[12px] italic font-medium">{{ $t('products.initial_stock.supplier_placeholder') }}</span>
                  </div>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2 text-[12px] font-bold">
                    <i class="pi pi-truck text-slate-400 text-[11px]"></i>
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </Select>
              <p v-if="modelValue.supplier_id" class="text-[10px] text-amber-500 dark:text-amber-400 ml-1 font-bold">
                ⚠ {{ $t('products.initial_stock.supplier_debt_hint') }}
              </p>
            </div>

            <!-- Info box -->
            <div class="flex items-start gap-3 p-3.5 bg-emerald-50/60 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
              <i class="pi pi-info-circle text-emerald-500 text-sm mt-0.5 shrink-0"></i>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
                {{ $t('products.initial_stock.info_atomic') }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Select from 'primevue/select'
import { branchesAPI, warehousesAPI, suppliersAPI } from '@/services/api'

// ─── Props & Emits ─────────────────────────────────────────────────────────
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      enabled: false,
      quantity: null,
      unit_cost: null,
      location_type: 'branch',
      location_id: null,
      supplier_id: null
    })
  },
  hasTur: {
    type: Boolean,
    default: false
  },
  submitted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// ─── Local state ───────────────────────────────────────────────────────────
const isEnabled = computed(() => props.modelValue.enabled)

const branches = ref([])
const warehouses = ref([])
const suppliers = ref([])
const loadingLocations = ref(false)
const loadingSuppliers = ref(false)

// ─── Location options based on location_type ──────────────────────────────
const locationOptions = computed(() => {
  return props.modelValue.location_type === 'warehouse' ? warehouses.value : branches.value
})

// ─── Toggle card ──────────────────────────────────────────────────────────
const toggleCard = () => {
  const newEnabled = !props.modelValue.enabled
  emit('update:modelValue', { ...props.modelValue, enabled: newEnabled })
  // Load data on first open
  if (newEnabled && branches.value.length === 0) {
    fetchLocations()
    fetchSuppliers()
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────
const update = (field, value) => {
  const updated = { ...props.modelValue, [field]: value }
  // Reset location_id when changing type
  if (field === 'location_type') {
    updated.location_id = null
  }
  emit('update:modelValue', updated)
}

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return ''
  const num = val.toString().replace(/\s/g, '')
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const parseNumber = (str) => {
  const raw = str.replace(/\s/g, '').replace(/[^\d.]/g, '')
  return raw ? Number(raw) : null
}

const handleQtyInput = (e) => {
  const raw = e.target.value.replace(/\s/g, '').replace(/[^\d.]/g, '')
  const num = raw ? Number(raw) : null
  update('quantity', num)
  e.target.value = formatNumber(raw)
}

const handleCostInput = (e) => {
  const raw = e.target.value.replace(/\s/g, '').replace(/[^\d.]/g, '')
  const num = raw ? Number(raw) : null
  update('unit_cost', num)
  e.target.value = formatNumber(raw)
}

// ─── API calls ────────────────────────────────────────────────────────────
const fetchLocations = async () => {
  loadingLocations.value = true
  try {
    const [brRes, whRes] = await Promise.all([
      branchesAPI.getAll({ page_size: 100 }),
      warehousesAPI.getAll({ page_size: 100 })
    ])
    branches.value = Array.isArray(brRes.data) ? brRes.data : (brRes.data?.results || [])
    warehouses.value = Array.isArray(whRes.data) ? whRes.data : (whRes.data?.results || [])
  } catch (err) {
    console.error('[InitialStockCard] Joylarni yuklashda xatolik:', err)
  } finally {
    loadingLocations.value = false
  }
}

const fetchSuppliers = async () => {
  loadingSuppliers.value = true
  try {
    const res = await suppliersAPI.getAll({ page_size: 200 })
    suppliers.value = Array.isArray(res.data) ? res.data : (res.data?.results || [])
  } catch (err) {
    console.error('[InitialStockCard] Yetkazib beruvchilarni yuklashda xatolik:', err)
  } finally {
    loadingSuppliers.value = false
  }
}

// ─── Watchers ─────────────────────────────────────────────────────────────
// If hasTur becomes true while card is open → disable initial stock
watch(() => props.hasTur, (isTur) => {
  if (isTur && props.modelValue.enabled) {
    emit('update:modelValue', {
      ...props.modelValue,
      enabled: false,
      quantity: null,
      unit_cost: null,
      location_id: null,
      supplier_id: null
    })
  }
})
</script>
