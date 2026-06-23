<template>
  <div class="reports-table overflow-hidden">
    <!-- Skeleton loader -->
    <div v-if="loading" class="p-6 space-y-3">
      <div v-for="i in 8" :key="i" class="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" :style="{ opacity: 1 - i * 0.1 }"></div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else-if="!items.length" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <i class="pi pi-ban text-4xl mb-3 opacity-30"></i>
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
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_stock') }}</th>
            <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_last_sale') }}</th>
            <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_idle_days') }}</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_frozen') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in items"
            :key="`${item.product_id}-${item.tur_id}`"
            :class="[
              'border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors',
              isNeverSold(item) ? 'bg-rose-50/40 dark:bg-rose-900/10' : ''
            ]"
          >
            <!-- Rank -->
            <td class="px-4 py-3">
              <div :class="isNeverSold(item) ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black">
                {{ offset + idx + 1 }}
              </div>
            </td>

            <!-- Mahsulot nomi -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <!-- "Hech sotilmagan" badge -->
                <span
                  v-if="isNeverSold(item)"
                  class="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 shrink-0"
                >
                  {{ $t('reports.never_sold') }}
                </span>
                <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{ item.nom }}</span>
              </div>
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

            <!-- Qoldiq -->
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100">{{ formatNum(item.current_stock) }}</span>
                <span class="text-[11px] text-slate-400">{{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
              </div>
            </td>

            <!-- Oxirgi sotuv sanasi -->
            <td class="px-4 py-3 text-center">
              <span v-if="item.last_sale_date" class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {{ item.last_sale_date }}
              </span>
              <span v-else class="text-[11px] font-bold text-rose-400 italic">—</span>
            </td>

            <!-- idle_display — backend tomonidan keladi -->
            <td class="px-4 py-3 text-center">
              <span :class="idleDisplayClass(item)" class="text-[12px] font-black px-2.5 py-1 rounded-xl">
                {{ item.idle_display }}
              </span>
            </td>

            <!-- Muzlatilgan kapital -->
            <td class="px-4 py-3 text-right">
              <span class="font-black text-rose-600 dark:text-rose-400 text-sm">
                {{ formatMoney(item.frozen_capital) }}
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
          :class="[
            'bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border flex flex-col gap-3 relative overflow-hidden',
            isNeverSold(item) ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-900/10' : 'border-slate-100 dark:border-slate-700/60'
          ]"
        >
          <!-- Top Row: Rank & Name -->
          <div class="flex items-start gap-3">
            <div :class="isNeverSold(item) ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'" class="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
              {{ offset + idx + 1 }}
            </div>
            <div class="flex-grow flex flex-col">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  v-if="isNeverSold(item)"
                  class="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400"
                >
                  {{ $t('reports.never_sold') }}
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
          <div class="h-px w-full" :class="isNeverSold(item) ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-slate-100 dark:bg-slate-700/50'"></div>

          <!-- Bottom Row: Metrics Grid -->
          <div class="grid grid-cols-2 gap-y-3 gap-x-4">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_stock') }}</span>
              <div class="flex items-baseline gap-1">
                <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatNum(item.current_stock) }}</span>
                <span class="text-[9px] text-slate-400">{{ item.birlik || item.unit_display || item.unit || 'dona' }}</span>
              </div>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_frozen') }}</span>
              <span class="font-black text-rose-600 dark:text-rose-400 text-sm">
                {{ formatMoney(item.frozen_capital) }}
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_last_sale') }}</span>
              <span v-if="item.last_sale_date" class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {{ item.last_sale_date }}
              </span>
              <span v-else class="text-[10px] font-bold text-rose-400 italic">—</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_idle_days') }}</span>
              <span :class="idleDisplayClass(item)" class="text-[10px] font-black px-2 py-0.5 rounded-lg inline-block w-max ml-auto">
                {{ item.idle_display }}
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

// last_sale_date null bo'lsa — hech sotilmagan
function isNeverSold(item) {
  return item.last_sale_date === null || item.last_sale_date === undefined
}

// idle_display ko'rsatish uchun rang
function idleDisplayClass(item) {
  const display = item.idle_display || ''
  if (isNeverSold(item) || display === 'Hech sotilmagan') {
    return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
  }
  if (display === '60+' || (parseDecimal(item.idle_days) >= 60)) {
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  }
  return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
}
</script>
