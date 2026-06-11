<template>
  <div class="workers-table-container space-y-3">
    <!-- TABLE WRAPPER -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
      
      <!-- HEADER PART (Compact) -->
      <div class="flex items-center justify-between px-4 py-3 bg-slate-50/30 dark:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-users text-emerald-500 text-[12px]"></i>
          </div>
          <div>
            <h3 class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight ">{{ $t('workers.list_title') }}</h3>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-widest">{{ $t('workers.worker_count', { count: totalRecords || 0 }) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            <span class="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-black text-emerald-500 tracking-widest">{{ $t('workers.active_status') }}</span>
          </div>
        </div>
      </div>

      <!-- CUSTOM TABLE (Compact) -->
      <div class="overflow-x-auto w-full custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_worker') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  {{ $t('workers.table_col_salary') }}
                  <button @click="showSalaries = !showSalaries" 
                          class="w-5 h-5 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <i :class="['pi', showSalaries ? 'pi-eye-slash' : 'pi-eye', 'text-[12px]']"></i>
                  </button>
                </div>
              </th>
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_branch') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_phone') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_status') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 text-center w-24">{{ $t('workers.table_col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <!-- LOADING STATE SKELETONS -->
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="bg-white dark:bg-slate-900">
                <td class="px-4 py-2">
                  <div class="flex gap-2.5 items-center py-0.5">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    <div class="space-y-1">
                      <div class="w-20 h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                      <div class="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2"><div class="w-16 h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-4 py-2"><div class="w-20 h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-4 py-2"><div class="w-20 h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-4 py-2"><div class="w-14 h-4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div></td>
                <td class="px-4 py-2 text-center"><div class="w-12 h-6 bg-slate-100 dark:bg-slate-800 mx-auto rounded-lg animate-pulse"></div></td>
              </tr>
            </template>

            <!-- EMPTY STATE -->
            <tr v-else-if="!workers.length">
              <td colspan="6" class="px-4 py-12 text-center bg-white dark:bg-slate-900">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                    <i class="pi pi-users text-3xl text-slate-300 dark:text-slate-700"></i>
                  </div>
                  <div>
                    <p class="text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-widest leading-tight">{{ $t('workers.not_found') }}</p>
                    <p class="text-[11px] text-slate-400 dark:text-slate-600 mt-1 font-bold ">{{ $t('workers.no_data_desc') }}</p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- DATA ROWS (Compact) -->
            <tr v-else v-for="data in workers" :key="data.id" 
                class="group bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-200">
              <td class="px-4 py-2">
                <div 
                  class="flex items-center gap-2.5 cursor-pointer group/worker"
                  @click="router.push({ name: 'worker-detail', params: { id: data.id || data._id } })"
                >
                  <div class="relative flex-shrink-0">
                    <div v-if="data.avatar_url"
                         class="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 group-hover/worker:border-emerald-500 transition-all">
                      <img :src="data.avatar_url" class="w-full h-full object-cover" />
                    </div>
                    <div v-else
                         class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[12px] shadow-sm border border-slate-100 dark:border-slate-800 group-hover/worker:border-emerald-500 transition-all"
                         :style="getAvatarGradient(data.full_name || data.first_name)">
                      {{ getInitials(data) }}
                    </div>
                    <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-slate-900 rounded-full"
                          :class="getStatusDotClass(data)"></span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-xs text-slate-700 dark:text-slate-200 leading-none truncate group-hover/worker:text-emerald-500 transition-colors">
                      {{ getDisplayName(data) }}
                    </p>
                    <span class="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-black tracking-widest border border-slate-100 dark:border-slate-800"
                          :class="getRoleBadgeClass(data.role)">
                      {{ getRoleDisplay(data) }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-4 py-2">
                <div class="flex flex-col">
                  <span class="font-bold text-emerald-600 dark:text-emerald-400 text-xs leading-none transition-all duration-300"
                        :class="{ 'blur-[4px] select-none': !showSalaries }">
                    {{ formatFullCurrency(data.salary) }}
                  </span>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 tracking-tighter">{{ $t('workers.salary_unit') }}</span>
                </div>
              </td>

              <td class="px-4 py-2">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-map-marker text-[11px] text-slate-400"></i>
                  <span class="text-[13px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                    {{ getBranchName(data) }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-2">
                <a :href="'tel:' + getPhone(data)" 
                   class="flex items-center gap-1.5 group/phone hover:opacity-80 transition-opacity">
                  <i class="pi pi-phone text-[11px] text-slate-400 group-hover/phone:text-blue-500"></i>
                  <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight group-hover/phone:text-slate-700 dark:group-hover/phone:text-slate-200">
                    {{ getPhone(data) || '—' }}
                  </span>
                </a>
              </td>

              <td class="px-4 py-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest border"
                      :class="getStatusClass(data)">
                  <span class="w-1 h-1 rounded-full" :class="getStatusDotClass(data)"></span>
                  {{ getStatusLabel(data) }}
                </span>
              </td>

              <td class="px-4 py-2 text-center">
                <div class="flex gap-1 justify-center items-center">
                  <button
                    v-if="settingsStore.isKpiEnabled && settingsStore.hasPlanKpi"
                    class="w-7 h-7 rounded-lg border transition-all active:scale-90 flex items-center justify-center"
                    :class="data.kpi_summary 
                      ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-slate-500/5 hover:bg-slate-500/10 border-slate-500/10 text-slate-400 dark:text-slate-500'"
                    v-tooltip.top="data.kpi_summary ? `${$t('kpi.table.target')}: ${formatFullCurrency(data.kpi_summary.target_amount)}` : $t('kpi.status.no_target')"
                    @click="$emit('open-target', data)">
                    <i :class="['pi', data.kpi_summary ? 'pi-bullseye' : 'pi-plus-circle', 'text-[11px]']"></i>
                  </button>
                  <button
                    class="w-7 h-7 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all active:scale-90"
                    v-tooltip.top="$t('common.edit')"
                    @click="$emit('edit', data)">
                    <i class="pi pi-pencil text-[11px]"></i>
                  </button>
                  <button v-if="!isManager"
                    class="w-7 h-7 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all active:scale-90"
                    v-tooltip.top="$t('common.delete')"
                    @click="$emit('delete', data)">
                    <i class="pi pi-trash text-[11px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION PART (Compact) -->
      <div v-if="totalRecords > 0" 
           class="px-4 py-3 bg-slate-50/30 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest">
          {{ $t('workers.page_info', { current: currentPage, total: totalPages }) }}
        </div>
        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1"
                  class="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">
            <i class="pi pi-angle-double-left text-[11px]"></i>
          </button>
          <button @click="currentPage--" :disabled="currentPage === 1"
                  class="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">
            <i class="pi pi-angle-left text-[11px]"></i>
          </button>
          
          <div class="flex items-center gap-1 mx-0.5">
            <template v-for="page in displayedPages" :key="page">
              <button @click="currentPage = page"
                      class="w-7 h-7 rounded-lg text-[12px] font-bold transition-all
                             border focus:outline-none"
                       :class="currentPage === page 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'">
                {{ page }}
              </button>
            </template>
          </div>

          <button @click="currentPage++" :disabled="currentPage === totalPages"
                  class="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">
            <i class="pi pi-angle-right text-[11px]"></i>
          </button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                  class="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50">
            <i class="pi pi-angle-double-right text-[11px]"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

const { t } = useI18n()
const router = useRouter()
const settingsStore = useSettingsStore()

import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
const isManager = computed(() => {
  const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
  return role === 'manager'
})

const showSalaries = ref(false)

const props = defineProps({
  workers: Array,
  loading: Boolean,
  totalRecords: Number,
  page: Number,
  pageSize: Number
})

const emit = defineEmits(['edit', 'delete', 'update:page', 'update:pageSize', 'page-change', 'open-target'])

const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
    emit('page-change')
  }
})

