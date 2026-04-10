<template>
  <div class="space-y-4">

    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-1.5 mb-1">
          <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1">
            <i class="pi pi-home text-[9px]"></i>
            Bosh sahifa
          </router-link>
          <i class="pi pi-chevron-right text-[8px] text-slate-300 dark:text-slate-600"></i>
          <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Xarajatlar</span>
        </div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">Xarajatlar boshqaruvi</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ expenses.length }} ta xarajat yozuvi</p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Kategoriyalar: Manager+ -->
        <button
          v-if="userIsManager"
          @click="showCategories = true"
          class="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-briefcase text-[10px]"></i>
          Kategoriyalar
        </button>
        <!-- Xarajat qo'shish: barcha ruxsatli xodimlar -->
        <button
          @click="openNew"
          class="h-8 px-3 rounded-lg text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-plus text-[10px]"></i>
          Xarajat qo'shish
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
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Jami xarajat</p>
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
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Eng ko'p xarajat</p>
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
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Oxirgi xarajat</p>
          <p class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            <span v-if="loading" class="inline-block w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></span>
            <span v-else>{{ lastExpenseDate }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">

      <!-- Sana filter (list: ?date=YYYY-MM-DD) -->
      <div class="relative">
        <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
        <input
          v-model="filters.date"
          type="date"
          class="h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all w-36"
        />
      </div>

      <!-- Kategoriya -->
      <select
        v-model="filters.category"
        class="h-8 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all min-w-[160px]"
      >
        <option :value="null">Barcha kategoriyalar</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <!-- Qidirish -->
      <button
        @click="fetchExpenses"
        class="h-8 px-4 rounded-lg text-xs font-medium bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white transition-all flex items-center gap-1.5"
      >
        <i class="pi pi-search text-[10px]"></i>
        Qidirish
      </button>

      <!-- Filtrni tozalash -->
      <button
        v-if="filters.date || filters.category"
        @click="clearFilters"
        class="h-8 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        title="Filtrni tozalash"
      >
        <i class="pi pi-times text-[10px]"></i>
      </button>

      <div class="flex-1"></div>

      <!-- Export (date_from/date_to rangi faqat export uchun) -->
      <div class="flex items-center gap-2">
        <!-- Export date range (Manager+) -->
        <template v-if="userIsManager">
          <div class="relative">
            <input
              v-model="exportFilters.date_from"
              type="date"
              placeholder="dan"
              title="Export: boshlanish sanasi"
              class="h-8 px-2 text-[10px] rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-transparent text-slate-500 dark:text-slate-400 focus:outline-none focus:border-rose-400 transition-all w-32"
            />
          </div>
          <span class="text-slate-300 dark:text-slate-600 text-xs">—</span>
          <div class="relative">
            <input
              v-model="exportFilters.date_to"
              type="date"
              title="Export: tugash sanasi"
              class="h-8 px-2 text-[10px] rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-transparent text-slate-500 dark:text-slate-400 focus:outline-none focus:border-rose-400 transition-all w-32"
            />
          </div>
        </template>

        <button
          @click="exportExpenses('excel')"
          class="h-8 px-3 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all flex items-center gap-1.5"
        >
          <i class="pi pi-file-excel text-[10px]"></i>
          Excel
        </button>
        <button
          @click="exportExpenses('pdf')"
          class="h-8 px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center gap-1.5"
        >
          <i class="pi pi-file-pdf text-[10px]"></i>
          PDF
        </button>
      </div>
    </div>

    <!-- ── Table ──────────────────────────────────────────────── -->
    <ExpenseTable
      :expenses="expenses"
      :loading="loading"
      :is-manager="userIsManager"
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
        <div v-if="showCategories" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
          <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col pointer-events-auto max-h-[80vh] overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black uppercase tracking-widest text-rose-500">Xarajat kategoriyalari</h3>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Boshqaruv paneli</p>
              </div>
              <button
                @click="showCategories = false"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6">
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
      :saving="saving"
      :submitted="submitted"
      @save="handleSave"
      @hide="hideDialog"
    />

    <ConfirmDialog pt:root:class="!rounded-2xl !border-none !shadow-2xl !bg-white dark:!bg-slate-900" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'

import useExpenses from '@/composables/useExpenses'
import ExpenseTable from './components/ExpenseTable.vue'
import ExpenseDialog from './components/ExpenseDialog.vue'
import CategoryList from './components/CategoryList.vue'

const confirm = useConfirm()

const {
  expenses,
  categories,
  loading,
  filters,
  exportFilters,
  isManager,
  fetchCategories,
  fetchExpenses,
  saveExpense,
  deleteExpense,
  exportExpenses
} = useExpenses()

const userIsManager = computed(() => isManager())

const expenseDialog = ref(false)
const showCategories = ref(false)
const saving = ref(false)
const submitted = ref(false)

const expense = ref({
  category: null,
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
  fetchExpenses()
}

const openNew = () => {
  expense.value = {
    category: null,
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

const editExpense = (data) => {
  expense.value = {
    ...data,
    category: data.category_id,
    date: data.date
  }
  expenseDialog.value = true
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
    message: "Ushbu xarajatni o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.",
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteExpense(data.id)
  })
}

onMounted(() => {
  fetchCategories()
  fetchExpenses()
})
</script>
