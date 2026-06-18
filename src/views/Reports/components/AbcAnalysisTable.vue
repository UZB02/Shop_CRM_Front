<template>
  <div class="space-y-0">

    <!-- ── Summary + Sort bloki ──────────────────────────────────── -->
    <div v-if="summary" class="border-b border-slate-100 dark:border-slate-800">

      <!-- Sort tugmalari -->
      <div class="flex items-center gap-2 px-4 pt-3 pb-2 flex-wrap">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
          {{ $t('reports.abc.sort_by') }}:
        </span>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="s in SORT_OPTIONS"
            :key="s.value"
            @click="emit('sort-change', s.value)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all',
              sort === s.value
                ? s.activeClass
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            ]"
          >
            <i :class="s.icon" class="text-[10px]"></i>
            {{ $t(s.label) }}
          </button>
        </div>
      </div>

      <!-- ── A/B/C kartalar (Ixcham va premium) ─────────────────── -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-4">
        <div
          v-for="grade in ['A', 'B', 'C']"
          :key="grade"
          :class="['rounded-xl p-3 border flex flex-col gap-2.5', gradeCardClass(grade)]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <AbcBadge :grade="grade" />
              <i
                class="pi pi-info-circle text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-help animate-pulse"
                v-tooltip.top="$t(`reports.abc.info_${grade.toLowerCase()}`)"
              />
            </div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {{ $t('reports.abc.grade_label', { grade }) }}
            </span>
          </div>
          <div class="space-y-1">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-black text-slate-800 dark:text-white">
                {{ activeSummary(grade)?.count ?? '—' }} {{ $t('reports.abc.items') }}
              </span>
              <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {{ activeSummary(grade)?.share_pct ?? '—' }}% {{ $t('reports.abc.share') }}
              </span>
            </div>
            <div class="w-full h-1 rounded-full bg-slate-200/50 dark:bg-slate-800/30 overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="gradeBarColor(grade)"
                :style="{ width: (activeSummary(grade)?.share_pct ?? 0) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton loader -->
    <div v-if="loading" class="p-6 space-y-3">
      <div v-for="i in 8" :key="i" class="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" :style="{ opacity: 1 - i * 0.1 }"></div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else-if="!items.length" class="flex flex-col items-center justify-center py-20 text-slate-400">
      <i class="pi pi-chart-pie text-4xl mb-3 opacity-30"></i>
      <p class="text-sm font-bold">{{ $t('reports.no_data') }}</p>
      <p class="text-xs mt-1">{{ $t('reports.no_data_desc') }}</p>
    </div>

    <!-- ── Desktop jadval ────────────────────────────────────────── -->
    <div v-else class="w-full">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest w-10">{{ $t('reports.col_rank') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_product') }}</th>
              <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_tur') }}</th>
              <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_abc_revenue') }}</th>
              <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_abc_profit') }}</th>
              <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_abc_qty') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_revenue') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_profit') }}</th>
              <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.col_cumulative') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="(item, idx) in items"
              :key="`${item.product_id}-${item.tur_id}`"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <!-- Rank -->
              <td class="px-4 py-3">
                <div class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-black">
                  {{ offset + idx + 1 }}
                </div>
              </td>

              <!-- Mahsulot + cross-insight -->
              <td class="px-4 py-3">
                <div class="flex flex-col gap-1">
                  <span class="font-bold text-slate-800 dark:text-slate-100">{{ item.nom }}</span>
                  <CrossInsightBadge :abc-revenue="item.abc_revenue" :abc-profit="item.abc_profit" />
                </div>
              </td>

              <!-- Tur -->
              <td class="px-4 py-3">
                <span
                  v-if="formatTur(item.tur) !== '-'"
                  class="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                >
                  {{ formatTur(item.tur) }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>

              <!-- ABC badgelar -->
              <td class="px-4 py-3 text-center"><AbcBadge :grade="item.abc_revenue" /></td>
              <td class="px-4 py-3 text-center"><AbcBadge :grade="item.abc_profit" /></td>
              <td class="px-4 py-3 text-center"><AbcBadge :grade="item.abc_quantity" /></td>

              <!-- Tushum -->
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end">
                  <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatMoney(item.revenue) }}</span>
                  <span class="text-[10px] text-slate-400">{{ parseDecimal(item.revenue_share_pct).toFixed(1) }}%</span>
                </div>
              </td>

              <!-- Foyda -->
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end">
                  <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm">{{ formatMoney(item.profit) }}</span>
                  <span class="text-[10px] text-slate-400">{{ parseDecimal(item.profit_share_pct).toFixed(1) }}%</span>
                </div>
              </td>

              <!-- Kumulyativ -->
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end gap-1">
                  <span class="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    {{ parseDecimal(item.cumulative_pct).toFixed(1) }}%
                  </span>
                  <!-- Mini progress bar -->
                  <div class="w-16 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="cumulativeBarColor(item.cumulative_pct)"
                      :style="{ width: Math.min(parseDecimal(item.cumulative_pct), 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Mobile cards ────────────────────────────────────────── -->
      <div class="md:hidden flex flex-col gap-3 px-3 py-3">
        <div
          v-for="(item, idx) in items"
          :key="`${item.product_id}-${item.tur_id}-mobile`"
          class="bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/60 flex flex-col gap-3"
        >
          <!-- Top: rank + nom + insight -->
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black">
              {{ offset + idx + 1 }}
            </div>
            <div class="flex-grow flex flex-col gap-1">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{{ item.nom }}</span>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  v-if="formatTur(item.tur) !== '-'"
                  class="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg text-[11px] font-semibold"
                >
                  {{ formatTur(item.tur) }}
                </span>
                <CrossInsightBadge :abc-revenue="item.abc_revenue" :abc-profit="item.abc_profit" />
              </div>
            </div>
          </div>

          <!-- ABC badge qatori -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-black text-slate-400 uppercase">{{ $t('reports.col_abc_revenue') }}</span>
              <AbcBadge :grade="item.abc_revenue" />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-black text-slate-400 uppercase">{{ $t('reports.col_abc_profit') }}</span>
              <AbcBadge :grade="item.abc_profit" />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-black text-slate-400 uppercase">{{ $t('reports.col_abc_qty') }}</span>
              <AbcBadge :grade="item.abc_quantity" />
            </div>
          </div>

          <div class="h-px bg-slate-100 dark:bg-slate-700/50"></div>

          <!-- Metrics -->
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_revenue') }}</span>
              <span class="font-black text-slate-800 dark:text-slate-100 text-sm">{{ formatMoney(item.revenue) }}</span>
              <span class="text-[10px] text-slate-400">{{ parseDecimal(item.revenue_share_pct).toFixed(1) }}%</span>
            </div>
            <div class="flex flex-col text-right">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('reports.col_profit') }}</span>
              <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm">{{ formatMoney(item.profit) }}</span>
              <span class="text-[10px] text-slate-400">{{ parseDecimal(item.profit_share_pct).toFixed(1) }}%</span>
            </div>
          </div>

          <!-- Kumulyativ progress -->
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">{{ $t('reports.col_cumulative') }}</span>
            <div class="flex-grow h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="cumulativeBarColor(item.cumulative_pct)"
                :style="{ width: Math.min(parseDecimal(item.cumulative_pct), 100) + '%' }"
              ></div>
            </div>
            <span class="text-[11px] font-black text-slate-600 dark:text-slate-300 shrink-0">
              {{ parseDecimal(item.cumulative_pct).toFixed(1) }}%
            </span>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTur, formatMoney, parseDecimal } from '../composables/useProductReports'
