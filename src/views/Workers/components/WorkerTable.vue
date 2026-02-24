<template>
  <div class="workers-table-wrapper rounded-2xl overflow-hidden shadow-lg border border-slate-800/40 dark:border-slate-700/30 w-full">

    <!-- Table Header -->
    <div class="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <i class="pi pi-users text-emerald-500 text-sm"></i>
        </div>
        <div>
          <h3 class="text-sm font-black text-white tracking-tight">Xodimlar Ro'yxati</h3>
          <p class="text-[10px] text-slate-500 font-medium">{{ workers?.length || 0 }} ta xodim</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Aktiv</span>
        </div>
      </div>
    </div>

    <!-- Table wrapper: horizontal scroll on small screens -->
    <div class="overflow-x-auto w-full">
    <DataTable
      :value="loading ? Array(5).fill({}) : workers"
      paginator
      :rows="10"
      scrollable
      scrollHeight="flex"
      class="workers-data-table"
      :rowHover="true"
    >
      <!-- Empty State -->
      <template #empty>
        <div class="flex flex-col items-center justify-center py-16 space-y-4">
          <div class="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
            <i class="pi pi-users text-4xl text-slate-600"></i>
          </div>
          <div class="text-center">
            <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Xodimlar topilmadi</p>
            <p class="text-xs text-slate-600 mt-1">Yangi xodim qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        </div>
      </template>

      <!-- Xodim Ustuni -->
      <Column header="Xodim" class="min-w-[14rem]">
        <template #body="{ data }">
          <div v-if="loading" class="flex gap-3 items-center py-1">
            <Skeleton shape="circle" size="2.75rem" />
            <div class="space-y-2">
              <Skeleton width="9rem" height="0.85rem" />
              <Skeleton width="5rem" height="0.65rem" />
            </div>
          </div>
          <div v-else class="flex items-center gap-3 py-1">
            <!-- Gradient Avatar -->
            <div class="relative">
              <div v-if="data.avatar_url"
                   class="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-slate-700">
                <img :src="data.avatar_url" class="w-full h-full object-cover" />
              </div>
              <div v-else
                   class="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-slate-700"
                   :style="getAvatarGradient(data.full_name || data.first_name)">
                {{ getInitials(data) }}
              </div>
              <!-- Online dot -->
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <p class="font-black text-sm text-white leading-none">
                {{ getDisplayName(data) }}
              </p>
              <span class="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest"
                    :class="getRoleBadgeClass(data.role)">
                {{ getRoleDisplay(data) }}
              </span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Maosh Ustuni -->
      <Column header="Oylik Maosh" class="min-w-[9rem]">
        <template #body="{ data }">
          <Skeleton v-if="loading" width="7rem" height="0.85rem" />
          <div v-else class="flex flex-col">
            <span class="font-black text-emerald-400 text-sm leading-none">
              {{ formatShortCurrency(data.salary) }}
            </span>
            <span class="text-[10px] text-slate-600 font-medium mt-0.5">UZS / oy</span>
          </div>
        </template>
      </Column>

      <!-- Filial Ustuni -->
      <Column header="Filial" class="min-w-[10rem]">
        <template #body="{ data }">
          <Skeleton v-if="loading" width="8rem" height="0.85rem" />
          <div v-else class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-map-marker text-[10px] text-emerald-500"></i>
            </div>
            <span class="text-xs font-semibold text-slate-300 leading-tight">
              {{ getBranchName(data) }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Telefon Ustuni -->
      <Column header="Telefon" class="min-w-[9rem]">
        <template #body="{ data }">
          <Skeleton v-if="loading" width="7rem" height="0.85rem" />
          <div v-else class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-phone text-[10px] text-slate-400"></i>
            </div>
            <span class="text-xs font-medium text-slate-400 tracking-wide">
              {{ getPhone(data) }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Status Ustuni -->
      <Column header="Status" class="min-w-[7rem]">
        <template #body="{ data }">
          <Skeleton v-if="loading" width="5rem" height="1.5rem" borderRadius="999px" />
          <span v-else
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                :class="getStatusClass(data)">
            <span class="w-1.5 h-1.5 rounded-full"
                  :class="isActive(data) ? 'bg-emerald-400' : 'bg-rose-400'"></span>
            {{ isActive(data) ? 'Faol' : 'Nofaol' }}
          </span>
        </template>
      </Column>

      <!-- Amallar Ustuni -->
      <Column header="" class="w-[7rem] text-right">
        <template #body="{ data }">
          <div v-if="loading" class="flex justify-end gap-2">
            <Skeleton shape="circle" size="2rem" />
            <Skeleton shape="circle" size="2rem" />
          </div>
          <div v-else class="flex gap-1.5 justify-end opacity-70 hover:opacity-100 transition-opacity">
            <button
              class="w-8 h-8 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 flex items-center justify-center transition-all duration-200 hover:scale-110"
              @click="$emit('edit', data)"
              title="Tahrirlash">
              <i class="pi pi-pencil text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 flex items-center justify-center transition-all duration-200 hover:scale-110"
              @click="$emit('delete', data)"
              title="O'chirish">
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
    </div><!-- end scroll wrapper -->
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Avatar from 'primevue/avatar'

const props = defineProps({
  workers: Array,
  loading: Boolean
})

const emit = defineEmits(['edit', 'delete'])

// Avatar uchun rang gradientlari
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

// full_name → "AH" kabi initials
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
  const roleMap = {
    'owner':   'Egasi',
    'admin':   'Admin',
    'manager': 'Menejer',
    'seller':  'Sotuvchi'
  }
  return data.role_display || roleMap[data.role] || data.role || '—'
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'owner':   return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
    case 'admin':   return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
    case 'manager': return 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
    case 'seller':  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
    default:        return 'bg-slate-700/50 text-slate-400 border border-slate-700'
  }
}

