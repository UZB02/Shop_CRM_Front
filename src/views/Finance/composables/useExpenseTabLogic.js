import { ref, computed, watch, onMounted } from 'vue'
import useExpenses from '@/composables/useExpenses'
import useReports from '@/composables/useReports'
import i18n from '@/i18n'

export default function useExpenseTabLogic() {
  const { 
    expenses, loading, filters, exportFilters, isManager, 
    branches, categories,
    fetchExpenses, fetchCategories, fetchBranches, fetchShifts,
    summaryData
  } = useExpenses()
  
  const { 
    debtors, performance, monthlyReport,
    fetchDebtors, fetchPerformance, fetchMonthlyChart
  } = useReports()

  const plFilters = ref({
    year: new Date().getFullYear(),
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    branch: filters.value.branch
  })

  const activeTab = ref('expenses')
  const userIsManager = computed(() => isManager())
  const { t } = i18n.global

  const tabs = computed(() => {
    const tList = [
      { id: 'expenses', label: t('finance.title'), icon: 'pi pi-wallet' }
    ]
    if (userIsManager.value) {
      tList.push(
        { id: 'profit-loss', label: t('reports.profit_loss'), icon: 'pi pi-chart-line' },
        { id: 'debtors', label: t('reports.debtors'), icon: 'pi pi-users' },
        { id: 'performance', label: t('reports.worker_performance'), icon: 'pi pi-chart-bar' }
      )
    }
    return tList
  })

  const fetchTabReport = async () => {
    if (!userIsManager.value || activeTab.value === 'expenses') return
    
    const params = {
      date_from: exportFilters.value.date_from,
      date_to: exportFilters.value.date_to,
      branch: filters.value.branch
    }

    if (activeTab.value === 'profit-loss') {
      const chartParams = { 
        year: plFilters.value.year,
        months: (plFilters.value.months || []).join(','),
        branch: plFilters.value.branch
      }
      fetchMonthlyChart(chartParams)
    }
    if (activeTab.value === 'debtors') fetchDebtors(params)
    if (activeTab.value === 'performance') fetchPerformance(params)
  }

  const formatDateToString = (date) => {
    if (!date || typeof date === 'string') return date
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Watchers
  watch(activeTab, fetchTabReport)

  watch(filters, () => {
    if (filters.value.date instanceof Date) {
      filters.value.date = formatDateToString(filters.value.date)
      return
    }
    if (activeTab.value === 'expenses') fetchExpenses()
    else fetchTabReport()
  }, { deep: true })

  watch(exportFilters, () => {
    if (exportFilters.value.date_from instanceof Date) {
      exportFilters.value.date_from = formatDateToString(exportFilters.value.date_from)
    }
    if (exportFilters.value.date_to instanceof Date) {
      exportFilters.value.date_to = formatDateToString(exportFilters.value.date_to)
    }
    if (activeTab.value !== 'expenses') fetchTabReport()
  }, { deep: true })

  watch(plFilters, () => {
    if (activeTab.value === 'profit-loss') fetchTabReport()
  }, { deep: true })

  // Summary Computations
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

  const refreshData = () => {
    fetchCategories()
    fetchExpenses()
    if (userIsManager.value) {
      fetchBranches()
      fetchShifts()
    }
  }

  return {
    activeTab, tabs, userIsManager,
    totalFromList, topCategoryName, lastExpenseDate,
    debtors, performance, monthlyReport, refreshData,
    plFilters, branches, categories
  }
}
