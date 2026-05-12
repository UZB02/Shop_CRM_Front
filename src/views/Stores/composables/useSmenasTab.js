import { ref, computed, watch, onMounted } from 'vue'
import { shiftsAPI, branchesAPI, reportsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useSmenasTab() {
  const { t } = useI18n()
  const toast = useToast()
  
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

  const exportShifts = async () => {
    try {
      const params = {}
      
      const formatDate = (date) => {
          if (!date) return null
          return new Date(date).toLocaleDateString('en-CA')
      }

      if (filters.value.date_from) params.date_from = formatDate(filters.value.date_from)
      if (filters.value.date_to) params.date_to = formatDate(filters.value.date_to)
      if (filters.value.branch_id) params.branch = filters.value.branch_id
      if (filters.value.status) params.status = filters.value.status

      toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })

      const res = await reportsAPI.exportShifts(params)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `smenalar_${params.date_from || 'hisobot'}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
    } catch (error) {
      console.error('Shifts Export error:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('reports.errors.export_failed'), life: 4000 })
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
    resetFilters,
    exportShifts
  }
}


