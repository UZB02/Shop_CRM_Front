import { ref } from 'vue'
import { expensesAPI, expenseCategoriesAPI, reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

export default function useExpenses() {
    const toast = useToast()

    const expenses = ref([])
    const categories = ref([])
    const loading = ref(false)
    const summaryData = ref({ totalExpenses: 0, summary: [] })

    const filters = ref({
        branch: null,
        category: null,
        smena: null,
        date_from: null,
        date_to: null,
        date: null
    })

    // ─── Category CRUD ──────────────────────────────────────────────────────────

    const fetchCategories = async (status = 'active') => {
        try {
            const res = await expenseCategoriesAPI.getAll({ status })
            categories.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const createCategory = async (data) => {
        try {
            await expenseCategoriesAPI.create(data)
            toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya yaratildi', life: 3000 })
            await fetchCategories('active')
            return true
        } catch (error) {
            const detail = error.response?.data?.name?.[0] || error.response?.data?.detail || 'Kategoriya yaratishda xatolik'
            toast.add({ severity: 'error', summary: 'Xatolik', detail, life: 4000 })
            return false
        }
    }

    const updateCategory = async (id, data) => {
        try {
            await expenseCategoriesAPI.update(id, data)
            toast.add({ severity: 'success', summary: 'Yangilandi', detail: 'Kategoriya yangilandi', life: 3000 })
            await fetchCategories('active')
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || 'Yangilashda xatolik'
            toast.add({ severity: 'error', summary: 'Xatolik', detail, life: 4000 })
            return false
        }
    }

    // DELETE = soft delete (backend nofaol qiladi)
    const deleteCategory = async (id) => {
        try {
            await expenseCategoriesAPI.delete(id)
            toast.add({ severity: 'success', summary: 'Nofaol qilindi', detail: 'Kategoriya nofaol qilindi', life: 3000 })
            await fetchCategories('active')
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || "O'chirishda xatolik"
            toast.add({ severity: 'error', summary: 'Xatolik', detail, life: 4000 })
            return false
        }
    }

    // ─── Expense CRUD ───────────────────────────────────────────────────────────

    const fetchExpenses = async () => {
        loading.value = true
        try {
            const res = await expensesAPI.getAll(filters.value)
            expenses.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])

            // Financial report for stats cards
            const reportRes = await reportsAPI.getFinancialReport(filters.value)
            const report = reportRes.data
            summaryData.value = {
                totalExpenses: parseFloat(report.expenses?.total || 0),
                summary: report.expenses?.items || []
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xarajatlarni yuklashda xatolik yuz berdi', life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const saveExpense = async (data) => {
        // FormData uchun id ni to'g'ri olish
        const id = data instanceof FormData ? data.get('id') : data.id
        const isUpdate = !!id
        try {
            if (isUpdate) {
                await expensesAPI.update(id, data)
            } else {
                await expensesAPI.create(data)
            }
            toast.add({
                severity: 'success',
                summary: 'Muvaffaqiyatli',
                detail: isUpdate ? 'Xarajat yangilandi' : 'Xarajat saqlandi',
                life: 3000
            })
            await fetchExpenses()
            return true
        } catch (error) {
            console.error('Error saving expense:', error)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 3000 })
            return false
        }
    }

    const deleteExpense = async (id) => {
        try {
            await expensesAPI.delete(id)
            toast.add({ severity: 'success', summary: "O'chirildi", detail: "Xarajat muvaffaqiyatli o'chirildi", life: 3000 })
            await fetchExpenses()
            return true
        } catch (error) {
            console.error('Error deleting expense:', error)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'chirishda xatolik yuz berdi", life: 3000 })
            return false
        }
    }

    const exportExpenses = async (format = 'excel') => {
        try {
            const res = await reportsAPI.exportExpenses({ ...filters.value, format })
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `xarajatlar_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export error:', error)
            toast.add({ severity: 'error', summary: 'Eksportda xatolik', detail: 'Faylni tayyorlashda texnik xatolik yuz berdi', life: 3000 })
        }
    }

    return {
        expenses,
        categories,
        loading,
        summaryData,
        filters,
        // Category
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        // Expense
        fetchExpenses,
        saveExpense,
        deleteExpense,
        exportExpenses
    }
}
