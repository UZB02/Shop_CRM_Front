<template>
  <div class="space-y-4">
    <!-- Net Profit Breakdown Card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <!-- Gross Revenue -->
      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black text-slate-400 tracking-[0.2em]">Yalpi Tushum</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <i class="pi pi-dollar text-xs"></i>
          </div>
        </div>
        <p class="text-xl font-black text-slate-800 dark:text-white tracking-tighter">{{ formatPrice(sales.gross_revenue) }}</p>
        <div class="flex items-center justify-between text-[11px] font-black tracking-wider">
          <span class="text-slate-400">Chegirma</span>
          <span class="text-rose-500">-{{ formatPrice(sales.discount_total) }}</span>
        </div>
      </div>

      <!-- COGS -->
      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black text-slate-400 tracking-[0.2em]">Tannarx (COGS)</span>
          <div class="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <i class="pi pi-box text-xs"></i>
          </div>
        </div>
        <p class="text-xl font-black text-slate-800 dark:text-white tracking-tighter">{{ formatPrice(expenses.cogs) }}</p>
        <div class="flex items-center justify-between text-[11px] font-black tracking-wider">
          <span class="text-slate-400">Isrof</span>
          <span class="text-orange-500">{{ formatPrice(expenses.wastage) }}</span>
        </div>
      </div>

      <!-- Expenses -->
      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black text-slate-400 tracking-[0.2em]">Xarajatlar</span>
          <div class="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <i class="pi pi-receipt text-xs"></i>
          </div>
        </div>
        <p class="text-xl font-black text-slate-800 dark:text-white tracking-tighter">{{ formatPrice(expenses.total) }}</p>
        <div class="flex items-center justify-between text-[11px] font-black tracking-wider">
          <span class="text-slate-400">Nisbat</span>
          <span class="text-rose-500">{{ expenses.expense_ratio }}% tushum</span>
        </div>
      </div>

      <!-- Net Profit -->
      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 shadow-sm flex flex-col gap-2 sm:gap-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 tracking-[0.2em]">Sof Foyda</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
            <i class="pi pi-chart-line text-xs"></i>
          </div>
        </div>
        <p class="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{{ formatPrice(expenses.net_profit) }}</p>
        <div class="text-[11px] font-black text-emerald-600/70 tracking-wider">
          Tushum: {{ formatPrice(sales.total_revenue) }}
        </div>
      </div>
    </div>

    <!-- Net Profit Formula Visual -->
    <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight mb-6">Sof Foyda Hisob-Kitobi</h3>
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <div class="flex flex-col gap-1">
          <p class="text-[10px] font-black text-slate-400 tracking-widest">Tushum</p>
          <p class="text-base font-black text-slate-800 dark:text-white">{{ formatPrice(sales.total_revenue) }}</p>
        </div>
        <span class="text-xl font-black text-slate-300">−</span>
        <div class="flex flex-col gap-1">
          <p class="text-[10px] font-black text-orange-400 tracking-widest">COGS</p>
          <p class="text-base font-black text-orange-500">{{ formatPrice(expenses.cogs) }}</p>
        </div>
        <span class="text-xl font-black text-slate-300">−</span>
        <div class="flex flex-col gap-1">
          <p class="text-[10px] font-black text-rose-400 tracking-widest">Xarajat</p>
          <p class="text-base font-black text-rose-500">{{ formatPrice(expenses.total) }}</p>
        </div>
        <span class="text-xl font-black text-slate-300">−</span>
        <div class="flex flex-col gap-1">
          <p class="text-[10px] font-black text-orange-400 tracking-widest">Isrof</p>
          <p class="text-base font-black text-orange-500">{{ formatPrice(expenses.wastage) }}</p>
        </div>
        <span class="text-xl font-black text-slate-300">=</span>
        <div class="flex flex-col gap-1 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p class="text-[10px] font-black text-emerald-500 tracking-widest">Sof Foyda</p>
          <p class="text-lg font-black text-emerald-600 dark:text-emerald-400">{{ formatPrice(expenses.net_profit) }}</p>
        </div>
      </div>
    </div>

    <!-- Expense Categories + 3-month trend -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Category chart -->
      <div class="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight">Xarajat Kategoriyalari</h3>
            <p class="text-[11px] text-slate-400 font-bold tracking-widest mt-0.5">Davr bo'yicha taqsimot</p>
          </div>
          <p class="text-xs font-black text-rose-500">{{ formatPrice(expenses.total) }}</p>
        </div>
        <div class="space-y-4">
          <div v-for="cat in expenses.by_category" :key="cat.category_id" class="flex items-center gap-4">
            <div class="w-24 shrink-0">
              <p class="text-[12px] font-black text-slate-600 dark:text-slate-300 tracking-tighter">{{ cat.name }}</p>
            </div>
            <div class="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500 rounded-full transition-all duration-1000" :style="{ width: cat.percent + '%' }"></div>
            </div>
            <div class="text-right w-20 sm:w-28 shrink-0">
              <p class="text-[11px] sm:text-[12px] font-black text-slate-800 dark:text-white">{{ formatPrice(cat.total) }}</p>
              <p class="text-[9px] sm:text-[10px] font-bold text-slate-400">{{ cat.percent }}%</p>
            </div>
          </div>
          <div v-if="!expenses.by_category?.length" class="text-center py-8 text-slate-400">
            <i class="pi pi-inbox text-2xl opacity-20"></i>
            <p class="text-[11px] font-black tracking-widest mt-2">Ma'lumot yo'q</p>
          </div>
        </div>
      </div>

      <!-- Pie chart -->
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight mb-6 self-start">Nisbat</h3>
        <div v-if="expenses.by_category?.length" class="h-[200px] w-full">
          <Chart type="pie" :data="expensePieData" :options="pieOptions" class="h-full w-full" />
        </div>
        <div v-else class="h-[200px] flex items-center justify-center text-slate-300">
           <i class="pi pi-chart-pie text-4xl opacity-10"></i>
        </div>
        <div class="mt-4 space-y-2 w-full">
          <div v-for="(cat, i) in expenses.by_category" :key="cat.category_id" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: pieColors[i % pieColors.length] }"></div>
            <span class="text-[11px] font-black text-slate-500 flex-1 ">{{ cat.name }}</span>
            <span class="text-[11px] font-black text-slate-800 dark:text-white">{{ cat.percent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-month expense trend -->
    <div v-if="expenses.trend_3months?.length" class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 class="text-sm font-black text-slate-800 dark:text-white tracking-tight mb-6">3 Oylik Xarajat Trendi</h3>
      <div v-if="expenses.trend_3months?.length" class="h-[200px]">
        <Chart type="bar" :data="trendChartData" :options="trendOptions" class="h-full w-full" />
      </div>
      <div v-else class="h-[200px] flex items-center justify-center border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
        <p class="text-[11px] font-black text-slate-400 tracking-widest">Trend tahlili yuklanmoqda...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  expenses: { type: Object, default: () => ({ total: 0, expense_ratio: 0, cogs: 0, wastage: 0, net_profit: 0, by_category: [], trend_3months: [] }) },
  sales:    { type: Object, default: () => ({ gross_revenue: 0, discount_total: 0, total_revenue: 0 }) }
})

