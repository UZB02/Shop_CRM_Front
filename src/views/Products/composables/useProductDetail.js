import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { productsAPI } from '@/services/api'

export function useProductDetail() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const confirm = useConfirm()

  const product = ref(null)
  const loading = ref(true)

  const fetchProduct = async () => {
    loading.value = true
    try {
      const response = await productsAPI.getById(route.params.id)
      product.value = response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulot ma\'lumotlarini yuklab bo\'lmadi', life: 5000 })
    } finally {
      loading.value = false
    }
  }

  const formatPrice = (value) => {
    if (value === null || value === undefined) return '0'
    return Number(value).toLocaleString('uz-UZ')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return dateStr
  }

  const calculateMargin = () => {
    if (!product.value?.purchase_price || !product.value?.sale_price) return 0
    const buy = Number(product.value.purchase_price)
    const sell = product.value.active_promotion ? Number(product.value.active_promotion.discounted_price) : Number(product.value.sale_price)
    if (buy === 0) return 0
    return (((sell - buy) / buy) * 100).toFixed(1)
  }

  const printBarcode = () => {
    if (!product.value?.barcode_image_url) return
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
          <img src="${product.value.barcode_image_url}" />
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

  const confirmDelete = () => {
    confirm.require({
      message: `"${product.value?.name}" mahsulotini o'chirishni tasdiqlaysizmi?`,
      header: 'O\'chirishni Tasdiqlash',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: 'Ha, o\'chirilsin',
      rejectLabel: 'Bekor qilish',
      accept: async () => {
        try {
          await productsAPI.delete(product.value.id)
          toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot o\'chirildi', life: 3000 })
          router.push('/dashboard/products')
        } catch (error) {
          toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 5000 })
        }
      }
    })
  }

  onMounted(() => {
    fetchProduct()
  })

  return {
    product,
    loading,
    router,
    formatPrice,
    formatDate,
    calculateMargin,
    fetchProduct,
    printBarcode,
    confirmDelete
  }
}


