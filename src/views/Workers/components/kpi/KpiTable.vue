<template>
  <div class="space-y-3">
    <!-- Desktop Table View -->
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
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('common.no_results') }}</p>
          </div>
        </template>

        <!-- Worker & Rank -->
        <Column field="worker_name" :header="$t('kpi.table.worker')" sortable class="min-w-[200px]">
          <template #body="{ data, index }">
            <div class="flex items-center gap-3 py-1 group/worker cursor-pointer" @click="$emit('open-target', data)">
              <div class="w-5 flex items-center justify-center shrink-0">
                 <i v-if="isTopThree(data)" :class="['pi pi-star-fill text-[11px]', getMedalColor(data)]"></i>
                 <span v-else class="text-[10px] font-bold text-slate-300">#{{ index + 1 }}</span>
              </div>
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shadow-sm transition-transform group-hover/worker:scale-105"
                :style="getAvatarGradient(data?.worker_name)"
              >
                {{ (data?.worker_name || '??').split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover/worker:text-emerald-500 transition-colors">
                  {{ data?.worker_name || '---' }}
                </span>
                <span class="text-[9px] font-medium text-slate-400 opacity-70 tracking-tight">ID: {{ data?.worker }}</span>
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
              <span class="text-[9px] font-medium text-slate-400 leading-none">{{ settingsStore.formatPrice(data?.sales_amount) }}</span>
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
            <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
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
                   <span class="text-[11px] font-black text-slate-800 dark:text-slate-200">
                     {{ settingsStore.formatPrice(data?.target_amount) }}
                   </span>
                   <span v-if="parseFloat(data?.completion_pct || 0) >= 100" class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                </div>
                <span class="text-[9px] font-bold text-emerald-500 opacity-80 mt-0.5 tracking-widest">+{{ settingsStore.formatPrice(data?.bonus_amount) }}</span>
              </template>
              <button 
                v-else
                @click="$emit('open-target', data)"
                class="text-[9px] font-bold text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 hover:text-emerald-500 transition-all"
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
                   <span class="text-[10px] font-black" :class="getCompletionColor(data?.completion_pct, 'text')">
                     {{ data?.completion_pct ? parseFloat(data?.completion_pct).toFixed(0) + '%' : '0%' }}
                   </span>
                   <!-- Smart Status Badge -->
                   <span class="px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter shadow-sm" :class="getSmartStatusBadge(data?.completion_pct)">
                     {{ getSmartStatusLabel(data?.completion_pct) }}
                   </span>
                 </div>
                 <span class="text-[8px] text-slate-400 font-bold uppercase tracking-tighter opacity-50">{{ $t('kpi.stats.plan_label') }}</span>
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
              <i class="pi pi-pencil text-[9px]"></i>
            </button>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden flex flex-col gap-3">
       <template v-if="loading">
          <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse h-48"></div>
       </template>
       <template v-else-if="data.length > 0">
          <div v-for="(item, index) in sortedData" :key="item.id" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
             <!-- Rank/Medal on Top Right -->
             <div class="absolute top-4 right-4">
                <i v-if="isTopThree(item)" :class="['pi pi-star-fill text-sm', getMedalColor(item)]"></i>
                <span v-else class="text-[10px] font-bold text-slate-300">#{{ index + 1 }}</span>
             </div>

             <!-- Header Info -->
             <div class="flex items-center gap-3 mb-4">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                  :style="getAvatarGradient(item?.worker_name)"
                >
                  {{ (item?.worker_name || '??').split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
                </div>
                <div class="flex flex-col min-w-0">
                   <h3 class="text-xs font-black text-slate-800 dark:text-white truncate">{{ item?.worker_name || '---' }}</h3>
                   <span class="text-[10px] font-medium text-slate-400">ID: {{ item.worker }}</span>
                </div>
             </div>

             <!-- Grid Stats -->
             <div class="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                <div>
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.net_sales') }}</span>
                  <span class="text-xs font-black text-emerald-500">{{ settingsStore.formatPrice(item.net_sales_amount) }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.returns_count') }}</span>
                  <span :class="['text-xs font-black', parseFloat(item.returns_amount) > 0 ? 'text-rose-500' : 'text-slate-300']">
                     {{ parseFloat(item.returns_amount) > 0 ? settingsStore.formatPrice(item.returns_amount) : '-' }}
                  </span>
                </div>
                <div>
                   <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.sales_count') }}</span>
                   <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ item.sales_count }}</span>
                      <span class="text-[10px] text-slate-400">/ {{ settingsStore.formatPrice(item.sales_amount) }}</span>
                   </div>
                </div>
                <div class="text-right">
                   <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.target') }}</span>
                   <div class="flex flex-col items-end leading-none">
                      <span v-if="parseFloat(item.target_amount) > 0" class="text-xs font-black text-slate-700 dark:text-slate-200">
                         {{ settingsStore.formatPrice(item.target_amount) }}
                      </span>
                      <span v-else class="text-[10px] font-bold text-slate-300 italic">No Target</span>
                   </div>
                </div>
             </div>

             <!-- Progress Section -->
             <div class="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
                <div class="flex justify-between items-center mb-1.5">
                   <div class="flex items-center gap-2">
                       <span class="text-[11px] font-black" :class="getCompletionColor(item.completion_pct, 'text')">
                          {{ item.completion_pct ? parseFloat(item.completion_pct).toFixed(0) + '%' : '0%' }}
                       </span>
                       <span class="px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter shadow-sm" :class="getSmartStatusBadge(item.completion_pct)">
                          {{ getSmartStatusLabel(item.completion_pct) }}
                       </span>
                   </div>
                   <button @click="$emit('open-target', item)" class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-slate-400 flex items-center justify-center shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700">
                      <i class="pi pi-pencil text-[9px]"></i>
                   </button>
                </div>
                <div class="h-1.5 w-full bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                   <div 
                      class="h-full rounded-full transition-all duration-1000"
                      :class="getCompletionColor(item.completion_pct, 'bg')"
                      :style="{ width: Math.min(parseFloat(item.completion_pct || 0), 100) + '%' }"
                   ></div>
                </div>
             </div>
          </div>
       </template>
       <template v-else>
          <div class="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
             <i class="pi pi-inbox text-3xl text-slate-200 mb-3 block"></i>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('common.no_results') }}</p>
          </div>
       </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useSettingsStore } from '@/store/settings'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  data: Array,
  fullList: Array, // For leaderboard calculation
  loading: Boolean
})

