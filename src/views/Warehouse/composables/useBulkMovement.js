import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockMovement } from './useStockMovement'
import { warehousesAPI, branchesAPI } from '@/services/api'

export function useBulkMovement() {
  const route = useRoute()
  const router = useRouter()
  const entityId = route.params.id
  const isBranch = route.path.includes('/branches/')
  
  const displayName = ref('...')

  const { products, loadingProducts, saving, loadProducts, saveMovement } = useStockMovement()

  const bulkItems = ref([{ product: null, quantity: null, unit_cost: null }])
  const movement_type = ref('in')
  const note = ref('')

  const validItemsCount = computed(() => {
    return bulkItems.value.filter(item => item.product?.id && item.quantity > 0).length
  })

  const addBulkItem = () => {
    bulkItems.value.push({ product: null, quantity: null, unit_cost: null })
  }

  const removeBulkItem = (index) => {
    bulkItems.value.splice(index, 1)
  }

  const handleSave = async () => {
    const validItems = bulkItems.value.filter(item => item.product?.id && item.quantity > 0)
    if (validItems.length === 0) return

    try {
      const payload = {
        isBulk: true,
        movement_type: movement_type.value,
        note: note.value,
        items: validItems.map(item => ({
          product: item.product.id,
          tur: item.product.tur_id || null,
          quantity: item.quantity,
          unit_cost: item.unit_cost || 0
        }))
      }

      if (isBranch) payload.branch = entityId
      else payload.warehouse = entityId

      await saveMovement(payload)
      router.back()
    } catch (error) {
      console.error('Error saving bulk movement:', error)
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
    addBulkItem,
    removeBulkItem,
    handleSave,
    loadProducts,
    router
  }
}
