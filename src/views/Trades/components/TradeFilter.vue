<template>
  <div class="flex flex-col w-full">
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
        @click="showFilters = !showFilters"
        class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-white shrink-0 shadow-sm"
      >
        <i class="pi pi-filter text-[13px]"></i>
        <span class="text-[13px] font-bold">Filtr</span>
        <i :class="['pi text-[10px] ml-1 transition-transform dark:text-slate-400', showFilters ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>
    </div>

    <!-- Filter Panel -->
    <div v-show="showFilters" class="mt-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-in slide-in-from-top-2 duration-200 shadow-sm relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        
        <!-- Row 1 -->
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Holat</label>
          <Dropdown 
            :modelValue="filters.status"
            @update:modelValue="$emit('update:filter', { status: $event })"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tanlang..."
            class="w-full !rounded-xl !border-slate-200 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 !h-10 text-[13px]"
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">To'lov turi</label>
          <Dropdown 
            :modelValue="filters.payment_type"
            @update:modelValue="$emit('update:filter', { payment_type: $event })"
            :options="paymentOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tanlang..."
            class="w-full !rounded-xl !border-slate-200 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 !h-10 text-[13px]"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Filial</label>
          <Dropdown 
            :modelValue="filters.branch"
            @update:modelValue="$emit('update:filter', { branch: $event })"
            :options="branchOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="Barchasi"
            filter
            class="w-full !rounded-xl !border-slate-200 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 !h-10 text-[13px]"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Xodim</label>
          <Dropdown 
            :modelValue="filters.worker"
            @update:modelValue="$emit('update:filter', { worker: $event })"
            :options="workerOptions"
            optionLabel="full_name"
            optionValue="id"
            placeholder="Barchasi"
            filter
            class="w-full !rounded-xl !border-slate-200 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 !h-10 text-[13px]"
          />
        </div>
        
        <!-- Row 2 -->
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Sanadan</label>
          <div class="relative">
            <input 
              type="date"
              :value="filters.date_from"
              @input="$emit('update:filter', { date_from: $event.target.value })"
              class="w-full h-10 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
            >
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Sanagacha</label>
          <div class="relative">
            <input 
              type="date"
              :value="filters.date_to"
              @input="$emit('update:filter', { date_to: $event.target.value })"
              class="w-full h-10 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
            >
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Min. summa</label>
          <input 
            type="number"
            :value="filters.min_amount"
            @input="$emit('update:filter', { min_amount: $event.target.value })"
            placeholder="0"
            class="w-full h-10 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-700 dark:text-white">Maks. summa</label>
          <input 
            type="number"
            :value="filters.max_amount"
            @input="$emit('update:filter', { max_amount: $event.target.value })"
            placeholder="0"
            class="w-full h-10 px-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
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
          <span class="text-[13px] font-bold">Tozalash</span>
        </button>
        <button 
          @click="$emit('search')" 
          class="h-10 px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <i class="pi pi-filter text-[11px]"></i>
          <span class="text-[13px] font-bold">Filtrni qo'llash</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import { customersAPI, branchesAPI, workersAPI } from '@/services/api'

const props = defineProps({
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['update:searchQuery', 'update:filter', 'search', 'reset'])

const showFilters = ref(false)

const selectedCustomer = ref(null)
const customerSuggestions = ref([])

const branchOptions = ref([{ id: '', name: 'Barchasi' }])
const workerOptions = ref([{ id: '', full_name: 'Barchasi' }])

const statusOptions = [
  { label: 'Barchasi', value: '' },
  { label: 'Yakunlangan', value: 'completed' },
  { label: 'Bekor qilingan', value: 'cancelled' }
]

const paymentOptions = [
  { label: 'Barchasi', value: '' },
  { label: 'Naqd', value: 'cash' },
  { label: 'Karta', value: 'card' },
  { label: 'Aralash', value: 'mixed' },
  { label: 'Nasiya', value: 'debt' }
]

onMounted(async () => {
  try {
    const [bRes, wRes] = await Promise.all([
      branchesAPI.getAll(),
      workersAPI.getAll()
    ])
    const loadedBranches = bRes.data.results || bRes.data || []
    const loadedWorkers = wRes.data.results || wRes.data || []
    
    branchOptions.value = [
      { id: '', name: 'Barchasi' },
      ...loadedBranches
    ]
    
    workerOptions.value = [
      { id: '', full_name: 'Barchasi' },
      ...loadedWorkers.map(w => ({
        id: w.id,
        full_name: w.full_name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.name || 'Nomsiz Xodim'
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
