import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { warehousesAPI, reportsAPI, movementsAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import { useToast } from 'primevue/usetoast'
import i18n from '@/i18n'

export function useWarehouseDetail() {
  const route = useRoute()
  const router = useRouter()
  const settingsStore = useSettingsStore()
  const toast = useToast()
  const { t } = i18n.global

  const warehouse = ref(null)
  const loading = ref(true)
  const tabLoading = ref(false)
  // Initialize activeTab from URL query params (default: 'products')
  const activeTab = ref(route.query.tab || 'products')
  
  const barcodeVisible = ref(false)
  const selectedProduct = ref(null)
  const productSearch = ref('')
  const pendingCount = ref(0)
  
  const incomingHistory = ref([])
  const incomingTotal = ref(0)
  const incomingPage = ref(1)
  const incomingRows = ref(10)

  // Void states
  const voidingId = ref(null)
  const voidingReason = ref('')
  const voidingLoading = ref(false)
  const voidingDialogVisible = ref(false)

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

  const openVoidDialog = (item) => {
    voidingId.value = item.id
    voidingReason.value = ''
    voidingDialogVisible.value = true
  }

  const confirmVoid = async () => {
    if (!voidingId.value) return
    if (!voidingReason.value.trim()) {
      toast.add({
        severity: 'warn',
        summary: t('common.confirm_title') || 'Ogohlantirish',
        detail: t('warehouse.detail.void_reason_required') || 'Bekor qilish sababini kiriting',
        life: 3000
      })
      return
    }

    try {
      voidingLoading.value = true
      const res = await movementsAPI.void(voidingId.value, {
        reason: voidingReason.value.trim()
      })
      
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: res.data?.detail || t('warehouse.detail.void_success') || 'Kirim muvaffaqiyatli bekor qilindi.',
        life: 3000
      })
      
      voidingDialogVisible.value = false
      await fetchWarehouseDetails('incoming')
    } catch (err) {
      console.error('Error voiding movement:', err)
      const errorMsg = err.response?.data?.detail || t('warehouse.detail.void_error') || 'Bekor qilishda xatolik yuz berdi'
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: errorMsg,
        life: 5000
      })
    } finally {
      voidingLoading.value = false
    }
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
    router.replace({
      query: {
        ...route.query,
        tab
      }
    })
    if (tab === 'transfers') return
    fetchWarehouseDetails(tab)
  })

  // Keep activeTab in sync with browser query changes (e.g. back/forward navigation)
  watch(
    () => route.query.tab,
    (newTab) => {
      if (newTab && newTab !== activeTab.value) {
        activeTab.value = newTab
      }
    }
  )

  const exportStocks = async () => {
    if (!warehouse.value) return
    try {
      toast.add({ severity: 'info', summary: t('common.processing'), detail: t('reports.export_started'), life: 2000 })
      
      const warehouseId = warehouse.value.id || warehouse.value._id
      const res = await reportsAPI.exportStocks({ warehouse: warehouseId })
      
      if (res.data.type === 'text/html') {
          toast.add({ severity: 'error', summary: t('common.error'), detail: 'Backend Error: Received HTML instead of File. Check vercel.json proxy.', life: 5000 })
          return
      }

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `qoldiqlar_${warehouse.value.name}_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.add({ severity: 'success', summary: t('common.success'), detail: t('reports.export_success'), life: 3000 })
    } catch (error) {
      console.error('Export stocks error:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('reports.errors.export_failed'), life: 4000 })
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
    exportStocks,
    
    // Void exports
    voidingReason,
    voidingLoading,
    voidingDialogVisible,
    openVoidDialog,
    confirmVoid
  }
}


