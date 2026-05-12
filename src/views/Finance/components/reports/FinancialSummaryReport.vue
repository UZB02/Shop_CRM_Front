<template>
  <div class="space-y-4">
    <template v-if="data">
      <!-- Period Info -->
      <div v-if="data.filters" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <i class="pi pi-calendar"></i>
          </div>
          <div>
            <h4 class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase">{{ $t('reports.period') }}</h4>
            <p class="text-sm font-bold text-slate-700 dark:text-slate-200">
              {{ data.filters.date_from }} — {{ data.filters.date_to }}
            </p>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Purchases Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <i class="pi pi-shopping-cart text-xl"></i>
            </div>
            <h4 class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase mb-1">{{ $t('warehouse.purchases') }}</h4>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(data.purchases?.total) }}</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">uzs</span>
            </div>
            <p class="mt-4 text-[11px] font-medium text-slate-400 leading-relaxed">
              {{ data.purchases?.count || 0 }} {{ $t('common.count') }}
            </p>
          </div>
        </div>

        <!-- Expenses Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <i class="pi pi-receipt text-xl"></i>
            </div>
            <h4 class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase mb-1">{{ $t('finance.expenses') }}</h4>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(data.expenses?.total) }}</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">uzs</span>
            </div>
             <p class="mt-4 text-[11px] font-medium text-slate-400 leading-relaxed">
              {{ data.expenses?.count || 0 }} {{ $t('common.count') }}
            </p>
          </div>
        </div>

        <!-- Wastage Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <i class="pi pi-trash text-xl"></i>
            </div>
            <h4 class="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] uppercase mb-1">{{ $t('shifts.finance.wastage') }}</h4>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-slate-800 dark:text-slate-100">{{ formatCurrency(data.wastage?.total_loss) }}</span>
              <span class="text-[11px] font-bold text-slate-400 uppercase">uzs</span>
            </div>
            <p class="mt-4 text-[11px] font-medium text-slate-400 leading-relaxed">
              {{ data.wastage?.count || 0 }} {{ $t('common.count') }}
            </p>
          </div>
        </div>

        <!-- Total Card -->
        <div class="bg-slate-900 dark:bg-rose-500 border border-slate-800 dark:border-rose-400 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
              <i class="pi pi-calculator text-xl"></i>
            </div>
            <h4 class="text-[11px] font-black text-slate-400 dark:text-rose-100 tracking-[0.2em] uppercase mb-1">{{ $t('common.total') }}</h4>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-white">{{ formatCurrency(data.grand_total) }}</span>
              <span class="text-[11px] font-bold text-slate-400 dark:text-rose-100 uppercase">uzs</span>
            </div>
            <p class="mt-4 text-[11px] font-medium text-slate-400 dark:text-rose-50 leading-relaxed">{{ $t('finance.total_outflow_desc') }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-if="!data" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-20 text-center shadow-sm">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700">
        <i class="pi pi-chart-bar text-3xl"></i>
      </div>
      <h4 class="text-sm font-black text-slate-400 tracking-widest uppercase">{{ $t('common.no_results') }}</h4>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const settingsStore = useSettingsStore()

const totalRevenue = computed(() => {
  if (!props.data?.revenue) return 0
  return Object.values(props.data.revenue).reduce((acc, val) => acc + parseFloat(val || 0), 0)
})

const formatCurrency = (val) => {
  if (!val) return '0'
  return new Intl.NumberFormat('uz-UZ').format(parseFloat(val))
}
</script>
