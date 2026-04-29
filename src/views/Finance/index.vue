<template>
  <div class="space-y-4">
    <!-- ── Header ─────────────────────────────────────────────── -->
    <ExpenseHeader 
      :is-manager="userIsManager" 
      :loading="loading"
      @manage-categories="showCategories = true"
      @add-expense="openNew"
    />

    <!-- ── Stats & Tabs Component ────────────────────────────── -->
    <MinimalFinanceStatsTabs 
      :tabs="tabs"
      v-model="activeTab"
       :netProfit="netProfit"
       :showSummary="userIsManager"
    />

    <!-- ── Common Filters ────────────────────────────────────── -->
    <ExpenseFilters 
      :filters="crudFilters"
      :export-filters="exportFilters"
      :categories="dynamicCategories"
      :shifts="shifts"
      :is-manager="userIsManager"
      :active-tab="activeTab"
      @clear="refreshData"
      @export="exportExpenses"
      @export-wastage="exportWastages"
    />

    <!-- ── Tab Content: Expenses (Original + Analytics) ─────── -->
    <div v-if="activeTab === 'expenses'" class="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <FinanceExpensesReport 
        :data="reports.expenses" 
        :expenses="expenseList"
        :loading="loading"
        :is-manager="userIsManager"
        @view="viewExpense"
        @edit="editExpense"
        @delete="confirmDelete"
      />
    </div>

    <!-- ── Tab Content: Revenue ──────────────────────────────── -->

    <!-- ── Tab Content: Revenue ──────────────────────────────── -->
    <div v-else-if="activeTab === 'revenue'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <RevenueReport :data="reports.revenue" />
    </div>

    <!-- ── Tab Content: Payments ─────────────────────────────── -->
    <div v-else-if="activeTab === 'payments'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <PaymentMethodsReport :data="reports.payments" :active-method="reportsFilters.payment_method" />
    </div>

    <!-- ── Tab Content: Profitability ────────────────────────── -->
    <div v-else-if="activeTab === 'profitability'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <ProfitabilityReport :data="reports.profitability" />
    </div>

    <!-- ── Tab Content: Profit & Loss ────────────────────────── -->
    <div v-else-if="activeTab === 'profit-loss'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <ProfitLossReport :data="reports.profitLoss" />
    </div>

    <!-- ── Tab Content: Debtors ──────────────────────────────── -->
    <div v-else-if="activeTab === 'debtors'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
       <DebtorReport :data="reports.debtors" />
    </div>

    <!-- ── Shared Modals ─────────────────────────────────────── -->
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
          <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto max-h-[92vh] sm:max-h-[85vh] overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black uppercase tracking-widest text-rose-500">{{ $t('finance.categories') }}</h3>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{{ $t('finance.management') }}</p>
              </div>
              <button @click="showCategories = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <CategoryList :is-manager="userIsManager" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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

    <ExpenseDetailModal
      v-model:visible="detailVisible"
      :expense="expense"
      :is-manager="userIsManager"
      @edit="onEditFromDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import i18n from '@/i18n'

// Composables
import useExpenses from '@/composables/useExpenses'
import useExpenseTabLogic from './composables/useExpenseTabLogic'

// Components (Layout & CRUD)
import ExpenseHeader from './components/ExpenseHeader.vue'
import MinimalFinanceStatsTabs from './components/MinimalFinanceStatsTabs.vue'
import ExpenseFilters from './components/ExpenseFilters.vue'
import ExpenseTable from './components/ExpenseTable.vue'
import ExpenseDialog from './components/ExpenseDialog.vue'
import ExpenseDetailModal from './components/ExpenseDetailModal.vue'
import CategoryList from './components/CategoryList.vue'

// Components (Analytical Reports)
import RevenueReport from './components/reports/RevenueReport.vue'
import PaymentMethodsReport from './components/reports/PaymentMethodsReport.vue'
import ProfitabilityReport from './components/reports/ProfitabilityReport.vue'
import ProfitLossReport from './components/reports/ProfitLossReport.vue'
import FinanceExpensesReport from './components/reports/FinanceExpensesReport.vue'
import DebtorReport from './components/reports/DebtorReport.vue'

const confirm = useConfirm()

const {
  activeTab, tabs, userIsManager,
  loading, reports, refreshData,
  branches, categories, shifts,
  expenseList, crudFilters, exportFilters,
  reportsFilters, dynamicCategories,
  netProfit
} = useExpenseTabLogic()

// Local state for CRUD operations
const { getExpenseById, saveExpense, deleteExpense, exportExpenses, exportWastages } = useExpenses()

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
  const detail = await getExpenseById(data.id)
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
  const detail = await getExpenseById(data.id)
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
  if (await saveExpense(payload)) {
      expenseDialog.value = false
      refreshData()
  }
  saving.value = false
}

const confirmDelete = (data) => {
  confirm.require({
    message: i18n.global.t('finance.delete_msg'),
    header: i18n.global.t('common.confirm_title'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
        if (await deleteExpense(data.id)) refreshData()
    }
  })
}

onMounted(refreshData)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
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
</style>
