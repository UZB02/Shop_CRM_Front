<template>
  <div class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Tabs -->
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 xl:flex-1">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="flex-1 xl:flex-none px-3 py-2.5 xl:py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-w-fit"
        :class="activeTab === tab.id 
          ? (tab.id === 'no_debt' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : tab.id === 'reminder_today'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : tab.id === 'reminder_upcoming'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : tab.id === 'reminder_overdue'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20')
          : (tab.id === 'reminder_overdue'
              ? 'text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 font-black'
              : tab.id === 'reminder_today'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 font-black'
                : tab.id === 'reminder_upcoming'
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200')"
      >
        <span class="flex items-center justify-center gap-2">
          <i :class="tab.icon" class="text-[13px]"></i>
          {{ tab.label }}
          <span v-if="tab.count > 0" class="px-1.5 py-0.5 rounded-lg bg-black/10 dark:bg-white/10 text-[10px] font-black">{{ tab.count }}</span>
        </span>
      </button>
    </div>

    <!-- Right Side Wrapper (Filters, Exports, Stats) -->
    <div class="flex flex-col xl:flex-row items-stretch xl:items-center">
      
      <!-- Filters and Actions Row -->
      <div v-if="activeTab === 'debtors' || settingsStore.hasPlanExport" 
           class="flex items-center gap-2 px-3 py-2 xl:py-1 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800"
           :class="activeTab === 'debtors' ? 'justify-between' : 'justify-end'">
        
        <!-- Debtors Filters -->
        <div v-if="activeTab === 'debtors'" class="relative group/min-debt flex-1 xl:flex-none xl:min-w-[120px]">
          <i class="pi pi-money-bill absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] transition-colors group-focus-within/min-debt:text-emerald-500"></i>
          <input 
            :value="minDebt" 
            @input="$emit('update:minDebt', $event.target.value)"
            type="number" 
            :placeholder="$t('finance.min_debt')" 
            class="w-full h-8 pl-7 pr-2 text-[11px] font-semibold rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all outline-none"
          />
        </div>

        <!-- Export Actions -->
        <div v-if="settingsStore.hasPlanExport" class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            @click.stop.prevent="$emit('export', 'excel')"
            class="h-8 w-8 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            title="Excel"
          >
            <i class="pi pi-file-excel text-[13px]"></i>
          </button>
          <button
            type="button"
            @click.stop.prevent="$emit('export', 'pdf')"
            class="h-8 w-8 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            title="PDF"
          >
            <i class="pi pi-file-pdf text-[13px]"></i>
          </button>
        </div>
      </div>

      <!-- Total Debt Amount Badge -->
      <div class="flex items-center justify-between xl:justify-end gap-3 px-4 py-3 xl:py-1.5 bg-slate-50/50 dark:bg-slate-800/50 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 transition-all min-w-fit rounded-b-lg xl:rounded-none">
        <div class="flex flex-col items-start xl:items-end">
          <span class="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {{ $t('customers.total_debt_label') || 'Umumiy Qarzdorlik' }}
          </span>
          <span class="text-[14px] font-black tracking-tighter"
                :class="totalDebt > 0 ? 'text-rose-500' : 'text-emerald-500'">
            {{ formatCurrency(totalDebt) }}
          </span>
        </div>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0"
             :class="totalDebt > 0 
               ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 shadow-sm shadow-rose-500/10' 
               : 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/10'">
          <i :class="totalDebt > 0 ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'" class="text-sm"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
const settingsStore = useSettingsStore()

defineProps({
  tabs: Array,
  activeTab: String,
  totalDebt: Number,
  minDebt: [Number, String]
})

defineEmits(['update:activeTab', 'update:minDebt', 'export'])

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'decimal',  // Changed from currency to keep it compact
    maximumFractionDigits: 0 
  }).format(val || 0) + ' UZS'
}
</script>


