import { ref, computed, watch, onMounted } from 'vue'
import { shiftsAPI, branchesAPI } from '@/services/api'
import { useI18n } from 'vue-i18n'

export function useSmenasTab() {
  const { t } = useI18n()
  
  const shifts = ref([])
  const loading = ref(false)
  const branches = ref([])
  
  const filters = ref({
    date_from: null,
    date_to: null,
    branch_id: null,
    status: null // 'open' or 'closed'
  })

  const loadBranches = async () => {
    try {
      const res = await branchesAPI.getAll()
      branches.value = res.data.results || res.data
    } catch (e) {
      console.error('Error loading branches for filters:', e)
    }
  }

  const fetchShifts = async (page = 1) => {
    try {
      loading.value = true
      
      const params = {
        page,
        size: 12
      }
      
      if (filters.value.date_from) {
        params.date_from = filters.value.date_from.toISOString().split('T')[0]
      }
      if (filters.value.date_to) {
        params.date_to = filters.value.date_to.toISOString().split('T')[0]
      }
      if (filters.value.branch_id) {
        params.branch = filters.value.branch_id
      }
      if (filters.value.status) {
        params.status = filters.value.status
      }

      const res = await shiftsAPI.getAll(params)
      shifts.value = res.data.results || res.data
    } catch (e) {
      console.error('Error fetching filtered shifts:', e)
    } finally {
      loading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = {
      date_from: null,
      date_to: null,
      branch_id: null,
      status: null
    }
    fetchShifts()
  }

  watch(filters, () => {
    fetchShifts()
  }, { deep: true })

  onMounted(() => {
    loadBranches()
    fetchShifts()
  })

  return {
    shifts,
    loading,
    branches,
    filters,
    fetchShifts,
    resetFilters
  }
}


