import { ref, watch, onMounted } from 'vue'
import { salesAPI, tradesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useTrades() {
  const toast = useToast()
  const { t } = useI18n()

  const loading = ref(false)
  const trades = ref([])
  const totalRecords = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const searchQuery = ref('')
  
  const filters = ref({
    status: '',
    payment_type: '',
    date: '',
    date_from: '',
    date_to: '',
    branch: '',
    worker: '',
    customer: '',
    min_amount: '',
    max_amount: ''
  })

  const selectedTrade = ref(null)
  const displayDetail = ref(false)
  const loadingDetail = ref(false)

  const loadTrades = async () => {
    loading.value = true
    try {
      const params = {
        page: page.value,
        page_size: pageSize.value,
        search: searchQuery.value || undefined,
        status: filters.value.status || undefined,
        payment_type: filters.value.payment_type || undefined,
        date: filters.value.date || undefined,
        date_from: filters.value.date_from || undefined,
        date_to: filters.value.date_to || undefined,
        branch: filters.value.branch || undefined,
        worker: filters.value.worker || undefined,
        customer: filters.value.customer || undefined,
        min_amount: filters.value.min_amount || undefined,
        max_amount: filters.value.max_amount || undefined
      }
      const response = await salesAPI.getAll(params)
      trades.value = response.data.results || []
      totalRecords.value = response.data.count || 0
    } catch (error) {
      console.error('Error loading trades:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    page.value = 1
    loadTrades()
  }

  let searchTimeout = null
  watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      loadTrades()
    }, 500)
  })

  const applyFilters = () => {
    page.value = 1
    loadTrades()
  }

  const resetFilters = () => {
    filters.value = {
      status: '',
      payment_type: '',
      date: '',
      date_from: '',
      date_to: '',
      branch: '',
      worker: '',
      customer: '',
      min_amount: '',
      max_amount: ''
    }
    searchQuery.value = ''
    page.value = 1
    loadTrades()
  }

  const viewTrade = async (trade) => {
    loadingDetail.value = true
    try {
      // Fetch full trade data to get items
      const response = await salesAPI.getById(trade.id)
      selectedTrade.value = response.data
      displayDetail.value = true
    } catch (error) {
           console.error('Error loading trade detail:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error_message'), life: 5000 })
    } finally {
      loadingDetail.value = false
    }
  }

  const onPageChange = (newPage) => {
    page.value = newPage
    loadTrades()
  }

  onMounted(() => {
    loadTrades()
  })

  return {
    loading,
    trades,
    totalRecords,
    page,
    pageSize,
    searchQuery,
    filters,
    selectedTrade,
    displayDetail,
    loadingDetail,
    loadTrades,
    handleSearch,
    applyFilters,
    resetFilters,
    viewTrade,
    onPageChange
  }
}
