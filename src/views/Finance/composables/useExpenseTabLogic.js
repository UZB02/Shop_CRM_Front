import { ref, computed, watch, onMounted } from 'vue'
import useExpenses from '@/composables/useExpenses'
import useFinanceReports, { getInitialFilters } from '@/composables/useFinanceReports'
import { categoriesAPI } from '@/services/api'
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
      fetchProfitLoss,
      fetchDebtors,
      fetchFinancialSummary,
      exportDebtors,
      clearFilters: clearReportsFilters
  } = useFinanceReports()

  const productCategories = ref([])

  // Synced loading state
  const loading = computed(() => crudLoading.value || reportsLoading.value)

  const activeTab = ref('profit-loss')
  const userIsManager = computed(() => isManager())
  const { t } = i18n.global

  const tabs = computed(() => {
    const tList = []
    
    // For Managers, Finance (P&L) is the primary tab
    if (userIsManager.value) {
      tList.push({ id: 'summary', label: t('common.summary'), icon: 'pi pi-info-circle' })
      tList.push({ id: 'profit-loss', label: t('finance.title'), icon: 'pi pi-chart-bar' })
    }

    // Common tabs for expenses
    tList.push(
      { id: 'expenses', label: t('finance.expenses'), icon: 'pi pi-chart-pie' }
    )

    if (userIsManager.value) {
      tList.push(
        { id: 'revenue', label: t('finance.revenue_report'), icon: 'pi pi-chart-line' },
        { id: 'payments', label: t('finance.payment_methods'), icon: 'pi pi-credit-card' },
        { id: 'profitability', label: t('finance.profitability'), icon: 'pi pi-percentage' },
        { id: 'debtors', label: t('reports.debtors'), icon: 'pi pi-users' }
      )
    }

    // If for some reason a non-manager ends up here, ensure they have a valid tab
    if (!userIsManager.value && activeTab.value === 'profit-loss') {
      activeTab.value = 'expenses'
    }

    return tList
  })

  // 1. First, define the fetch function to avoid ReferenceErrors
  const fetchTabReport = async () => {
    switch (activeTab.value) {
        case 'summary':
            if (userIsManager.value) await fetchFinancialSummary()
            break
        case 'profit-loss':
            if (userIsManager.value) await fetchProfitLoss()
            break
        case 'expenses':
            await fetchExpensesReport()
            await fetchExpenseList()
            break
        case 'revenue':
            if (userIsManager.value) await fetchRevenue()
            break
        case 'payments':
            if (userIsManager.value) await fetchPaymentMethods()
            break
        case 'profitability':
            if (userIsManager.value) await fetchProfitability()
            break
        case 'debtors':
            if (userIsManager.value) await fetchDebtors()
            break
    }
  }

  // 2. Define the refresh function
  const refreshData = () => {
    // Reset all filters to default
    crudFilters.value.branch = null
    crudFilters.value.category = null
    crudFilters.value.date = null
    crudFilters.value.search = ''
    crudFilters.value.min_debt = 0
    crudFilters.value.group_by = 'day'
    
    // Refresh data
    fetchCategories()
    categoriesAPI.getAll().then(res => productCategories.value = res.data)
    fetchTabReport()
    
    if (userIsManager.value) {
        fetchShifts()
        fetchBranches()
    }
  }

  // 3. Define watchers
  watch(crudFilters, (newVal) => {
      reportsFilters.branch = newVal.branch
      reportsFilters.category = newVal.category
      reportsFilters.search = newVal.search
      reportsFilters.group_by = newVal.group_by || 'day'
      reportsFilters.year = newVal.year
      reportsFilters.months = newVal.months
      reportsFilters.min_debt = newVal.min_debt
      reportsFilters.payment_method = newVal.payment_method ?? null

      // Date Range Sync
      if (Array.isArray(newVal.date)) {
        const [start, end] = newVal.date
        if (start) {
            reportsFilters.date_from = new Date(start).toLocaleDateString('en-CA')
        }
        if (end) {
            reportsFilters.date_to = new Date(end).toLocaleDateString('en-CA')
        } else if (start) {
            reportsFilters.date_to = new Date(start).toLocaleDateString('en-CA')
        }
      } else if (newVal.date) {
        const d = new Date(newVal.date).toLocaleDateString('en-CA')
        reportsFilters.date_from = d
        reportsFilters.date_to = d
      } else {
        const defaults = getInitialFilters()
        reportsFilters.date_from = defaults.date_from
        reportsFilters.date_to = defaults.date_to
      }

      fetchTabReport()
  }, { deep: true, flush: 'sync' })

  watch(activeTab, (newTab) => {
    fetchTabReport()
  })

  watch(exportFilters, (newVal) => {
      if (newVal.date_from) reportsFilters.date_from = newVal.date_from
      if (newVal.date_to) reportsFilters.date_to = newVal.date_to
      fetchTabReport()
  }, { deep: true })

  onMounted(() => {
      refreshData()
      if (userIsManager.value) {
          fetchProfitLoss()
      }
  })

  return {
    activeTab, tabs, userIsManager,
    loading,
    reports,
    refreshData,
    branches, categories, shifts,
    expenseList, crudFilters, exportFilters,
    reportsFilters,
    exportDebtors,
    dynamicCategories: computed(() => activeTab.value === 'expenses' ? categories.value : productCategories.value),
    summaryData: computed(() => reports.expenses?.summary || {}),
    totalFromList: computed(() => parseFloat(reports.expenses?.summary?.expenses_total || 0)),
    netProfit: computed(() => {
      return parseFloat(reports.profitLoss?.summary?.total_net_profit || 0)
    })
  }
}


