<template>
  <div class="hidden lg:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <DataTable 
      :value="sortedData" 
      :loading="loading"
      responsiveLayout="scroll"
      class="kpi-compact-datatable"
      :rows="20"
      dataKey="id"
      sortField="worker_name"
      :sortOrder="1"
    >
      <template #empty>
        <div class="py-16 text-center">
           <i class="pi pi-inbox text-3xl text-slate-200 mb-3 block"></i>
           <p class="text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('common.no_results') }}</p>
        </div>
      </template>

      <!-- Worker & Rank -->
      <Column field="worker_name" :header="$t('kpi.table.worker')" sortable class="min-w-[200px]">
        <template #body="{ data, index }">
          <div class="flex items-center gap-3 py-1 group/worker cursor-pointer" @click="navigateToDetail(data)">
            <div class="w-5 flex items-center justify-center shrink-0">
               <i v-if="isTopThree(data)" :class="['pi pi-star-fill text-[13px]', getMedalColor(data)]"></i>
               <span v-else class="text-[12px] font-bold text-slate-300">#{{ index + 1 }}</span>
            </div>
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[12px] shadow-sm transition-transform group-hover/worker:scale-105"
              :style="getAvatarGradient(data?.worker_name)"
            >
              {{ (data?.worker_name || '??').split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover/worker:text-emerald-500 transition-colors">
                {{ data?.worker_name || '---' }}
              </span>
              <span class="text-[11px] font-medium text-slate-400 opacity-70 tracking-tight">ID: {{ data?.worker }}</span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Sales Analytics -->
      <Column field="sales_count" :header="$t('kpi.table.sales_count')" sortable class="text-center min-w-[120px]">
        <template #body="{ data }">
          <div class="flex flex-col items-center gap-1.5">
            <div class="flex items-center gap-2">
               <span class="text-xs font-bold text-slate-700 dark:text-slate-100">{{ data?.sales_count }}</span>
               <div class="flex h-1 w-10 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full" :style="{ width: getQualityRatio(data) + '%' }"></div>
                  <div class="bg-rose-500 h-full" :style="{ width: (100 - getQualityRatio(data)) + '%' }"></div>
               </div>
            </div>
            <span class="text-[11px] font-medium text-slate-400 leading-none">{{ settingsStore.formatPrice(data?.sales_amount) }}</span>
          </div>
        </template>
      </Column>

      <!-- Net Sales -->
      <Column field="net_sales_amount" :header="$t('kpi.table.net_sales')" sortable class="text-right min-w-[110px]">
        <template #body="{ data }">
          <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {{ settingsStore.formatPrice(data?.net_sales_amount) }}
          </span>
        </template>
      </Column>

      <!-- Returns Amount -->
      <Column field="returns_amount" :header="$t('kpi.table.returns_count')" sortable class="text-right min-w-[110px]">
        <template #body="{ data }">
          <span v-if="parseFloat(data?.returns_amount || 0) > 0" class="text-xs font-bold text-rose-500">
            {{ settingsStore.formatPrice(data?.returns_amount) }}
          </span>
          <span v-else class="text-xs text-slate-300 dark:text-slate-700">-</span>
        </template>
      </Column>

      <!-- Avg Sale -->
      <Column field="avg_sale" :header="$t('kpi.table.avg_sale')" sortable class="text-right min-w-[100px]">
        <template #body="{ data }">
          <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
            {{ settingsStore.formatPrice(data?.avg_sale) }}
          </span>
        </template>
      </Column>

      <!-- Target Status -->
      <Column field="target_amount" :header="$t('kpi.table.target')" sortable class="text-right min-w-[120px]">
        <template #body="{ data }">
          <div class="flex flex-col items-end">
            <template v-if="parseFloat(data?.target_amount || 0) > 0">
              <div class="flex items-center gap-1.5">
                 <span class="text-[13px] font-black text-slate-800 dark:text-slate-200">
                   {{ settingsStore.formatPrice(data?.target_amount) }}
                 </span>
                 <span v-if="parseFloat(data?.completion_pct || 0) >= 100" class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              <span class="text-[11px] font-bold text-emerald-500 opacity-80 mt-0.5 tracking-widest">+{{ settingsStore.formatPrice(data?.bonus_amount) }}</span>
            </template>
            <button 
              v-else
              @click="$emit('open-target', data)"
              class="text-[11px] font-bold text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 hover:text-emerald-500 transition-all"
            >
              {{ $t('kpi.status.no_target') }}
            </button>
          </div>
        </template>
      </Column>

      <!-- Progress -->
      <Column field="completion_pct" :header="$t('kpi.table.completion')" sortable class="min-w-[150px]">
        <template #body="{ data }">
          <div class="flex flex-col gap-1 py-1">
            <div class="flex justify-between items-center">
               <div class="flex items-center gap-2">
                 <span class="text-[12px] font-black" :class="getCompletionColor(data?.completion_pct, 'text')">
                   {{ data?.completion_pct ? parseFloat(data?.completion_pct).toFixed(0) + '%' : '0%' }}
                 </span>
                 <span class="px-1.5 py-0.5 rounded-[4px] text-[10px] font-black tracking-tighter shadow-sm" :class="getSmartStatusBadge(data?.completion_pct)">
                   {{ getSmartStatusLabel(data?.completion_pct) }}
                 </span>
               </div>
               <span class="text-[10px] text-slate-400 font-bold tracking-tighter opacity-50">{{ $t('kpi.stats.plan_label') }}</span>
            </div>
            <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800/20 rounded-full overflow-hidden shadow-inner">
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
      <Column class="w-10 sticky right-0 text-center">
        <template #body="{ data }">
          <button 
            @click="$emit('open-target', data)"
            v-tooltip.left="$t('kpi.set_target.title')"
            class="w-7 h-7 rounded-lg text-slate-300 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center active:scale-95"
          >
            <i class="pi pi-pencil text-[11px]"></i>
          </button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useSettingsStore } from '@/store/settings'
import { useKpiTable } from '../../composables/useKpiTable'

const props = defineProps({
  data: Array,
  fullList: Array,
  loading: Boolean
})

const emit = defineEmits(['open-target'])

const router = useRouter()
const settingsStore = useSettingsStore()

const navigateToDetail = (data) => {
  if (!data?.worker) return
  router.push({ 
    name: 'worker-detail', 
    params: { id: data.worker },
    query: { tab: 'kpi' }
  })
}
const {
  sortedData,
  isTopThree,
  getMedalColor,
  getSmartStatusLabel,
  getSmartStatusBadge,
  getCompletionColor,
  getQualityRatio,
  getAvatarGradient
} = useKpiTable(props)
</script>

<style scoped>
.kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 10px;
  font-weight: 800;
  text-transform: ;
  letter-spacing: 0.05em;
  color: #64748b;
}

.dark .kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #0f172a;
  border-bottom-color: #1e293b;
  color: #94a3b8;
}

.kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid #f8fafc;
}

.dark .kpi-compact-datatable :deep(.p-datatable-tbody > tr > td) {
  border-bottom-color: #1e293b;
}

.kpi-compact-datatable :deep(.p-datatable-wrapper)::-webkit-scrollbar {
  height: 4px;
}
.kpi-compact-datatable :deep(.p-datatable-wrapper)::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.dark .kpi-compact-datatable :deep(.p-datatable-wrapper)::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>


