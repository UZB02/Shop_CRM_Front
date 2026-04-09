<template>
  <div class="flex flex-col md:flex-row items-center gap-3 w-full">
    <!-- Search -->
    <div class="relative w-full md:w-80">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
      <input 
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @keyup.enter="$emit('search')"
        type="text" 
        :placeholder="$t('customers.search_placeholder')"
        class="w-full h-10 pl-9 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none text-[11px] font-bold text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
      >
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto">
      <Dropdown 
        :modelValue="filters.status"
        @update:modelValue="$emit('update:filter', { status: $event })"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Holat"
        class="min-w-[120px] !rounded-xl !border-slate-100 dark:!border-slate-800 !h-10 text-[11px]"
      />
      
      <Dropdown 
        :modelValue="filters.payment_type"
        @update:modelValue="$emit('update:filter', { payment_type: $event })"
        :options="paymentOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="To'lov turi"
        class="min-w-[140px] !rounded-xl !border-slate-100 dark:!border-slate-800 !h-10 text-[11px]"
      />

      <!-- Date Filters (using simple text inputs or PrimeVue Calendars if wanted) -->
      <button 
        @click="$emit('reset')"
        class="h-10 px-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-all outline-none"
        v-tooltip.top="'Tozalash'"
      >
        <i class="pi pi-filter-slash text-xs"></i>
      </button>

      <button 
        @click="$emit('search')"
        class="h-10 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-sm"
      >
        Filtrni qo'llash
      </button>
    </div>
  </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['update:searchQuery', 'update:filter', 'search', 'reset'])

const statusOptions = [
  { label: 'Barchasi', value: '' },
  { label: 'Yakunlangan', value: 'completed' },
  { label: 'Kutilmoqda', value: 'pending' },
  { label: 'Bekor qilingan', value: 'cancelled' }
]

const paymentOptions = [
  { label: 'Barchasi', value: '' },
  { label: 'Naqd', value: 'cash' },
  { label: 'Karta', value: 'card' },
  { label: 'Aralash', value: 'mixed' },
  { label: 'Nasiya', value: 'debt' }
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
