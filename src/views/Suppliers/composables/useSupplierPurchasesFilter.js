import { ref, computed, onMounted } from 'vue'
import { workersAPI, branchesAPI, warehousesAPI } from '@/services/api'

export function useSupplierPurchasesFilter(emit) {
  const showFilters = ref(false)
  
  const filters = ref({
    search: '',
    id: null,
    worker: null,
    branch: null,
    warehouse: null,
    dates: null,
    min_total: null,
    max_total: null
  })

  const workers = ref([])
  const branches = ref([])
  const warehouses = ref([])

  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.id || 
      filters.value.worker || 
      filters.value.branch || 
      filters.value.warehouse || 
      (filters.value.dates && filters.value.dates.length > 0) || 
      filters.value.min_total || 
      filters.value.max_total
    )
  })

  const onApply = () => {
    showFilters.value = false
    emit('apply', filters.value)
  }

  const onReset = () => {
    filters.value = {
      search: filters.value.search,
      id: null,
      worker: null,
      branch: null,
      warehouse: null,
      dates: null,
      min_total: null,
      max_total: null
    }
    showFilters.value = false
    emit('apply', filters.value)
  }

  const onSearchEnter = () => {
    emit('apply', filters.value)
  }

  onMounted(() => {
    Promise.all([
      workersAPI.getAll({ limit: 100 }).then(res => {
        const data = res.data.results || res.data || []
        workers.value = data.map(w => ({
          id: w.id,
          full_name: w.full_name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.name || 'Noma\'lum xodim'
        }))
      }).catch(() => {}),
      branchesAPI.getAll({ limit: 100 }).then(res => branches.value = res.data.results || res.data).catch(() => {}),
      warehousesAPI.getAll({ limit: 100 }).then(res => warehouses.value = res.data.results || res.data).catch(() => {})
    ])
  })

  return {
    filters,
    showFilters,
    workers,
    branches,
    warehouses,
    hasActiveFilters,
    onApply,
    onReset,
    onSearchEnter
  }
}
