<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1 sm:p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] sm:rounded-2xl shadow-sm overflow-hidden">
    <!-- Tabs -->
    <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth p-0.5">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-2 rounded-[1.2rem] sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest transition-all duration-300 relative group/tab whitespace-nowrap min-w-fit"
        :class="activeTab === tab.id 
          ? (tab.id === 'no_debt' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20')
          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        <span class="relative z-10 flex items-center justify-center gap-2">
          <i :class="tab.icon" class="text-[10px] sm:text-xs"></i>
          {{ tab.label }}
          <span v-if="tab.count > 0" class="px-1.5 py-0.5 rounded-md bg-white/20 text-[8px] font-black">{{ tab.count }}</span>
        </span>
      </button>
    </div>

    <!-- Total Debt Amount Badge -->
    <div class="flex items-center justify-between sm:justify-end gap-3 px-4 py-2.5 sm:py-2 bg-slate-50/50 dark:bg-emerald-500/5 sm:bg-transparent border sm:border-0 border-slate-100 dark:border-slate-800 sm:dark:border-transparent rounded-2xl transition-all"
         :class="totalDebt > 0 
           ? 'bg-rose-500/5 dark:bg-rose-500/10' 
           : 'bg-emerald-500/5 dark:bg-emerald-500/10'">
      <div class="flex flex-col items-start sm:items-end">
        <span class="text-[8px] font-black tracking-widest leading-none"
              :class="totalDebt > 0 ? 'text-rose-500' : 'text-emerald-500'">
          {{ $t('customers.total_debt_label') || 'Umumiy Qarzdorlik' }}
        </span>
        <span class="text-[13px] font-black tracking-tighter mt-1"
              :class="totalDebt > 0 ? 'text-slate-800 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'">
          {{ formatCurrency(totalDebt) }}
        </span>
      </div>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg transition-all"
           :class="totalDebt > 0 
             ? 'bg-rose-500 shadow-rose-500/20' 
             : 'bg-emerald-500 shadow-emerald-500/20'">
        <i :class="totalDebt > 0 ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'" class="text-xs"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  activeTab: String,
  totalDebt: Number
})

defineEmits(['update:activeTab'])

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'currency', 
    currency: 'UZS', 
    maximumFractionDigits: 0 
  }).format(val || 0)
}
</script>
