import { ref, reactive } from 'vue'
import { financeReportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import i18n from '@/i18n'

export default function useFinanceReports() {
    const toast = useToast()
    const { t } = i18n.global

    const loading = ref(false)
    
    // Default filters based on logic
    const getInitialFilters = () => {
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
            months: '1,2,3,4,5,6,7,8,9,10,11,12'
        }
    }

    const filters = reactive(getInitialFilters())

    // State for each report
    const reports = reactive({
        revenue: { summary: {}, chart: [], table: [] },
        expenses: { summary: {}, chart: [], purchases: {}, expenses: {} },
        payments: { summary: {}, chart: [], table: [] },
        profitability: { summary: {}, chart: [], table: [] },
        profitLoss: { summary: {}, data: [], year: null, months: [] },
        debtors: { total_debt: 0, debtors_count: 0, items: [] }
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
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
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
                search: filters.search,
                group_by: filters.group_by === 'day' ? 'day' : 'month'
            })
            reports.expenses = res.data
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
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
                group_by: filters.group_by === 'day' ? 'day' : 'month'
            })
            reports.payments = res.data
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
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
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchProfitLoss = async () => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getProfitLoss({
                year: filters.year,
                months: filters.months,
                branch: filters.branch
            })
            reports.profitLoss = res.data
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const fetchDebtors = async (minDebt = 0) => {
        loading.value = true
        try {
            const res = await financeReportsAPI.getDebtorReport({
                branch: filters.branch,
                min_debt: minDebt
            })
            reports.debtors = res.data
        } catch (error) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('finance.messages.load_error'), life: 3000 })
        } finally {
            loading.value = false
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
        clearFilters
    }
}
