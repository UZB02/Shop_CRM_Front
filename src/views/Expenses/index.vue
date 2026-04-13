<template>
  <div class="space-y-4">
    <!-- ── Header ─────────────────────────────────────────────── -->
    <ExpenseHeader 
      :is-manager="userIsManager" 
      @manage-categories="showCategories = true"
      @add-expense="openNew"
    />

    <!-- ── Tab Navigation ────────────────────────────────────── -->
    <ExpenseTabs 
      v-model="activeTab" 
      :tabs="tabs" 
    />

    <!-- ── Global Filters & Export (Visible for all tabs) ────── -->
    <ExpenseFilters 
      v-if="activeTab !== 'profit-loss' && (activeTab === 'expenses' || userIsManager)"
      :filters="filters"
      :export-filters="exportFilters"
      :categories="categories"
      :shifts="shifts"
      :is-manager="userIsManager"
      @clear="clearFilters"
      @export="exportExpenses"
      @export-wastage="exportWastages"
    />

    <!-- ── Profit & Loss Specialized Filters ────────────────── -->
    <ProfitLossFilters
      v-if="activeTab === 'profit-loss' && userIsManager"
      :filters="plFilters"
      :branches="branches"
      :is-manager="userIsManager"
      @refresh="refreshData"
    />

    <!-- ── Tab Content: Expenses ────────────────────────────── -->
    <div v-show="activeTab === 'expenses'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ExpenseTabStats 
        :loading="loading"
        :is-manager="userIsManager"
        :summary-data="summaryData"
        :total-from-list="totalFromList"
        :top-category-name="topCategoryName"
        :last-expense-date="lastExpenseDate"
        @view-report="showExportOptions = true"
      />

    <!-- ── Table ──────────────────────────────────────────────── -->
      <ExpenseTable
        :expenses="expenses"
        :loading="loading"
        :is-manager="userIsManager"
        @view="viewExpense"
        @edit="editExpense"
        @delete="confirmDelete"
      />
    </div>

    <!-- ── Tab Content: Other Reports ─────────────────────────── -->
    <div v-if="activeTab !== 'expenses'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <!-- Profit & Loss -->
        <div v-if="activeTab === 'profit-loss'" class="space-y-4">
           <ProfitLossReport :monthly-data="monthlyReport" />
        </div>

        <!-- Debtors -->
        <div v-if="activeTab === 'debtors'" class="space-y-4">
           <DebtorReport :data="debtors" />
        </div>

        <!-- Performance -->
        <div v-if="activeTab === 'performance'" class="space-y-4">
           <WorkerPerformanceReport :data="performance" />
        </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'

// Composables
import useExpenses from '@/composables/useExpenses'
import useExpenseTabLogic from './composables/useExpenseTabLogic'

// Components
import ExpenseHeader from './components/ExpenseHeader.vue'
import ExpenseTabs from './components/ExpenseTabs.vue'
import ExpenseTabStats from './components/ExpenseTabStats.vue'
import ExpenseFilters from './components/ExpenseFilters.vue'
import ExpenseTable from './components/ExpenseTable.vue'
import ExpenseDialog from './components/ExpenseDialog.vue'
import ExpenseDetailModal from './components/ExpenseDetailModal.vue'
import CategoryList from './components/CategoryList.vue'
import ProfitLossFilters from './components/ProfitLossFilters.vue'
import ProfitLossReport from './components/reports/ProfitLossReport.vue'
import DebtorReport from './components/reports/DebtorReport.vue'
import WorkerPerformanceReport from './components/reports/WorkerPerformanceReport.vue'

const confirm = useConfirm()

// Root state from main composable
const {
  expenses, categories, branches, loading, filters, exportFilters,
  fetchExpenses, getExpenseById, saveExpense, deleteExpense,
  exportExpenses, exportWastages, shifts, summaryData
} = useExpenses()

// UI Logic and Reports from specialized composable
const {
  activeTab, tabs, userIsManager,
  totalFromList, topCategoryName, lastExpenseDate,
  debtors, performance, monthlyReport, refreshData,
  plFilters
} = useExpenseTabLogic()

const expenseDialog = ref(false)
const detailVisible = ref(false)
const showCategories = ref(false)
const saving = ref(false)
const submitted = ref(false)

const expense = ref({
  category: null, branch: null, amount: null,
  date: new Date().toISOString().split('T')[0],
  description: '', receipt_image: null
})

const clearFilters = () => {
  filters.value.date = null
  filters.value.category = null
  filters.value.smena = null
}

const openNew = () => {
  expense.value = {
    category: null, branch: null, amount: null,
    date: new Date().toISOString().split('T')[0],
    description: '', receipt_image: null
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
    expense.value = { ...detail, category: detail.category_id, branch: detail.branch_id, date: detail.date }
    detailVisible.value = true
  }
}

const onEditFromDetail = (data) => {
  detailVisible.value = false
  setTimeout(() => { expenseDialog.value = true }, 300)
}

const editExpense = async (data) => {
  loading.value = true
  const detail = await getExpenseById(data.id)
  loading.value = false
  if (detail) {
    expense.value = { ...detail, category: detail.category_id, branch: detail.branch_id, date: detail.date }
    expenseDialog.value = true
  }
}

const handleSave = async (payload) => {
  submitted.value = true
  const amt = payload instanceof FormData ? payload.get('amount') : payload.amount
  if (!amt) return
  saving.value = true
  if (await saveExpense(payload)) expenseDialog.value = false
  saving.value = false
}

const confirmDelete = (data) => {
  confirm.require({
    message: i18n.global.t('expenses.delete_msg'),
    header: i18n.global.t('common.confirm_title'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteExpense(data.id)
  })
}

onMounted(refreshData)
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
