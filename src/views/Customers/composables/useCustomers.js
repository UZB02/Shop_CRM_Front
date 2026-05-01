import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { customersAPI, customerGroupsAPI } from '@/services/api'

export function useCustomers() {
  const router = useRouter()
  const toast = useToast()
  const confirm = useConfirm()
  const { t } = useI18n()

  const loading = ref(false)
  const saving = ref(false)
  const groups = ref([])
  const customerDialog = ref(false)
  const submitted = ref(false)

  const activeTab = ref('no_debt')
  const groupedData = ref({
    debtors: { count: 0, results: [], total_debt_balance: 0, current_page: 1 },
    no_debt: { count: 0, results: [], current_page: 1 }
  })

  const page = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
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

  // Watch for tab change to reset page and reload
  watch(activeTab, () => {
    page.value = 1
    loadCustomers()
  })

  const loadCustomers = async () => {
    loading.value = true
    try {
      const params = { 
        page: page.value, 
        limit: pageSize.value,
        search: searchQuery.value || undefined 
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
      message: t('customers.messages.delete_confirm', { name: data.name }),
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
    formatCurrency
  }
}


