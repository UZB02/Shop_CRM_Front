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
  const movement_type = ref(savedState.type || 'in')
  const note = ref(savedState.note || '')
  const supplier = ref(savedState.supplier || null)
  const paidAmount = ref(savedState.paidAmount || '')
  const paymentType = ref(savedState.paymentType || 'cash')
  const suppliersList = ref([])

  // Persistence Watcher
  watch([bulkItems, movement_type, note, supplier, paidAmount, paymentType], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      items: bulkItems.value,
      type: movement_type.value,
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
    if (validItems.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Diqqat',
        detail: 'Kamida bitta mahsulot kiritilishi shart.',
        life: 5000
      })
      return
    }

    // Frontend validation: check if any item is has_tur=true but has no tur_id
    const missingTurItem = validItems.find(item => item.product.has_tur && item.product.tur_id == null)
    if (missingTurItem) {
      toast.add({
        severity: 'error',
        summary: 'Xatolik',
        detail: `"${missingTurItem.product.name}" mahsuloti tur tizimiga ega. tur_id ko'rsatilishi shart.`,
        life: 7000
      })
      return
    }

    // Frontend validatsiya: paid_amount > 0 bo'lsa supplier majburiy
    const paid = Number(paidAmount.value || 0)
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
          detail: `To'lov summasi jami narxdan (${totalCost.toLocaleString('ru-RU')}) oshib ketishi mumkin emas.`,
          life: 7000
        })
        return
      }
    }

    try {
      const payload = {
        isBulk: true,
        movement_type: movement_type.value,
        description: note.value || '',
        paid_amount: movement_type.value === 'in' ? Number(paid).toFixed(2) : '0.00',
        payment_type: movement_type.value === 'in' && paid > 0 ? paymentType.value : 'cash',
        supplier: movement_type.value === 'in' && supplier.value 
          ? (typeof supplier.value === 'object' ? supplier.value.id : Number(supplier.value)) 
          : null,
        items: validItems.map(item => {
          const itemData = {
            product: Number(item.product.id),
            quantity: Number(item.quantity).toFixed(3),
            unit_cost: Number(item.unit_cost || 0).toFixed(2)
          }
          if (item.product.has_tur && item.product.tur_id != null) {
            itemData.tur_id = Number(item.product.tur_id)
          }
          return itemData
        })
      }

      // Mutual exclusion validation: exactly one of branch or warehouse must be provided, the other is null
      if (isBranch) {
        payload.branch = Number(entityId)
        payload.warehouse = null
      } else {
        payload.branch = null
        payload.warehouse = Number(entityId)
      }

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