const totalPages = computed(() => {
  return Math.ceil((props.totalRecords || 0) / (props.pageSize || 10))
})

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({length: Math.max(0, total)}, (_, i) => i + 1)
  
  if (currentPage.value <= 3) return [1, 2, 3, 4, 5]
  if (currentPage.value >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  
  return [currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2]
})

// UTILS
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
  const index = (fullName?.charCodeAt(0) || 0) % gradients.length
  return { background: gradients[index] }
}

const getInitials = (data) => {
  const full = data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim()
  const parts = full.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts.length === 1 && parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return '?'
}

const getDisplayName = (data) => {
  return data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || '—'
}

const getRoleDisplay = (data) => {
  return t(`workers.roles.${data.role || 'seller'}`)
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'owner':   return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
    case 'admin':   return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
    case 'manager': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
    case 'seller':  return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
    default:        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  }
}

const getStatusLabel = (data) => {
  return t(`workers.statuses.${data.status || 'active'}`)
}

const getStatusDotClass = (data) => {
  switch (data.status) {
    case 'active': return 'bg-emerald-500 animate-pulse'
    case 'tatil': return 'bg-amber-500'
    case 'ishdan_ketgan': return 'bg-rose-500'
    default: return 'bg-emerald-500 animate-pulse'
  }
}

const getStatusClass = (data) => {
  switch (data.status) {
    case 'active': 
      return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20'
    case 'tatil': 
      return 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20'
    case 'ishdan_ketgan': 
      return 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20'
    default: 
      return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20'
  }
}

const formatFullCurrency = (val) => {
  const num = parseFloat(val) || 0
  return num.toLocaleString('fr-FR').replace(/,/g, ' ')
}

const getBranchName = (data) => data.branch_name || data.branch?.name || data.branch || '—'
const getPhone = (data) => data.phone1 || data.phone || '—'
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

/* Ensure table rows keep consistent height */
table {
  border-spacing: 0;
}

th, td {
  white-space: nowrap;
}
</style>


