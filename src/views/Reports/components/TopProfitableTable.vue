<template>
  <div class="reports-table overflow-hidden">
    <!-- Skeleton loader -->
    <div v-if="loading" class="p-6 space-y-3">
      <div v-for="i in 8" :key="i" class="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" :style="{ opacity: 1 - i * 0.1 }"></div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else-if="!items.length" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <i class="pi pi-dollar text-4xl mb-3 opacity-30"></i>
      <p class="text-sm font-bold">{{ $t('reports.no_data') }}</p>
      <p class="text-xs mt-1">{{ $t('reports.no_data_desc') }}</p>
    </div>

    <!-- Desktop jadval (Hidden on Mobile) -->
    <div v-else class="w-full">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest w-10">{{ $t('reports.col_rank') }}</th>
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_product') }}</th>
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_tur') }}</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_sold_qty') }}</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_profit') }}</th>
            <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_margin') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in items"
            :key="`${item.product_id}-${item.tur_id}`"
            class="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <!-- Rank -->
            <td class="px-4 py-3">
              <div :class="rankClass(offset + idx + 1)" class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black">
                {{ offset + idx + 1 }}
              </div>
            </td>

            <!-- Mahsulot nomi -->
            <td class="px-4 py-3">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{ item.nom }}</span>
            </td>

            <!-- Turi -->
            <td class="px-4 py-3">
              <span
                :class="formatTur(item.tur) === '-'
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-[11px]'"
                class="font-semibold text-xs"
              >
                {{ formatTur(item.tur) }}
              </span>
            </td>

            <!-- Sotildi -->
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100">{{ formatNum(item.sold_quantity) }}</span>
                <span class="text-[11px] text-slate-400 font-semibold">{{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
              </div>
            </td>

            <!-- Foyda -->
            <td class="px-4 py-3 text-right">
              <span class="font-black text-violet-600 dark:text-violet-400 text-sm">{{ formatMoney(item.profit) }}</span>
            </td>

            <!-- Margin -->
            <td class="px-4 py-3 text-center">
              <span
                :class="[marginBadge(item.margin_pct), 'text-[11px] font-black px-2 py-1 rounded-lg']"
              >
                {{ parseDecimal(item.margin_pct).toFixed(1) }}%
              </span>
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
          <!-- Top Row: Rank & Name -->
          <div class="flex items-start gap-3">
            <div :class="rankClass(offset + idx + 1)" class="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
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

          <!-- Divider -->
          <div class="h-px w-full bg-slate-100 dark:bg-slate-700/50"></div>

          <!-- Bottom Row: Metrics -->
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_sold_qty') }}</span>
              <div class="flex items-baseline gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatNum(item.sold_quantity) }}</span>
                <span class="text-[9px] text-slate-400 font-semibold">{{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
              </div>
            </div>
            <div class="flex flex-col text-center border-x border-slate-100 dark:border-slate-700/50 px-2">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_profit') }}</span>
              <span class="font-black text-violet-600 dark:text-violet-400 text-sm truncate">{{ formatMoney(item.profit) }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_margin') }}</span>
              <span
                :class="[marginBadge(item.margin_pct), 'text-[10px] font-black px-1.5 py-0.5 rounded-lg']"
              >
                {{ parseDecimal(item.margin_pct).toFixed(1) }}%
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
import { formatTur, formatMoney, formatNum, parseDecimal } from '../composables/useProductReports'
import ReportsPagination from './ReportsPagination.vue'

const props = defineProps({
  items:    { type: Array,   default: () => [] },
  loading:  { type: Boolean, default: false },
  total:    { type: Number,  default: 0 },
  page:     { type: Number,  default: 1 },
  pageSize: { type: Number,  default: 20 },
})
const emit = defineEmits(['page-change'])

const offset = computed(() => (props.page - 1) * props.pageSize)

function rankClass(rank) {
  if (rank === 1) return 'bg-amber-400/20 text-amber-500'
  if (rank === 2) return 'bg-slate-300/20 text-slate-500'
  if (rank === 3) return 'bg-orange-400/20 text-orange-500'
  return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
}

function marginBadge(pct) {
  const v = parseDecimal(pct)
  if (v >= 30) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  if (v >= 15) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
}
</script>
