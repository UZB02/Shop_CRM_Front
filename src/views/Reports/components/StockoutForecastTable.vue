<template>
  <div>
    <!-- Desktop jadval (Hidden on Mobile) -->
    <div class="w-full">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest w-10">{{ $t('reports.col_rank') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_product') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_tur') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_stock') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_avg_daily_sales') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_days_until_stockout') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_est_stockout_date') }}</th>
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
              <td class="px-4 py-3">
                <div class="flex items-baseline gap-1">
                  <span class="font-black text-slate-800 dark:text-slate-100">{{ formatNum(item.current_stock) }}</span>
                  <span class="text-[10px] text-slate-400">dona</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="font-bold text-slate-600 dark:text-slate-300">{{ parseFloat(item.avg_daily_sales || 0).toFixed(2) }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <span
                  :class="[
                    item.days_until_stockout <= 3 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500',
                    'text-xs font-black px-2 py-0.5 rounded-md'
                  ]"
                >
                  {{ item.days_until_stockout }} kun
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">{{ item.est_stockout_date || '—' }}</span>
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
          :class="[
            'bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border flex flex-col gap-3 relative overflow-hidden',
            item.days_until_stockout <= 3 ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-900/10' : 'border-orange-200 dark:border-orange-900/50 bg-orange-50/20 dark:bg-orange-900/10'
          ]"
        >
          <!-- Top Row: Name & Alert -->
          <div class="flex items-start gap-3">
            <div
              :class="item.days_until_stockout <= 3 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'"
              class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-black shadow-sm"
            >
              {{ offset + idx + 1 }}
            </div>
            <div class="flex-grow flex flex-col">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  v-if="item.days_until_stockout <= 3"
                  class="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white shadow-sm shadow-rose-500/30 uppercase tracking-wider flex items-center gap-1"
                >
                  <i class="pi pi-bolt text-[8px]"></i>
                  {{ $t('reports.stockout.urgent') }}
                </span>
                <span class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{{ item.nom }}</span>
              </div>
              <span
                v-if="formatTur(item.tur) !== '-'"
                class="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg text-[11px] font-semibold self-start"
              >
                {{ formatTur(item.tur) }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px w-full" :class="item.days_until_stockout <= 3 ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-orange-100 dark:bg-orange-900/30'"></div>

          <!-- Bottom Row: Metrics Grid -->
          <div class="grid grid-cols-2 gap-y-3 gap-x-4">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_stock') }}</span>
              <div class="flex items-baseline gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatNum(item.current_stock) }}</span>
                <span class="text-[9px] text-slate-400">dona</span>
              </div>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_avg_daily_sales') }}</span>
              <span class="font-bold text-slate-600 dark:text-slate-300 text-sm">{{ parseFloat(item.avg_daily_sales || 0).toFixed(2) }} / kun</span>
            </div>

            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_days_until_stockout') }}</span>
              <span
                :class="item.days_until_stockout <= 3 ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'"
                class="font-black text-sm"
              >
                {{ $t('reports.stockout.days_left', { n: item.days_until_stockout }) }}
              </span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_est_stockout_date') }}</span>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200">
                {{ item.est_stockout_date || '—' }}
              </span>
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
import { formatTur, formatNum } from '../composables/useProductReports'
import ReportsPagination from './ReportsPagination.vue'

const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
})

const emit = defineEmits(['page-change'])

const offset = computed(() => (props.page - 1) * props.pageSize)
</script>
