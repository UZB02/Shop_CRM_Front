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
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_sold_qty') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_revenue') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_last_sale') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="(item, idx) in items"
              :key="`${item.product_id}-${item.tur_id}`"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="w-6 h-6 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center text-[11px] font-black">
                  <i class="pi pi-exclamation-triangle text-[10px]"></i>
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
                  <span class="font-black text-slate-800 dark:text-slate-100">{{ formatNum(item.sold_quantity) }}</span>
                  <span class="text-[10px] text-slate-400">dona</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatMoney(item.sold_revenue) }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">{{ item.last_sale_date || '—' }}</span>
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
          class="bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border border-rose-200 dark:border-rose-900/50 flex flex-col gap-3 relative overflow-hidden"
        >
          <!-- Top Row: Name & Alert -->
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-500 shrink-0 flex items-center justify-center text-xs font-black shadow-sm">
              <i class="pi pi-exclamation-triangle text-sm"></i>
            </div>
            <div class="flex-grow flex flex-col">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white shadow-sm shadow-rose-500/30 uppercase tracking-wider">
                  {{ $t('reports.tabs.sold_out') }}
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
          <div class="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>

          <!-- Bottom Row: Metrics Grid -->
          <div class="grid grid-cols-2 gap-y-3 gap-x-4">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_sold_qty') }}</span>
              <div class="flex items-baseline gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatNum(item.sold_quantity) }}</span>
                <span class="text-[9px] text-slate-400">dona</span>
              </div>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_revenue') }}</span>
              <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                {{ formatMoney(item.sold_revenue) }}
              </span>
            </div>

            <div class="flex flex-col col-span-2">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_last_sale') }}</span>
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {{ item.last_sale_date || '—' }}
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
import { formatTur, formatMoney, formatNum } from '../composables/useProductReports'
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
