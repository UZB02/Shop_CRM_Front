<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm backdrop-blur-xl border border-slate-100/50 dark:border-slate-800/30">
    <div class="overflow-x-auto overflow-y-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.table.name') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter hidden sm:table-cell">{{ $t('customers.table.contact_address') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-center font-inter hidden md:table-cell">{{ $t('customers.table.trades') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter text-right sm:text-left">
              {{ isDebtorsMode ? ($t('customers.table.debt_label') || 'Qarz Miqdori') : $t('customers.table.total_spent') }}
            </th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-right font-inter">{{ $t('customers.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <!-- Loading -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 animate-pulse"></div></td>
              <td class="px-4 py-3 hidden sm:table-cell"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 animate-pulse"></div></td>
              <td class="px-4 py-3 hidden md:table-cell"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12 mx-auto animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse ml-auto sm:ml-0"></div></td>
              <td class="px-4 py-3"><div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-20 ml-auto animate-pulse"></div></td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!customers.length">
            <tr>
              <td colspan="5" class="px-6 py-14 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-users text-xl text-slate-400"></i>
                </div>
                <p class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('customers.table.no_results') }}</p>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <tr 
            v-for="data in customers" 
            :key="data.id" 
            class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all border-b border-slate-50 dark:border-slate-800 last:border-0"
          >
            <!-- Name & Group -->
            <td class="px-4 py-2.5">
              <div 
                class="flex items-center gap-3 cursor-pointer group/name" 
                @click="$emit('view-history', data.id)"
              >
                <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0 transition-all group-hover/name:bg-emerald-500 group-hover/name:text-white hidden xs:flex">
                  <i class="pi pi-user text-sm"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[14px] font-black text-slate-800 dark:text-slate-200 tracking-tight group-hover/name:text-emerald-500 transition-colors truncate">{{ data.name }}</p>
                  <div class="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span v-if="data.group_name" class="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-[10px] font-black text-amber-600 dark:text-amber-400 tracking-widest border border-amber-500/20 truncate">
                      {{ data.group_name }}
                    </span>
                    <span class="sm:hidden text-[12px] text-slate-400 font-medium truncate">{{ data.phone }}</span>
                  </div>
                  <!-- Reminder info -->
                  <div 
                    v-if="getReminderStatus(data.debt_reminder_date, data.debt_balance)" 
                    class="flex items-center gap-1 mt-1 text-[11px]"
                    :class="getReminderStatus(data.debt_reminder_date, data.debt_balance).class"
                  >
                    <i class="pi pi-calendar text-[10px]" />
                    <span>{{ $t('customers.table.reminder') }}: {{ getReminderStatus(data.debt_reminder_date, data.debt_balance).text }}</span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Contact & Address -->
            <td class="px-4 py-2.5 hidden sm:table-cell">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <i class="pi pi-phone text-[11px] text-slate-400"></i>
                  <span class="text-[13px] font-semibold tracking-tight">{{ data.phone }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <i class="pi pi-map-marker text-[11px]"></i>
                  <span class="text-[12px] font-medium truncate max-w-[180px]">{{ data.address || '—' }}</span>
                </div>
                <div v-if="data.created_on" class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400/70 tracking-wider">
                  <i class="pi pi-calendar text-[10px]"></i>
                  {{ data.created_on }}
                </div>
              </div>
            </td>

            <!-- Status & Trades -->
            <td class="px-4 py-2.5 text-center hidden md:table-cell">
              <div class="flex flex-col items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest"
                      :class="data.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'">
                  {{ data.status_display || data.status }}
                </span>
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-[13px] font-black text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  {{ data.total_purchases_count || 0 }}
                </span>
              </div>
            </td>

            <!-- Total Spent / Debt Balance -->
            <td class="px-4 py-2.5 text-right sm:text-left">
              <div class="flex flex-col">
                <span 
                  class="text-[14px] font-black tracking-tighter"
                  :class="isDebtorsMode ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'"
                >
                  {{ formatCurrency(isDebtorsMode ? data.debt_balance : data.total_purchases_amount) }}
                </span>
                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  {{ isDebtorsMode ? ($t('customers.table.debt_status') || 'To\'lanmagan') : $t('customers.table.total_spent_label') }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-4 py-4 text-right">
              <div class="flex justify-end gap-1 transition-opacity">
                <button
                  @click="emit('edit', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                >
                  <i class="pi pi-pencil text-[12px]"></i>
                </button>
                <button
                  @click="emit('delete', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                >
                  <i class="pi pi-trash text-[12px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalRecords > 0" 
         class="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-[11px] font-black text-slate-400 tracking-widest uppercase">
        {{ (currentPage-1)*pageSize + 1 }} - {{ Math.min(currentPage*pageSize, totalRecords) }} / {{ totalRecords }}
      </div>
      <div class="flex items-center gap-1.5">
        <button @click="currentPage--" :disabled="currentPage === 1"
                class="w-9 h-9 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-90">
          <i class="pi pi-angle-left text-[12px]"></i>
        </button>
        
        <div class="flex items-center gap-1.5">
          <template v-for="p in displayedPages" :key="p">
            <button @click="currentPage = p"
                    class="w-9 h-9 rounded-xl text-[13px] font-black transition-all shadow-sm border focus:outline-none active:scale-90"
                    :class="currentPage === p 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
              {{ p }}
            </button>
          </template>
        </div>

        <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="w-9 h-9 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-90">
          <i class="pi pi-angle-right text-[12px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  customers: { type: Array, default: () => [] },
  loading: Boolean,
  totalRecords: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  mode: { type: String, default: 'no_debt' }
})

const emit = defineEmits(['edit', 'delete', 'view-history', 'update:page', 'page-change'])

const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
    emit('page-change')
  }
})

const isDebtorsMode = computed(() => props.mode === 'debtors' || props.mode.startsWith('reminder_'))

const totalPages = computed(() => Math.ceil(props.totalRecords / props.pageSize))

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (currentPage.value <= 3) return [1, 2, 3, 4, 5]
  if (currentPage.value >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2]
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'currency', 
    currency: 'UZS', 
    maximumFractionDigits: 0 
  }).format(val || 0)
}

const getReminderStatus = (reminderDateStr, debtBalance) => {
  if (!reminderDateStr || Number(debtBalance) <= 0) return null

  const reminderDate = new Date(reminderDateStr)
  reminderDate.setHours(0,0,0,0)
  
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const diffTime = today.getTime() - reminderDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const parts = reminderDateStr.split('-')
  const formattedDate = parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : reminderDateStr

  if (diffDays > 0) {
    return {
      text: `${formattedDate} (${t('customers.table.days_overdue', { days: diffDays })})`,
      class: 'text-rose-600 dark:text-rose-400 font-bold'
    }
  } else if (diffDays === 0) {
    return {
      text: `${formattedDate} (${t('customers.table.contact_today')})`,
      class: 'text-amber-600 dark:text-amber-400 font-bold animate-pulse'
    }
  } else {
    return {
      text: `${formattedDate} (${t('customers.table.days_left', { days: Math.abs(diffDays) })})`,
      class: 'text-sky-600 dark:text-sky-400 font-semibold'
    }
  }
}
</script>



