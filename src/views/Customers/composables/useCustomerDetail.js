import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { customersAPI, customerGroupsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useCustomerDetail() {
  const route = useRoute()
  const toast = useToast()
  const { t } = useI18n()

  const loading = ref(true)
  const saving = ref(false)
  const submitted = ref(false)
  const customer = ref(null)
  const purchaseHistory = ref([])
  const debtHistory = ref([])
  const purchaseCount = ref(0)
  const debtCount = ref(0)
  const purchasePage = ref(1)
  const debtPage = ref(1)
  const totalDebt = ref(0)
  const groups = ref([])
  const currentFilters = ref({})
  const purchaseSummary = ref(null)
  const debtSummary = ref(null)
  const activeTab = ref('overview')
  const editDialog = ref(false)
  const payDebtDialog = ref(false)
  const customerToEdit = ref({})
  const selectedTrade = ref(null)
  const displayTradeDetail = ref(false)

  const lastTrades = computed(() => purchaseHistory.value?.slice(0, 3) || [])

  const loadCustomerData = async () => {
    loading.value = true
    try {
      const id = route.params.id
      if (!id) return
      
      const response = await customersAPI.getById(id)
      customer.value = response.data.customer || response.data

      await Promise.all([
        loadPurchases(1),
        loadDebts(1)
      ])
    } catch (error) {
      console.error('Error loading customer details:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
    } finally {
      loading.value = false
    }
  }

  const loadPurchases = async (page = 1) => {
    try {
      const id = route.params.id
      const response = await customersAPI.getPurchases(id, { 
        page, 
        page_size: 10,
        ...currentFilters.value
      })
      purchaseHistory.value = response.data.results || []
      purchaseCount.value = response.data.count || purchaseHistory.value.length
      purchaseSummary.value = response.data.summary || null
      purchasePage.value = page
    } catch (error) {
      console.error('Error loading purchases:', error)
    }
  }

  const loadDebts = async (page = 1) => {
    try {
      const id = route.params.id
      const response = await customersAPI.getDebtSales(id, { 
        page, 
        page_size: 10,
        ...currentFilters.value
      })
      debtHistory.value = response.data.results || []
      debtCount.value = response.data.count || debtHistory.value.length
      debtSummary.value = response.data.summary || null
      totalDebt.value = response.data.total_debt || (debtSummary.value?.total_debt || 0)
      debtPage.value = page
    } catch (error) {
      console.error('Error loading debts:', error)
    }
  }

  const loadGroups = async () => {
    try {
      const response = await customerGroupsAPI.getAll()
      groups.value = response.data.results || response.data
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  const handleFilters = (filters) => {
    currentFilters.value = filters
    loadPurchases(1)
    loadDebts(1)
  }

  const editCustomer = () => {
    customerToEdit.value = { ...customer.value }
    editDialog.value = true
  }

  const saveUpdate = async () => {
    if (!customerToEdit.value.name?.trim() || !customerToEdit.value.phone?.trim()) return

    saving.value = true
    try {
      const payload = {
        name: customerToEdit.value.name,
        phone: customerToEdit.value.phone,
        address: customerToEdit.value.address,
        group: customerToEdit.value.group
      }
      await customersAPI.update(customerToEdit.value.id, payload)
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.updated'), life: 5000 })
      editDialog.value = false
      loadCustomerData()
    } catch (error) {
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error'), life: 5000 })
    } finally {
      saving.value = false
    }
  }

  const showTradeDetail = (trade) => {
    selectedTrade.value = trade
    displayTradeDetail.value = true
  }

  return {
    loading, saving, submitted, customer, purchaseHistory, debtHistory,
    purchaseCount, debtCount, purchasePage, debtPage, totalDebt,
    groups, activeTab, editDialog, payDebtDialog, customerToEdit,
    selectedTrade, displayTradeDetail,
    lastTrades, purchaseSummary, debtSummary,
    loadCustomerData, loadPurchases, loadDebts, loadGroups,
    handleFilters, editCustomer, saveUpdate, showTradeDetail
  }
}
