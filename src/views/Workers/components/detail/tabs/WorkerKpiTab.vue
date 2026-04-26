<template>
  <div class="space-y-3">
    <!-- Compact Filters -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-900 p-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex items-center gap-2">
        <i class="pi pi-filter text-[10px] text-emerald-500"></i>
        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ $t('kpi.filters.year') }}:</label>
        <Dropdown 
          v-model="selectedYear" 
          :options="years" 
          class="h-7 w-24 kpi-dropdown-mini"
          @change="loadHistory"
        />
      </div>
      <button 
        @click="loadHistory" 
        :disabled="loading"
        class="h-7 w-7 rounded flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:rotate-180 disabled:opacity-50"
      >
        <i :class="['pi pi-refresh text-[10px]', { 'animate-spin': loading }]"></i>
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
          <div class="py-8 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">
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
                <span class="text-[9px] font-medium text-slate-400">{{ settingsStore.formatPrice(data?.sales_amount) }}</span>
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
            <span class="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
              {{ settingsStore.formatPrice(data?.avg_sale) }}
            </span>
          </template>
        </Column>

        <!-- Target -->
        <Column field="target_amount" :header="$t('kpi.table.target')" class="text-right min-w-[110px]">
          <template #body="{ data }">
            <div class="flex flex-col items-end">
              <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {{ parseFloat(data?.target_amount || 0) > 0 ? settingsStore.formatPrice(data?.target_amount) : '—' }}
              </span>
              <span class="text-[9px] font-bold text-emerald-500 opacity-70">{{ settingsStore.formatPrice(data?.bonus_amount) }}</span>
            </div>
          </template>
        </Column>

        <!-- Completion -->
        <Column field="completion_pct" :header="$t('kpi.table.completion')" class="min-w-[120px]">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 py-1">
              <div class="flex justify-between items-center text-[9px] font-black">
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
              <i class="pi pi-pencil text-[9px]"></i>
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
import Dropdown from 'primevue/dropdown'
import SetTargetModal from '../../SetTargetModal.vue'

const props = defineProps({
  workerId: [Number, String]
})

const settingsStore = useSettingsStore()
const loading = ref(false)
const history = ref([])
const selectedYear = ref(new Date().getFullYear())
const dialogVisible = ref(false)
const selectedKpi = ref(null)

const years = ref([
    2024, 2025, 2026, 2027, 2028
])

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
        const res = await kpiAPI.getWorkerKpi(props.workerId, { year: selectedYear.value })
        history.value = res.data?.results || res.data || []
    } catch (e) {
        console.error('KPI history load error:', e)
    } finally {
        loading.value = false
    }
}

const openDialog = (kpi) => {
    selectedKpi.value = kpi
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
.kpi-dropdown-mini :deep(.p-inputtext) {
    padding: 0.15rem 0.5rem;
    font-size: 10px !important;
    font-weight: 800;
}

/* Compact DataTable Overlay */
.kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
}

.dark .kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #0f172a;
  border-bottom-color: #1e293b;
  color: #94a3b8;
}

.kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 0.35rem 0.75rem;
  border-bottom: 1px solid #f8fafc;
}

.dark .kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  border-bottom-color: #1e293b;
}
</style>