const settingsStore = useSettingsStore()
const formatPrice = (v) => settingsStore.formatPrice(v)

const pieColors = ['#f43f5e', '#fb923c', '#facc15', '#34d399', '#60a5fa']

const expensePieData = computed(() => ({
  labels: props.expenses.by_category.map(c => c.name),
  datasets: [{
    data: props.expenses.by_category.map(c => c.total),
    backgroundColor: pieColors,
    borderWidth: 0,
    spacing: 3,
    borderRadius: 4
  }]
}))

const pieOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' }
}

const trendChartData = computed(() => ({
  labels: props.expenses.trend_3months.map(t => t.month),
  datasets: [
    {
      label: 'Tushum',
      data: props.expenses.trend_3months.map(t => t.revenue),
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderRadius: 6,
      barThickness: 20
    },
    {
      label: 'Xarajat',
      data: props.expenses.trend_3months.map(t => t.expenses),
      backgroundColor: 'rgba(244, 63, 94, 0.6)',
      borderRadius: 6,
      barThickness: 20
    }
  ]
}))

const trendOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { usePointStyle: true, font: { size: 9, weight: 'bold' }, color: '#94a3b8', padding: 16 }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#94a3b8' } },
    y: {
      border: { dash: [4, 4] },
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { font: { size: 8 }, color: '#94a3b8', callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v }
    }
  }
}
</script>


