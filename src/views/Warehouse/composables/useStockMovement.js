import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { movementsAPI, productsAPI } from '@/services/api'

export function useStockMovement() {
    const toast = useToast()

    const visible = ref(false)
    const bulkVisible = ref(false)
    const saving = ref(false)
    const warehouse = ref(null)
    const products = ref([])
    const loadingProducts = ref(false)

    const loadProducts = async (query = '') => {
        loadingProducts.value = true
        try {
            const res = await productsAPI.getAll({ 
                search: query,
                page_size: 100 
            })
            const newProducts = res.data.results || (Array.isArray(res.data) ? res.data : [])
            
            // For bulk movement, we might want to merge with existing list 
            // but for search results, replacing is often better 
            // especially if we keep the "selected" items separately.
            products.value = newProducts
        } catch (error) {
            console.error('Error loading products for movement:', error)
        } finally {
            loadingProducts.value = false
        }
    }

    const openMovementDialog = (w) => {
        warehouse.value = w
        visible.value = true
        if (products.value.length === 0) {
            loadProducts()
        }
    }

    const openBulkMovementDialog = (w) => {
        warehouse.value = w
        bulkVisible.value = true
        if (products.value.length === 0) {
            loadProducts()
        }
    }

    const saveMovement = async (formData) => {
        saving.value = true
        try {
            let response;
            if (formData.isBulk) {
                response = await movementsAPI.bulkCreate(formData)
            } else {
                response = await movementsAPI.create(formData)
            }
            toast.add({
                severity: 'success',
                summary: 'Muvaffaqiyatli',
                detail: 'Zaxira harakati saqlandi',
                life: 5000
            })
            visible.value = false
            bulkVisible.value = false
            return response.data
        } catch (error) {
            const data = error.response?.data
            let errorMsg = 'Xatolik yuz berdi'
            if (data) {
                if (data.non_field_errors?.length) {
                    errorMsg = data.non_field_errors[0]
                } else if (data.detail) {
                    errorMsg = data.detail
                } else if (Array.isArray(data.items)) {
                    // Bulk operatsiyada har bir item xatosi
                    const firstItemErr = data.items.find(e => e && Object.keys(e).length > 0)
                    if (firstItemErr) {
                        const fieldName = Object.keys(firstItemErr)[0]
                        errorMsg = `${fieldName}: ${firstItemErr[fieldName]}`
                    }
                } else if (typeof data === 'object') {
                    const firstKey = Object.keys(data)[0]
                    if (firstKey) errorMsg = `${firstKey}: ${Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]}`
                }
            }
            toast.add({
                severity: 'error',
                summary: 'Xatolik',
                detail: errorMsg,
                life: 7000
            })
            throw error
        } finally {
            saving.value = false
        }
    }

    return {
        visible,
        bulkVisible,
        saving,
        warehouse,
        products,
        loadingProducts,
        loadProducts,
        openMovementDialog,
        openBulkMovementDialog,
        saveMovement
    }
}


