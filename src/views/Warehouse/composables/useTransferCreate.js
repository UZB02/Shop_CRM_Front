import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { warehousesAPI, branchesAPI } from '@/services/api'
import { useTransfers } from '@/composables/useTransfers'

export function useTransferCreate() {
  const route = useRoute()
  const router = useRouter()
  const entityId = route.params.id
  const isBranch = computed(() => route.path.includes('/branches/'))

  const targetType = ref('branch')
  const showProductSelect = ref(false)
  const productSearch = ref('')
  const sourceName = ref('')
  const availableProducts = ref([])

  const {
    transferForm,
    subLoading,
    branches,
    warehouses,
    fetchLocations,
    createTransfer
  } = useTransfers()

  const isValid = computed(() => {
    const hasTarget = targetType.value === 'branch'
      ? !!transferForm.value.to_branch
      : !!transferForm.value.to_warehouse
    return hasTarget && transferForm.value.items.length > 0 && transferForm.value.items.every(i => i.quantity > 0)
  })

  const filteredBranches = computed(() =>
    branches.value.filter(b => String(b.id || b._id) !== String(entityId))
  )
  const filteredWarehouses = computed(() =>
    warehouses.value.filter(w => String(w.id || w._id) !== String(entityId))
  )

  const selectedDestinationName = computed(() => {
    if (targetType.value === 'branch' && transferForm.value.to_branch) {
      return filteredBranches.value.find(b => (b.id || b._id) == transferForm.value.to_branch)?.name
    }
    if (targetType.value === 'warehouse' && transferForm.value.to_warehouse) {
      return filteredWarehouses.value.find(w => (w.id || w._id) == transferForm.value.to_warehouse)?.name
    }
    return null
  })

  const filteredAvailableProducts = computed(() => {
    if (!productSearch.value.trim()) return availableProducts.value
    const q = productSearch.value.toLowerCase()
    return availableProducts.value.filter(p =>
      (p.product_name || p.name || '').toLowerCase().includes(q) ||
      (p.barcode || '').includes(q)
    )
  })

  const addProduct = (p) => {
    const existing = transferForm.value.items.find(i => {
      const pId = i.product.product_id || i.product.id
      const newPId = p.product_id || p.id
      return pId === newPId && i.product.tur_id === p.tur_id
    })
    if (existing) {
      existing.quantity = Number(existing.quantity) + 1
    } else {
      transferForm.value.items.push({ product: p, quantity: 1, note: '' })
    }
    showProductSelect.value = false
    productSearch.value = ''
  }

  const removeItem = (idx) => {
    transferForm.value.items.splice(idx, 1)
  }

  const loadSourceData = async () => {
    try {
      const api = isBranch.value ? branchesAPI : warehousesAPI
      const res = await api.getById(entityId)
      if (res.data) {
        sourceName.value = res.data.name
        availableProducts.value = res.data.products || []
        if (isBranch.value) {
          transferForm.value.from_branch = entityId
          transferForm.value.from_warehouse = null
        } else {
          transferForm.value.from_warehouse = entityId
          transferForm.value.from_branch = null
        }
      }
    } catch (e) {
      console.error('Error fetching source data', e)
    }
  }

  const stockErrors = ref(null)

  const submitTransfer = async () => {
    if (!isValid.value) return
    stockErrors.value = null
    
    const result = await createTransfer()
    
    if (result === true) {
      router.back()
    } else if (result && result.validationErrors) {
      stockErrors.value = result.validationErrors
    }
  }

  const resetForm = () => {
    transferForm.value.items = []
    transferForm.value.note = ''
    transferForm.value.to_branch = null
    transferForm.value.to_warehouse = null
  }

  return {
    router,
    targetType,
    showProductSelect,
    productSearch,
    sourceName,
    availableProducts,
    transferForm,
    subLoading,
    isValid,
    filteredBranches,
    filteredWarehouses,
    selectedDestinationName,
    filteredAvailableProducts,
    addProduct,
    removeItem,
    loadSourceData,
    submitTransfer,
    fetchLocations,
    resetForm,
    stockErrors
  }
}
