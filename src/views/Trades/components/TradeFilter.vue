<template>
  <div class="flex flex-col w-full relative">
    <!-- Top Row: Customer AutoComplete and Toggle -->
    <div class="flex items-center gap-3 w-full">
      <div class="relative flex-1">
        <AutoComplete 
          v-model="selectedCustomer"
          :suggestions="customerSuggestions"
          @complete="searchCustomers"
          @item-select="onCustomerSelect"
          optionLabel="name"
          :placeholder="$t('customers.search_placeholder') || 'Mijoz nomi bo\'yicha qidirib tanlang...'"
          class="w-full custom-autocomplete-wrapper"
          inputClass="w-full h-11 !pl-11 pr-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
        />
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10 transition-colors" :class="{'text-emerald-500': selectedCustomer}"></i>
        <button 
          v-if="selectedCustomer" 
          @click="onCustomerClear" 
          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 z-10 p-1"
        >
           <i class="pi pi-times text-[10px] font-bold"></i>
        </button>
      </div>
      <button 
        v-if="hasActiveFilters"
        @click="onReset"
        class="h-11 px-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all shrink-0 shadow-sm group"
        title="Filtrlarni tozalash"
      >
        <i class="pi pi-refresh text-[12px] group-hover:rotate-180 transition-transform duration-500"></i>
      </button>

      <button 
        @click="showFilters = !showFilters"
        :class="[
          'h-11 px-5 rounded-xl border flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm',
          showFilters 
            ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <i class="pi pi-filter text-[13px]"></i>
        <span class="text-[13px] font-bold">Filtr</span>
        <i :class="['pi text-[10px] ml-1 transition-transform', showFilters ? 'pi-chevron-up opacity-50' : 'pi-chevron-down dark:text-slate-400']"></i>
      </button>
    </div>

    <!-- Filter Panel (Absolute Positioned Menu) -->
    <div 
      v-show="showFilters" 
      class="absolute right-0 top-full mt-2 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 duration-200 z-[100] w-[320px] md:w-[600px]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Row 1 -->
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('common.status') }}</label>
          <Dropdown 
            :modelValue="filters.status"
            @update:modelValue="$emit('update:filter', { status: $event })"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('common.select')"
            class="w-full !rounded-xl !border-slate-100 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950 !h-10 text-[13px]"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('trades.payment.all') }}</label>
          <Dropdown 
            :modelValue="filters.payment_type"
            @update:modelValue="$emit('update:filter', { payment_type: $event })"
            :options="paymentOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('common.select')"
            class="w-full !rounded-xl !border-slate-100 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950 !h-10 text-[13px]"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('trades.filters.branch') }}</label>
          <Dropdown 
            :modelValue="filters.branch"
            @update:modelValue="$emit('update:filter', { branch: $event })"
            :options="branchOptions"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('common.all')"
            filter
            :disabled="isSeller"
            class="w-full !rounded-xl !border-slate-100 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950 !h-10 text-[13px] disabled:opacity-50"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('trades.filters.worker') }}</label>
          <Dropdown 
            :modelValue="filters.worker"
            @update:modelValue="$emit('update:filter', { worker: $event })"
            :options="workerOptions"
            optionLabel="full_name"
            optionValue="id"
            :placeholder="$t('common.all')"
            filter
            class="w-full !rounded-xl !border-slate-100 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950 !h-10 text-[13px]"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('common.date_from') }}</label>
          <input 
            type="date"
            :value="filters.date_from"
            @input="$emit('update:filter', { date_from: $event.target.value })"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('common.date_to') }}</label>
          <input 
            type="date"
            :value="filters.date_to"
            @input="$emit('update:filter', { date_to: $event.target.value })"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('trades.filters.min_amount') }}</label>
          <input 
            type="number"
            :value="filters.min_amount"
            @input="$emit('update:filter', { min_amount: $event.target.value })"
            placeholder="0"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('trades.filters.max_amount') }}</label>
          <input 
            type="number"
            :value="filters.max_amount"
            @input="$emit('update:filter', { max_amount: $event.target.value })"
            placeholder="0"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
          >
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/50">
        <button 
          @click="onReset" 
          class="h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
        >
          <i class="pi pi-times text-[10px]"></i>
          <span class="text-[13px] font-bold">{{ $t('common.reset') }}</span>
        </button>
        <button 
          @click="onApply" 
          class="h-10 px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <i class="pi pi-filter text-[11px]"></i>
          <span class="text-[13px] font-bold">{{ $t('trades.filters.apply') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import { customersAPI, branchesAPI, workersAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['update:searchQuery', 'update:filter', 'search', 'reset'])

const authStore = useAuthStore()
const { t } = useI18n()

const showFilters = ref(false)

const selectedCustomer = ref(null)
const customerSuggestions = ref([])

const branchOptions = ref([{ id: '', name: t('common.all') }])
const workerOptions = ref([{ id: '', full_name: t('common.all') }])

const isSeller = computed(() => {
  const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
  return role === 'seller'
})

const hasActiveFilters = computed(() => {
  return Object.keys(props.filters).some(key => {
    if (key === 'search') return false // Ignore general search
    return props.filters[key] !== '' && props.filters[key] !== null && props.filters[key] !== undefined
  })
})

const onApply = () => {
  emit('search')
  showFilters.value = false
}

const statusOptions = computed(() => [
  { label: t('trades.status.all'), value: '' },
  { label: t('trades.status.completed'), value: 'completed' },
  { label: t('trades.status.cancelled'), value: 'cancelled' },
  { label: t('trades.status.returned'), value: 'returned' },
  { label: t('trades.status.partially_returned'), value: 'partially_returned' }
])

const paymentOptions = computed(() => [
  { label: t('trades.payment.all'), value: '' },
  { label: t('trades.payment.cash'), value: 'cash' },
  { label: t('trades.payment.card'), value: 'card' },
  { label: t('trades.payment.mixed'), value: 'mixed' },
  { label: t('trades.payment.debt'), value: 'debt' }
])

onMounted(async () => {
  try {
    const [bRes, wRes] = await Promise.all([
      branchesAPI.getAll(),
      workersAPI.getAll()
    ])
    const loadedBranches = bRes.data.results || bRes.data || []
    const loadedWorkers = wRes.data.results || wRes.data || []
    
    branchOptions.value = [
      { id: '', name: t('common.all') },
      ...loadedBranches
    ]
    
    workerOptions.value = [
      { id: '', full_name: t('common.all') },
      ...loadedWorkers.map(w => ({
        id: w.id,
        full_name: w.full_name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.name || t('workers.unknown')
      }))
    ]
  } catch (error) {
    console.error('Error loading filter options:', error)
  }
})

const searchCustomers = async (event) => {
  try {
    const res = await customersAPI.getAll({ search: event.query, limit: 15 })
    customerSuggestions.value = res.data.results || res.data || []
  } catch (error) {
    console.error('Error searching customers:', error)
  }
}

const onCustomerSelect = (event) => {
  if (event.value && event.value.id) {
    emit('update:filter', { customer: event.value.id })
    emit('search')
  }
}

const onCustomerClear = () => {
  selectedCustomer.value = null
  emit('update:filter', { customer: '' })
  emit('search')
}

watch(selectedCustomer, (newVal) => {
  // If user cleared the text manually (it becomes empty string)
  if (!newVal) {
    emit('update:filter', { customer: '' })
    emit('search')
  }
})

// Listen to reset from parent to clear local state if needed
const onReset = () => {
  selectedCustomer.value = null
  emit('reset')
}
</script>

<style scoped>
.animate-in {
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.custom-autocomplete-wrapper) {
  display: block;
  width: 100%;
}
:deep(.custom-autocomplete-wrapper .p-autocomplete-input) {
  width: 100% !important;
}
:deep(.p-autocomplete-panel) {
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}
.dark :deep(.p-autocomplete-panel) {
  background: #0f172a;
  border-color: #1e293b;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
</style>
