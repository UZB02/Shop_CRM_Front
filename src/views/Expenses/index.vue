<template>
  <div class="space-y-4">

    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1">
            <i class="pi pi-home text-[9px]"></i>
            {{ $t('common.back') }}
          </router-link>
          <i class="pi pi-chevron-right text-[8px] text-slate-300 dark:text-slate-600"></i>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{{ $t('expenses.title') }}</span>
        </div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('expenses.management') }}</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ $t('expenses.all_records', { count: expenses.length }) }}</p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <!-- Kategoriyalar: Manager+ -->
        <button
          v-if="userIsManager"
          @click="showCategories = true"
          class="flex-1 sm:flex-initial h-9 sm:h-8 px-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm"
        >
          <i class="pi pi-briefcase text-[10px]"></i>
          {{ $t('expenses.categories') }}
        </button>
        <!-- Xarajat qo'shish: barcha ruxsatli xodimlar -->
        <button
          @click="openNew"
          class="flex-1 sm:flex-initial h-9 sm:h-8 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-lg shadow-rose-500/20 active:scale-95"
        >
          <i class="pi pi-plus text-[10px]"></i>
          {{ $t('expenses.add') }}
        </button>
      </div>
    </div>

    <!-- ── Stats ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Total (Manager+ uchun financial report dan, boshqalar uchun local hisob) -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div class="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-500/20 shrink-0">
          <i class="pi pi-wallet text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('expenses.total_monthly') }}</p>
          <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            <span v-if="loading" class="inline-block w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></span>
            <span v-else>{{ formatCurrency(totalFromList) }}</span>
          </p>
        </div>
      </div>

      <!-- Top Category -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div class="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-500/20 shrink-0">
          <i class="pi pi-chart-pie text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('expenses.top_category') }}</p>
          <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            <span v-if="loading" class="inline-block w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></span>
            <span v-else>{{ topCategoryName || '—' }}</span>
          </p>
        </div>
      </div>

      <!-- Last Expense Date -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div class="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-100 dark:border-sky-500/20 shrink-0">
          <i class="pi pi-calendar text-sm"></i>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('expenses.last_expense') }}</p>
          <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            <span v-if="loading" class="inline-block w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></span>
            <span v-else>{{ lastExpenseDate }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Sana filter -->
        <div class="relative flex-1 min-w-[140px] sm:flex-none sm:w-44">
          <DatePicker
            v-model="filters.date"
            dateFormat="yy-mm-dd"
            :placeholder="$t('common.date')"
            showIcon
            iconDisplay="input"
            class="w-full"
            pt:root:class="!h-9 sm:!h-8 !rounded-xl !border !border-slate-200 dark:!border-slate-700 focus-within:!border-rose-400 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
            pt:input:class="!bg-transparent !border-none !shadow-none !text-xs !font-bold !pl-9 !h-full"
          />
        </div>

        <!-- Kategoriya -->
        <div class="relative flex-1 min-w-[160px] sm:flex-none sm:w-56">
          <Select
            v-model="filters.category"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('categories.all')"
            showClear
            class="w-full"
            pt:root:class="!h-9 sm:!h-8 !rounded-xl !border !border-slate-200 dark:!border-slate-700 focus:!border-rose-400 !bg-slate-50/50 dark:!bg-slate-800/40"
            pt:label:class="!text-xs !font-bold !flex !items-center !py-0 !px-3"
          />
        </div>

        <!-- Qidirish tugmasi olib tashlandi, filtrlar avtomatik ishlaydi -->

        <!-- Filtrni tozalash -->
        <button
          v-if="filters.date || filters.category"
          @click="clearFilters"
          class="h-9 sm:h-8 w-9 sm:w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all active:scale-95"
          title="Filtrni tozalash"
        >
          <i class="pi pi-times text-[10px]"></i>
        </button>

        <div class="flex-1"></div>

        <!-- Advanced toggle -->
        <button
          @click="showExportOptions = !showExportOptions"
          class="h-9 sm:h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          :class="showExportOptions ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'"
        >
          <i class="pi pi-sliders-h text-[10px]"></i>
          {{ showExportOptions ? $t('common.close') : $t('reports.title') }}
        </button>
      </div>

      <!-- Export options panel -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showExportOptions" class="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1 hidden sm:inline">{{ $t('reports.title') }}:</span>
            <div class="flex items-center gap-2 flex-1 sm:flex-none">
              <DatePicker
                v-model="exportFilters.date_from"
                dateFormat="yy-mm-dd"
                :placeholder="$t('common.date_from')"
                class="flex-1 sm:w-32"
                pt:root:class="!h-8 !rounded-lg !border !border-slate-200 dark:!border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-bold !h-full"
              />
              <span class="text-slate-300 dark:text-slate-600">—</span>
              <DatePicker
                v-model="exportFilters.date_to"
                dateFormat="yy-mm-dd"
                :placeholder="$t('common.date_to')"
                class="flex-1 sm:w-32"
                pt:root:class="!h-8 !rounded-lg !border !border-slate-200 dark:!border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                pt:input:class="!bg-transparent !border-none !shadow-none !text-[10px] !font-bold !h-full"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button
              @click="exportExpenses('excel')"
              class="flex-1 sm:flex-none h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <i class="pi pi-file-excel text-[10px]"></i>
              Excel
            </button>
            <button
              @click="exportExpenses('pdf')"
              class="flex-1 sm:flex-none h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <i class="pi pi-file-pdf text-[10px]"></i>
              PDF
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── Table ──────────────────────────────────────────────── -->
    <ExpenseTable
      :expenses="expenses"
      :loading="loading"
      :is-manager="userIsManager"
      @view="viewExpense"
      @edit="editExpense"
      @delete="confirmDelete"
    />

    <!-- ── Category Modal (Manager+) ─────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCategories" @click="showCategories = false" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="showCategories" class="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto max-h-[92vh] sm:max-h-[85vh] overflow-hidden transition-all duration-300">
            <!-- Modal Header -->
            <div class="px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h3 class="text-xs sm:text-sm font-black uppercase tracking-widest text-rose-500">{{ $t('expenses.categories') }}</h3>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{{ $t('expenses.management') }}</p>
              </div>
              <button
                @click="showCategories = false"
                class="w-9 h-9 sm:w-8 sm:h-8 rounded-xl sm:rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </div>
            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <CategoryList :is-manager="userIsManager" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Expense Dialog ─────────────────────────────────────── -->
    <ExpenseDialog
      v-model:visible="expenseDialog"
      :expense="expense"
      :categories="categories"
      :branches="branches"
      :saving="saving"
      :submitted="submitted"
      @save="handleSave"
      @hide="hideDialog"
    />

    <!-- ── Expense Detail Modal ───────────────────────────────── -->
    <ExpenseDetailModal
      v-model:visible="detailVisible"
      :expense="expense"
      :is-manager="userIsManager"
      @edit="onEditFromDetail"
    />

    <ConfirmDialog pt:root:class="!rounded-2xl !border-none !shadow-2xl !bg-white dark:!bg-slate-900" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'

import useExpenses from '@/composables/useExpenses'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import ExpenseTable from './components/ExpenseTable.vue'
import ExpenseDialog from './components/ExpenseDialog.vue'
import ExpenseDetailModal from './components/ExpenseDetailModal.vue'
import CategoryList from './components/CategoryList.vue'

const confirm = useConfirm()

const {
  expenses,
  categories,
  branches,
  loading,
  filters,
  exportFilters,
  isManager,
  fetchCategories,
  fetchExpenses,
  getExpenseById,
  saveExpense,
  deleteExpense,
  exportExpenses,
  fetchBranches
} = useExpenses()

const userIsManager = computed(() => isManager())

const expenseDialog = ref(false)
const detailVisible = ref(false)
const showCategories = ref(false)
const showExportOptions = ref(false)
const saving = ref(false)
const submitted = ref(false)

const expense = ref({
  category: null,
  branch: null,
  amount: null,
  date: new Date().toISOString().split('T')[0],
  description: '',
  receipt_image: null
})

// Jami summa — list dan hisoblangan (barcha rollar uchun ishlaydi)
const totalFromList = computed(() =>
  expenses.value.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
)

const topCategoryName = computed(() => {
  if (!expenses.value.length) return null
  const counts = {}
  expenses.value.forEach(e => {
    counts[e.category_name] = (counts[e.category_name] || 0) + parseFloat(e.amount || 0)
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
})

const lastExpenseDate = computed(() => {
  if (!expenses.value.length) return '—'
  const latest = [...expenses.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  return new Date(latest.date).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const formatCurrency = (val) =>
  new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const clearFilters = () => {
  filters.value.date = null
  filters.value.category = null
}

const openNew = () => {
  expense.value = {
    category: null,
    branch: null,
    amount: null,
    date: new Date().toISOString().split('T')[0],
    description: '',
    receipt_image: null
  }
  submitted.value = false
  expenseDialog.value = true
}

const hideDialog = () => {
  expenseDialog.value = false
  submitted.value = false
}

const viewExpense = async (data) => {
  loading.value = true
  const detail = await getExpenseById(data.id)
  loading.value = false
  
  if (detail) {
    expense.value = {
      ...detail,
      category: detail.category_id,
      branch: detail.branch_id,
      date: detail.date
    }
    detailVisible.value = true
  }
}

const onEditFromDetail = (data) => {
  detailVisible.value = false
  setTimeout(() => {
    expenseDialog.value = true
  }, 300)
}

const editExpense = async (data) => {
  loading.value = true
  const detail = await getExpenseById(data.id)
  loading.value = false
  
  if (detail) {
    expense.value = {
      ...detail,
      category: detail.category_id,
      branch: detail.branch_id,
      date: detail.date
    }
    expenseDialog.value = true
  }
}

const handleSave = async (payload) => {
  submitted.value = true
  const cat = payload instanceof FormData ? payload.get('category') : payload.category
  const amt = payload instanceof FormData ? payload.get('amount') : payload.amount
  if (!cat || !amt) return

  saving.value = true
  const success = await saveExpense(payload)
  if (success) expenseDialog.value = false
  saving.value = false
}

const confirmDelete = (data) => {
  confirm.require({
    message: t('expenses.delete_msg'),
    header: t('common.confirm_title'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteExpense(data.id)
  })
}

const formatDateToString = (date) => {
  if (!date || typeof date === 'string') return date
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

watch(filters, () => {
  if (filters.value.date instanceof Date) {
    filters.value.date = formatDateToString(filters.value.date)
    return
  }
  fetchExpenses()
}, { deep: true })

watch(exportFilters, () => {
  if (exportFilters.value.date_from instanceof Date) {
    exportFilters.value.date_from = formatDateToString(exportFilters.value.date_from)
  }
  if (exportFilters.value.date_to instanceof Date) {
    exportFilters.value.date_to = formatDateToString(exportFilters.value.date_to)
  }
}, { deep: true })

onMounted(() => {
  fetchCategories()
  fetchExpenses()
  if (userIsManager.value) {
    fetchBranches()
  }
})
</script>

<style scoped>
:deep(.p-datepicker-input),
:deep(.p-select-label) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-datepicker),
:deep(.p-select) {
  background: transparent !important;
}

/* Ensure dark mode colors are correct for internal components */
.dark :deep(.p-datepicker-input),
.dark :deep(.p-select-label) {
  color: #e2e8f0 !important; /* slate-200 */
}
</style>
