import { ref, computed, watch, onMounted } from 'vue'
import useExpenses from '@/composables/useExpenses'
import useFinanceReports from '@/composables/useFinanceReports'
import i18n from '@/i18n'

export default function useExpenseTabLogic() {
  const { 
    expenses: expenseList, loading: crudLoading, filters: crudFilters, exportFilters, isManager, 
    branches, categories, shifts,
    fetchExpenses: fetchExpenseList, fetchCategories, fetchBranches, fetchShifts,
    summaryData: oldSummary
  } = useExpenses()
  
  const {
      loading: reportsLoading,
      filters: reportsFilters,
      reports,
      fetchRevenue,
      fetchExpensesReport,
      fetchPaymentMethods,
      fetchProfitability,
      fetchProfitLoss,
      fetchDebtors,
      clearFilters: clearReportsFilters
  } = useFinanceReports()

  // Synced loading state
  const loading = computed(() => crudLoading.value || reportsLoading.value)

  const activeTab = ref('expenses')
  const userIsManager = computed(() => isManager())
  const { t } = i18n.global

  const tabs = computed(() => {
    const tList = [
      { id: 'expenses', label: t('finance.title'), icon: 'pi pi-wallet' }
    ]
    if (userIsManager.value) {
      tList.push(
        { id: 'revenue', label: t('finance.revenue_report'), icon: 'pi pi-chart-line' },
        { id: 'payments', label: t('finance.payment_methods'), icon: 'pi pi-credit-card' },
        { id: 'profitability', label: t('finance.profitability'), icon: 'pi pi-percentage' },
        { id: 'profit-loss', label: t('reports.profit_loss'), icon: 'pi pi-chart-bar' },
        { id: 'debtors', label: t('reports.debtors'), icon: 'pi pi-users' }
      )
    }
    return tList
  })

  // Sync filters between useExpenses and useFinanceReports
  watch(() => crudFilters.value, (newVal) => {
      reportsFilters.branch = newVal.branch
      reportsFilters.category = newVal.category
  }, { deep: true })

  watch(() => exportFilters.value, (newVal) => {
      reportsFilters.date_from = newVal.date_from
      reportsFilters.date_to = newVal.date_to
  }, { deep: true })

  const fetchTabReport = async () => {
    if (!userIsManager.value) return
    
    switch (activeTab.value) {
        case 'expenses':
            await Promise.all([fetchExpenseList(), fetchExpensesReport()])
            break
        case 'revenue':
            await fetchRevenue()
            break
        case 'payments':
            await fetchPaymentMethods()
            break
        case 'profitability':
            await fetchProfitability()
            break
        case 'profit-loss':
            await fetchProfitLoss()
            break
        case 'debtors':
            await fetchDebtors()
            break
    }
  }

  // Watchers for automatic refresh
  watch(activeTab, fetchTabReport)
  
  // Refresh on filter changes
  watch([() => crudFilters.value.branch, () => crudFilters.value.category, () => crudFilters.value.date], () => {
      if (activeTab.value === 'expenses') fetchExpenseList()
      fetchTabReport()
  }, { deep: true })

  watch([() => exportFilters.value.date_from, () => exportFilters.value.date_to], fetchTabReport)

  const refreshData = () => {
    fetchCategories()
    fetchTabReport()
    if (userIsManager.value) {
      fetchBranches()
      fetchShifts()
    }
  }

  return {
    activeTab, tabs, userIsManager,
    loading,
    reports,
    refreshData,
    branches, categories, shifts,
    expenseList, crudFilters, exportFilters,
    // Add these for backward compatibility if needed in index.vue
    summaryData: reports.expenses?.summary || {},
    totalFromList: computed(() => parseFloat(reports.expenses?.summary?.expenses_total || 0))
  }
}
