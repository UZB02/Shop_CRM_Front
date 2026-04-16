import { ref, computed } from 'vue'
import { promotionsAPI, categoriesAPI, subcategoriesAPI, productsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

export function usePromotionManager() {
    const toast = useToast()
    const loading = ref(false)
    const formsaving = ref(false)
    const promotions = ref([])
    const isSlideOverOpen = ref(false)
    const isEditing = ref(false)
    
    // Dependencies
    const fetchedCategories = ref([])
    const fetchedSubcategories = ref([])
    const fetchedProducts = ref([])
    const isFetchingDeps = ref(false)

    const activeItem = ref({
        id: null,
        name: '',
        discount_pct: null,
        valid_from: null,
        valid_to: null,
        is_active: true,
        categories: [],
        subcategories: [],
        products: []
    })

    const loadData = async () => {
        loading.value = true
        try {
            const res = await promotionsAPI.getAll()
            promotions.value = res.data.results || res.data
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Xatolik', detail: "Aksiyalarni yuklashda xatolik", life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const loadDependencies = async () => {
        if (fetchedCategories.value.length > 0 && fetchedProducts.value.length > 0) return
        isFetchingDeps.value = true
        try {
            const [catRes, subRes, prodRes] = await Promise.all([
                categoriesAPI.getAll({ limit: 500 }),
                subcategoriesAPI.getAll({ limit: 500 }),
                productsAPI.getAll({ limit: 1000 })
            ])
            fetchedCategories.value = catRes.data.results || catRes.data || []
            fetchedSubcategories.value = subRes.data.results || subRes.data || []
            fetchedProducts.value = prodRes.data.results || prodRes.data || []
        } catch (e) {
            console.error('Failed to load dependencies', e)
        } finally {
            isFetchingDeps.value = false
        }
    }

    const openCreate = () => {
        activeItem.value = {
            id: null,
            name: '',
            discount_pct: null,
            valid_from: null,
            valid_to: null,
            is_active: true,
            categories: [],
            subcategories: [],
            products: []
        }
        isEditing.value = false
        isSlideOverOpen.value = true
        loadDependencies()
    }

    const parseSafeDate = (dateStr) => {
        if (!dateStr) return null
        const clean = dateStr.toString().replace(' | ', ' ')
        const d = new Date(clean)
        return isNaN(d.getTime()) ? null : d
    }

    const openEdit = (item) => {
        activeItem.value = {
            id: item.id,
            name: item.name,
            discount_pct: Number(item.discount_pct),
            valid_from: parseSafeDate(item.valid_from),
            valid_to: parseSafeDate(item.valid_to),
            is_active: item.is_active,
            // ID larni MultiSelect uchun massivga otamiz
            categories: item.categories || [],
            subcategories: item.subcategories || [],
            products: item.products || []
        }
        isEditing.value = true
        isSlideOverOpen.value = true
        loadDependencies()
    }

    const confirmDelete = async (id) => {
        if (!confirm('Ushbu aksiyani o`chirmokchimisiz?')) return
        try {
            await promotionsAPI.delete(id)
            toast.add({ severity: 'success', summary: 'Muaffaqiyatli', detail: "Aksiya o'chirildi", life: 2000 })
            loadData()
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Xato', detail: "O'chirishda xato yuz berdi" })
        }
    }

    const toggleStatus = async (item) => {
        try {
            if (item.is_active) {
                await promotionsAPI.deactivate(item.id)
            } else {
                await promotionsAPI.activate(item.id)
            }
            loadData()
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Xato', detail: "Statusni o'zgartirib bo'lmadi" })
        }
    }

    const submitForm = async () => {
        // Validation
        const t = activeItem.value
        if (!t.name || !t.discount_pct || !t.valid_from || !t.valid_to) {
            toast.add({ severity: 'warn', summary: 'Majburiy:', detail: "Barcha asosiy maydonlarni to'ldiring", life: 3000 })
            return
        }
        if (new Date(t.valid_from) >= new Date(t.valid_to)) {
            toast.add({ severity: 'warn', summary: 'Xato:', detail: "Tugash vaqti boshlanish vaqtidan katta bo'lishi shart", life: 3000 })
            return
        }
        if (t.categories.length === 0 && t.subcategories.length === 0 && t.products.length === 0) {
            toast.add({ severity: 'warn', summary: 'Xato:', detail: "Aksiya uchun kamida 1 ta mahsulot yoki kategoriya tanlash shart", life: 4000 })
            return
        }

        formsaving.value = true
        try {
            // Transform payload
            const payload = {
                name: t.name,
                discount_pct: t.discount_pct,
                valid_from: new Date(t.valid_from).toISOString(),
                valid_to: new Date(t.valid_to).toISOString(),
                is_active: t.is_active,
                categories: t.categories,
                subcategories: t.subcategories,
                products: t.products
            }

            if (isEditing.value) {
                await promotionsAPI.update(t.id, payload)
                toast.add({ severity: 'success', summary: 'Saqlandi', detail: "Aksiya yangilandi" })
            } else {
                await promotionsAPI.create(payload)
                toast.add({ severity: 'success', summary: 'Yaratildi', detail: "Yangi aksiya yaratildi" })
            }
            
            isSlideOverOpen.value = false
            loadData()
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Xato', detail: "Saqlashda xato yuz berdi" })
        } finally {
            formsaving.value = false
        }
    }

    return {
        loading,
        formsaving,
        promotions,
        isSlideOverOpen,
        isEditing,
        activeItem,
        
        fetchedCategories,
        fetchedSubcategories,
        fetchedProducts,
        isFetchingDeps,

        loadData,
        openCreate,
        openEdit,
        confirmDelete,
        toggleStatus,
        submitForm
    }
}
