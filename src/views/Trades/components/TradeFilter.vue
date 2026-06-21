<template>
  <div class="flex flex-col w-full">
    <!-- Top Row: Customer AutoComplete and Toggle -->
    <div class="flex items-center gap-3 w-full">
      <div class="relative flex-1">
        <AutoComplete 
          ref="customerAutocomplete"
          v-model="selectedCustomer"
          :suggestions="customerSuggestions"
          @complete="searchCustomers"
          @item-select="onCustomerSelect"
          optionLabel="name"
          :placeholder="$t('customers.search_placeholder') || 'Mijoz nomi bo\'yicha qidirib tanlang...'"
          class="w-full custom-autocomplete-wrapper"
          inputClass="w-full h-11 !pl-11 pr-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none text-[15px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
        />
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10 transition-colors" :class="{'text-emerald-500': selectedCustomer}"></i>
        <button 
          v-if="selectedCustomer" 
          @click="onCustomerClear" 
          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 z-10 p-1"
        >
           <i class="pi pi-times text-[12px] font-bold"></i>
        </button>
      </div>
      
      <button 
        v-if="hasActiveFilters"
        @click="onReset"
        class="h-11 px-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-500/5 text-rose-500 flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/10 transition-all shrink-0 shadow-sm group"
        title="Filtrlarni tozalash"
      >
        <i class="pi pi-refresh text-[14px] group-hover:rotate-180 transition-transform duration-500"></i>
      </button>

      <button 
        @click="showFilters = true"
        :class="[
          'h-11 px-5 rounded-xl border flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm font-bold text-[14px]',
          hasActiveFilters
            ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-white' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <i class="pi pi-filter text-[14px]"></i>
        <span>Filtr</span>
        <span v-if="hasActiveFilters" class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>
    </div>

    <!-- Sliding Sidebar Drawer (Teleported to Body for perfect layout) -->
    <Teleport to="body">
      <!-- Backdrop -->
      <div 
        v-if="showFilters" 
        @click="showFilters = false"
        class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
      ></div>

      <!-- Drawer Panel -->
      <div 
        :class="[
          'fixed right-0 top-0 bottom-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_60px_rgba(0,0,0,0.7)] z-[10000] flex flex-col transition-all duration-300 ease-out transform',
          showFilters ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20 backdrop-blur">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <i class="pi pi-sliders-h text-[16px]"></i>
            </div>
            <div>
              <h4 class="text-[15px] font-black text-slate-800 dark:text-slate-100">Batafsil saralash</h4>
              <p class="text-[11px] text-slate-400 font-bold">Savdolarni batafsil saralash paneli</p>
            </div>
          </div>
          <button 
            @click="showFilters = false" 
            class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <i class="pi pi-times text-[12px] font-bold"></i>
          </button>
        </div>

        <!-- Scrollable Form Container -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
          <!-- Status & Payment Type Row -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Status (Holat) -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-info-circle text-[11px] text-emerald-500/80"></i>
                {{ $t('common.status') }}
              </label>
              <Select 
                :modelValue="filters.status"
                @update:modelValue="$emit('update:filter', { status: $event })"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                class="sr-select !h-11 flex items-center"
                :placeholder="$t('common.status')" 
              />
            </div>
            
            <!-- To'lov turi -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-credit-card text-[11px] text-emerald-500/80"></i>
                {{ $t('subscription.payment_type') || 'To\'lov turi' }}
              </label>
              <Select 
                :modelValue="filters.payment_type"
                @update:modelValue="$emit('update:filter', { payment_type: $event })"
                :options="paymentOptions"
                optionLabel="label"
                optionValue="value"
                class="sr-select !h-11 flex items-center"
                :placeholder="$t('subscription.payment_type') || 'To\'lov turi'" 
              />
            </div>
          </div>

          <!-- Filial & Worker Row -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Filial -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-map-marker text-[11px] text-emerald-500/80"></i>
                {{ $t('trades.filters.branch') }}
              </label>
              <Select 
                :modelValue="filters.branch"
                @update:modelValue="$emit('update:filter', { branch: $event })"
                :options="branchOptions"
                optionLabel="name"
                optionValue="id"
                :disabled="isSeller"
                class="sr-select !h-11 flex items-center"
                :placeholder="$t('trades.filters.branch')" 
              />
            </div>

            <!-- Xodim -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-user text-[11px] text-emerald-500/80"></i>
                {{ $t('trades.filters.worker') }}
              </label>
              <Select 
                :modelValue="filters.worker"
                @update:modelValue="$emit('update:filter', { worker: $event })"
                :options="workerOptions"
                optionLabel="full_name"
                optionValue="id"
                class="sr-select !h-11 flex items-center"
                :placeholder="$t('trades.filters.worker')" 
              />
            </div>
          </div>

          <!-- Smena -->
          <div class="flex flex-col">
            <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
              <i class="pi pi-clock text-[11px] text-emerald-500/80"></i>
              Smena
            </label>
            <Select 
              :modelValue="filters.smena"
              @update:modelValue="$emit('update:filter', { smena: $event })"
              :options="shiftOptions"
              optionLabel="name"
              optionValue="id"
              class="sr-select !h-11 flex items-center"
              placeholder="Smena" 
            />
          </div>

          <!-- Sanalar Grid -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Sana dan -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-calendar-plus text-[10px] text-emerald-500/80"></i>
                {{ $t('common.date_from') }}
              </label>
              <DatePicker 
                :modelValue="filters.date_from ? new Date(filters.date_from) : null"
                @update:modelValue="onDateFromChange"
                dateFormat="yy-mm-dd"
                showIcon
                iconDisplay="input"
                class="sr-datepicker-custom !w-full"
                inputClass="!w-full !h-11 px-4 !bg-slate-50/50 dark:!bg-slate-950/40 !border !border-slate-200/80 dark:!border-slate-800/80 !rounded-xl text-[13px] !font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                placeholder="Dan"
              />
            </div>

            <!-- Sana gacha -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-calendar-minus text-[10px] text-emerald-500/80"></i>
                {{ $t('common.date_to') }}
              </label>
              <DatePicker 
                :modelValue="filters.date_to ? new Date(filters.date_to) : null"
                @update:modelValue="onDateToChange"
                dateFormat="yy-mm-dd"
                showIcon
                iconDisplay="input"
                class="sr-datepicker-custom !w-full"
                inputClass="!w-full !h-11 px-4 !bg-slate-50/50 dark:!bg-slate-950/40 !border !border-slate-200/80 dark:!border-slate-800/80 !rounded-xl text-[13px] !font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                placeholder="Gacha"
              />
            </div>
          </div>

          <!-- Summalar Grid -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Min Summa -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-wallet text-[10px] text-emerald-500/80"></i>
                {{ $t('trades.filters.min_amount') }}
              </label>
              <InputNumber 
                :modelValue="filters.min_amount !== '' && filters.min_amount !== null ? Number(filters.min_amount) : null"
                @update:modelValue="$emit('update:filter', { min_amount: $event !== null ? String($event) : '' })"
                placeholder="0"
                mode="decimal"
                class="sr-number !h-11"
                inputClass="!w-full !h-11 !px-4 !bg-slate-50/50 dark:!bg-slate-950/40 !border !border-slate-200/80 dark:!border-slate-800/80 !rounded-xl focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/5 outline-none text-[13px] !font-bold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-500 shadow-sm"
              />
            </div>

            <!-- Max Summa -->
            <div class="flex flex-col">
              <label class="text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2">
                <i class="pi pi-wallet text-[10px] text-emerald-500/80"></i>
                {{ $t('trades.filters.max_amount') }}
              </label>
              <InputNumber 
                :modelValue="filters.max_amount !== '' && filters.max_amount !== null ? Number(filters.max_amount) : null"
                @update:modelValue="$emit('update:filter', { max_amount: $event !== null ? String($event) : '' })"
                placeholder="0"
                mode="decimal"
                class="sr-number !h-11"
                inputClass="!w-full !h-11 !px-4 !bg-slate-50/50 dark:!bg-slate-950/40 !border !border-slate-200/80 dark:!border-slate-800/80 !rounded-xl focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/5 outline-none text-[13px] !font-bold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        <!-- Sticky Footer inside Drawer -->
        <div class="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/60 p-5 flex items-center justify-between gap-3 bg-slate-50/20">
          <button 
            @click="onReset" 
            class="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold text-[13px]"
          >
            <i class="pi pi-times text-[11px]"></i>
            <span>Tozalash</span>
          </button>
          <button 
            @click="onApply" 
            class="h-11 flex-1 px-6 rounded-xl bg-emerald-500 text-white flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors font-bold text-[13px] shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <i class="pi pi-filter text-[11px]"></i>
            <span>Filtrni qo'llash</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import { useTradeFilter } from '../composables/useTradeFilter'

const props = defineProps({
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['update:searchQuery', 'update:filter', 'search', 'reset'])

const customerAutocomplete = ref(null)

const {
  showFilters,
  selectedCustomer,
  customerSuggestions,
  branchOptions,
  workerOptions,
  shiftOptions,
  isSeller,
  hasActiveFilters,
  statusOptions,
  paymentOptions,
  onApply,
  onDateFromChange,
  onDateToChange,
  searchCustomers,
  onCustomerSelect,
  onCustomerClear,
  onReset
} = useTradeFilter(props, emit, customerAutocomplete)
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

:deep(.sr-datepicker-custom) {
  width: 100% !important;
}
:deep(.sr-datepicker-custom .p-datepicker-input) {
  width: 100% !important;
}
</style>

<style>
/* Global override to ensure PrimeVue v4 teleported panels are always on top of the fixed sidebar drawer */
.p-select-overlay,
.p-select-panel,
.p-datepicker-panel,
.p-datepicker,
.p-autocomplete-panel {
  z-index: 100010 !important;
}
</style>


