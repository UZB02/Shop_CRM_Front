import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAppConfirm as useConfirm } from '@/composables/useAppConfirm'
import { productsAPI } from '@/services/api'
import { useNotificationStore } from '@/store/notifications'

export function useProducts() {
    const toast = useToast()
    const confirm = useConfirm()
    const notificationStore = useNotificationStore()

    const loading = ref(false)
    const products = ref([])
    const totalProducts = ref(0)
    const currentPage = ref(1)
    const rowsPerPage = ref(10)
    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const selectedSubcategory = ref(null)
    const selectedStatus = ref(null)
    const selectedPromotion = ref(null)
    const subcategories = ref([])

    let lastRequestId = 0

    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) {
            subcategories.value = []
            selectedSubcategory.value = null
            return
        }
        try {
            const { subcategoriesAPI } = await import('@/services/api')
            const res = await subcategoriesAPI.getAll({ category: categoryId })
            subcategories.value = Array.isArray(res.data) ? res.data : (res.data?.results || [])
        } catch (err) {
            console.error('Subcategory fetch error:', err)
        }
    }

    const loadProducts = async () => {
        const requestId = ++lastRequestId
        loading.value = true
        try {
            const params = {
                page: currentPage.value,
                page_size: rowsPerPage.value
            }
            if (searchQuery.value) params.search = searchQuery.value
            
            if (selectedCategory.value) {
                params.category = selectedCategory.value
            }
            
            if (selectedSubcategory.value) {
                params.subcategory = selectedSubcategory.value
            }
            
            if (selectedStatus.value) {
                params.status = selectedStatus.value
            }
            
            if (selectedPromotion.value !== null && selectedPromotion.value !== '') {
                params.on_promotion = selectedPromotion.value
            }

            const response = await productsAPI.getAll(params)
            
            // Only update if this is still the most recent request
            if (requestId === lastRequestId) {
                console.log('API Products Response (current):', response.data)
                products.value = response.data.results || response.data || []
                totalProducts.value = response.data.count || (Array.isArray(response.data) ? response.data.length : 0)
            }
        } catch (error) {
            if (requestId === lastRequestId) {
                console.error('Error loading products:', error)
                toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulotlarni yuklashda xatolik', life: 5000 })
            }
        } finally {
            if (requestId === lastRequestId) {
                loading.value = false
            }
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
                    
                    // Sync limits after deletion
                    notificationStore.fetchSubscription()
                    
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
        selectedSubcategory,
        selectedStatus,
        selectedPromotion,
        subcategories,
        fetchSubcategories,
        loadProducts,
        handleSearch,
        handlePageChange,
        confirmDeleteProduct
    }
}


