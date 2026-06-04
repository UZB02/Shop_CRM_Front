import { ref } from 'vue'
import { suppliersAPI } from '@/services/api'

export function useSupplierPurchases(supplierId) {
  const records = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const totalRecords = ref(0)
  
  // store current applied filters internally
  const currentFilters = ref({})

  const loadData = async (page = 1) => {
    loading.value = true
    currentPage.value = page
    try {
      const params = { page }
      const f = currentFilters.value
      
      if (f.search) params.search = f.search
      if (f.id) params.id = f.id
      if (f.worker) params.worker = f.worker
      if (f.branch) params.branch = f.branch
      if (f.warehouse) params.warehouse = f.warehouse
      if (f.min_total) params.min_total = f.min_total
      if (f.max_total) params.max_total = f.max_total

      if (f.dates && f.dates.length === 2) {
        if (f.dates[0]) {
          const d1 = new Date(f.dates[0])
          d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset())
          params.date_from = d1.toISOString().split('T')[0]
        }
        if (f.dates[1]) {
          const d2 = new Date(f.dates[1])
          d2.setMinutes(d2.getMinutes() - d2.getTimezoneOffset())
          params.date_to = d2.toISOString().split('T')[0]
        }
      } else if (f.dates && !Array.isArray(f.dates)) {
          const d1 = new Date(f.dates)
          d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset())
          params.date_from = d1.toISOString().split('T')[0]
      }

      const res = await suppliersAPI.getPurchases(supplierId, params)
      records.value = res.data.results || []
      totalRecords.value = res.data.count || 0
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const applyFilters = (filters) => {
    currentFilters.value = { ...filters }
    loadData(1)
  }

  const onPageChange = (event) => {
    const page = Math.floor(event.first / event.rows) + 1
    loadData(page)
  }

  return {
    records,
    loading,
    currentPage,
    totalRecords,
    loadData,
    applyFilters,
    onPageChange
  }
}