defineEmits(['open-target'])

const settingsStore = useSettingsStore()

// Sort display data by completion percentage descending
const sortedData = computed(() => {
  if (!props.data) return []
  return [...props.data].sort((a, b) => {
    return parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0)
  })
})

// Leaderboard Logic
const isTopThree = (data) => {
  const sorted = [...props.fullList].sort((a,b) => parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0))
  const rank = sorted.findIndex(item => item.id === data.id)
  return rank >= 0 && rank < 3 && parseFloat(data.completion_pct) > 0
}

const getMedalColor = (data) => {
  const sorted = [...props.fullList].sort((a,b) => parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0))
  const rank = sorted.findIndex(item => item.id === data.id)
  if (rank === 0) return 'text-amber-400'
  if (rank === 1) return 'text-slate-400'
  if (rank === 2) return 'text-amber-700'
  return ''
}

// Smart Status Logic
const getSmartStatusLabel = (pct) => {
  const val = parseFloat(pct || 0)
  if (val >= 100) return t('kpi.labels.star')
  if (val >= 90) return t('kpi.labels.expert')
  if (val >= 70) return t('kpi.labels.solid')
  if (val >= 50) return t('kpi.labels.growing')
  return t('kpi.labels.lagging')
}

const getSmartStatusBadge = (pct) => {
  const val = parseFloat(pct || 0)
  if (val >= 100) return 'bg-emerald-500 text-white'
  if (val >= 90) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  if (val >= 70) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  if (val >= 50) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
}

const getQualityRatio = (data) => {
    const sales = parseFloat(data.sales_amount || 0)
    const returns = parseFloat(data.returns_amount || 0)
    if (sales === 0) return 100
    return Math.max(0, ((sales - returns) / sales) * 100)
}

const getCompletionColor = (pct, target = 'text') => {
  if (pct === null || pct === undefined) {
    return target === 'text' ? 'text-slate-300' : 'bg-slate-100 dark:bg-slate-800'
  }
  const val = parseFloat(pct)
  if (val >= 100) return target === 'text' ? 'text-emerald-500' : 'bg-emerald-500'
  if (val >= 70) return target === 'text' ? 'text-amber-500' : 'bg-amber-500'
  return target === 'text' ? 'text-rose-500' : 'bg-rose-500'
}

// Avatar Utils
const gradients = [
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #84cc16, #65a30d)',
  'linear-gradient(135deg, #f97316, #ea580c)',
]

const getAvatarGradient = (fullName) => {
  if (!fullName) return { background: gradients[0] }
  const index = fullName.charCodeAt(0) % gradients.length
  return { background: gradients[index] }
}
</script>

<style scoped>
.kpi-compact-datatable :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
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