import { ref, computed, onMounted } from 'vue'
import { kpiAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import { useI18n } from 'vue-i18n'

export function useKpi() {
  const { t } = useI18n()
  const settingsStore = useSettingsStore()

  const loading = ref(false)
  const kpiList = ref([])
  const period = ref(new Date())
  const searchQuery = ref('')
  const targetModalVisible = ref(false)
  const selectedKpi = ref(null)
  const showCharts = ref(false)

  const filteredKpiList = computed(() => {
    if (!searchQuery.value) return kpiList.value
    const query = searchQuery.value.toLowerCase()
    return kpiList.value.filter(item => 
      item.worker_name?.toLowerCase().includes(query) ||
      item.worker?.toString().includes(query)
    )
  })

  // 1. Global Analytics Stats
  const globalStats = computed(() => {
    if (!kpiList.value.length) return { totalNetSales: 0, avgCompletion: 0, returnRate: 0, topPerformer: null }
    
    const totalNet = kpiList.value.reduce((acc, curr) => acc + parseFloat(curr.net_sales_amount || 0), 0)
    const totalSales = kpiList.value.reduce((acc, curr) => acc + parseFloat(curr.sales_amount || 0), 0)
    const totalReturns = kpiList.value.reduce((acc, curr) => acc + parseFloat(curr.returns_amount || 0), 0)
    const avgComp = kpiList.value.reduce((acc, curr) => acc + parseFloat(curr.completion_pct || 0), 0) / kpiList.value.length
    
    const sorted = [...kpiList.value].sort((a,b) => parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0))
    
    return {
      totalNetSales: totalNet,
      avgCompletion: avgComp.toFixed(1),
      returnRate: totalSales > 0 ? ((totalReturns / totalSales) * 100).toFixed(1) : 0,
      topPerformer: sorted[0]
    }
  })

  // 2. Charts Logic
  const barChartData = computed(() => {
    const sorted = [...kpiList.value].sort((a,b) => parseFloat(b.net_sales_amount || 0) - parseFloat(a.net_sales_amount || 0)).slice(0, 8)
    return {
      labels: sorted.map(item => (item.worker_name || '').split(' ')[0]),
      datasets: [
        {
          label: t('kpi.table.net_sales'),
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          data: sorted.map(item => parseFloat(item.net_sales_amount || 0)),
          borderRadius: 6,
          barThickness: 24
        }
      ]
    }
  })

  const barChartOptions = computed(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Summa: ${settingsStore.formatPrice(context.raw)}`
        }
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' }
      },
      y: { 
        grid: { borderDash: [2, 4], color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { size: 9 }, color: '#94a3b8', callback: (val) => val >= 1000000 ? (val / 1000000) + 'M' : val }
      }
    }
  }))

  const doughnutChartData = computed(() => {
    const counts = { star: 0, expert: 0, solid: 0, lagging: 0 }
    kpiList.value.forEach(item => {
      const pct = parseFloat(item.completion_pct || 0)
      if (pct >= 100) counts.star++
      else if (pct >= 80) counts.expert++
      else if (pct >= 50) counts.solid++
      else counts.lagging++
    })

    return {
      labels: [t('kpi.labels.star'), t('kpi.labels.expert'), t('kpi.labels.solid'), t('kpi.labels.lagging')],
      datasets: [{
        data: [counts.star, counts.expert, counts.solid, counts.lagging],
        backgroundColor: ['#10b981', '#34d399', '#f59e0b', '#f43f5e'],
        hoverOffset: 4,
        borderWidth: 0
      }]
    }
  })

  const loadKpiData = async () => {
    if (!settingsStore.isKpiEnabled) return
    loading.value = true
    try {
      const params = {
        month: period.value.getMonth() + 1,
        year: period.value.getFullYear()
      }
      const res = await kpiAPI.getAll(params)
      kpiList.value = res.data?.results || res.data || []
    } catch (error) {
      console.error('Error loading KPI data:', error)
    } finally {
      loading.value = false
    }
  }

  const openTargetDialog = (kpi) => {
    selectedKpi.value = kpi
    targetModalVisible.value = true
  }

  onMounted(loadKpiData)

  return {
    loading,
    kpiList,
    period,
    searchQuery,
    targetModalVisible,
    selectedKpi,
    showCharts,
    filteredKpiList,
    globalStats,
    barChartData,
    barChartOptions,
    doughnutChartData,
    loadKpiData,
    openTargetDialog
  }
}
