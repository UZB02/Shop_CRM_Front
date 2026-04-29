import { ref, computed } from 'vue'
import { productsAPI, customersAPI } from '@/services/api'
import { useSaleReturns } from './useSaleReturns'

export function useReturnCart(props, emit, close) {
  const { createReturn, loading } = useSaleReturns()

  const productQuery = ref('')
  const searchResults = ref([])
  const returnItems = ref([])
  const reason = ref('')
  const selectedCustomerId = ref(null)
  const customers = ref([])

  const totalAmount = computed(() => {
    return returnItems.value.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
  })

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll({ page_size: 100 })
      customers.value = response.data.results || []
    } catch (e) {
      console.error('Failed to load customers')
    }
  }

  const resetForm = () => {
    reason.value = ''
    returnItems.value = []
    productQuery.value = ''
    searchResults.value = []

    if (props.initialSale) {
      selectedCustomerId.value = props.initialSale.customer_id
    } else {
      selectedCustomerId.value = null
      loadCustomers()
    }
  }

  let searchTimeout = null
  const onSearchProducts = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (!productQuery.value.trim()) {
      searchResults.value = []
      return
    }

    searchTimeout = setTimeout(async () => {
      try {
        const response = await productsAPI.getAll({ search: productQuery.value, page_size: 5 })
        searchResults.value = response.data.results || []
      } catch (e) {
        console.error('Search failed')
      }
    }, 400)
  }

  const addProduct = (p) => {
    const existing = returnItems.value.find(item => item.product === p.id)
    if (existing) {
      existing.quantity += 1
    } else {
      returnItems.value.push({
        product: p.id,
        product_name: p.name,
        quantity: 1,
        unit_price: p.selling_price,
        unit: p.unit
      })
    }
    productQuery.value = ''
    searchResults.value = []
  }

  const addFromSale = (saleItem) => {
    const qty = parseFloat(saleItem.quantity || 0)
    const returnedQty = parseFloat(saleItem.returned_qty || 0)
    const netQty = parseFloat(saleItem.net_qty || (qty - returnedQty))

    returnItems.value.push({
      product: saleItem.product_id || saleItem.product,
      tur_id: saleItem.tur_id,
      tur_name: saleItem.tur_name,
      tur_color: saleItem.tur_color,
      product_name: saleItem.product_name,
      quantity: netQty,
      unit_price: parseFloat(saleItem.unit_price),
      unit: saleItem.unit || 'dona',
      max_qty: netQty
    })
  }

  const isAlreadyAdded = (productId, turId = null) => {
    return returnItems.value.some(item => item.product === productId && item.tur_id === turId)
  }

  const removeItem = (idx) => {
    returnItems.value.splice(idx, 1)
  }

  const updateQty = (idx, delta) => {
    const item = returnItems.value[idx]
    const newVal = parseFloat(item.quantity) + delta

    // Enforce 0 < newVal <= max_qty (if max_qty exists)
    if (newVal > 0) {
      if (item.max_qty !== undefined && newVal > item.max_qty) {
        return
      }
      item.quantity = newVal
    }
  }

  const submitReturn = async () => {
    if (!returnItems.value.length) return
    const payload = {
      reason: reason.value || undefined,
      items: returnItems.value.map(it => ({
        product: it.product,
        quantity: it.quantity.toString(),
        unit_price: it.unit_price.toString(),
        ...(it.tur_id && { tur: it.tur_id })
      }))
    }

    if (props.initialSale?.id) payload.sale = props.initialSale.id
    if (selectedCustomerId.value) payload.customer = selectedCustomerId.value

    try {
      await createReturn(payload)
      emit('success')
      close()
    } catch (e) {
      // Error handled in composable toast
    }
  }

  return {
    productQuery,
    searchResults,
    returnItems,
    reason,
    selectedCustomerId,
    customers,
    totalAmount,
    loading,
    resetForm,
    onSearchProducts,
    addProduct,
    addFromSale,
    isAlreadyAdded,
    removeItem,
    updateQty,
    submitReturn,
    loadCustomers
  }
}
