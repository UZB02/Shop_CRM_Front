<template>
  <div class="space-y-3">
    <!-- Enterprise Grade Filter Bar -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-900/40 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div class="flex items-center gap-3">
        <!-- Label Section -->
        <div class="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-800">
          <i class="pi pi-calendar text-[13px] text-emerald-500"></i>
          <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">{{ $t('kpi.filters.year') }}:</span>
        </div>

        <!-- Perfectly Centered Pixel-Perfect Year Picker -->
        <DatePicker 
          v-model="selectedYearDate" 
          view="year" 
          dateFormat="yy"
          @date-select="loadHistory"
          class="kpi-year-picker-final w-28 h-8"
          :pt="{
            root: { class: 'relative h-8 !bg-transparent !border-none !shadow-none' },
            input: { class: 'h-8 rounded-lg border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/50 transition-all duration-300 shadow-sm text-[13px] font-black text-slate-700 dark:text-slate-200 w-full focus:ring-0 tracking-wider text-center flex items-center justify-center p-0' },
            panel: { class: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl mt-1 overflow-hidden min-w-[280px]' },
            yearPicker: { class: 'grid grid-cols-3 gap-2 p-4 bg-white dark:bg-slate-900' },
            year: ({ context }) => ({
              class: [
                'py-2 px-1 rounded-lg text-[13px] font-bold text-center transition-all cursor-pointer border border-transparent',
                context.selected 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-emerald-500'
              ]
            })
          }"
        />
      </div>

      <!-- Actions -->
      <button 
        @click="loadHistory" 
        :disabled="loading"
        class="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all active:scale-95 disabled:opacity-50 group"
      >
        <i :class="['pi pi-refresh text-[12px] group-hover:rotate-180 transition-transform duration-500', { 'animate-spin': loading }]"></i>
      </button>
    </div>

    <!-- Compact History Table -->
    <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <DataTable 
        :value="history" 
        :loading="loading"
        responsiveLayout="scroll"
        class="kpi-compact-datatable"
        dataKey="id"
      >
        <template #empty>
          <div class="py-8 text-center text-[12px] text-slate-400 font-bold tracking-widest">
             {{ $t('common.no_results') }}
          </div>
        </template>

        <!-- Month -->
        <Column field="month" :header="$t('kpi.filters.month')" sortable class="min-w-[100px]">
          <template #body="{ data }">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatMonth(data?.month) }} {{ data?.year }}</span>
          </template>
        </Column>

        <!-- Sales -->
        <Column field="sales_count" :header="$t('kpi.table.sales_count')" class="text-center min-w-[90px]">
            <template #body="{ data }">
              <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ data?.sales_count }}</span>
                <span class="text-[11px] font-medium text-slate-400">{{ settingsStore.formatPrice(data?.sales_amount) }}</span>
              </div>
            </template>
        </Column>

        <!-- Net Sales -->
        <Column field="net_sales_amount" :header="$t('kpi.table.net_sales')" class="text-right min-w-[100px]">
          <template #body="{ data }">
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {{ settingsStore.formatPrice(data?.net_sales_amount) }}
            </span>
          </template>
        </Column>

        <!-- Avg Sale -->
        <Column field="avg_sale" :header="$t('kpi.table.avg_sale')" class="text-right min-w-[100px]">
          <template #body="{ data }">
            <span class="text-[12px] font-semibold text-slate-500 whitespace-nowrap">
              {{ settingsStore.formatPrice(data?.avg_sale) }}
            </span>
          </template>
        </Column>

        <!-- Target -->
        <Column field="target_amount" :header="$t('kpi.table.target')" class="text-right min-w-[110px]">
          <template #body="{ data }">
            <div class="flex flex-col items-end">
              <span class="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                {{ parseFloat(data?.target_amount || 0) > 0 ? settingsStore.formatPrice(data?.target_amount) : '—' }}
              </span>
              <span class="text-[11px] font-bold text-emerald-500 opacity-70">{{ settingsStore.formatPrice(data?.bonus_amount) }}</span>
            </div>
          </template>
        </Column>

        <!-- Completion -->
        <Column field="completion_pct" :header="$t('kpi.table.completion')" class="min-w-[120px]">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 py-1">
              <div class="flex justify-between items-center text-[11px] font-black">
                <span :class="getCompletionColor(data?.completion_pct, 'text')">
                  {{ data?.completion_pct ? parseFloat(data?.completion_pct).toFixed(0) + '%' : '0%' }}
                </span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full transition-all duration-1000 ease-out rounded-full"
                  :class="getCompletionColor(data?.completion_pct, 'bg')"
                  :style="{ width: Math.min(parseFloat(data?.completion_pct || 0), 100) + '%' }"
                ></div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Action -->
        <Column class="w-10">
          <template #body="{ data }">
            <button 
              @click="openDialog(data)"
              class="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <i class="pi pi-pencil text-[11px]"></i>
            </button>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Set Target Modal -->
    <SetTargetModal 
      v-model="dialogVisible" 
      :kpi="selectedKpi"
      @saved="loadHistory"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { kpiAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DatePicker from 'primevue/datepicker'
import SetTargetModal from '../../SetTargetModal.vue'

const props = defineProps({
  workerId: [Number, String]
})

const settingsStore = useSettingsStore()
const loading = ref(false)
const history = ref([])
const selectedYearDate = ref(new Date())
const dialogVisible = ref(false)
const selectedKpi = ref(null)

const formatMonth = (m) => {
    const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
        'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ]
    return months[m - 1] || m
}

const loadHistory = async () => {
    if (!props.workerId) return
    loading.value = true
    try {
        const year = selectedYearDate.value ? selectedYearDate.value.getFullYear() : new Date().getFullYear()
        const res = await kpiAPI.getWorkerKpi(props.workerId, { year })
        history.value = res.data?.results || res.data || []
    } catch (e) {
        console.error('KPI history load error:', e)
    } finally {
        loading.value = false
    }
}

const openDialog = (kpi) => {
    selectedKpi.value = { ...kpi, worker: kpi.worker || props.workerId }
    dialogVisible.value = true
}

const getCompletionColor = (pct, target = 'text') => {
  if (pct === null || pct === undefined) return target === 'text' ? 'text-slate-300' : 'bg-slate-100 dark:bg-slate-800'
  const val = parseFloat(pct)
  if (val >= 100) return target === 'text' ? 'text-emerald-500' : 'bg-emerald-500'
  if (val >= 70) return target === 'text' ? 'text-amber-500' : 'bg-amber-500'
  return target === 'text' ? 'text-rose-500' : 'bg-rose-500'
}

onMounted(loadHistory)
</script>

<style scoped>
/* Enterprise DatePicker Styling - Overriding PrimeVue Defaults */
:deep(.p-datepicker-input) {
  background-color: rgb(30 41 59 / 0.4) !important; /* dark:bg-slate-800/40 */
  border-color: rgb(51 65 85 / 0.5) !important; /* dark:border-slate-700/50 */
  color: #f1f5f9 !important; /* slate-200 */
}

html:not(.dark) :deep(.p-datepicker-input) {
  background-color: rgb(248 250 252 / 0.5) !important; /* bg-slate-50/50 */
  border-color: rgb(226 232 240 / 0.6) !important; /* border-slate-200/60 */
  color: #334155 !important; /* text-slate-700 */
}

.kpi-compact-datatable :deep(.p-datatable-row:hover) {
  background: rgba(var(--slate-500-rgb), 0.05); /* slightly visible hover */
}

/* ... existing datatable styles ... */
.kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.75rem;
  font-weight: 900;
  color: #64748b;
  letter-spacing: 0.05em;
}

.dark .kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #0f172a;
  border-bottom-color: #1e293b;
  color: #94a3b8;
}

.kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f8fafc;
}

.dark .kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  border-bottom-color: #1e293b;
}

.kpi-compact-datatable :deep(.p-datatable-row:hover) {
  background: #f1f5f9/30;
}

.dark .kpi-compact-datatable :deep(.p-datatable-row:hover) {
  background: rgba(255, 255, 255, 0.02);
}
</style>


