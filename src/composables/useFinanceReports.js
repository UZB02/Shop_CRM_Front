import { ref, reactive } from 'vue'
import { financeReportsAPI, reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import i18n from '@/i18n'

// Default filters based on logic
export const getInitialFilters = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return {
        date_from: firstDay.toISOString().split('T')[0],
        date_to: today.toISOString().split('T')[0],
        branch: null,
        category: null,
        search: '',
        group_by: 'day',
        year: today.getFullYear(),
        months: '1,2,3,4,5,6,7,8,9,10,11,12',
        min_debt: 0,
        payment_method: null
    }
}

export default function useFinanceReports() {
    const toast = useToast()
    const { t } = i18n.global

    const loading = ref(false)
    
    const filters = reactive(getInitialFilters())

    // State for each report
    const reports = reactive({
        revenue: { summary: {}, chart: [], table: [] },
        expenses: { summary: {}, chart: [], purchases: {}, expenses: {} },
        payments: { summary: {}, chart: [], table: [] },
        profitability: { summary: {}, chart: [], table: [], subcategory_enabled: false },
        profitLoss: { summary: {}, data: [], year: null, months: [] },
        debtors: { total_debt: 0, debtors_count: 0, items: [] },
        financialSummary: null
    })

    const fetchRevenue = async () => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getRevenue({
                date_from: filters.date_from,
                date_to: filters.date_to,
                branch: filters.branch,
                category: filters.category,
                search: filters.search,
                group_by: filters.group_by
            })
            reports.revenue = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchExpensesReport = async () => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getExpenses({
                date_from: filters.date_from,
                date_to: filters.date_to,
                branch: filters.branch,
                category: filters.category,
                search: filters.search,
                group_by: filters.group_by || 'day'
            })
            reports.expenses = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchPaymentMethods = async () => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getPaymentMethods({
                date_from: filters.date_from,
                date_to: filters.date_to,
                branch: filters.branch,
                category: filters.category,
                group_by: filters.group_by || 'month'
            })
            reports.payments = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchProfitability = async () => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getCategoryProfit({
                date_from: filters.date_from,
                date_to: filters.date_to,
                branch: filters.branch,
                search: filters.search,
                group_by: filters.category ? 'subcategory' : 'category'
            })
            reports.profitability = res.data
            if (res.data.filters?.subcategory_enabled !== undefined) {
                reports.profitability.subcategory_enabled = res.data.filters.subcategory_enabled
            }
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchProfitLoss = async () => {
        loading.value = true
        try {
            // Ensure months is a string if it's an array
            const monthsParam = Array.isArray(filters.months) ? filters.months.join(',') : filters.months
            const res = await financeReportsAPI.getProfitLoss({
                year: filters.year,
                months: monthsParam,
                branch: filters.branch
            })
            reports.profitLoss = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchDebtors = async () => {
        loading.value = true
        try {
            const res = await reportsAPI.getDebtorReport({
                branch: filters.branch,
                min_debt: filters.min_debt
            })
            reports.debtors = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchFinancialSummary = async () => {
        loading.value = true
        try {
            const res = await reportsAPI.getFinancialReport({
                date_from: filters.date_from,
                date_to: filters.date_to,
                branch: filters.branch
            })
            reports.financialSummary = res.data
        } catch (error) {
            if (error.response?.status === 429) return
            const detail = error.response?.data?.detail || error.response?.data?.message || t('finance.messages.load_error')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const exportDebtors = async (format = 'excel') => {
        try {
            const params = { format }
            if (filters.branch) params.branch = filters.branch
            if (filters.min_debt) params.min_debt = filters.min_debt

            toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })

            const res = await reportsAPI.exportDebtorReport(params)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `qarzdorlar_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
        } catch (error) {
            console.error('Debtor Export error:', error)
            const detail = error.response?.status === 403
                ? t('reports.errors.subscription_required')
                : t('reports.errors.export_failed')
            toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
        }
    }

    const clearFilters = () => {
        Object.assign(filters, getInitialFilters())
    }

    return {
        loading,
        filters,
        reports,
        fetchRevenue,
        fetchExpensesReport,
        fetchPaymentMethods,
        fetchProfitability,
        fetchProfitLoss,
        fetchDebtors,
        fetchFinancialSummary,
        exportDebtors,
        clearFilters
    }
}


