<template>
  <div class="workers-table-container space-y-4">
    <!-- TABLE WRAPPER -->
    <div class="workers-table-wrapper rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900 transition-colors duration-300">
      
      <!-- HEADER PART -->
      <div class="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-users text-emerald-500 text-sm"></i>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ $t('workers.list_title') }}</h3>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{{ $t('workers.worker_count', { count: totalRecords || 0 }) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{{ $t('workers.active_status') }}</span>
          </div>
        </div>
      </div>

      <!-- CUSTOM TABLE -->
      <div class="overflow-x-auto w-full custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-900/50">
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_worker') }}</th>
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  {{ $t('workers.table_col_salary') }}
                  <button @click="showSalaries = !showSalaries" 
                          class="w-5 h-5 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <i :class="['pi', showSalaries ? 'pi-eye-slash' : 'pi-eye', 'text-[10px]']"></i>
                  </button>
                </div>
              </th>
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_branch') }}</th>
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_phone') }}</th>
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">{{ $t('workers.table_col_status') }}</th>
              <th class="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-right">{{ $t('workers.table_col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <!-- LOADING STATE SKELETONS -->
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="bg-white dark:bg-slate-900">
                <td class="px-6 py-4">
                  <div class="flex gap-3 items-center py-1">
                    <div class="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    <div class="space-y-2">
                      <div class="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                      <div class="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4"><div class="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="w-16 h-5 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div></td>
                <td class="px-6 py-4"><div class="w-16 h-8 bg-slate-100 dark:bg-slate-800 ml-auto rounded-xl animate-pulse"></div></td>
              </tr>
            </template>

            <!-- EMPTY STATE -->
            <tr v-else-if="!workers.length">
              <td colspan="6" class="px-6 py-16 text-center bg-white dark:bg-slate-900">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shadow-inner">
                    <i class="pi pi-users text-4xl text-slate-300 dark:text-slate-700"></i>
                  </div>
                  <div class="max-w-[200px]">
                    <p class="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">{{ $t('workers.not_found') }}</p>
                    <p class="text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-medium">{{ $t('workers.no_data_desc') }}</p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- DATA ROWS -->
            <tr v-else v-for="data in workers" :key="data.id" 
                class="group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
              <td class="px-6 py-4">
                <div 
                  class="flex items-center gap-3 cursor-pointer group/worker"
                  @click="router.push({ name: 'worker-detail', params: { id: data.id || data._id } })"
                >
                  <div class="relative flex-shrink-0 transition-transform duration-300 group-hover/worker:scale-105">
                    <div v-if="data.avatar_url"
                         class="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 group-hover/worker:ring-emerald-500 transition-all shadow-sm">
                      <img :src="data.avatar_url" class="w-full h-full object-cover" />
                    </div>
                    <div v-else
                         class="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-slate-100 dark:ring-slate-800 group-hover/worker:ring-emerald-500 transition-all font-black"
                         :style="getAvatarGradient(data.full_name || data.first_name)">
                      {{ getInitials(data) }}
                    </div>
                    <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full shadow-sm transition-colors duration-300"
                          :class="getStatusDotClass(data)"></span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-black text-sm text-slate-900 dark:text-white leading-none truncate group-hover/worker:text-emerald-500 transition-colors">
                      {{ getDisplayName(data) }}
                    </p>
                    <span class="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border"
                          :class="getRoleBadgeClass(data.role)">
                      {{ getRoleDisplay(data) }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-black text-emerald-600 dark:text-emerald-400 text-sm leading-none transition-all duration-300"
                        :class="{ 'blur-[4px] select-none': !showSalaries }">
                    {{ formatFullCurrency(data.salary) }}
                  </span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-500 font-medium mt-0.5 uppercase tracking-tighter">{{ $t('workers.salary_unit') }}</span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                    <i class="pi pi-map-marker text-[10px] text-emerald-600 dark:text-emerald-500"></i>
                  </div>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight truncate max-w-[120px]">
                    {{ getBranchName(data) }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4">
                <a :href="'tel:' + getPhone(data)" 
                   class="flex items-center gap-2 group/phone hover:opacity-80 transition-opacity cursor-pointer">
                  <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50 transition-colors group-hover/phone:bg-blue-500/10 group-hover/phone:border-blue-500/20">
                    <i class="pi pi-phone text-[10px] text-slate-500 dark:text-slate-400 group-hover/phone:text-blue-500"></i>
                  </div>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide group-hover/phone:text-slate-700 dark:group-hover/phone:text-slate-200 transition-colors">
                    {{ getPhone(data) || '—' }}
                  </span>
                </a>
              </td>

              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border"
                      :class="getStatusClass(data)">
                  <span class="w-1.5 h-1.5 rounded-full shadow-sm"
                        :class="getStatusDotClass(data)"></span>
                  {{ getStatusLabel(data) }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex gap-1.5 justify-end items-center group-hover:opacity-100 transition-opacity">
                  <button
                    class="w-8 h-8 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-200"
                    v-tooltip.top="$t('common.edit')"
                    @click="$emit('edit', data)">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all duration-200"
                    v-tooltip.top="$t('common.delete')"
                    @click="$emit('delete', data)">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION PART -->
      <div v-if="totalRecords > 0" 
           class="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          {{ $t('workers.page_info', { current: currentPage, total: totalPages }) }}
        </div>
        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1"
                  class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <i class="pi pi-angle-double-left text-[10px]"></i>
          </button>
          <button @click="currentPage--" :disabled="currentPage === 1"
                  class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <i class="pi pi-angle-left text-[10px]"></i>
          </button>
          
          <div class="flex items-center gap-1 mx-1">
            <template v-for="page in displayedPages" :key="page">
              <button @click="currentPage = page"
                      class="w-8 h-8 rounded-xl text-[11px] font-black transition-all shadow-sm
                             border focus:outline-none"
                       :class="currentPage === page 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
                {{ page }}
              </button>
            </template>
          </div>

          <button @click="currentPage++" :disabled="currentPage === totalPages"
                  class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <i class="pi pi-angle-right text-[10px]"></i>
          </button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                  class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                         border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <i class="pi pi-angle-double-right text-[10px]"></i>
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

const { t } = useI18n()
const router = useRouter()

const showSalaries = ref(false)

const props = defineProps({
  workers: Array,
  loading: Boolean,
  totalRecords: Number,
  page: Number,
  pageSize: Number
})

const emit = defineEmits(['edit', 'delete', 'update:page', 'update:pageSize', 'page-change'])

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
