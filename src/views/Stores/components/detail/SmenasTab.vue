<template>
  <div class="space-y-5">

    <!-- ===== MODERN FILTER BAR (WorkerHistoryTab style) ===== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 bg-white dark:bg-slate-900/40 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-inner mb-2">

      <!-- Date From -->
      <DatePicker
        v-model="filters.date_from"
        dateFormat="dd.mm.yy"
        showIcon
        iconDisplay="input"
        class="!h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full"
        inputClass="!text-[12px] !font-black !!tracking-tighter !h-10 !bg-transparent !border-none !px-4"
        :placeholder="$t('common.date_from')"
      />

      <!-- Date To -->
      <DatePicker
        v-model="filters.date_to"
        dateFormat="dd.mm.yy"
        showIcon
        iconDisplay="input"
        class="!h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full"
        inputClass="!text-[12px] !font-black !!tracking-tighter !h-10 !bg-transparent !border-none !px-4"
        :placeholder="$t('common.date_to')"
      />

      <!-- Branch -->
      <Select
        v-model="filters.branch_id"
        :options="branches"
        optionLabel="name"
        optionValue="id"
        showClear
        class="!text-[12px] !font-black !!tracking-tighter !h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 flex items-center px-2"
        :placeholder="$t('branches.title')"
      />

      <!-- Status -->
      <Select
        v-model="filters.status"
        :options="statusOptions"
        optionLabel="label"
        optionValue="id"
        showClear
        class="!text-[12px] !font-black !!tracking-tighter !h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 flex items-center px-2"
        :placeholder="$t('common.status')"
      />

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Export -->
        <button
          @click="exportShifts"
          v-tooltip.top="$t('common.export')"
          class="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 border-none text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-300 flex items-center justify-center shadow-sm"
        >
          <i class="pi pi-file-excel text-xs"></i>
        </button>

        <!-- Reset -->
        <button
          @click="resetFilters"
          v-tooltip.top="$t('common.reset')"
          class="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 border-none text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 hover:rotate-180 flex items-center justify-center"
        >
          <i class="pi pi-refresh text-xs"></i>
        </button>
      </div>
    </div>


    <!-- ===== SKELETON ===== -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="i in 6" :key="i"
        class="h-44 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse"
      ></div>
    </div>

    <!-- ===== EMPTY STATE ===== -->
    <div
      v-else-if="shifts.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-5 text-slate-200 dark:text-slate-700 text-2xl">
        <i class="pi pi-calendar"></i>
      </div>
      <h4 class="text-[12px] font-black text-slate-400 dark:text-slate-600 tracking-[0.3em]">{{ $t('common.no_results') }}</h4>
    </div>

    <!-- ===== SHIFTS GRID ===== -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="(smena, index) in shifts" :key="smena.id"
        @click="$router.push({ name: 'shift-detail', params: { id: smena.id } })"
        class="bg-white dark:bg-[#0b1120] border border-slate-100 dark:border-slate-800 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-slate-900/80 group animate-in"
        :class="smena.status === 'open' ? 'border-l-[3px] border-l-emerald-500' : 'border-l-[3px] border-l-slate-300 dark:border-l-slate-700'"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <!-- Header: Icon + Branch + Badge -->
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Icon -->
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm transition-transform duration-300 group-hover:scale-110"
              :class="smena.status === 'open' ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'"
            >
              <i :class="smena.status === 'open' ? 'pi pi-bolt' : 'pi pi-moon'" class="text-xs"></i>
            </div>
            <!-- Branch & Worker -->
            <div class="min-w-0">
              <h4 class="text-[13px] font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate mb-1.5">{{ smena.branch_name }}</h4>
              <div class="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-600 tracking-wider">
                <i class="pi pi-user text-[10px]"></i>
                <span class="truncate">{{ smena.worker_open_name || smena.worker_name || '—' }}</span>
              </div>
            </div>
          </div>
          <!-- Status Badge -->
          <span
            class="flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider border"
            :class="smena.status === 'open'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'"
          >
            {{ smena.status === 'open' ? $t('shifts.status.open') : $t('shifts.status.closed') }}
          </span>
        </div>

        <!-- Cash Hero -->
        <div class="py-3 border-y border-slate-50 dark:border-slate-800 mb-3">
          <p class="text-[8.5px] font-black text-slate-400 dark:text-slate-600 tracking-[0.15em] mb-1">
            {{ smena.status === 'open' ? $t('stores.detail.cash_balance') : $t('stores.detail.cash_end') }}
          </p>
          <div class="flex items-baseline gap-1.5">
            <span class="text-[1.5rem] font-black leading-none tracking-tight text-slate-800 dark:text-slate-100">
              {{ Number(smena.status === 'open' ? (smena.expected_cash || smena.cash_start || 0) : (smena.cash_end || 0)).toLocaleString() }}
            </span>
            <span class="text-[11px] font-black text-slate-400 dark:text-slate-600 ">uzs</span>
          </div>
        </div>

        <!-- Footer: Timestamps -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-[0.12em] mb-1">
              {{ $t('stores.detail.shift_opened', { date: '' }).replace(':', '') }}
            </p>
            <p class="text-[12px] font-semibold text-slate-500 dark:text-slate-500">{{ smena.start_time || smena.opened_at || '—' }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-[0.12em] mb-1 truncate">
              {{ smena.status === 'open' ? $t('stores.detail.cash_start') : $t('stores.detail.shift_closed', { date: '' }).replace(':', '') }}
            </p>
            <p class="text-[12px] font-semibold text-slate-500 dark:text-slate-500">
              {{ smena.status === 'open'
                ? Number(smena.cash_start || 0).toLocaleString() + ' UZS'
                : (smena.end_time || smena.closed_at || '—') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSmenasTab } from '../../composables/useSmenasTab'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'

const { t } = useI18n()
const { shifts, loading, branches, filters, resetFilters, exportShifts } = useSmenasTab()

const statusOptions = computed(() => [
  { id: 'open',   label: t('shifts.status.open') },
  { id: 'closed', label: t('shifts.status.closed') }
])
</script>

<style scoped>
/* Keyframe animations — cannot be done with Tailwind */
.animate-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ─── PrimeVue Input Base (Dark Mode default — app uses html.dark) ─── */
.senior-pv-input :deep(.p-inputtext),
.senior-pv-input.p-select {
  background-color: #111827 !important;
  border: 1px solid #1e293b !important;
  border-radius: 0.75rem !important;
  height: 2.625rem !important;
  padding: 0 0.875rem !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.05em !important;
  color: #f1f5f9 !important;
  box-shadow: none !important;
  transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
}

/* Calendar trigger button — remove white box */
.senior-pv-input :deep(.p-datepicker-trigger),
.senior-pv-input :deep(.p-datepicker-button) {
  background: transparent !important;
  border: none !important;
  border-left: 1px solid #1e293b !important;
  border-radius: 0 0.75rem 0.75rem 0 !important;
  color: #475569 !important;
  height: 2.625rem !important;
  box-shadow: none !important;
}
.senior-pv-input :deep(.p-datepicker-trigger):hover,
.senior-pv-input :deep(.p-datepicker-button):hover { color: #10b981 !important; }

/* Select chevron */
.senior-pv-input.p-select :deep(.p-select-dropdown) {
  background: transparent !important;
  border: none !important;
  color: #475569 !important;
}

/* Placeholder */
.senior-pv-input :deep(.p-inputtext::placeholder),
.senior-pv-input :deep(.p-placeholder) {
  color: #475569 !important;
  font-weight: 700 !important;
}

/* Focus */
.senior-pv-input :deep(.p-inputtext:focus),
.senior-pv-input.p-focus {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.08) !important;
}

/* ─── Light Mode (html is NOT .dark) ─── */
:global(html:not(.dark)) .senior-pv-input :deep(.p-inputtext),
:global(html:not(.dark)) .senior-pv-input.p-select {
  background-color: #f8fafc !important;
  border-color: #e2e8f0 !important;
  color: #1e293b !important;
}
:global(html:not(.dark)) .senior-pv-input :deep(.p-datepicker-trigger),
:global(html:not(.dark)) .senior-pv-input :deep(.p-datepicker-button) {
  border-left-color: #e2e8f0 !important;
  color: #94a3b8 !important;
}
:global(html:not(.dark)) .senior-pv-input :deep(.p-inputtext::placeholder),
:global(html:not(.dark)) .senior-pv-input :deep(.p-placeholder) {
  color: #94a3b8 !important;
}
:global(html:not(.dark)) .senior-pv-input :deep(.p-inputtext:focus),
:global(html:not(.dark)) .senior-pv-input.p-focus {
  background-color: #fff !important;
  border-color: #10b981 !important;
}

/* ─── Panels (Dropdown list & Calendar popup) ─── */
:deep(.p-select-panel), :deep(.p-datepicker) {
  border-radius: 1rem !important;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3) !important;
  border: 1px solid #1e293b !important;
  background-color: #111827 !important;
}
:global(html:not(.dark)) :deep(.p-select-panel),
:global(html:not(.dark)) :deep(.p-datepicker) {
  background-color: #fff !important;
  border-color: #e2e8f0 !important;
  box-shadow: 0 12px 30px -8px rgba(0,0,0,0.1) !important;
}
:deep(.p-datepicker-header) {
  background: transparent !important;
  border-bottom: 1px solid #1e293b !important;
}
:global(html:not(.dark)) :deep(.p-datepicker-header) {
  border-bottom-color: #e2e8f0 !important;
}
:deep(.p-datepicker-day-selected) {
  background-color: #10b981 !important;
  color: #fff !important;
  border-radius: 0.5rem !important;
}
:deep(.p-select-item) {
  font-size: 11px !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  margin: 0.15rem 0.3rem !important;
  color: #64748b !important;
}
:deep(.p-select-item.p-highlight) {
  background-color: rgba(16,185,129,0.1) !important;
  color: #10b981 !important;
}
</style>