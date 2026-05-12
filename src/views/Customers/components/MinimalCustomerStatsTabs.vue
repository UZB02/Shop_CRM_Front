<template>
  <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Tabs -->
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 flex-1">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
        :class="activeTab === tab.id 
          ? (tab.id === 'no_debt' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-rose-500 text-white')
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        <span class="flex items-center justify-center gap-2">
          <i :class="tab.icon" class="text-[12px]"></i>
          {{ tab.label }}
          <span v-if="tab.count > 0" class="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[11px] font-bold">{{ tab.count }}</span>
        </span>
      </button>
    </div>

    <!-- Debtors Filters & Actions -->
    <div v-if="activeTab === 'debtors'" class="flex items-center gap-2 px-2 py-1 md:py-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
      <div class="relative group/min-debt min-w-[120px]">
        <i class="pi pi-money-bill absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] transition-colors group-focus-within/min-debt:text-emerald-500"></i>
        <input 
          :value="minDebt" 
          @input="$emit('update:minDebt', $event.target.value)"
          type="number" 
          :placeholder="$t('finance.min_debt')" 
          class="w-full h-8 pl-7 pr-2 text-[11px] font-semibold rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all outline-none"
        />
      </div>

      <div class="flex items-center gap-1">
        <button 
          @click="$emit('export', 'excel')"
          class="h-8 w-8 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
          title="Excel"
        >
          <i class="pi pi-file-excel text-[12px]"></i>
        </button>
        <button 
          @click="$emit('export', 'pdf')"
          class="h-8 w-8 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          title="PDF"
        >
          <i class="pi pi-file-pdf text-[12px]"></i>
        </button>
      </div>
    </div>

    <!-- Total Debt Amount Badge -->
    <div class="flex items-center justify-between md:justify-end gap-3 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 transition-all min-w-fit">
      <div class="flex flex-col items-start md:items-end">
        <span class="text-[11px] font-bold tracking-widest text-slate-400">
          {{ $t('customers.total_debt_label') || 'Umumiy Qarzdorlik' }}
        </span>
        <span class="text-xs font-semibold tracking-tight"
              :class="totalDebt > 0 ? 'text-rose-500' : 'text-emerald-500'">
          {{ formatCurrency(totalDebt) }}
        </span>
      </div>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0"
           :class="totalDebt > 0 
             ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
             : 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'">
        <i :class="totalDebt > 0 ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'" class="text-[12px]"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
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


