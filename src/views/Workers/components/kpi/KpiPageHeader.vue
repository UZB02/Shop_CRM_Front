<template>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
    <div class="min-0">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/workers" class="text-[12px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-users text-[11px]"></i>
          {{ $t('workers.title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[10px] text-slate-300"></i>
        <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('kpi.title') }}</span>
      </div>
      
      <div class="flex items-center gap-3">
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ $t('kpi.title') }}</h1>
        <div class="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-sm"></span>
          <span class="text-[11px] font-black text-emerald-500 tracking-widest">{{ $t('workers.active_status') }}</span>
        </div>
      </div>
    </div>

    <!-- Compact Filters Integration -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
      <!-- Chart Toggle -->
      <button 
        v-if="hasData"
        @click="$emit('toggle-charts')"
        class="h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-all border shadow-sm text-[12px] font-black tracking-wider whitespace-nowrap"
        :class="showCharts 
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/30'"
      >
        <i :class="['pi', showCharts ? 'pi-list' : 'pi-chart-bar']"></i>
        <span>{{ showCharts ? $t('kpi.buttons.show_list') : $t('kpi.buttons.show_charts') }}</span>
      </button>

      <!-- Period -->
      <div class="relative group/period">
        <i class="pi pi-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-400 text-[12px] z-10"></i>
        <DatePicker 
          :modelValue="period" 
          @update:modelValue="$emit('update:period', $event)"
          view="month" 
          dateFormat="mm/yy" 
          class="kpi-calendar-compact w-full sm:w-36"
          @date-select="$emit('filter-change')"
          :placeholder="$t('kpi.filters.month')"
          :pt="calendarPt"
        />
      </div>

      <!-- Search -->
      <div class="relative group/search w-full sm:min-w-[180px]">
        <span class="absolute inset-y-0 left-3 flex items-center text-slate-300 pointer-events-none group-focus-within/search:text-emerald-500 transition-colors">
          <i class="pi pi-search text-[12px]"></i>
        </span>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          :placeholder="$t('common.search') + '...'" 
          class="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all outline-none"
        />
      </div>
      
      <!-- Refresh -->
      <button 
        @click="$emit('refresh')" 
        :disabled="loading"
        class="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/20 transition-all disabled:opacity-50 active:scale-95 group shadow-sm"
      >
        <i :class="['pi pi-refresh text-[12px] group-hover:rotate-180 transition-transform duration-500', { 'animate-spin': loading }]"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import DatePicker from 'primevue/datepicker'

defineProps({
  period: Date,
  searchQuery: String,
  showCharts: Boolean,
  loading: Boolean,
  hasData: Boolean
})

defineEmits(['update:period', 'update:searchQuery', 'filter-change', 'refresh', 'toggle-charts'])

const calendarPt = {
  panel: { class: 'shadow-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden min-w-[320px]' },
  header: { class: 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4' },
  monthPicker: { class: 'grid grid-cols-3 gap-4 p-5 bg-white dark:bg-slate-900' },
  month: ({ context }) => ({
    class: [
      'py-3 px-2 rounded-xl text-[14px] font-black text-center transition-all cursor-pointer border border-transparent tracking-wider',
      context.selected 
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 hover:text-emerald-500'
    ]
  })
}
</script>

<style scoped>
.kpi-calendar-compact :deep(.p-inputtext) {
  height: 32px;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  padding-left: 1.75rem !important;
  color: #334155 !important;
  box-shadow: none !important;
  transition: all 0.2s;
}

.dark .kpi-calendar-compact :deep(.p-inputtext) {
  background: #0f172a !important;
  border-color: #334155 !important;
  color: #f1f5f9 !important;
}

.kpi-calendar-compact :deep(.p-inputtext:focus) {
  border-color: #10b981 !important;
}
</style>


