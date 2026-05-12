import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI, reportsAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import i18n from '@/i18n'

export function useWarehouseDetail() {
  const route = useRoute()
  const router = useRouter()
  const settingsStore = useSettingsStore()

  const warehouse = ref(null)
  const loading = ref(true)
  const tabLoading = ref(false)
  const activeTab = ref('products')
  
  const barcodeVisible = ref(false)
  const selectedProduct = ref(null)
  const productSearch = ref('')
  const pendingCount = ref(0)
  
  const incomingHistory = ref([])
  const incomingTotal = ref(0)
  const incomingPage = ref(1)
  const incomingRows = ref(10)

  const wastageModalVisible = ref(false)
  const selectedProductForWastage = ref(null)
  const wastagesTabRef = ref(null)

  // Computed
  const filteredProducts = computed(() => {
    const products = warehouse.value?.products ?? []
    if (!productSearch.value.trim()) return products
    const q = productSearch.value.toLowerCase()
    return products.filter(p =>
      p.product_name?.toLowerCase().includes(q) ||
      p.barcode?.toLowerCase().includes(q)
    )
  })

  const navTabs = computed(() => {
    const tabs = [
      { id: 'products', label: i18n.global.t('warehouse.detail.products'), icon: 'pi-box', count: warehouse.value?.products?.length ?? 0 },
      { id: 'transfers', label: i18n.global.t('warehouse.detail.transfers'), icon: 'pi-arrows-h', count: pendingCount.value > 0 ? pendingCount.value : undefined },
      { id: 'incoming', label: i18n.global.t('warehouse.detail.incoming_history'), icon: 'pi-history', count: incomingHistory.value?.length > 0 ? incomingHistory.value.length : undefined },
    ]

    if (settingsStore.isWastageEnabled) {
      tabs.push({ id: 'wastages', label: i18n.global.t('warehouse.wastage.title'), icon: 'pi-exclamation-triangle' })
    }

    return tabs
  })

  // Methods
  const fetchWarehouseDetails = async (tab = null) => {
    if (tab) tabLoading.value = true
    else if (!warehouse.value) loading.value = true
    
    try {
      const params = tab === 'incoming' ? { page: incomingPage.value } : (tab ? { tab } : {})
      const warehouseId = route.params.id
      
      const res = await (tab === 'incoming' 
        ? warehousesAPI.getIncoming(warehouseId, params)
        : warehousesAPI.getById(warehouseId, params)
      )
      
      if (tab && warehouse.value) {
        if (tab === 'incoming') {
          incomingHistory.value = res.data.results || res.data
          incomingTotal.value = res.data.count || (Array.isArray(res.data) ? res.data.length : 0)
        } else if (res.data[tab]) {
          warehouse.value[tab] = res.data[tab]
        } else {
          warehouse.value = res.data
        }
      } else {
        warehouse.value = res.data
        if (!tab) {
           const incRes = await warehousesAPI.getIncoming(warehouseId, { page: 1 })
           incomingHistory.value = incRes.data.results || incRes.data
           incomingTotal.value = incRes.data.count || (Array.isArray(incRes.data) ? incRes.data.length : 0)
        }
      }
    } catch (error) {
      console.error('Error fetching warehouse details:', error)
    } finally {
      loading.value = false
      tabLoading.value = false
    }
  }

  const showBarcode = (product) => {
    selectedProduct.value = product
    barcodeVisible.value = true
  }

  const downloadBarcode = async () => {
    if (!selectedProduct.value?.barcode_image_url) return
    
    try {
      const response = await fetch(selectedProduct.value.barcode_image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `barcode_${selectedProduct.value.barcode || selectedProduct.value.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const openWastageModal = (product) => {
    selectedProductForWastage.value = product
    wastageModalVisible.value = true
  }

  const onWastageSaved = () => {
    fetchWarehouseDetails()
    if (activeTab.value === 'wastages' && wastagesTabRef.value) {
      wastagesTabRef.value.refresh()
    }
  }

  const onIncomingPageChange = (event) => {
    incomingPage.value = event.page + 1
    fetchWarehouseDetails('incoming')
  }

  const openMovementDialog = () => {
    if (warehouse.value) {
      router.push({
        name: 'warehouse-bulk',
        params: { id: warehouse.value.id || warehouse.value._id }
      })
    }
  }

  const openNewTransferHandler = () => {
    router.push({
      name: 'warehouse-transfer-create',
      params: { id: warehouse.value?.id || warehouse.value?._id }
    })
  }

  // Watchers
  watch(activeTab, (tab) => {
    if (tab === 'transfers') return
    fetchWarehouseDetails(tab)
  })

  const exportStocks = async () => {
    if (!warehouse.value) return
    try {
      const warehouseId = warehouse.value.id || warehouse.value._id
      const res = await reportsAPI.exportStocks({ warehouse: warehouseId })
      
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `qoldiqlar_${warehouse.value.name}_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export stocks error:', error)
    }
  }

  onMounted(() => {
    fetchWarehouseDetails()
  })

  return {
    warehouse,
    loading,
    tabLoading,
    activeTab,
    barcodeVisible,
    selectedProduct,
    productSearch,
    pendingCount,
    incomingHistory,
    incomingTotal,
    incomingPage,
    incomingRows,
    wastageModalVisible,
    selectedProductForWastage,
    wastagesTabRef,
    filteredProducts,
    navTabs,
    showBarcode,
    downloadBarcode,
    openWastageModal,
    onWastageSaved,
    onIncomingPageChange,
    openMovementDialog,
    openNewTransferHandler,
    exportStocks
  }
}


