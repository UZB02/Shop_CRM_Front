import { ref, computed } from 'vue'
import { promotionsAPI, categoriesAPI, subcategoriesAPI, productsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function usePromotionManager() {
    const toast = useToast()
    const { t } = useI18n()
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
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('products.promotions.messages.load_error'), life: 3000 })
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

    const openEdit = async (item) => {
        isFetchingDeps.value = true
        try {
            // Full ma'lumotlarni olish (ayniqsa bog'langan mahsulot/kategoriyalar uchun)
            const res = await promotionsAPI.getById(item.id)
            const fullItem = res.data

            activeItem.value = {
                id: fullItem.id,
                name: fullItem.name,
                discount_pct: Number(fullItem.discount_pct),
                valid_from: parseSafeDate(fullItem.valid_from),
                valid_to: parseSafeDate(fullItem.valid_to),
                is_active: fullItem.is_active,
                // ID larni MultiSelect uchun massivga otamiz (agar ob'ekt bo'lsa ID sini olamiz)
                categories: (fullItem.categories || []).map(c => typeof c === 'object' ? c.id : c),
                subcategories: (fullItem.subcategories || []).map(s => typeof s === 'object' ? s.id : s),
                products: (fullItem.products || []).map(p => typeof p === 'object' ? p.id : p)
            }
            isEditing.value = true
            isSlideOverOpen.value = true
            await loadDependencies()
        } catch (e) {
            console.error('Failed to load promotion details:', e)
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('products.promotions.messages.details_load_error') })
        } finally {
            isFetchingDeps.value = false
        }
    }

    const confirmDelete = async (id) => {
        if (!confirm(t('products.promotions.messages.delete_confirm'))) return
        try {
            await promotionsAPI.delete(id)
            toast.add({ severity: 'success', summary: t('common.success'), detail: t('products.promotions.messages.deleted'), life: 2000 })
            loadData()
        } catch (e) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('products.promotions.messages.delete_error') })
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
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('products.promotions.messages.status_error') })
        }
    }

    const submitForm = async () => {
        // Validation
        const item = activeItem.value
        if (!item.name || !item.discount_pct || !item.valid_from || !item.valid_to) {
            toast.add({ severity: 'warn', summary: t('common.required'), detail: t('products.promotions.messages.fill_required'), life: 3000 })
            return
        }
        if (new Date(item.valid_from) >= new Date(item.valid_to)) {
            toast.add({ severity: 'warn', summary: t('common.error'), detail: t('products.promotions.messages.date_error'), life: 3000 })
            return
        }
        if (item.categories.length === 0 && item.subcategories.length === 0 && item.products.length === 0) {
            toast.add({ severity: 'warn', summary: t('common.error'), detail: t('products.promotions.messages.selection_required'), life: 4000 })
            return
        }

        formsaving.value = true
        try {
            // Transform payload
            const payload = {
                name: item.name,
                discount_pct: item.discount_pct,
                valid_from: new Date(item.valid_from).toISOString(),
                valid_to: new Date(item.valid_to).toISOString(),
                is_active: item.is_active,
                categories: item.categories,
                subcategories: item.subcategories,
                products: item.products
            }

            if (isEditing.value) {
                await promotionsAPI.update(item.id, payload)
                toast.add({ severity: 'success', summary: t('common.success'), detail: t('products.promotions.messages.updated') })
            } else {
                await promotionsAPI.create(payload)
                toast.add({ severity: 'success', summary: t('common.success'), detail: t('products.promotions.messages.created') })
            }
            
            isSlideOverOpen.value = false
            loadData()
        } catch (e) {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('products.promotions.messages.save_error') })
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


