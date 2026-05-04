import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockMovement } from './useStockMovement'
import { warehousesAPI, branchesAPI, salesAPI } from '@/services/api'

export function useBulkMovement() {
  const route = useRoute()
  const router = useRouter()
  const entityId = route.params.id
  const isBranch = route.path.includes('/branches/')
  
  const displayName = ref('...')
  const STORAGE_KEY = `bulk_movement_${isBranch ? 'branch' : 'wh'}_${entityId}`

  const { products, loadingProducts, saving, loadProducts, saveMovement } = useStockMovement()

  // Initialize state from localStorage if available
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  
  const bulkItems = ref(savedState.items || [])
  const movement_type = ref(savedState.type || 'in')
  const note = ref(savedState.note || '')

  // Persistence Watcher
  watch([bulkItems, movement_type, note], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      items: bulkItems.value,
      type: movement_type.value,
      note: note.value
    }))
  }, { deep: true })

  const validItemsCount = computed(() => {
    return bulkItems.value.filter(item => item.product?.id && item.quantity > 0).length
  })

  const addItem = (product) => {
    const existing = bulkItems.value.find(item => 
      item.product.id === product.id && 
      (item.product.tur_id === product.tur_id)
    )

    if (existing) {
      existing.quantity++
    } else {
      bulkItems.value.unshift({ 
        product: { ...product }, 
        quantity: 1, 
        unit_cost: product.cost_price || 0 
      })
    }
  }

  const removeBulkItem = (index) => {
    bulkItems.value.splice(index, 1)
  }

  const updateQty = (index, qty) => {
    bulkItems.value[index].quantity = qty
  }

  const updatePrice = (index, price) => {
    bulkItems.value[index].unit_cost = price
  }

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY)
    router.back()
  }

  const handleSave = async () => {
    const validItems = bulkItems.value.filter(item => item.product?.id && item.quantity > 0)
    if (validItems.length === 0) return

    try {
      const payload = {
        isBulk: true,
        movement_type: movement_type.value,
        note: note.value,
        items: validItems.map(item => {
          const itemData = {
            product: item.product.id,
            quantity: item.quantity,
            unit_cost: item.unit_cost || 0
          }
          if (item.product.has_tur && item.product.tur_id != null) {
            itemData.tur_id = item.product.tur_id
          }
          return itemData
        })
      }

      if (isBranch) payload.branch = entityId
      else payload.warehouse = entityId

      await saveMovement(payload)
      
      // Clear persistence on success
      localStorage.removeItem(STORAGE_KEY)
      
      router.back()
    } catch (error) {
      console.error('Error saving bulk movement:', error)
    }
  }

  const scanAndAdd = async (barcode) => {
    if (!barcode) return
    saving.value = true
    try {
      const res = await salesAPI.scanProduct(barcode)
      if (res.data) {
        const { type, tur_required, matched_tur, product } = res.data
        
        if (tur_required) {
          return { needs_tur: true, product }
        }
        
        // If matched_tur exists, we pass it to addItem as variant info
        const productToAdd = { ...product }
        if (type === 'tur' && matched_tur) {
          productToAdd.tur_id = matched_tur.id
          productToAdd.tur_name = matched_tur.name
          productToAdd.tur_color = matched_tur.color
          productToAdd.barcode = matched_tur.barcode || product.barcode
        }
        
        addItem(productToAdd)
        return true
      }
    } catch (err) {
      // getErrorMessage handles the 404 or other errors
      throw err
    } finally {
      saving.value = false
    }
  }

  onMounted(async () => {
    loadProducts()
    try {
      if (isBranch) {
        const res = await branchesAPI.getById(entityId)
        displayName.value = res.data.name
      } else {
        const res = await warehousesAPI.getById(entityId)
        displayName.value = res.data.name
      }
    } catch (error) {
      console.error('Error fetching entity:', error)
    }
  })

  return {
    warehouseName: displayName,
    products,
    loadingProducts,
    saving,
    bulkItems,
    movement_type,
    note,
    validItemsCount,
    addItem,
    removeBulkItem,
    updateQty,
    updatePrice,
    handleSave,
    handleCancel,
    loadProducts,
    scanAndAdd,
    router
  }
}


