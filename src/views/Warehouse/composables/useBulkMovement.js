import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockMovement } from './useStockMovement'
import { warehousesAPI } from '@/services/api'

export function useBulkMovement() {
  const route = useRoute()
  const router = useRouter()
  const warehouseId = route.params.id
  const warehouseName = ref('...')

  const { products, saving, loadProducts, saveMovement } = useStockMovement()

  const bulkItems = ref([{ product: null, quantity: null, unit_cost: null }])
  const movement_type = ref('in')
  const note = ref('')

  const validItemsCount = computed(() => {
    return bulkItems.value.filter(item => item.product && item.quantity > 0).length
  })

  const addBulkItem = () => {
    bulkItems.value.push({ product: null, quantity: null, unit_cost: null })
  }

  const removeBulkItem = (index) => {
    bulkItems.value.splice(index, 1)
  }

  const handleSave = async () => {
    const validItems = bulkItems.value.filter(item => item.product && item.quantity > 0)
    if (validItems.length === 0) return

    try {
      await saveMovement({
        isBulk: true,
        movement_type: movement_type.value,
        warehouse: warehouseId,
        note: note.value,
        items: validItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unit_cost: item.unit_cost || 0
        }))
      })
      router.back()
    } catch (error) {
      console.error('Error saving bulk movement:', error)
    }
  }

  onMounted(async () => {
    loadProducts()
    try {
      const res = await warehousesAPI.getById(warehouseId)
      warehouseName.value = res.data.name
    } catch (error) {
      console.error('Error fetching warehouse:', error)
    }
  })

  return {
    warehouseName,
    products,
    saving,
    bulkItems,
    movement_type,
    note,
    validItemsCount,
    addBulkItem,
    removeBulkItem,
    handleSave,
    router
  }
}
