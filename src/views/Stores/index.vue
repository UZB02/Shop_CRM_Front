<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Do'konlar va Filiallar</h1>
      <Button label="Yangi do'kon qo'shish" icon="pi pi-plus" severity="success" @click="openNewStoreDialog" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Store Table Component -->
      <StoreTable 
        :stores="stores" 
        :loading="loading" 
        @edit="editStore" 
        @delete="confirmDeleteStore" 
      />

      <!-- Branch Table Component -->
      <BranchTable 
        :branches="branches" 
        :loading="loading" 
        @edit="editBranch" 
        @delete="confirmDeleteBranch"
        @add="openNewBranchDialog"
      />
    </div>

    <!-- Store Dialog Component -->
    <StoreDialog 
      v-model:visible="storeDialog"
      :store="store"
      :submitted="submitted"
      :saving="saving"
      @save="saveStore"
      @hide="hideDialog"
    />

    <!-- Branch Dialog Component -->
    <BranchDialog 
      v-model:visible="branchDialog"
      :branch="branch"
      :stores="stores"
      :submitted="branchSubmitted"
      :saving="saving"
      @save="saveBranch"
      @hide="hideBranchDialog"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import StoreTable from './components/StoreTable.vue'
import BranchTable from './components/BranchTable.vue'
import StoreDialog from './components/StoreDialog.vue'
import BranchDialog from './components/BranchDialog.vue'
import { storesAPI, warehousesAPI } from '@/services/api'

const toast = useToast()
const confirm = useConfirm()

const stores = ref([])
const branches = ref([])
const loading = ref(false)
const saving = ref(false)
const storeDialog = ref(false)
const branchDialog = ref(false)
const submitted = ref(false)
const branchSubmitted = ref(false)

const store = ref({
  name: '',
  location: '',
  address: '',
  phone: '',
  openingHours: '09:00 - 21:00',
  status: 'Active'
})

const branch = ref({
  name: '',
  store: null,
  location: '',
  capacity: 1000,
  status: 'Active'
})

const loadData = async () => {
  loading.value = true
  try {
    const [storesRes, warehousesRes] = await Promise.all([
      storesAPI.getAll(),
      warehousesAPI.getAll()
    ])
    stores.value = storesRes.data
    branches.value = warehousesRes.data.map(w => ({
      ...w,
      parentStoreName: w.store?.name || 'Biriktirilmagan'
    }))
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

const openNewStoreDialog = () => {
  store.value = { name: '', location: '', address: '', phone: '', openingHours: '09:00 - 21:00', status: 'Active' }
  submitted.value = false
  storeDialog.value = true
}

const hideDialog = () => {
  storeDialog.value = false
  submitted.value = false
}

const saveStore = async () => {
  submitted.value = true
  if (store.value.name.trim() && store.value.location.trim()) {
    saving.value = true
    try {
      if (store.value.id || store.value._id) {
        await storesAPI.update(store.value.id || store.value._id, store.value)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Do'kon ma'lumotlari yangilandi", life: 3000 })
      } else {
        await storesAPI.create(store.value)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Yangi do'kon qo'shildi", life: 3000 })
      }
      storeDialog.value = false
      loadData()
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: "Saqlashda xatolik yuz berdi", life: 3000 })
    } finally {
      saving.value = false
    }
  }
}

const editStore = (data) => {
  store.value = { ...data }
  storeDialog.value = true
}

const confirmDeleteStore = (data) => {
  confirm.require({
    message: `"${data.name}" do'konini o'chirishni tasdiqlaysizmi?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await storesAPI.delete(data.id || data._id)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Do'kon o'chirildi", life: 3000 })
        loadData()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'chirishda xatolik yuz berdi", life: 3000 })
      }
    }
  })
}

const openNewBranchDialog = () => {
  branch.value = { name: '', store: stores.value.length > 0 ? stores.value[0]._id : null, location: '', capacity: 1000, status: 'Active' }
  branchSubmitted.value = false
  branchDialog.value = true
}

const hideBranchDialog = () => {
  branchDialog.value = false
  branchSubmitted.value = false
}

const saveBranch = async () => {
  branchSubmitted.value = true
  if (branch.value.name.trim() && branch.value.store && branch.value.location.trim()) {
    saving.value = true
    try {
      if (branch.value.id || branch.value._id) {
        await warehousesAPI.update(branch.value.id || branch.value._id, branch.value)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Filial ma'lumotlari yangilandi", life: 3000 })
      } else {
        await warehousesAPI.create(branch.value)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Yangi filial qo'shildi", life: 3000 })
      }
      branchDialog.value = false
      loadData()
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Xatolik', detail: "Saqlashda xatolik yuz berdi", life: 3000 })
    } finally {
      saving.value = false
    }
  }
}

const editBranch = (data) => {
  branch.value = { ...data, store: data.store?._id || data.store }
  branchDialog.value = true
}

const confirmDeleteBranch = (data) => {
  confirm.require({
    message: `"${data.name}" filialini o'chirishni tasdiqlaysizmi?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await warehousesAPI.delete(data.id || data._id)
        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Filial o'chirildi", life: 3000 })
        loadData()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'chirishda xatolik yuz berdi", life: 3000 })
      }
    }
  })
}
</script>
