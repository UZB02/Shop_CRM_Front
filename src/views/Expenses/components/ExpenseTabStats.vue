<template>
  <div class="space-y-4">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="stat in mainStats" :key="stat.label" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div :class="stat.bg" class="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0">
          <i :class="[stat.icon, stat.color]" class="text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ stat.label }}</p>
          <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            <span v-if="loading" class="inline-block w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></span>
            <span v-else>{{ stat.value }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Financial Overview (Manager+) -->
    <div v-if="isManager && summaryData.totalExpenses > 0" class="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
          <i class="pi pi-info-circle"></i>
        </div>
        <div>
          <h4 class="text-xs font-black uppercase tracking-widest text-rose-500">{{ $t('reports.financial_report') }}</h4>
          <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ $t('reports.financial_desc') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="text-center sm:text-right">
          <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">{{ $t('reports.total_ops') }}</span>
          <span class="text-sm font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(summaryData.totalExpenses) }}</span>
        </div>
        <button 
          @click="$emit('view-report')"
          class="h-9 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          {{ $t('common.view_all') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  isManager: Boolean,
  summaryData: Object,
  totalFromList: [Number, String],
  topCategoryName: String,
  lastExpenseDate: String
})

defineEmits(['view-report'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const mainStats = computed(() => [
  {
    label: 'Oylik xarajatlar',
    value: formatCurrency(props.totalFromList),
    icon: 'pi pi-wallet',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20'
  },
  {
    label: 'Eng ko\'p kateg.',
    value: props.topCategoryName || '—',
    icon: 'pi pi-chart-pie',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20'
  },
  {
    label: 'Oxirgi xarajat',
    value: props.lastExpenseDate || '—',
    icon: 'pi pi-calendar',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20'
  }
])
</script>
