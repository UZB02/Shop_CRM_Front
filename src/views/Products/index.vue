<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Mahsulotlar Boshqaruvi</h1>
      <div class="flex gap-2">
        <Button label="Kategoriya qo'shish" icon="pi pi-folder-plus" outlined severity="secondary" @click="openCategoryDialog" />
        <Button label="Yangi mahsulot" icon="pi pi-plus" severity="success" @click="openNewProductDialog" />
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="border-none shadow-sm">
      <template #content>
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-4 items-center">
            <span class="p-input-icon-left w-full md:w-80">
              <i class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Qidiruv (Nomi, Barcode...)" class="w-full" @input="handleSearch" />
            </span>
            <Dropdown v-model="selectedWarehouse" placeholder="omborni tanlang" :options="warehouses" optionLabel="name" optionValue="_id" class="w-48" showClear @change="loadProducts" />
            <Dropdown v-model="selectedCategory" placeholder="Kategoriyani tanlang" :options="categories" optionLabel="name" optionValue="name" class="w-48" showClear @change="loadProducts" />
          </div>
          <Button icon="pi pi-filter" text severity="secondary" label="Filtrlar" />
        </div>
      </template>
    </Card>

    <!-- Products Table Component -->
    <ProductTable 
      :products="products" 
      :loading="loading" 
      :totalRecords="totalProducts" 
      @edit="editProduct" 
      @delete="confirmDeleteProduct"
    />

    <!-- Product Dialog Component -->
    <ProductDialog 
      v-model:visible="productDialog"
      :product="product"
      :categories="categories"
      :warehouses="warehouses"
      :saving="saving"
      :header="productDialogHeader"
      @save="saveProduct"
    />

    <!-- Category Dialog Component -->
    <CategoryDialog 
      v-model:visible="categoryDialog"
      :category="category"
      :categories="categories"
      :saving="cSaving"
      @save="saveCategory"
      @edit="editCategory"
      @delete="confirmDeleteCategory"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import ConfirmDialog from 'primevue/confirmdialog'

import ProductTable from './components/ProductTable.vue'
import ProductDialog from './components/ProductDialog.vue'
import CategoryDialog from './components/CategoryDialog.vue'

import { productsAPI, warehousesAPI, categoriesAPI } from '@/services/api'

const toast = useToast()
const confirm = useConfirm()

const loading = ref(false)
const saving = ref(false)
const cSaving = ref(false)
const searchQuery = ref('')
const selectedWarehouse = ref(null)
const selectedCategory = ref(null)
const warehouses = ref([])
const categories = ref([])
const products = ref([])
const totalProducts = ref(0)

const productDialog = ref(false)
const categoryDialog = ref(false)

const product = ref({
  name: '',
  category: '',
  barcode: '',
  warehouse: null,
  unit: 'dona',
  amount: 0,
  purchasePrice: 0,
  salePrice: 0,
  lowStockThreshold: 10,
  imageUrl: ''
})

const category = ref({
  name: '',
  description: ''
})

const productDialogHeader = computed(() => {
  return (product.value.id || product.value._id) ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"
})

let searchTimeout = null

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params = { page: 1, limit: 10 }
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedWarehouse.value) params.warehouse = selectedWarehouse.value
    if (selectedCategory.value) params.category = selectedCategory.value

    const response = await productsAPI.getAll(params)
    products.value = response.data.products
    totalProducts.value = response.data.total
  } catch (error) {
    console.error('Error loading products:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Mahsulotlarni yuklashda xatolik', life: 3000 })
  } finally {
    loading.value = false
  }
}

const loadData = async () => {
  try {
    const [wRes, cRes] = await Promise.all([
      warehousesAPI.getAll(),
      categoriesAPI.getAll()
    ])
    warehouses.value = wRes.data
    categories.value = cRes.data
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

onMounted(() => {
  loadProducts()
  loadData()
})

// Product Methods
const openNewProductDialog = () => {
  product.value = {
    name: '',
    category: categories.value.length > 0 ? categories.value[0].name : '',
    barcode: '',
    warehouse: warehouses.value.length > 0 ? warehouses.value[0]._id : null,
    unit: 'dona',
    amount: 0,
    purchasePrice: 0,
    salePrice: 0,
    lowStockThreshold: 10,
    imageUrl: ''
  }
  productDialog.value = true
}

const saveProduct = async ({ product: productData, file }) => {
  saving.value = true
  try {
    const formData = new FormData()
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        let val = productData[key]
        if (val && typeof val === 'object' && val._id) val = val._id
        formData.append(key, val)
      }
    })

    if (file) {
      formData.append('image', file)
    }

    if (productData.id || productData._id) {
      const id = productData.id || productData._id
      await productsAPI.update(id, formData)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot yangilandi', life: 3000 })
    } else {
      await productsAPI.create(formData)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Yangi mahsulot qo\'shildi', life: 3000 })
    }
    productDialog.value = false
    loadProducts()
  } catch (error) {
    console.error('Product saving error:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Saqlashda xatolik yuz berdi', life: 3000 })
  } finally {
    saving.value = false
  }
}

const editProduct = (data) => {
  product.value = { ...data, warehouse: data.warehouse?._id || data.warehouse }
  productDialog.value = true
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
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Mahsulot o\'chirildi', life: 3000 })
        loadProducts()
      } catch (error) {
        console.error('Product deletion error:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 3000 })
      }
    }
  })
}

// Category Methods
const openCategoryDialog = () => {
  category.value = { name: '', description: '' }
  categoryDialog.value = true
}

const saveCategory = async (catData) => {
  cSaving.value = true
  try {
    if (catData._id) {
      await categoriesAPI.update(catData._id, catData)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya yangilandi', life: 3000 })
    } else {
      await categoriesAPI.create(catData)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya qo\'shildi', life: 3000 })
    }
    category.value = { name: '', description: '' }
    loadData()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xatolik yuz berdi', life: 3000 })
  } finally {
    cSaving.value = false
  }
}

const editCategory = (cat) => {
  category.value = { ...cat }
}

const confirmDeleteCategory = (cat) => {
  confirm.require({
    message: `"${cat.name}" kategoriyasini o'chirishni tasdiqlaysizmi? Bu mahsulotlarni o'chirmaydi.`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await categoriesAPI.delete(cat._id)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Kategoriya o\'chirildi', life: 3000 })
        loadData()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik yuz berdi', life: 3000 })
      }
    }
  })
}
</script>
