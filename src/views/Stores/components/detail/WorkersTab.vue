<template>
  <div class="space-y-4">
    <!-- TABLE VIEW: Hidden on mobile, visible on medium screens and up -->
    <div class="hidden md:block workers-table-wrapper rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900 transition-colors duration-300">
      <!-- HEADER PART -->
      <div class="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-users text-emerald-500 text-sm"></i>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ $t('workers.list_title') }}</h3>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{{ $t('workers.worker_count', { count: workers?.length || 0 }) }}</p>
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
            <tr v-for="data in workers" :key="data.id" 
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
                         :style="getAvatarGradient(getDisplayName(data))">
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
                    @click="editWorker(data)">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all duration-200"
                    v-tooltip.top="$t('common.delete')"
                    @click="confirmDeleteWorker(data)">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CARD VIEW: Visible on mobile, hidden on medium screens and up -->
    <div class="grid grid-cols-1 gap-4 md:hidden">
      <div v-for="data in workers" :key="data.id" 
           class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3" @click="router.push({ name: 'worker-detail', params: { id: data.id || data._id } })">
            <div class="relative">
              <div v-if="data.avatar_url" class="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                <img :src="data.avatar_url" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-slate-100 dark:ring-slate-800 font-black" :style="getAvatarGradient(getDisplayName(data))">
                {{ getInitials(data) }}
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" :class="getStatusDotClass(data)"></span>
            </div>
            <div>
              <p class="font-black text-sm text-slate-900 dark:text-white leading-tight">{{ getDisplayName(data) }}</p>
              <span class="inline-flex items-center mt-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border" :class="getRoleBadgeClass(data.role)">
                {{ getRoleDisplay(data) }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="editWorker(data)" class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center active:bg-blue-500 active:text-white transition-all">
               <i class="pi pi-pencil text-xs"></i>
            </button>
            <button @click="confirmDeleteWorker(data)" class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center active:bg-rose-500 active:text-white transition-all">
               <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
          <div>
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Maosh</p>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-emerald-600 dark:text-emerald-400" :class="{ 'blur-[4px] transition-all': !showSalaries }">
                {{ formatFullCurrency(data.salary) }}
              </span>
              <button @click="showSalaries = !showSalaries" class="text-slate-400 hover:text-slate-600">
                <i :class="['pi', showSalaries ? 'pi-eye-slash' : 'pi-eye', 'text-[10px]']"></i>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Filial</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{{ getBranchName(data) }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div class="flex items-center gap-2">
             <i class="pi pi-phone text-[10px] text-slate-400"></i>
             <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ getPhone(data) }}</span>
          </div>
          <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border" :class="getStatusClass(data)">
            {{ getStatusLabel(data) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Worker Dialog Reused -->
    <WorkerDialog
      v-model:visible="workerDialog"
      :worker="worker"
      :saving="saving"
      :submitted="submitted"
      :is-edit="!!worker.id"
      :create-login="createLogin"
      @save="saveWorker"
      @hide="hideDialog"
      @update:createLogin="createLogin = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWorkerActions } from '@/views/Workers/composables/useWorkerActions'
import WorkerDialog from '@/views/Workers/components/WorkerDialog.vue'

const props = defineProps({
  workers: {
    type: Array,
    default: () => []
  },
  onRefresh: {
    type: Function,
    required: true
  }
})

const { t } = useI18n()
const router = useRouter()
const showSalaries = ref(false)

const {
  worker,
  workerDialog,
  saving,
  submitted,
  createLogin,
  editWorker,
  saveWorker,
  confirmDeleteWorker,
  hideDialog
} = useWorkerActions(() => props.onRefresh())

// HELPERS
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

const getRoleDisplay = (data) => t(`workers.roles.${data.role || 'seller'}`)

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'owner':   return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
    case 'admin':   return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
    case 'manager': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
    case 'seller':  return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
    default:        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  }
}

const getStatusLabel = (data) => t(`workers.statuses.${data.status || 'active'}`)

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
    case 'active': return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20'
    case 'tatil': return 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20'
    case 'ishdan_ketgan': return 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20'
    default: return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20'
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
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
