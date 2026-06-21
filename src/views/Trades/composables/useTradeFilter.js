import { ref, watch, onMounted, computed } from 'vue'
import { customersAPI, branchesAPI, workersAPI, shiftsAPI } from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

export function useTradeFilter(props, emit, customerAutocomplete = null) {
  const authStore = useAuthStore()
  const { t } = useI18n()

  const hideAutocomplete = () => {
    if (customerAutocomplete && customerAutocomplete.value) {
      customerAutocomplete.value.hide?.()
      const inputEl = customerAutocomplete.value.$el?.querySelector('input')
      if (inputEl) {
        inputEl.blur()
      }
    }
  }

  const showFilters = ref(false)
  const selectedCustomer = ref(null)
  const customerSuggestions = ref([])

  const branchOptions = ref([{ id: '', name: t('common.all') }])
  const workerOptions = ref([{ id: '', full_name: t('common.all') }])
  const shiftOptions = ref([{ id: '', name: t('common.all') || 'Barchasi' }])

  const isSeller = computed(() => {
    const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
    return role === 'seller'
  })

  const hasActiveFilters = computed(() => {
    return Object.keys(props.filters).some(key => {
      if (key === 'search') return false // Ignore general search
      return props.filters[key] !== '' && props.filters[key] !== null && props.filters[key] !== undefined
    })
  })

  const statusOptions = computed(() => [
    { label: t('trades.status.all'), value: '' },
    { label: t('trades.status.completed'), value: 'completed' },
    { label: t('trades.status.cancelled'), value: 'cancelled' },
    { label: t('trades.status.returned'), value: 'returned' },
    { label: t('trades.status.partially_returned'), value: 'partially_returned' }
  ])

  const paymentOptions = computed(() => [
    { label: t('trades.payment.all'), value: '' },
    { label: t('trades.payment.cash'), value: 'cash' },
    { label: t('trades.payment.card'), value: 'card' },
    { label: t('trades.payment.mixed'), value: 'mixed' },
    { label: t('trades.payment.debt'), value: 'debt' }
  ])

  const onApply = () => {
    emit('search')
    showFilters.value = false
  }

  const onDateFromChange = (val) => {
    if (!val) {
      emit('update:filter', { date_from: '' })
      return
    }
    const dateObj = new Date(val)
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    emit('update:filter', { date_from: `${yyyy}-${mm}-${dd}` })
  }

  const onDateToChange = (val) => {
    if (!val) {
      emit('update:filter', { date_to: '' })
      return
    }
    const dateObj = new Date(val)
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    emit('update:filter', { date_to: `${yyyy}-${mm}-${dd}` })
  }

  const searchCustomers = async (event) => {
    const query = event.query?.trim()
    if (query && /^9\d{12}$/.test(query)) {
      emit('update:searchQuery', query)
      selectedCustomer.value = null
      customerSuggestions.value = []
      hideAutocomplete()
      return
    }

    try {
      const res = await customersAPI.getAll({ search: event.query, limit: 15 })
      customerSuggestions.value = res.data.results || res.data || []
    } catch (error) {
      console.error('Error searching customers:', error)
    }
  }

  const onCustomerSelect = (event) => {
    if (event.value && event.value.id) {
      emit('update:filter', { customer: event.value.id })
      emit('search')
    }
  }

  const onCustomerClear = () => {
    selectedCustomer.value = null
    emit('update:filter', { customer: '' })
    emit('search')
  }

  watch(selectedCustomer, (newVal) => {
    if (typeof newVal === 'string') {
      const val = newVal.trim()
      if (/^9\d{12}$/.test(val)) {
        emit('update:searchQuery', val)
        selectedCustomer.value = null
        customerSuggestions.value = []
        hideAutocomplete()
        return
      }
    }
    if (!newVal) {
      emit('update:filter', { customer: '' })
      emit('search')
    }
  })

  const onReset = () => {
    selectedCustomer.value = null
    emit('reset')
  }

  onMounted(async () => {
    try {
      const [bRes, wRes, sRes] = await Promise.all([
        branchesAPI.getAll(),
        workersAPI.getAll(),
        shiftsAPI.getAll({ page_size: 100 })
      ])
      const loadedBranches = bRes.data.results || bRes.data || []
      const loadedWorkers = wRes.data.results || wRes.data || []
      const loadedShifts = sRes.data.results || sRes.data || []

      branchOptions.value = [
        { id: '', name: t('common.all') },
        ...loadedBranches
      ]

      workerOptions.value = [
        { id: '', full_name: t('common.all') },
        ...loadedWorkers.map(w => ({
          id: w.id,
          full_name: w.full_name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.name || t('workers.unknown')
        }))
      ]

      shiftOptions.value = [
        { id: '', name: t('common.all') || 'Barchasi' },
        ...loadedShifts.map(s => ({
          id: s.id,
          name: `#${s.id} - ${s.worker?.full_name || s.worker?.first_name || 'Smena'} (${new Date(s.opened_at).toLocaleDateString('uz-UZ', {day:'2-digit', month:'2-digit'})})`
        }))
      ]
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  })

  return {
    showFilters,
    selectedCustomer,
    customerSuggestions,
    branchOptions,
    workerOptions,
    shiftOptions,
    isSeller,
    hasActiveFilters,
    statusOptions,
    paymentOptions,
    onApply,
    onDateFromChange,
    onDateToChange,
    searchCustomers,
    onCustomerSelect,
    onCustomerClear,
    onReset
  }
}
