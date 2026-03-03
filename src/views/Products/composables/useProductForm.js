import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { productsAPI, categoriesAPI, warehousesAPI } from '@/services/api'

export function useProductForm() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    const loading = ref(false)
    const saving = ref(false)
    const isEdit = computed(() => !!route.params.id)
    const submitted = ref(false)

    const product = ref({
        name: '',
        category: null,
        barcode: '',
        warehouse: null,
        unit: 'dona',
        amount: 0,
        purchase_price: 0,
        sale_price: 0,
        lowStockThreshold: 10,
        imageUrl: ''
    })

    const categories = ref([])
    const warehouses = ref([])
    const units = ['dona', 'kg', 'g', 'litr', 'metr', 'm2', 'yashik', 'qop', 'quti']
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const previewUrl = ref(null)

    const fetchData = async () => {
        loading.value = true
        try {
            const [catsRes, whsRes] = await Promise.all([
                categoriesAPI.getAll(),
                warehousesAPI.getAll()
            ])

            categories.value = Array.isArray(catsRes.data) ? catsRes.data : (catsRes.data?.results || [])
            warehouses.value = Array.isArray(whsRes.data) ? whsRes.data : (whsRes.data?.results || [])

            if (isEdit.value) {
                const res = await productsAPI.getById(route.params.id)
                const data = res.data

                product.value = {
                    ...data,
                    category: data.category_id || data.category?._id || data.category?.id || data.category,
                    imageUrl: data.image || data.imageUrl,
                    purchase_price: Number(data.purchase_price) || 0,
                    sale_price: Number(data.sale_price) || 0,
                    amount: Number(data.amount) || 0
                }

                if (data.store_name) {
                    const matchedWh = warehouses.value.find(w => w.name === data.store_name)
                    if (matchedWh) product.value.warehouse = matchedWh._id || matchedWh.id
                }
            }
        } catch (err) {
            console.error('Fetch error:', err)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ma\'lumotlarni yuklab bo\'lmadi', life: 3000 })
        } finally {
            loading.value = false
        }
    }

    const onFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Rasm hajmi 5MBdan oshmasligi kerak', life: 3000 })
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
        if (!product.value.name || !product.value.category) {
            toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Iltimos, barcha majburiy maydonlarni to\'ldiring', life: 3000 })
            return
        }

        saving.value = true
        try {
            const formData = new FormData()
            Object.keys(product.value).forEach(key => {
                if (key !== 'imageUrl' && product.value[key] !== null) {
                    formData.append(key, product.value[key])
                }
            })

            if (selectedFile.value) {
                formData.append('image', selectedFile.value)
            }

            if (isEdit.value) {
                await productsAPI.update(route.params.id, formData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot yangilandi', life: 3000 })
            } else {
                await productsAPI.create(formData)
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangi mahsulot qo\'shildi', life: 3000 })
            }
            router.push('/dashboard/products')
        } catch (err) {
            console.error('Save error:', err)
            toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 3000 })
        } finally {
            saving.value = false
        }
    }

    return {
        loading,
        saving,
        product,
        categories,
        warehouses,
        units,
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
