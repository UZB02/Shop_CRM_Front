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
  
  
  const formatImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return url.startsWith('/') ? url : `/${url}`
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
      <html>
        <head>
          <title>Shtrix-kod</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #fff;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${barcodeUrl.value}" />
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          <\/script>
        </body>
      </html>
    `)
    win.document.close()
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


