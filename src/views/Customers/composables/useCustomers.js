import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirmStore } from '@/store/confirm'
import { customersAPI, customerGroupsAPI, reportsAPI } from '@/services/api'

export function useCustomers() {
  const router = useRouter()
  const route = useRoute()
  const toast = useToast()
  const confirm = useConfirmStore()
  const { t } = useI18n()

  const loading = ref(false)
  const saving = ref(false)
  const groups = ref([])
  const customerDialog = ref(false)
  const submitted = ref(false)

  // Initialize activeTab from URL query params (default: 'no_debt')
  const activeTab = ref(route.query.tab || 'no_debt')
  const groupedData = ref({
    debtors: { count: 0, results: [], total_debt_balance: 0, current_page: 1 },
    no_debt: { count: 0, results: [], current_page: 1 }
  })

  const page = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const minDebt = ref(0)
  let searchTimeout = null

  const customer = ref({
    name: '',
    phone: '',
    group: null,
    branch: '',
    address: '',
    notes: ''
  })

  const customerTabs = computed(() => [
    { id: 'no_debt', label: t('customers.tab_all') || 'Mijozlar', icon: 'pi pi-users', count: groupedData.value.no_debt.count },
    { id: 'debtors', label: t('customers.tab_debtors') || 'Qarzdorlar', icon: 'pi pi-exclamation-circle', count: groupedData.value.debtors.count }
  ])

  const activeCustomers = computed(() => groupedData.value[activeTab.value]?.results || [])
  const totalRecords = computed(() => groupedData.value[activeTab.value]?.count || 0)

  // Watch for tab change to sync query parameters and reload
  watch(activeTab, (newTab) => {
    router.replace({
      query: {
        ...route.query,
        tab: newTab
      }
    })
    page.value = 1
    loadCustomers()
  })

  // Watch for browser router query changes (e.g. back/forward navigation)
  watch(
    () => route.query.tab,
    (newTab) => {
      if (newTab && newTab !== activeTab.value) {
        activeTab.value = newTab
      }
    }
  )

  watch(minDebt, () => {
    if (activeTab.value === 'debtors') {
      handleSearch() // reuse search timeout for minDebt too
    }
  })

  const loadCustomers = async () => {
    loading.value = true
    try {
      const params = { 
        page: page.value, 
        limit: pageSize.value,
        search: searchQuery.value || undefined,
        min_debt: activeTab.value === 'debtors' ? minDebt.value : undefined
      }
      const response = await customersAPI.getGrouped(params)
      groupedData.value = response.data
    } catch (error) {
      console.error('Error loading customers:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      loadCustomers()
    }, 500)
  }

  const loadGroups = async () => {
    try {
      const response = await customerGroupsAPI.getAll()
      groups.value = response.data.results || response.data
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  const openNew = () => {
    customer.value = { name: '', phone: '', group: null, branch: '', address: '', notes: '' }
    submitted.value = false
    customerDialog.value = true
  }

  const editCustomer = async (data) => {
    try {
      const response = await customersAPI.getById(data.id)
      customer.value = { ...response.data }
      customerDialog.value = true
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
    }
  }

  const viewHistory = (id) => {
    router.push(`/dashboard/customers/${id}`)
  }

  const saveCustomer = async () => {
    submitted.value = true
    if (!customer.value.name?.trim() || !customer.value.phone?.trim()) return

    saving.value = true
    try {
      const payload = {
        name: customer.value.name,
        phone: customer.value.phone,
        address: customer.value.address,
        group: customer.value.group
      }

      if (customer.value.id) {
        await customersAPI.update(customer.value.id, payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.messages.updated'), life: 5000 })
      } else {
        await customersAPI.create(payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.messages.added'), life: 5000 })
      }
      customerDialog.value = false
      loadCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.save_error'), life: 5000 })
    } finally {
      saving.value = false
    }
  }

  const confirmDelete = (data) => {
    confirm.require({
      message: t('customers.messages.delete_confirm', { Name: data.name }),
      header: t('common.confirm_title') || 'Tasdiqlash',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await customersAPI.delete(data.id)
          toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('customers.messages.deleted'), life: 5000 })
          loadCustomers()
        } catch (error) {
          toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.delete_error'), life: 5000 })
        }
      }
    })
  }

  const hideDialog = () => {
    customerDialog.value = false
    submitted.value = false
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { 
      style: 'currency', 
      currency: 'UZS', 
      maximumFractionDigits: 0 
    }).format(val || 0)
  }

  const exportData = async (format = 'excel') => {
    console.log('exportData triggered with format:', format, 'tab:', activeTab.value)
    try {
      const params = { format }
      if (searchQuery.value) params.search = searchQuery.value
      
      let apiCall = null
      let fileName = ''

      if (activeTab.value === 'debtors') {
        if (minDebt.value) params.min_debt = minDebt.value
        apiCall = reportsAPI.exportDebtorReport(params)
        fileName = `qarzdorlar_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`
      } else {
        // activeTab === 'no_debt' (Mijozlar)
        // Additional filters like group or status can be added here if needed
        apiCall = reportsAPI.exportCustomers(params)
        fileName = `mijozlar_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`
      }
      
      toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })

      const res = await apiCall
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
    } catch (error) {
      console.error('Export error:', error)
      const detail = error.response?.status === 403
        ? t('reports.errors.subscription_required')
        : t('reports.errors.export_failed')
      toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
    }
  }

  onMounted(() => {
    loadCustomers()
    loadGroups()
  })

  return {
    router,
    loading,
    saving,
    groups,
    customerDialog,
    submitted,
    activeTab,
    groupedData,
    page,
    pageSize,
    searchQuery,
    minDebt,
    customer,
    customerTabs,
    activeCustomers,
    totalRecords,
    loadCustomers,
    handleSearch,
    openNew,
    editCustomer,
    viewHistory,
    saveCustomer,
    confirmDelete,
    hideDialog,
    formatCurrency,
    exportData
  }
}


