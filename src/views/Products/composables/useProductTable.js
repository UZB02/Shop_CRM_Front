import { ref, watch } from 'vue'
import api from '@/services/api'

export function useProductTable(products) {
  const imageErrors = ref({})
  
  const handleImageError = (id) => {
    imageErrors.value[id] = true
  }
  
  watch(() => products?.value, () => {
    imageErrors.value = {}
  })
  
  const formatNumber = (value) => {
    if (!value) return '0'
    return new Intl.NumberFormat('uz-UZ').format(value)
  }
  
  const formatImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    const base = 'https://shopcrmsystem-production.up.railway.app'
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
      const res = await api.get(
        `/warehouse/products/${item.id || item._id}/barcode/`,
        { responseType: 'blob' }
      )
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
  
  const printBarcode = () => {
    if (!barcodeUrl.value) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Shtrix-kod — ${selectedBarcodeItem.value?.name}</title>
      <style>
        body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: monospace; gap: 12px; }
        img { max-width: 300px; }
        p { font-size: 14px; letter-spacing: 4px; margin: 0; }
      </style></head>
      <body>
        <img src="${barcodeUrl.value}" />
        <p>${selectedBarcodeItem.value?.barcode || ''}</p>
        <script>window.onload = () => { window.print(); window.close() }<\/script>
      </body></html>
    `)
    win.document.close()
  }
  
  return {
    imageErrors,
    handleImageError,
    formatNumber,
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
