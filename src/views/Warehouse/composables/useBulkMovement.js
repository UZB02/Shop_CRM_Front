import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useStockMovement } from './useStockMovement'
import { warehousesAPI, branchesAPI, salesAPI, suppliersAPI } from '@/services/api'

export function useBulkMovement() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const entityId = route.params.id
  const isBranch = route.path.includes('/branches/')
  
  const displayName = ref('...')
  const STORAGE_KEY = `bulk_movement_${isBranch ? 'branch' : 'wh'}_${entityId}`

  const { products, loadingProducts, saving, loadProducts, saveMovement } = useStockMovement()

  // Initialize state from localStorage if available
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  
  const bulkItems = ref(savedState.items || [])
  const movement_type = ref('in')
  const note = ref(savedState.note || '')
  const supplier = ref(savedState.supplier || null)
  const paidAmount = ref(savedState.paidAmount || '')
  const paymentType = ref(savedState.paymentType || 'cash')
  const suppliersList = ref([])

  // Persistence Watcher
  watch([bulkItems, movement_type, note, supplier, paidAmount, paymentType], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      items: bulkItems.value,
      type: 'in',
      note: note.value,
      supplier: supplier.value,
      paidAmount: paidAmount.value,
      paymentType: paymentType.value
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

    // Frontend validatsiya: paid_amount > 0 bo'lsa supplier majburiy
    const paid = Number(paidAmount.value)
    if (movement_type.value === 'in' && paid > 0 && !supplier.value) {
      toast.add({
        severity: 'warn',
        summary: 'Diqqat',
        detail: 'Qisman to\'lov kiritilganda yetkazib beruvchini tanlash majburiy.',
        life: 5000
      })
      return
    }

    // Frontend validatsiya: paid_amount > totalCost
    if (movement_type.value === 'in' && paid > 0) {
      const totalCost = validItems.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.unit_cost || 0)), 0)
      if (paid > totalCost) {
        toast.add({
          severity: 'error',
          summary: 'Xatolik',
          detail: `paid_amount (${paid.toLocaleString('ru-RU')}) jami tannarxdan (${totalCost.toLocaleString('ru-RU')}) oshib ketishi mumkin emas.`,
          life: 7000
        })
        return
      }
    }

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

      if (movement_type.value === 'in') {
        if (supplier.value) {
          payload.supplier = typeof supplier.value === 'object' ? supplier.value.id : supplier.value
        }
        if (paid > 0) {
          payload.paid_amount = paid
          payload.payment_type = paymentType.value
        }
        // paid_amount = 0 yoki ko'rsatilmagan → to'liq summa qarzga yoziladi (backend default)
      }

      if (isBranch) payload.branch = Number(entityId)
      else payload.warehouse = Number(entityId)

      await saveMovement(payload)
      
      // Muvaffaqiyatli saqlanganda localStorage tozalanadi
      localStorage.removeItem(STORAGE_KEY)
      
      router.back()
    } catch (error) {
      console.error('Error saving bulk movement:', error)
      // Xato useStockMovement ichida toast orqali ko'rsatiladi
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
      
      // Load suppliers list for selection
      const supRes = await suppliersAPI.getAll({ page: 1, limit: 1000 })
      suppliersList.value = supRes.data?.results || []
    } catch (error) {
      console.error('Error fetching entity or suppliers:', error)
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
    router,
    supplier,
    suppliersList,
    paidAmount,
    paymentType
  }
}


