import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { shiftsAPI } from '@/services/api'

export function useShiftDetail() {
  const route = useRoute()
  const loading = ref(true)
  const data = ref(null)

  const paymentMethods = ['cash', 'card', 'mixed', 'debt']

  const methodLabels = {
    cash: 'Naqd pul',
    card: 'Plastik karta',
    mixed: 'Aralash',
    debt: 'Nasiya'
  }

  const dotClasses = {
    cash: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    card: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    mixed: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    debt: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  }

  const progressClasses = {
    cash: 'bg-emerald-500',
    card: 'bg-blue-500',
    mixed: 'bg-purple-500',
    debt: 'bg-amber-500'
  }

  const loadData = async () => {
    try {
      loading.value = true
      const res = await shiftsAPI.getXReport(route.params.id)
      data.value = res.data
      console.log('📊 X-Report Data:', data.value)
    } catch (error) {
      console.error('Shift detail fetch error:', error)
    } finally {
      loading.value = false
    }
  }

  const formatCurrency = (val) => {
    if (!val) return '0'
    const num = parseFloat(val)
    return new Intl.NumberFormat('uz-UZ', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(num)
  }

  const calculatePercent = (val) => {
    if (!data.value || !data.value.x_report?.sales_total) return 0
    const total = parseFloat(data.value.x_report.sales_total)
    const current = parseFloat(val)
    if (total === 0 || isNaN(total)) return 0
    return ((current / total) * 100).toFixed(1)
  }

  const handlePrint = () => {
    window.print()
  }

  onMounted(() => {
    loadData()
  })

  return {
    loading,
    data,
    paymentMethods,
    methodLabels,
    dotClasses,
    progressClasses,
    formatCurrency,
    calculatePercent,
    handlePrint
  }
}
