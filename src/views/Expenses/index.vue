<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Xarajatlar Boshqaruvi</h1>
        <p class="text-slate-500 text-sm mt-1">Barcha korxona xarajatlarini kuzatib boring</p>
      </div>
      <Button label="Xarajat qo'shish" icon="pi pi-plus" severity="danger" class="shadow-sm" @click="openNew" />
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <Card class="bg-rose-50 border-rose-100 dark:bg-rose-950/20 border-none shadow-sm">
         <template #content>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600">
                    <i class="pi pi-wallet text-xl"></i>
                </div>
                <div>
                   <p class="text-sm text-rose-600 font-medium">Shu oydagi xarajat</p>
                   <h3 v-if="loading" class="mt-1"><Skeleton width="8rem" height="1.5rem" /></h3>
                   <h3 v-else class="text-2xl font-bold text-rose-700 mt-1">{{ formatCurrency(summaryData.totalExpenses) }}</h3>
                </div>
            </div>
         </template>
       </Card>

       <Card class="bg-amber-50 border-amber-100 dark:bg-amber-950/20 border-none shadow-sm">
         <template #content>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600">
                    <i class="pi pi-chart-pie text-xl"></i>
                </div>
                <div>
                   <p class="text-sm text-amber-600 font-medium">Top kategoriya</p>
                   <h3 v-if="loading" class="mt-1"><Skeleton width="6rem" height="1.5rem" /></h3>
                   <h3 v-else class="text-2xl font-bold text-amber-700 mt-1">{{ topCategory || 'Mavjud emas' }}</h3>
                </div>
            </div>
         </template>
       </Card>

       <Card class="bg-sky-50 border-sky-100 dark:bg-sky-950/20 border-none shadow-sm">
         <template #content>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600">
                    <i class="pi pi-calendar text-xl"></i>
                </div>
                <div>
                   <p class="text-sm text-sky-600 font-medium">Oxirgi xarajat</p>
                   <h3 v-if="loading" class="mt-1"><Skeleton width="7rem" height="1.5rem" /></h3>
                   <h3 v-else class="text-lg font-bold text-sky-700 mt-1">{{ lastExpenseDate }}</h3>
                </div>
            </div>
         </template>
       </Card>
    </div>

    <!-- Expenses Table Component -->
    <ExpenseTable 
        :expenses="expenses" 
        :loading="loading" 
        @edit="editExpense" 
        @delete="confirmDelete" 
    />

    <!-- Expense Dialog Component -->
    <ExpenseDialog 
        v-model:visible="expenseDialog"
        :expense="expense"
        :categories="categories"
        :saving="saving"
        :submitted="submitted"
        @save="saveExpense"
        @hide="hideDialog"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { expensesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import ConfirmDialog from 'primevue/confirmdialog'

import ExpenseTable from './components/ExpenseTable.vue'
import ExpenseDialog from './components/ExpenseDialog.vue'

const toast = useToast()
const confirm = useConfirm()

const expenses = ref([])
const summaryData = ref({ totalExpenses: 0, summary: [] })
const loading = ref(false)
const saving = ref(false)
const expenseDialog = ref(false)
const submitted = ref(false)

const expense = ref({
    name: '',
    category: 'Boshqa',
    amount: null,
    date: new Date(),
    seller: '',
    description: ''
})

const categories = ['Ijara', 'Kommunal', 'Soliq', 'Maosh', 'Transport', 'Marketing', 'Boshqa']

const topCategory = computed(() => {
    if (!summaryData.value.summary || summaryData.value.summary.length === 0) return null
    return summaryData.value.summary[0]._id
})

const lastExpenseDate = computed(() => {
    if (!expenses.value || expenses.value.length === 0) return '-'
    const date = new Date(expenses.value[0].date)
    return date.toLocaleDateString('uz-UZ')
})

const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
}

const loadData = async () => {
    loading.value = true
    try {
        const [expensesRes, summaryRes] = await Promise.all([
            expensesAPI.getAll(),
            expensesAPI.getSummary()
        ])
        expenses.value = expensesRes.data.expenses || expensesRes.data
        summaryData.value = summaryRes.data
    } catch (error) {
        console.error('Error loading expenses:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ma\'lumotlarni yuklashda xatolik yuz berdi', life: 3000 })
    } finally {
        loading.value = false
    }
}

const openNew = () => {
    expense.value = {
        name: '',
        category: 'Boshqa',
        amount: null,
        date: new Date(),
        seller: 'Admin',
        description: ''
    }
    submitted.value = false
    expenseDialog.value = true
}

const hideDialog = () => {
    expenseDialog.value = false
    submitted.value = false
}

const editExpense = (data) => {
    expense.value = { ...data, date: new Date(data.date) }
    expenseDialog.value = true
}

const saveExpense = async () => {
    submitted.value = true
    if (!expense.value.name?.trim() || !expense.value.amount) return

    saving.value = true
    try {
        if (expense.value._id) {
            await expensesAPI.update(expense.value._id, expense.value)
            toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Xarajat yangilandi', life: 3000 })
        } else {
            await expensesAPI.create(expense.value)
            toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangi xarajat saqlandi', life: 3000 })
        }
        expenseDialog.value = false
        loadData()
    } catch (error) {
        console.error('Error saving expense:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 5000 })
    } finally {
        saving.value = false
    }
}

const confirmDelete = (data) => {
    confirm.require({
        message: `"${data.name}" xarajatini o'chirishni tasdiqlaysizmi?`,
        header: 'Tasdiqlash',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await expensesAPI.delete(data._id)
                toast.add({ severity: 'success', summary: 'O\'chirildi', detail: 'Xarajat muvaffaqiyatli o\'chirildi', life: 3000 })
                loadData()
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 3000 })
            }
        }
    })
}

onMounted(() => {
    loadData()
})
</script>
