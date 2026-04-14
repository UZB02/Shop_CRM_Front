import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { productsAPI, categoriesAPI, subcategoriesAPI } from '@/services/api'
import { useSettingsStore } from '@/store/settings'

export function useProductForm() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const settingsStore = useSettingsStore()

    const loading = ref(false)
    const saving = ref(false)
    const isEdit = computed(() => !!route.params.id)
    const submitted = ref(false)

    const product = ref({
        name: '',
        category: null,
        subcategory: null,
        unit: 'dona',
        purchase_price: 0,
        sale_price: 0,
        price_currency: settingsStore.settings?.default_currency || 'UZS',
        barcode: '',
        imageUrl: ''
    })

    const categories = ref([])
    const subcategories = ref([])
    const units = [
        { value: 'dona', label: 'Dona' },
        { value: 'kg', label: 'Kilogram' },
        { value: 'g', label: 'Gram' },
        { value: 'litr', label: 'Litr' },
        { value: 'metr', label: 'Metr' },
        { value: 'm2', label: 'Kvadrat metr' },
        { value: 'yashik', label: 'Yashik' },
        { value: 'qop', label: 'Qop' },
        { value: 'quti', label: 'Quti' },
    ]

    const currencies = computed(() => {
        const list = [
            { id: "UZS", name: "UZS", symbol: "so'm", show: true },
            { id: "USD", name: "USD", symbol: "$", show: settingsStore.settings?.show_usd_price },
            { id: "EUR", name: "EUR", symbol: "€", show: settingsStore.settings?.show_eur_price },
            { id: "RUB", name: "RUB", symbol: "₽", show: settingsStore.settings?.show_rub_price },
            { id: "CNY", name: "CNY", symbol: "¥", show: settingsStore.settings?.show_cny_price }
        ]
        
        // Return only enabled ones OR the current default_currency OR the product's own currency
        return list.filter(c => 
            c.show || 
            c.id === settingsStore.settings?.default_currency || 
            c.id === product.value.price_currency ||
            c.id === 'UZS'
        )
    })

    const fileInput = ref(null)
    const selectedFile = ref(null)
    const previewUrl = ref(null)

    const fetchData = async () => {
        loading.value = true
        try {
            const res = await categoriesAPI.getAll()
            categories.value = Array.isArray(res.data) ? res.data : (res.data?.results || [])

            if (isEdit.value) {
                const res = await productsAPI.getById(route.params.id)
                const data = res.data

                product.value = {
                    ...data,
                    category: data.category_id || data.category?._id || data.category?.id || data.category,
                    subcategory: data.subcategory_id || data.subcategory?._id || data.subcategory?.id || data.subcategory,
                    price_currency: data.currency_code || data.price_currency || settingsStore.settings?.default_currency || 'UZS',
                    unit: data.unit || 'dona',
                    imageUrl: data.image || data.imageUrl,
                    purchase_price: Number(data.purchase_price) || 0,
                    sale_price: Number(data.sale_price) || 0
                }

                // If editing and has category, fetch subcategories
                if (product.value.category) {
                    fetchSubcategories(product.value.category)
                }
            }
        } catch (err) {
            console.error('Fetch error:', err)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ma\'lumotlarni yuklab bo\'lmadi', life: 5000 })
        } finally {
            loading.value = false
        }
    }

    const fetchSubcategories = async (categoryId) => {
        try {
            const res = await subcategoriesAPI.getAll({ category: categoryId })
            subcategories.value = Array.isArray(res.data) ? res.data : (res.data?.results || [])
        } catch (err) {
            console.error('Subcategory fetch error:', err)
        }
    }

    watch(() => product.value.category, (newVal) => {
        if (newVal) {
            fetchSubcategories(newVal)
        } else {
            subcategories.value = []
            product.value.subcategory = null
        }
    })

    const onFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Rasm hajmi 5MBdan oshmasligi kerak', life: 5000 })
                return
            }
            selectedFile.value = file
            previewUrl.value = URL.createObjectURL(file)
        }
    }

    const removeImage = () => {
        selectedFile.value = null
        previewUrl.value = null
        product.value.imageUrl = ''
        if (fileInput.value) fileInput.value.value = ''
    }

    const onSave = async () => {
        submitted.value = true
        if (!product.value.name || !product.value.category || !product.value.purchase_price || !product.value.sale_price) {
            toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Iltimos, barcha majburiy maydonlarni to\'ldiring', life: 5000 })
            return
        }

        saving.value = true
        try {
            const formData = new FormData()

            const payload = {
                name: product.value.name,
                category: product.value.category,
                subcategory: product.value.subcategory,
                unit: product.value.unit,
                purchase_price: product.value.purchase_price.toString(),
                sale_price: product.value.sale_price.toString(),
                currency_code: product.value.price_currency,
                barcode: product.value.barcode || ''
            }

            Object.keys(payload).forEach(key => {
                if (payload[key] !== null && payload[key] !== undefined) {
                    formData.append(key, payload[key])
                }
            })

            if (selectedFile.value) {
                formData.append('image', selectedFile.value)
            }

            if (isEdit.value) {
                await productsAPI.update(route.params.id, formData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot yangilandi', life: 5000 })
            } else {
                await productsAPI.create(formData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangi mahsulot qo\'shildi', life: 5000 })
            }
            router.push('/dashboard/products')
        } catch (err) {
            console.error('Save error:', err)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 5000 })
        } finally {
            saving.value = false
        }
    }

    return {
        loading,
        saving,
        product,
        categories,
        subcategories,
        units,
        currencies,
        fileInput,
        previewUrl,
        isEdit,
        submitted,
        fetchData,
        onFileSelect,
        removeImage,
        onSave,
        router
    }
}
