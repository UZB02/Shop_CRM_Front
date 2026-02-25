<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Xodimlar Boshqaruvi</h1>
        <p class="text-slate-500 text-sm mt-1">Sizning jamoangiz va ularning ruxsatlari</p>
      </div>
      <Button label="Yangi xodim" icon="pi pi-user-plus" severity="success" class="shadow-sm w-full sm:w-auto" @click="openNew" />
    </div>

    <!-- Workers Table Component -->
    <WorkerTable 
      :workers="workers" 
      :loading="loading" 
      @edit="editWorker" 
      @delete="confirmDeleteWorker" 
    />

    <!-- Worker Dialog Component -->
    <WorkerDialog 
      v-model:visible="workerDialog"
      v-model:createLogin="createLogin"
      :worker="worker"
      :stores="stores"
      :storesLoading="storesLoading"
      :saving="saving"
      :submitted="submitted"
      @save="saveWorker"
      @hide="hideDialog"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { workersAPI, storesAPI, branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import WorkerTable from './components/WorkerTable.vue'
import WorkerDialog from './components/WorkerDialog.vue'

const route = useRoute()
const toast = useToast()
const confirm = useConfirm()

const workers = ref([])
const stores = ref([])
const loading = ref(false)
const storesLoading = ref(false)
const saving = ref(false)
const workerDialog = ref(false)
const submitted = ref(false)
const createLogin = ref(false)

const worker = ref({
    first_name: '',
    last_name: '',
    role: 'seller',
    branch: null,
    status: 'Faol',
    salary: 0,
    phone1: '',
    email: '',
    permissions: []
})

const loadWorkers = async () => {
    loading.value = true
    try {
        const response = await workersAPI.getAll()
        const data = response.data

        if (data && data.results && Array.isArray(data.results)) {
            workers.value = data.results
        } else if (Array.isArray(data)) {
            workers.value = data
        } else {
            workers.value = []
        }
    } catch (error) {
        console.error('❌ Error loading workers:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xodimlarni yuklashda xatolik', life: 3000 })
    } finally {
        loading.value = false
    }
}

const loadStores = async () => {
    storesLoading.value = true
    try {
        let response
        try {
            response = await storesAPI.getAll()
        } catch {
            response = await branchesAPI.getAll()
        }
        const data = response.data
        stores.value = data?.results ?? (Array.isArray(data) ? data : [])
    } catch (error) {
        console.warn('Filiallarni yuklashda xatolik:', error)
        stores.value = []
    } finally {
        storesLoading.value = false
    }
}

const openNew = () => {
    worker.value = { 
        first_name: '',
        last_name: '',
        role: 'seller',
        branch: stores.value.length > 0 ? (stores.value[0]._id || stores.value[0].id) : null,
        status: 'Faol',
        salary: 0,
        phone1: '',
        email: '',
        password: '',
        permissions: [] 
    }
    createLogin.value = false
    submitted.value = false
    workerDialog.value = true
}

const hideDialog = () => {
    workerDialog.value = false
    submitted.value = false
}

const editWorker = async (data) => {
    let fullData = data
    try {
        const res = await workersAPI.getById(data.id || data._id)
        fullData = res.data
    } catch (e) {
        console.warn('Detail endpoint failed, using list data:', e)
    }

    let firstName = fullData.first_name || ''
    let lastName = fullData.last_name || ''
    if (!firstName && !lastName && fullData.full_name) {
        const parts = fullData.full_name.trim().split(' ')
        firstName = parts[0] || ''
        lastName = parts.slice(1).join(' ') || ''
    }

    worker.value = {
        id: fullData.id || fullData._id,
        first_name: firstName,
        last_name: lastName,
        email: fullData.email || '',
        phone1: fullData.phone1 || fullData.phone || '',
        role: fullData.role || 'seller',
        branch: fullData.branch?.id || fullData.branch?._id || fullData.branch || null,
        salary: parseFloat(fullData.salary) || 0,
        username: fullData.username || '',
        password: '',
        permissions: fullData.permissions || [],
    }

    createLogin.value = !!(fullData.user || fullData.userId || fullData.username)
    submitted.value = false
    workerDialog.value = true
}

const saveWorker = async () => {
    submitted.value = true
    if (!worker.value.first_name?.trim() || !worker.value.last_name?.trim()) return

    saving.value = true
    try {
        const payload = {
            first_name: worker.value.first_name.trim(),
            last_name: worker.value.last_name.trim(),
            role: worker.value.role,
        }

        if (worker.value.email) payload.email = worker.value.email
        if (worker.value.phone1) payload.phone1 = worker.value.phone1
        if (worker.value.branch) payload.branch = worker.value.branch
        if (worker.value.salary) payload.salary = worker.value.salary

        if (createLogin.value) {
            if (worker.value.username) payload.username = worker.value.username
            if (worker.value.password) payload.password = worker.value.password
            if (worker.value.permissions?.length) payload.permissions = worker.value.permissions
        }

        if (worker.value.id) {
            await workersAPI.update(worker.value.id, payload)
            toast.add({ severity: 'success', summary: 'Yangilandi ✅', detail: `${worker.value.first_name} ${worker.value.last_name} ma'lumotlari yangilandi`, life: 3000 })
        } else {
            await workersAPI.create(payload)
            toast.add({ severity: 'success', summary: 'Qo\'shildi ✅', detail: 'Yangi xodim muvaffaqiyatli qo\'shildi', life: 3000 })
        }
        workerDialog.value = false
        loadWorkers()
    } catch (error) {
        console.error('❌ Error saving worker:', error)
        toast.add({ severity: 'error', summary: 'Xatolik ❌', detail: 'Saqlashda xatolik yuz berdi', life: 3000 })
    } finally {
        saving.value = false
    }
}

const confirmDeleteWorker = (data) => {
    const name = data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Xodim'
    confirm.require({
        message: `"${name}" xodimini tizimdan o'chirishni tasdiqlaysizmi?`,
        header: 'O\'chirishni tasdiqlash',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ha, o\'chir',
        rejectLabel: 'Bekor qilish',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await workersAPI.delete(data.id || data._id)
                toast.add({ severity: 'success', summary: 'O\'chirildi ✅', detail: `"${name}" tizimdan o'chirildi`, life: 3000 })
                loadWorkers()
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Xatolik ❌', detail: 'Xodimni o\'chirishda xatolik yuz berdi', life: 3000 })
            }
        }
    })
}

onMounted(async () => {
    await Promise.all([loadWorkers(), loadStores()])
    
    if (route.query.edit) {
        const workerToEdit = workers.value.find(w => (w.id || w._id).toString() === route.query.edit.toString())
        if (workerToEdit) {
            editWorker(workerToEdit)
        } else {
            try {
                const res = await workersAPI.getById(route.query.edit)
                if (res.data) editWorker(res.data)
            } catch (e) {
                console.error('Could not find worker to edit from query', e)
            }
        }
    }
})
</script>
