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

    const loadProducts = async () => {
        loadingProducts.value = true
        try {
            const res = await productsAPI.getAll({ page_size: 1000 })
            products.value = res.data.results || (Array.isArray(res.data) ? res.data : [])
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
            const errorMsg = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Xatolik yuz berdi'
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
