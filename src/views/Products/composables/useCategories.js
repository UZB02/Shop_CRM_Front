import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { categoriesAPI, warehousesAPI } from '@/services/api'

export function useCategories(loadProductsCallback) {
    const toast = useToast()
    const confirm = useConfirm()

    const categories = ref([])
    const warehouses = ref([])
    const cSaving = ref(false)
    const categoryDialog = ref(false)
    const category = ref({
        name: '',
        description: ''
    })

    const loadData = async () => {
        try {
            const [wRes, cRes] = await Promise.all([
                warehousesAPI.getAll(),
                categoriesAPI.getAll()
            ])
            warehouses.value = wRes.data.results || wRes.data || []
            categories.value = cRes.data.results || cRes.data || []
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const openCategoryDialog = () => {
        category.value = { name: '', description: '' }
        categoryDialog.value = true
    }

    const editCategory = (cat) => {
        category.value = { ...cat }
        categoryDialog.value = true
    }

    const saveCategory = async (catData) => {
        cSaving.value = true
        try {
            const id = catData._id || catData.id
            if (id) {
                await categoriesAPI.update(id, catData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya yangilandi', life: 3000 })
            } else {
                await categoriesAPI.create(catData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya qo\'shildi', life: 3000 })
            }
            categoryDialog.value = false
            category.value = { name: '', description: '' }
            loadData()
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xatolik yuz berdi', life: 3000 })
        } finally {
            cSaving.value = false
        }
    }

    const confirmDeleteCategory = (cat) => {
        confirm.require({
            message: `"${cat.name}" kategoriyasini o'chirishni tasdiqlaysizmi? Bu mahsulotlarni o'chirmaydi.`,
            header: 'Tasdiqlash',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    const id = cat._id || cat.id
                    await categoriesAPI.delete(id)
                    toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya o\'chirildi', life: 3000 })
                    loadData()
                } catch (error) {
                    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 3000 })
                }
            }
        })
    }

    return {
        categories,
        warehouses,
        cSaving,
        categoryDialog,
        category,
        loadData,
        openCategoryDialog,
        editCategory,
        saveCategory,
        confirmDeleteCategory
    }
}
