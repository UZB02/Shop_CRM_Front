import { ref, watch } from 'vue'
import { saleReturnsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useSaleReturns() {
  const toast = useToast()
  const { t } = useI18n()

  const loading = ref(false)
  const returns = ref([])
  const totalRecords = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const searchQuery = ref('')
  
  const filters = ref({
    status: '',
    branch: '',
    smena: '',
    date_from: '',
    date_to: ''
  })

  const selectedReturn = ref(null)
  const displayDetail = ref(false)
  const loadingDetail = ref(false)

  const loadReturns = async () => {
    loading.value = true
    try {
      const params = {
        page: page.value,
        page_size: pageSize.value,
        search: searchQuery.value || undefined,
        status: filters.value.status || undefined,
        branch: filters.value.branch || undefined,
        smena: filters.value.smena || undefined,
        date_from: filters.value.date_from || undefined,
        date_to: filters.value.date_to || undefined
      }
      const response = await saleReturnsAPI.getAll(params)
      returns.value = response.data.results || []
      totalRecords.value = response.data.count || 0
    } catch (error) {
      console.error('Error loading sale returns:', error)
      toast.add({ 
        severity: 'error', 
        summary: t('common.error'), 
        detail: t('common.error_message'), 
        life: 5000 
      })
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    page.value = 1
    loadReturns()
  }

  let searchTimeout = null
  watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      loadReturns()
    }, 500)
  })

  const applyFilters = () => {
    page.value = 1
    loadReturns()
  }

  const resetFilters = () => {
    filters.value = {
      status: '',
      branch: '',
      smena: '',
      date_from: '',
      date_to: ''
    }
    searchQuery.value = ''
    page.value = 1
    loadReturns()
  }

  const viewReturn = async (returnItem) => {
    loadingDetail.value = true
    try {
      const response = await saleReturnsAPI.getById(returnItem.id)
      selectedReturn.value = response.data
      displayDetail.value = true
    } catch (error) {
      console.error('Error loading return detail:', error)
      toast.add({ 
        severity: 'error', 
        summary: t('common.error'), 
        detail: t('common.error_message'), 
        life: 5000 
      })
    } finally {
      loadingDetail.value = false
    }
  }

  const createReturn = async (data) => {
    loading.value = true
    try {
      const response = await saleReturnsAPI.create(data)
      toast.add({ 
        severity: 'success', 
        summary: t('common.success'), 
        detail: "Qaytarish muvaffaqiyatli bajarildi.", 
        life: 3000 
      })
      loadReturns()
      return response.data
    } catch (error) {
      console.error('Error creating return:', error)
      let detail = t('common.error_message')
      if (error.response?.data?.message) detail = error.response.data.message
      else if (typeof error.response?.data === 'string') detail = error.response.data
      
      toast.add({ 
        severity: 'error', 
        summary: t('common.error'), 
        detail: detail, 
        life: 5000 
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const onPageChange = (newPage) => {
    page.value = newPage
    loadReturns()
  }

  return {
    loading,
    returns,
    totalRecords,
    page,
    pageSize,
    searchQuery,
    filters,
    selectedReturn,
    displayDetail,
    loadingDetail,
    loadReturns,
    handleSearch,
    applyFilters,
    resetFilters,
    viewReturn,
    createReturn,
    onPageChange
  }
}
