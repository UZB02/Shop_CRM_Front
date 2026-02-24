<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Skladlar</h1>
      <Button label="Yangi sklad" icon="pi pi-plus" severity="success" @click="openNewWarehouseDialog" />
    </div>

    <div v-if="loading && !warehouses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="i in 3" :key="i" class="border-none shadow-sm">
        <template #content>
          <div class="space-y-4">
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="100%" height="2rem" />
          </div>
        </template>
      </Card>
    </div>

    <div v-else-if="!warehouses.length" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <i class="pi pi-box text-5xl text-slate-300 mb-4"></i>
      <p class="text-slate-500 text-lg">Skladlar mavjud emas</p>
      <Button label="Birinchi skladni qo'shing" icon="pi pi-plus" text class="mt-2" @click="openNewWarehouseDialog" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Warehouse Card Component -->
      <WarehouseCard 
        v-for="w in warehouses" 
        :key="w._id" 
        :warehouse="w" 
        @edit="editWarehouse" 
        @delete="confirmDeleteWarehouse" 
      />
    </div>

    <!-- Warehouse Dialog Component -->
    <WarehouseDialog 
      v-model:visible="warehouseDialog"
      :warehouse="warehouse"
      :stores="stores"
      :submitted="submitted"
      :saving="saving"
      @save="saveWarehouse"
      @hide="hideDialog"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import ConfirmDialog from 'primevue/confirmdialog'

import WarehouseCard from './components/WarehouseCard.vue'
import WarehouseDialog from './components/WarehouseDialog.vue'
import { warehousesAPI, storesAPI } from '@/services/api'

const toast = useToast()
const confirm = useConfirm()

const warehouses = ref([])
const stores = ref([])
const loading = ref(false)
const saving = ref(false)
const warehouseDialog = ref(false)
const submitted = ref(false)

const warehouse = ref({
  name: '',
  location: '',
  capacity: 1000,
  status: 'Active',
  store: null
})

const loadData = async () => {
  loading.value = true
  try {
    const [warehousesRes, storesRes] = await Promise.all([
      warehousesAPI.getAll(),
      storesAPI.getAll()
    ])
    warehouses.value = warehousesRes.data
    stores.value = storesRes.data
  } catch (error) {
    console.error('Data loading error:', error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: "Ma'lumotlarni yuklashda xatolik yuz berdi", life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const openNewWarehouseDialog = () => {
  warehouse.value = { name: '', location: '', capacity: 1000, status: 'Active', store: null }
  submitted.value = false
  warehouseDialog.value = true
}

const hideDialog = () => {
  warehouseDialog.value = false
  submitted.value = false
}

const saveWarehouse = async () => {
  submitted.value = true
  if (warehouse.value.name.trim()) {
    saving.value = true
    try {
      const payload = { ...warehouse.value }
      if (payload.store === '') payload.store = null

      if (warehouse.value.id || warehouse.value._id) {
        await warehousesAPI.update(warehouse.value.id || warehouse.value._id, payload)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Sklad ma'lumotlari yangilandi", life: 3000 })
      } else {
        await warehousesAPI.create(payload)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Yangi sklad qo'shildi", life: 3000 })
      }
      warehouseDialog.value = false
      loadData()
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: "Saqlashda xatolik yuz berdi", life: 3000 })
    } finally {
      saving.value = false
    }
  }
}

const editWarehouse = (data) => {
  warehouse.value = { ...data, store: data.store?._id || data.store }
  warehouseDialog.value = true
}

const confirmDeleteWarehouse = (data) => {
  confirm.require({
    message: `"${data.name}" skladini o'chirishni tasdiqlaysizmi?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await warehousesAPI.delete(data.id || data._id)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Sklad o'chirildi", life: 3000 })
        loadData()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'chirishda xatolik yuz berdi", life: 3000 })
      }
    }
  })
}
</script>
