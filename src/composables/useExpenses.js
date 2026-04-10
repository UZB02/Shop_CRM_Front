import { ref } from 'vue'
import { expensesAPI, expenseCategoriesAPI, reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/store/auth'

export default function useExpenses() {
    const toast = useToast()
    const authStore = useAuthStore()

    const expenses = ref([])
    const categories = ref([])
    const loading = ref(false)
    const summaryData = ref({ totalExpenses: 0, summary: [] })

    // List endpoint accepts: branch, category, smena, date (YYYY-MM-DD — single date)
    const filters = ref({
        branch: null,
        category: null,
        smena: null,
        date: null
    })

    // Export uses separate date range params (only for export endpoints)
    const exportFilters = ref({
        date_from: null,
        date_to: null
    })

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const isManager = () => {
        const user = authStore.user
        if (!user) return false
        return (
            user.is_owner ||
            user.is_superuser ||
            user.is_staff ||
            ['owner', 'manager'].includes((user.role || user.worker?.role || '').toLowerCase())
        )
    }

    // ─── Category CRUD ──────────────────────────────────────────────────────────

    const fetchCategories = async (status = 'active') => {
        try {
            const res = await expenseCategoriesAPI.getAll({ status })
            categories.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
        } catch {
            // Silent fail — categories not critical for basic page load
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
            // List endpoint params: branch, category, smena, date (single date)
            const params = {}
            if (filters.value.branch) params.branch = filters.value.branch
            if (filters.value.category) params.category = filters.value.category
            if (filters.value.smena) params.smena = filters.value.smena
            if (filters.value.date) params.date = filters.value.date

            const res = await expensesAPI.getAll(params)
            expenses.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])

            // Financial report is Manager+ only — silently skip for sellers
            if (isManager()) {
                try {
                    const reportParams = {}
                    if (exportFilters.value.date_from) reportParams.date_from = exportFilters.value.date_from
                    if (exportFilters.value.date_to) reportParams.date_to = exportFilters.value.date_to
                    if (filters.value.branch) reportParams.branch = filters.value.branch

                    const reportRes = await reportsAPI.getFinancialReport(reportParams)
                    const report = reportRes.data
                    summaryData.value = {
                        totalExpenses: parseFloat(report.expenses?.total || 0),
                        summary: report.expenses?.items || []
                    }
                } catch {
                    // Financial report failed silently — stats cards will show 0
                }
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            toast.add({
                severity: 'error',
                summary: 'Xatolik',
                detail: 'Xarajatlarni yuklashda xatolik yuz berdi',
                life: 3000
            })
        } finally {
            loading.value = false
        }
    }

    const saveExpense = async (data) => {
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
            const detail = error.response?.data?.detail || error.response?.data?.amount?.[0] || 'Saqlashda xatolik yuz berdi'
            toast.add({ severity: 'error', summary: 'Xatolik', detail, life: 3000 })
            return false
        }
    }

    const deleteExpense = async (id) => {
        try {
            await expensesAPI.delete(id)
            toast.add({ severity: 'success', summary: "O'chirildi", detail: "Xarajat o'chirildi", life: 3000 })
            await fetchExpenses()
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || "O'chirishda xatolik"
            toast.add({ severity: 'error', summary: 'Xatolik', detail, life: 3000 })
            return false
        }
    }

    // Export uses date_from/date_to (range) — separate from list filters
    const exportExpenses = async (format = 'excel') => {
        try {
            const params = { format }
            if (exportFilters.value.date_from) params.date_from = exportFilters.value.date_from
            if (exportFilters.value.date_to) params.date_to = exportFilters.value.date_to
            if (filters.value.branch) params.branch = filters.value.branch
            if (filters.value.category) params.category = filters.value.category

            const res = await reportsAPI.exportExpenses(params)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `xarajatlar_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            const status = error.response?.status
            const detail = status === 403
                ? 'Export uchun obuna talab qilinadi'
                : 'Faylni tayyorlashda xatolik yuz berdi'
            toast.add({ severity: 'error', summary: 'Eksport xatoligi', detail, life: 4000 })
        }
    }

    return {
        expenses,
        categories,
        loading,
        summaryData,
        filters,
        exportFilters,
        isManager,
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
