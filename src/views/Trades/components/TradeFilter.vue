<template>
  <div class="flex flex-col w-full">
    <!-- Top Row: Search and Toggle -->
    <div class="flex items-center gap-3 w-full">
      <div class="relative flex-1">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          @keyup.enter="$emit('search')"
          type="text" 
          :placeholder="$t('customers.search_placeholder') || 'Mijoz ismi yoki telefon raqami bo\'...'"
          class="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none text-[13px] font-medium text-slate-800 dark:text-white transition-all placeholder:text-slate-500"
        >
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
    <div v-show="showFilters" class="mt-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-in slide-in-from-top-2 duration-200 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
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

        <!-- Row 2 -->
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
          @click="$emit('reset')" 
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
import { ref } from 'vue'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['update:searchQuery', 'update:filter', 'search', 'reset'])

const showFilters = ref(false)

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
</script>

<style scoped>
.animate-in {
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
