<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <!-- Top-5 Eng ko'p sotilgan -->
    <div class="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <i class="pi pi-chart-bar text-emerald-600 dark:text-emerald-400 text-[13px]"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('reports.top5_title') }}</p>
          </div>
        </div>
        <router-link
          to="/dashboard/reports"
          class="text-[11px] font-black text-emerald-500 hover:text-emerald-600 tracking-wide transition-colors"
        >
          {{ $t('reports.view_full_report') }}
        </router-link>
      </div>

      <!-- List -->
      <div v-if="topSellingLoading" class="p-4 space-y-2.5">
        <div v-for="i in 5" :key="i" class="h-8 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
      </div>
      <div v-else-if="!topSelling.length" class="flex items-center justify-center py-10 text-slate-400">
        <p class="text-xs font-semibold">{{ $t('reports.no_data') }}</p>
      </div>
      <ul v-else class="divide-y divide-slate-50 dark:divide-slate-800/60">
        <li
          v-for="(item, idx) in topSelling"
          :key="`ts-${item.product_id}-${item.tur_id}`"
          class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
        >
          <!-- Rank -->
          <div :class="rankClass(idx + 1)" class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">
            {{ idx + 1 }}
          </div>
          <!-- Nom -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ item.nom }}</p>
            <p v-if="formatTur(item.tur) !== '-'" class="text-[10px] text-slate-400 font-semibold">{{ formatTur(item.tur) }}</p>
          </div>
          <!-- Miqdor va tushum -->
          <div class="text-right shrink-0">
            <p class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{ formatMoney(item.sold_revenue) }}</p>
            <p class="text-[10px] text-slate-400 font-semibold">{{ formatNum(item.sold_quantity) }} dona</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- O'lik tovar ogohlantirish kartasi -->
    <div class="rounded-2xl border border-rose-200 dark:border-rose-700/40 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-rose-100 dark:border-rose-800/40 flex items-center justify-between bg-rose-50/50 dark:bg-rose-900/10">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
            <i class="pi pi-ban text-rose-600 dark:text-rose-400 text-[13px]"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-rose-400 dark:text-rose-500 tracking-widest uppercase">
              {{ $t('reports.dead_stock_widget_title') }}
            </p>
          </div>
        </div>
        <router-link
          to="/dashboard/reports?tab=dead-stock"
          class="text-[11px] font-black text-rose-500 hover:text-rose-600 tracking-wide transition-colors"
        >
          {{ $t('reports.view_full_report') }}
        </router-link>
      </div>

      <!-- Stats -->
      <div v-if="deadStockLoading" class="p-6 space-y-3">
        <div v-for="i in 3" :key="i" class="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
      </div>
      <div v-else class="p-5 space-y-4">
        <!-- Count -->
        <div class="flex items-center justify-between p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/40">
          <div>
            <p class="text-[11px] font-black text-rose-400 tracking-widest">UMUMIY O'LIK TOVAR</p>
            <p class="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{{ deadStockCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
            <i class="pi pi-box text-rose-500 text-2xl"></i>
          </div>
        </div>

        <!-- Muzlatilgan kapital -->
        <div v-if="frozenCapital" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
          <div>
            <p class="text-[11px] font-black text-slate-400 tracking-widest">{{ $t('reports.frozen_capital_total').toUpperCase() }}</p>
            <p class="text-xl font-black text-slate-800 dark:text-white mt-1">{{ frozenCapital }}</p>
          </div>
          <i class="pi pi-lock text-slate-400 text-2xl"></i>
        </div>

        <!-- CTA -->
        <router-link
          to="/dashboard/reports?tab=dead-stock"
          class="block w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-black text-center tracking-wide hover:shadow-lg hover:shadow-rose-500/25 active:scale-95 transition-all"
        >
          <i class="pi pi-arrow-right mr-2"></i>
          To'liq hisobotni ko'rish
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductReports, formatTur, formatMoney, formatNum, parseDecimal } from '@/views/Reports/composables/useProductReports'

const topSelling       = ref([])
const topSellingLoading = ref(false)
const deadStockCount   = ref(0)
const frozenCapital    = ref('')
const deadStockLoading = ref(false)

const { fetchMini } = useProductReports()

function rankClass(rank) {
  if (rank === 1) return 'bg-amber-400/20 text-amber-500'
  if (rank === 2) return 'bg-slate-300/20 text-slate-500'
  if (rank === 3) return 'bg-orange-400/20 text-orange-500'
  return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
}

async function loadWidgetData() {
  topSellingLoading.value = true
  deadStockLoading.value  = true

  try {
    const [tsData, dsData] = await Promise.all([
      fetchMini('top-selling', 5),
      fetchMini('dead-stock', 20),  // Frozen capital uchun bir nechta olamiz
    ])

    topSelling.value = tsData.results
    deadStockCount.value = dsData.count

    // Muzlatilgan kapitalini yig'amiz
    const total = dsData.results.reduce((sum, item) => sum + parseDecimal(item.frozen_capital), 0)
    if (total > 0) {
      frozenCapital.value = formatMoney(total)
    }
  } catch (e) {
    console.warn('[DashboardProductInsights] load error:', e)
  } finally {
    topSellingLoading.value = false
    deadStockLoading.value  = false
  }
}

onMounted(loadWidgetData)
</script>
