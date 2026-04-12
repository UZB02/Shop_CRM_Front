import { ref } from 'vue'
import { reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import i18n from '@/i18n'

export default function useReports() {
    const toast = useToast()
    const { t } = i18n.global
    const loading = ref(false)

    // Data for various reports
    const financialSummary = ref(null)
    const profitLoss = ref(null)
    const turnover = ref([])
    const debtors = ref({ items: [], total_debt: 0 })
    const performance = ref([])
    const inventoryValue = ref({ items: [], total_value: 0 })
    const taxReport = ref(null)
    const monthlyReport = ref(null)

    const fetchFinancialSummary = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getFinancialReport(params)
            financialSummary.value = res.data
        } catch (error) {
            console.error('Financial Summary Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchProfitLoss = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getProfitLoss(params)
            profitLoss.value = res.data
        } catch (error) {
            console.error('P&L Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchTurnover = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getProductTurnover(params)
            turnover.value = res.data.items || []
        } catch (error) {
            console.error('Turnover Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchDebtors = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getDebtorReport(params)
            debtors.value = res.data
        } catch (error) {
            console.error('Debtors Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchPerformance = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getWorkerPerformance(params)
            performance.value = res.data.items || []
        } catch (error) {
            console.error('Performance Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchInventoryValue = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getInventoryValue(params)
            inventoryValue.value = res.data
        } catch (error) {
            console.error('Inventory Value Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchTaxReport = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getTaxReport(params)
            taxReport.value = res.data
        } catch (error) {
            console.error('Tax Report Error:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchMonthlyChart = async (params) => {
        loading.value = true
        try {
            const res = await reportsAPI.getMonthlyProfitLoss(params)
            monthlyReport.value = res.data
        } catch (error) {
            console.error('Monthly Chart Error:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        financialSummary,
        profitLoss,
        turnover,
        debtors,
        performance,
        inventoryValue,
        taxReport,
        fetchFinancialSummary,
        fetchProfitLoss,
        fetchTurnover,
        fetchDebtors,
        fetchPerformance,
        fetchInventoryValue,
        fetchTaxReport,
        fetchMonthlyChart,
        monthlyReport
    }
}
