import { ref } from 'vue'
import { expensesAPI, expenseCategoriesAPI, reportsAPI, branchesAPI, shiftsAPI } from '@/services/api'
import api from '@/services/api'
import { useToast } from 'primevue/usetoast'
import i18n from '@/i18n'
import { useAuthStore } from '@/store/auth'

// Shared state to ensure consistency across components
const expenses = ref([])
const categories = ref([])
const branches = ref([])
const shifts = ref([])
const loading = ref(false)
const summaryData = ref({ totalExpenses: 0, summary: [] })

// List endpoint accepts: branch, category, smena, date (YYYY-MM-DD — single date)
const filters = ref({
    branch: null,
    category: null,
    smena: null,
    date: null,
    search: '',
    group_by: 'day',
    year: new Date().getFullYear(),
    months: '1,2,3,4,5,6,7,8,9,10,11,12',
    min_debt: 0,
    payment_method: null,
    reason: null
})

// Export uses separate date range params (only for export endpoints)
const exportFilters = ref({
    date_from: null,
    date_to: null
})

export default function useExpenses() {
    const toast = useToast()
    const { t } = i18n.global
    const authStore = useAuthStore()

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

    const fetchCategories = async (statusArg = null) => {
        try {
            // Agar statusArg passed bo'lmasa, barchasini oladi (yoki backend defaultiga ko'ra)
            const params = {}
            if (statusArg && typeof statusArg === 'string') {
                params.status = statusArg
            }

            const res = await expenseCategoriesAPI.getAll(params)
            categories.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
        } catch {
            // Silent fail
        }
    }

    const createCategory = async (data) => {
        try {
            await expenseCategoriesAPI.create(data)
            toast.add({ severity: 'success', summary: t('common.success'), detail: t('finance.messages.category_added'), life: 3000 })
            await fetchCategories()
            return true
        } catch (error) {
            const detail = error.response?.data?.name?.[0] || error.response?.data?.detail || t('finance.messages.save_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
            return false
        }
    }

    const updateCategory = async (id, data) => {
        try {
            await expenseCategoriesAPI.update(id, data)
            toast.add({ severity: 'success', summary: t('common.updated'), detail: t('finance.messages.category_updated'), life: 3000 })
            await fetchCategories()
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || t('finance.messages.save_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
            return false
        }
    }

    const deleteCategory = async (id) => {
        try {
            await expenseCategoriesAPI.delete(id)
            toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('finance.messages.deleted'), life: 3000 })
            await fetchCategories()
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || t('finance.messages.delete_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
            return false
        }
    }

    // ─── Expense CRUD ───────────────────────────────────────────────────────────

    const fetchExpenses = async () => {
        loading.value = true
        try {
            const params = {}
            if (filters.value.branch) params.branch = filters.value.branch
            if (filters.value.category) params.category = filters.value.category
            if (filters.value.smena) params.smena = filters.value.smena

            if (filters.value.date) {
                if (Array.isArray(filters.value.date)) {
                    const [start, _] = filters.value.date
                    if (start) params.date = new Date(start).toLocaleDateString('en-CA')
                } else {
                    params.date = new Date(filters.value.date).toLocaleDateString('en-CA')
                }
            }

            if (filters.value.search) params.search = filters.value.search

            const res = await expensesAPI.getAll(params)
            expenses.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
            console.log('💸 FINANCE: Raw Expenses List:', expenses.value)

            if (isManager()) {
                try {
                    const reportParams = {}
                    if (exportFilters.value.date_from) reportParams.date_from = exportFilters.value.date_from
                    if (exportFilters.value.date_to) reportParams.date_to = exportFilters.value.date_to
                    if (filters.value.branch) reportParams.branch = filters.value.branch

                    const reportRes = await reportsAPI.getFinancialReport(reportParams)
                    const report = reportRes.data
                    console.log('📒 FINANCE: Financial Report (v1):', report)
                    summaryData.value = {
                        totalExpenses: parseFloat(report.expenses?.total || 0),
                        summary: report.expenses?.items || []
                    }
                } catch {
                    // Silent fail
                }
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('finance.messages.load_error'),
                life: 3000
            })
        } finally {
            loading.value = false
        }
    }

    const getExpenseById = async (id) => {
        try {
            const res = await expensesAPI.getById(id)
            return res.data
        } catch (error) {
            console.error('Error fetching expense detail:', error)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('finance.messages.load_error'),
                life: 3000
            })
            return null
        }
    }

    const fetchBranches = async () => {
        try {
            const res = await branchesAPI.getAll()
            branches.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
        } catch {
            // Silent fail
        }
    }

    const fetchShifts = async () => {
        const settingsStore = (await import('@/store/settings')).useSettingsStore()
        if (!settingsStore.isShiftEnabled) return

        try {
            // Faqat ochiq smenalar emas, filtrlash uchun barchasi kerak bo'lishi mumkin
            const res = await api.get('/shifts/') // shiftsAPI.getAll or direct call
            shifts.value = Array.isArray(res.data) ? res.data : (res.data.results || res.data.data || [])
        } catch {
            // Silent fail
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
                summary: t('common.success'),
                detail: isUpdate ? t('finance.messages.updated') : t('finance.messages.added'),
                life: 3000
            })
            await fetchExpenses()
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || error.response?.data?.amount?.[0] || t('finance.messages.save_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
            return false
        }
    }

    const deleteExpense = async (id) => {
        try {
            await expensesAPI.delete(id)
            toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('finance.messages.deleted'), life: 3000 })
            await fetchExpenses()
            return true
        } catch (error) {
            const detail = error.response?.data?.detail || t('finance.messages.delete_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
            return false
        }
    }

    const exportExpenses = async (format = 'excel') => {
        try {
            const params = { format }

            // Format dates correctly to YYYY-MM-DD
            const formatDate = (date) => {
                if (!date) return null
                if (typeof date === 'string') return date.split('T')[0]
                return new Date(date).toLocaleDateString('en-CA')
            }

            if (exportFilters.value.date_from) params.date_from = formatDate(exportFilters.value.date_from)
            if (exportFilters.value.date_to) params.date_to = formatDate(exportFilters.value.date_to)

            // If export dates are missing, fallback to main filters if possible
            if (!params.date_from && filters.value.date) {
                if (Array.isArray(filters.value.date)) {
                    params.date_from = formatDate(filters.value.date[0])
                    params.date_to = formatDate(filters.value.date[1]) || params.date_from
                } else {
                    params.date_from = formatDate(filters.value.date)
                    params.date_to = formatDate(filters.value.date)
                }
            }

            if (filters.value.branch) params.branch = filters.value.branch
            if (filters.value.category) params.category = filters.value.category
            if (filters.value.smena) params.smena = filters.value.smena

            toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })

            const res = await reportsAPI.exportExpenses(params)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `xarajatlar_${params.date_from || 'hisobot'}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
        } catch (error) {
            console.error('Export error:', error)
            const status = error.response?.status
            const detail = status === 403
                ? t('reports.errors.subscription_required')
                : t('reports.errors.export_failed')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
        }
    }

    const exportWastages = async () => {
        try {
            const params = {}

            const formatDate = (date) => {
                if (!date) return null
                if (typeof date === 'string') return date.split('T')[0]
                return new Date(date).toLocaleDateString('en-CA')
            }

            if (exportFilters.value.date_from) params.date_from = formatDate(exportFilters.value.date_from)
            if (exportFilters.value.date_to) params.date_to = formatDate(exportFilters.value.date_to)

            // Fallback to main filters
            if (!params.date_from && filters.value.date) {
                if (Array.isArray(filters.value.date)) {
                    params.date_from = formatDate(filters.value.date[0])
                    params.date_to = formatDate(filters.value.date[1]) || params.date_from
                } else {
                    params.date_from = formatDate(filters.value.date)
                    params.date_to = formatDate(filters.value.date)
                }
            }

            if (filters.value.branch) params.branch = filters.value.branch
            if (filters.value.smena) params.smena = filters.value.smena
            if (filters.value.reason) params.reason = filters.value.reason

            toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })

            const res = await reportsAPI.exportWastages(params)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `isroflar_${params.date_from || 'hisobot'}.xlsx`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
        } catch (error) {
            console.error('Wastage Export error:', error)
            const status = error.response?.status
            const detail = status === 403
                ? t('reports.errors.subscription_required')
                : t('reports.errors.export_failed')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
        }
    }

    return {
        expenses,
        categories,
        branches,
        shifts,
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
        getExpenseById,
        saveExpense,
        deleteExpense,
        exportExpenses,
        exportWastages,
        fetchBranches,
        fetchShifts
    }
}