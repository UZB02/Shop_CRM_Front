import { ref, onMounted } from 'vue'
import { auditLogsAPI } from '@/services/settings'
import { workersAPI } from '@/services/workers'

export function useAuditLogs() {
  const loading = ref(false)
  const logs = ref([])
  const totalRecords = ref(0)
  const currentPage = ref(1)

  const showAdvanced = ref(false)

  const filters = ref({
    model: null,
    action: null,
    worker: null,
    date_from: null,
    date_to: null,
    search_query: null,
    is_impersonated: null
  })

  const workersList = ref([])

  const detailVisible = ref(false)
  const selectedLog = ref(null)

  const modelOptions = [
    { label: 'Mahsulot', value: 'Product' },
    { label: 'Kategoriya', value: 'Category' },
    { label: 'Savdo', value: 'Sale' },
    { label: 'Savdo Qaytarilishi', value: 'SaleReturn' },
    { label: 'Xarajat', value: 'Expense' },
    { label: 'Ombor', value: 'Warehouse' },
    { label: 'Filial', value: 'Branch' },
    { label: 'Xodim', value: 'Worker' },
    { label: 'O\'tkazma (Transfer)', value: 'Transfer' },
    { label: 'Yetkazib beruvchi', value: 'Supplier' }
  ]

  const actionOptions = [
    { label: 'Yaratildi (Create)', value: 'create' },
    { label: 'Yangilandi (Update)', value: 'update' },
    { label: 'O\'chirildi (Delete)', value: 'delete' },
    { label: 'Tizimga kirish (Login)', value: 'login' },
    { label: 'Tizimdan chiqish (Logout)', value: 'logout' }
  ]

  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const getActionLabel = (act) => {
    if (act === 'create') return 'Yaratildi'
    if (act === 'update') return 'Yangilandi'
    if (act === 'delete') return 'O\'chirildi'
    if (act === 'login') return 'Tizimga kirdi'
    if (act === 'logout') return 'Tizimdan chiqdi'
    return act
  }

  const getActionIcon = (act) => {
    if (act === 'create') return 'pi pi-plus-circle'
    if (act === 'update') return 'pi pi-pencil'
    if (act === 'delete') return 'pi pi-trash'
    if (act === 'login') return 'pi pi-sign-in'
    if (act === 'logout') return 'pi pi-sign-out'
    return 'pi pi-info-circle'
  }

  const getActionClass = (act) => {
    if (act === 'create') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
    if (act === 'update') return 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
    if (act === 'delete') return 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
    if (act === 'login') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    if (act === 'logout') return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
    return 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
  }

  const fetchWorkers = async () => {
    try {
      const res = await workersAPI.getAll()
      const raw = res.data?.results || (Array.isArray(res.data) ? res.data : [])
      workersList.value = raw.map(w => ({
        label: w.full_name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.name || w.username || `Xodim #${w.id}`,
        value: w.id
      }))
    } catch (err) {
      console.error('Audit Log: Failed to fetch workers', err)
    }
  }

  const fetchLogs = async (page = 1) => {
    loading.value = true
    try {
      const params = {
        page,
        limit: 10
      }
      if (filters.value.model) params.model = filters.value.model
      if (filters.value.action) params.action = filters.value.action
      if (filters.value.worker) params.worker = filters.value.worker
      if (filters.value.date_from) params.date_from = formatDate(filters.value.date_from)
      if (filters.value.date_to) params.date_to = formatDate(filters.value.date_to)
      if (filters.value.search_query) params.description = filters.value.search_query
      if (filters.value.is_impersonated !== null) params.is_impersonated = filters.value.is_impersonated

      const res = await auditLogsAPI.getAll(params)
      logs.value = res.data?.results || (Array.isArray(res.data) ? res.data : [])
      totalRecords.value = res.data?.count || logs.value.length
      currentPage.value = page
    } catch (err) {
      console.error('Audit Log: Failed to fetch audit logs', err)
    } finally {
      loading.value = false
    }
  }

  const onPageChange = (event) => {
    const targetPage = event.page + 1
    fetchLogs(targetPage)
  }

  const resetFilters = () => {
    filters.value = {
      model: null,
      action: null,
      worker: null,
      date_from: null,
      date_to: null,
      search_query: null,
      is_impersonated: null
    }
    fetchLogs(1)
  }

  const showDetails = (log) => {
    selectedLog.value = log
    detailVisible.value = true
  }

  onMounted(() => {
    fetchWorkers()
    fetchLogs(1)
  })

  return {
    loading,
    logs,
    totalRecords,
    currentPage,
    showAdvanced,
    filters,
    workersList,
    detailVisible,
    selectedLog,
    modelOptions,
    actionOptions,
    getActionLabel,
    getActionIcon,
    getActionClass,
    fetchLogs,
    onPageChange,
    resetFilters,
    showDetails
  }
}
