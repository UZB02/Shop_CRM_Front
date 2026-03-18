import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { productsAPI } from '@/services/api'

export function useProducts() {
    const toast = useToast()
    const confirm = useConfirm()

    const loading = ref(false)
    const products = ref([])
    const totalProducts = ref(0)
    const currentPage = ref(1)
    const rowsPerPage = ref(15)
    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const selectedStatus = ref(null)

    const loadProducts = async () => {
        loading.value = true
        try {
            const params = {
                page: currentPage.value,
                page_size: rowsPerPage.value
            }
            if (searchQuery.value) params.search = searchQuery.value
            if (selectedCategory.value != null) params.category = selectedCategory.value
            if (selectedStatus.value) params.status = selectedStatus.value

            const response = await productsAPI.getAll(params)
            console.log('API Products Response:', response.data)

            products.value = response.data.results || []
            totalProducts.value = response.data.count || 0
        } catch (error) {
            console.error('Error loading products:', error)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulotlarni yuklashda xatolik', life: 5000 })
        } finally {
            loading.value = false
        }
    }

    const handleSearch = (query) => {
        searchQuery.value = query
        currentPage.value = 1
        loadProducts()
    }

    const handlePageChange = (event) => {
        currentPage.value = event.page + 1
        rowsPerPage.value = event.rows
        loadProducts()
    }

    const confirmDeleteProduct = (data) => {
        confirm.require({
            message: `"${data.name}" ni o'chirishni tasdiqlaysizmi?`,
            header: 'Tasdiqlash',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    const id = data.id || data._id
                    await productsAPI.delete(id)
                    toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot o\'chirildi', life: 5000 })
                    loadProducts()
                } catch (error) {
                    console.error('Product deletion error:', error)
                    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 5000 })
                }
            }
        })
    }

    return {
        loading,
        products,
        totalProducts,
        currentPage,
        rowsPerPage,
        searchQuery,
        selectedCategory,
        selectedStatus,
        loadProducts,
        handleSearch,
        handlePageChange,
        confirmDeleteProduct
    }
}