// status: "active" | "deactive" | boolean — backend'dagi haqiqiy qiymatlar
const isActive = (data) => {
  if (typeof data.is_active === 'boolean') return data.is_active
  if (typeof data.status === 'string') return data.status === 'active'
  return true // default: faol
}

const getStatusClass = (data) => {
  return isActive(data)
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
}

const formatShortCurrency = (val) => {
  const num = parseFloat(val) || 0
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + ' mln'
  if (num >= 1_000)     return (num / 1_000).toFixed(0) + ' ming'
  return num.toFixed(0)
}

const getBranchName = (data) => {
  return data.branch_name || data.branch?.name || data.branch || '—'
}

const getPhone = (data) => {
  return data.phone1 || data.phone || '—'
}
</script>

<style scoped>
/* Table background */
.workers-table-wrapper {
  background: #0f172a;
}

/* DataTable overrides */
:deep(.workers-data-table .p-datatable-table) {
  background: transparent;
}

:deep(.workers-data-table .p-datatable-thead > tr > th) {
  background: #0f172a !important;
  color: #64748b;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-bottom: 1px solid #1e293b !important;
  border-top: none !important;
  padding: 14px 16px;
}

:deep(.workers-data-table .p-datatable-tbody > tr) {
  background: transparent !important;
  border-bottom: 1px solid #1e293b !important;
  transition: background 0.15s ease;
}

:deep(.workers-data-table .p-datatable-tbody > tr:hover) {
  background: #1e293b !important;
}

:deep(.workers-data-table .p-datatable-tbody > tr > td) {
  border: none !important;
  padding: 12px 16px;
  color: #cbd5e1;
}

:deep(.workers-data-table .p-datatable-tbody > tr:last-child) {
  border-bottom: none !important;
}

/* Pagination */
:deep(.workers-data-table .p-paginator) {
  background: #0f172a !important;
  border-top: 1px solid #1e293b !important;
  border-radius: 0 !important;
  padding: 12px 16px;
}

:deep(.workers-data-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
  font-weight: 900;
  border-radius: 10px;
}

:deep(.workers-data-table .p-paginator .p-paginator-page),
:deep(.workers-data-table .p-paginator .p-paginator-next),
:deep(.workers-data-table .p-paginator .p-paginator-prev),
:deep(.workers-data-table .p-paginator .p-paginator-first),
:deep(.workers-data-table .p-paginator .p-paginator-last) {
  color: #64748b !important;
  border-radius: 10px !important;
  transition: all 0.2s;
}

:deep(.workers-data-table .p-paginator .p-paginator-page:hover),
:deep(.workers-data-table .p-paginator .p-paginator-next:hover),
:deep(.workers-data-table .p-paginator .p-paginator-prev:hover) {
  background: #1e293b !important;
  color: #94a3b8 !important;
}

/* Scrollbar */
:deep(.workers-data-table .p-datatable-wrapper::-webkit-scrollbar) {
  height: 4px;
}
:deep(.workers-data-table .p-datatable-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}
:deep(.workers-data-table .p-datatable-wrapper::-webkit-scrollbar-thumb) {
  background: #334155;
  border-radius: 4px;
}
</style>
