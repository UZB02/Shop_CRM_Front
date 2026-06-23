<template>
  <div class="space-y-4">
    <!-- Top Summary Cards -->
    <div v-if="summary" class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Tushum -->
      <div class="bg-white dark:bg-slate-800/85 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('reports.trend.revenue') }}</span>
          <div class="flex items-center gap-1.5">
            <TrendBadge :pct="summary.growth.revenue_pct" />
            <i class="pi pi-wallet text-emerald-500 text-sm"></i>
          </div>
        </div>
        <div class="mt-2 flex items-baseline justify-between flex-wrap gap-x-2">
          <span class="text-base font-black text-slate-800 dark:text-white leading-none">{{ formatMoney(summary.current_period.revenue) }}</span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-semibold line-through decoration-slate-300 dark:decoration-slate-600 leading-none">{{ formatMoney(summary.previous_period.revenue) }}</span>
        </div>
      </div>

      <!-- Miqdor -->
      <div class="bg-white dark:bg-slate-800/85 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('reports.trend.quantity') }}</span>
          <div class="flex items-center gap-1.5">
            <TrendBadge :pct="summary.growth.quantity_pct" />
            <i class="pi pi-box text-blue-500 text-sm"></i>
          </div>
        </div>
        <div class="mt-2 flex items-baseline justify-between flex-wrap gap-x-2">
          <span class="text-base font-black text-slate-800 dark:text-white leading-none">
            {{ formatNum(summary.current_period.quantity) }}
            <span class="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{{ $t('common.count') }}</span>
          </span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-semibold line-through decoration-slate-300 dark:decoration-slate-600 leading-none">{{ formatNum(summary.previous_period.quantity) }} {{ $t('common.count') }}</span>
        </div>
      </div>

      <!-- Foyda -->
      <div class="bg-white dark:bg-slate-800/85 rounded-xl p-3 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('reports.trend.profit') }}</span>
          <div class="flex items-center gap-1.5">
            <TrendBadge :pct="summary.growth.profit_pct" />
            <i class="pi pi-chart-line text-violet-500 text-sm"></i>
          </div>
        </div>
        <div class="mt-2 flex items-baseline justify-between flex-wrap gap-x-2">
          <span class="text-base font-black text-slate-800 dark:text-white leading-none">{{ formatMoney(summary.current_period.profit) }}</span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-semibold line-through decoration-slate-300 dark:decoration-slate-600 leading-none">{{ formatMoney(summary.previous_period.profit) }}</span>
        </div>
      </div>
    </div>

    <!-- Jadval qismi -->
    <div class="w-full">
      <!-- Desktop jadval (Hidden on Mobile) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest w-10">{{ $t('reports.col_rank') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_product') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_tur') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_current_period') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_previous_period') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_delta') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_growth_pct') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="(item, idx) in items"
              :key="`${item.product_id}-${item.tur_id}`"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-black">
                  {{ offset + idx + 1 }}
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="font-bold text-slate-800 dark:text-slate-100">{{ item.nom }}</span>
              </td>
              <td class="px-4 py-3">
                <span v-if="formatTur(item.tur) !== '-'" class="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {{ formatTur(item.tur) }}
                </span>
                <span v-else class="text-slate-400 font-medium">-</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col">
                  <span class="font-black text-slate-800 dark:text-slate-100">{{ formatMoney(item.current_revenue) }}</span>
                  <span class="text-[10px] text-slate-500">{{ formatNum(item.current_quantity) }} {{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-500 font-semibold">{{ formatMoney(item.previous_revenue) }}</span>
                  <span class="text-[10px] text-slate-400">{{ formatNum(item.previous_quantity) }} {{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col">
                  <span :class="deltaColor(item.direction)" class="font-bold text-sm">{{ formatMoney(item.delta_revenue) }}</span>
                  <span class="text-[10px] text-slate-400">{{ item.delta_quantity > 0 ? '+' : '' }}{{ formatNum(item.delta_quantity) }} {{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <TrendBadge :pct="item.growth_pct" :direction="item.direction" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile jadval (Cards, Hidden on Desktop) -->
      <div class="md:hidden flex flex-col gap-3 px-3 py-3">
        <div
          v-for="(item, idx) in items"
          :key="`${item.product_id}-${item.tur_id}-mobile`"
          class="bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/60 flex flex-col gap-3 relative overflow-hidden"
        >
          <!-- Top Row: Name & Trend -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0 flex items-center justify-center text-xs font-black shadow-sm">
                {{ offset + idx + 1 }}
              </div>
              <div class="flex-grow flex flex-col">
                <span class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-1">{{ item.nom }}</span>
                <span
                  v-if="formatTur(item.tur) !== '-'"
                  class="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg text-[11px] font-semibold self-start"
                >
                  {{ formatTur(item.tur) }}
                </span>
              </div>
            </div>
            <TrendBadge :pct="item.growth_pct" :direction="item.direction" />
          </div>

          <!-- Divider -->
          <div class="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>

          <!-- Bottom Row: Metrics -->
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_previous_period') }}</span>
              <span class="text-xs text-slate-500 font-semibold">{{ formatMoney(item.previous_revenue) }}</span>
              <span class="text-[9px] text-slate-400">{{ formatNum(item.previous_quantity) }} {{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
            </div>
            
            <div class="flex flex-col items-center">
              <i class="pi pi-arrow-right text-[10px] text-slate-300 dark:text-slate-600"></i>
            </div>

            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_current_period') }}</span>
              <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatMoney(item.current_revenue) }}</span>
              <span class="text-[10px] text-slate-500">{{ formatNum(item.current_quantity) }} {{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Paginatsiya -->
    <ReportsPagination
      v-if="!loading && items.length"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @change="emit('page-change', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTur, formatMoney, formatNum } from '../composables/useProductReports'
import TrendBadge from './TrendBadge.vue'
import ReportsPagination from './ReportsPagination.vue'

const props = defineProps({
  items: { type: Array, required: true },
  summary: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
})

const emit = defineEmits(['page-change'])

const offset = computed(() => (props.page - 1) * props.pageSize)

const deltaColor = (direction) => {
  if (direction === 'up' || direction === 'new') return 'text-emerald-600 dark:text-emerald-400'
  if (direction === 'down') return 'text-rose-600 dark:text-rose-400'
  return 'text-slate-600 dark:text-slate-400'
}
</script>