import AbcBadge from './AbcBadge.vue'
import ReportsPagination from './ReportsPagination.vue'

const { t } = useI18n()

const props = defineProps({
  items:    { type: Array,  default: () => [] },
  summary:  { type: Object, default: null },
  loading:  { type: Boolean, default: false },
  total:    { type: Number, default: 0 },
  page:     { type: Number, default: 1 },
  pageSize: { type: Number, default: 20 },
  sort:     { type: String, default: 'revenue' },
})

const emit = defineEmits(['page-change', 'sort-change'])

const offset = computed(() => (props.page - 1) * props.pageSize)

const SORT_OPTIONS = [
  { value: 'revenue',  label: 'reports.abc.sort_revenue',  icon: 'pi pi-wallet',     activeClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { value: 'profit',   label: 'reports.abc.sort_profit',   icon: 'pi pi-chart-line', activeClass: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
  { value: 'quantity', label: 'reports.abc.sort_quantity', icon: 'pi pi-box',        activeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
]

// Aktiv sort metrikning summary'sidan A/B/C ma'lumotlarini olish
function activeSummary(grade) {
  if (!props.summary) return null
  return props.summary[props.sort]?.[grade] ?? null
}

function gradeCardClass(grade) {
  const map = {
    A: 'bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40',
    B: 'bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40',
    C: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60',
  }
  return map[grade] || ''
}

function gradeBarColor(grade) {
  const map = {
    A: 'bg-emerald-500',
    B: 'bg-amber-500',
    C: 'bg-slate-400',
  }
  return map[grade] || 'bg-slate-400'
}

function cumulativeBarColor(pct) {
  const v = parseDecimal(pct)
  if (v <= 80) return 'bg-emerald-500'
  if (v <= 95) return 'bg-amber-500'
  return 'bg-slate-400'
}

// Cross-insight badge — inline komponent sifatida
const CrossInsightBadge = {
  props: { abcRevenue: String, abcProfit: String },
  setup(p) {
    const badge = computed(() => {
      if (p.abcRevenue === 'A' && p.abcProfit === 'C')
        return { label: t('reports.abc.insight_trap'), cls: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400', icon: 'pi pi-exclamation-circle' }
      if (p.abcRevenue === 'C' && p.abcProfit === 'A')
        return { label: t('reports.abc.insight_gem'), cls: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', icon: 'pi pi-star-fill' }
      return null
    })
    return { badge }
  },
  template: `
    <span v-if="badge" :class="['inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black', badge.cls]">
      <i :class="badge.icon" class="text-[8px]"></i>
      {{ badge.label }}
    </span>
  `
}
</script>

<style scoped>
.info-expand-enter-active,
.info-expand-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.info-expand-enter-from,
.info-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}
.info-expand-enter-to,
.info-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 80px;
}
</style>
