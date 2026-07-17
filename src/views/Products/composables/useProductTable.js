import { ref, watch } from 'vue'
import api from '@/services/api'
import { useSettingsStore } from '@/store/settings'
import { useBarcodePrint } from '@/composables/useBarcodePrint'

export function useProductTable(products) {
  const settingsStore = useSettingsStore()
  const { printBarcode: doPrintBarcode } = useBarcodePrint()
  const imageErrors = ref({})
  
  const handleImageError = (id) => {
    imageErrors.value[id] = true
  }
  
  watch(() => products?.value, () => {
    imageErrors.value = {}
  })
  
  
  const formatImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    const base = 'https://api.siriuspos.uz'
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  }
  
  // Barcode modal state
  const showBarcodeModal = ref(false)
  const selectedBarcodeItem = ref(null)
  const barcodeUrl = ref(null)
  const barcodeLoading = ref(false)
  const barcodeError = ref(false)
  
  const viewBarcode = async (item) => {
    selectedBarcodeItem.value = item
    showBarcodeModal.value = true
    barcodeUrl.value = null
    barcodeError.value = false
    barcodeLoading.value = true
    try {
      let endpoint = `/warehouse/products/${item.id || item._id}/barcode/`
      const params = {}
      if (item.tur_id) {
        endpoint = `/warehouse/products/${item.id || item._id}/turlar/${item.tur_id}/barcode/`
        params.show_tur = settingsStore.showTurOnBarcode
      }
      const res = await api.get(endpoint, { params, responseType: 'blob' })
      barcodeUrl.value = URL.createObjectURL(res.data)
    } catch {
      barcodeError.value = true
    } finally {
      barcodeLoading.value = false
    }
  }
  
  const closeBarcodeModal = () => {
    showBarcodeModal.value = false
    if (barcodeUrl.value) {
      URL.revokeObjectURL(barcodeUrl.value)
      barcodeUrl.value = null
    }
  }
  
  const downloadBarcode = () => {
    if (!barcodeUrl.value) return
    const a = document.createElement('a')
    a.href = barcodeUrl.value
    a.download = `barcode-${selectedBarcodeItem.value?.barcode || 'product'}.png`
    a.click()
  }
  
  const printBarcode = (copies = 1) => {
    if (!barcodeUrl.value) return
    doPrintBarcode(barcodeUrl.value, copies)
  }
  
  return {
    imageErrors,
    handleImageError,
    formatImageUrl,
    showBarcodeModal,
    selectedBarcodeItem,
    barcodeUrl,
    barcodeLoading,
    barcodeError,
    viewBarcode,
    closeBarcodeModal,
    downloadBarcode,
    printBarcode
  }
}


