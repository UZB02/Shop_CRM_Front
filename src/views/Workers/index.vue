<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{{ $t('workers.management_title') }}</h1>
        <p class="text-slate-500 text-sm mt-1">{{ $t('workers.management_subtitle') }}</p>
      </div>
      <Button :label="$t('workers.new_worker')" icon="pi pi-user-plus" severity="success" class="shadow-sm w-full sm:w-auto" @click="openNew" />
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="relative w-full">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <i class="pi pi-search"></i>
          </span>
          <InputText 
            v-model="filters.search" 
            :placeholder="$t('common.search') + '...'" 
            class="w-full !pl-11 !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 focus:!ring-2 focus:!ring-emerald-500/20 transition-all text-sm"
          />
        </div>

        <!-- Role Filter -->
        <Dropdown 
          v-model="filters.role" 
          :options="roleOptions" 
          optionLabel="label" 
          optionValue="value" 
          showClear 
          :placeholder="$t('workers.role')" 
          class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm"
        />

        <!-- Status Filter -->
        <Dropdown 
          v-model="filters.status" 
          :options="statusOptions" 
          optionLabel="label" 
          optionValue="value" 
          showClear 
          :placeholder="$t('common.status')" 
          class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm"
        />

        <!-- Branch Filter -->
        <Dropdown 
          v-model="filters.branch" 
          :options="stores" 
          optionLabel="name" 
          optionValue="id" 
          showClear 
          :placeholder="$t('workers.branch')" 
          :loading="storesLoading"
          class="w-full !h-12 !rounded-2xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 flex items-center px-2 text-sm"
        />
      </div>
    </div>

    <!-- Workers Table Component -->
    <WorkerTable 
      :workers="workers" 
      :loading="loading" 
      :total-records="totalRecords"
      v-model:page="page"
      v-model:page-size="pageSize"
      @edit="editWorker" 
      @delete="confirmDeleteWorker" 
      @page-change="loadWorkers"
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
import { ref, computed, watch, onMounted, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { workersAPI, storesAPI, branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

import WorkerTable from './components/WorkerTable.vue'
import WorkerDialog from './components/WorkerDialog.vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { WORKER_ROLES, WORKER_STATUSES } from './composables/useWorkerForm'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()

const workers = ref([])
const totalRecords = ref(0)
const page = ref(1)
const pageSize = ref(10)
const stores = ref([])
const loading = ref(false)
const storesLoading = ref(false)
const saving = ref(false)
const workerDialog = ref(false)
const submitted = ref(false)
const createLogin = ref(true)

const filters = ref({
    search: '',
    status: null,
    role: null,
    branch: null
})

const roleOptions = computed(() => [
    ...WORKER_ROLES.map(r => ({
        ...r,
        label: t(`workers.roles.${r.value}`)
    }))
])

const statusOptions = computed(() => [
    ...WORKER_STATUSES.map(s => ({
        ...s,
        label: t(`workers.statuses.${s.value}`)
    }))
])

const worker = ref({
    first_name: '',
    last_name: '',
    role: 'seller',
    branch: null,
    status: 'active',
    salary: 0,
    phone1: '',
    email: '',
    permissions: []
})

const loadWorkers = async () => {
    loading.value = true
    try {
        const params = {
            page: page.value,
            page_size: pageSize.value
        }

        // Add filters if they have values
        if (filters.value.search) params.search = filters.value.search
        if (filters.value.status) params.status = filters.value.status
        if (filters.value.role) params.role = filters.value.role
        if (filters.value.branch) params.branch = filters.value.branch

        const response = await workersAPI.getAll(params)
        const data = response.data
        console.log("API dan kelayotgan workers ma'lumotlari:", data)
        
        if (data && data.results && Array.isArray(data.results)) {
            workers.value = data.results
            totalRecords.value = data.count || data.results.length
        } else if (Array.isArray(data)) {
            workers.value = data
            totalRecords.value = data.length
        } else {
            workers.value = []
            totalRecords.value = 0
        }
    } catch (error) {
        console.error('❌ Error loading workers:', error)
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.load_error'), life: 3000 })
    } finally {
        loading.value = false
    }
}

// Manual Debounce Implementation
let debounceTimer = null
watch(() => filters.value, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        page.value = 1
        loadWorkers()
    }, 500)
}, { deep: true })

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
        status: 'active',
        salary: 0,
        phone1: '',
        email: '',
        password: '',
        permissions: [] 
    }
    createLogin.value = true
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
        console.log("Tanlangan xodim ma'lumotlari:", fullData)
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
        status: fullData.status || 'active',
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
            status: worker.value.status,
        }

        if (worker.value.email) payload.email = worker.value.email
        if (worker.value.phone1) {
            payload.phone1 = worker.value.phone1.startsWith('+') 
                ? worker.value.phone1 
                : '+' + worker.value.phone1
        }
        if (worker.value.branch) payload.branch = worker.value.branch
        if (worker.value.salary) payload.salary = worker.value.salary

        if (createLogin.value) {
            if (worker.value.username) payload.username = worker.value.username
            if (worker.value.password) payload.password = worker.value.password
            // permissionsni Proxy’dan oddiy Array’ga o'tkazib yuboramiz
            payload.permissions = [...toRaw(worker.value.permissions || [])]
        }

        console.group("🚀 Xodim ma'lumotlarini yuborish");
        console.log("Status:", worker.value.id ? "Tahrirlash (Edit)" : "Yangi qo'shish (Create)");
        console.log("Raw Worker Data:", toRaw(worker.value));
        console.log("Final API Payload:", payload);
        console.groupEnd();

        if (worker.value.id) {
            await workersAPI.update(worker.value.id, payload)
            toast.add({ 
              severity: 'success', 
              summary: t('common.updated'), 
              detail: t('workers.messages.updated', { name: `${worker.value.first_name} ${worker.value.last_name}` }), 
              life: 3000 
            })
        } else {
            await workersAPI.create(payload)
            toast.add({ 
              severity: 'success', 
              summary: t('common.added'), 
              detail: t('workers.messages.added'), 
              life: 3000 
            })
        }
        workerDialog.value = false
        loadWorkers()
    } catch (error) {
        console.error('❌ Error saving worker:', error)
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.save_error'), life: 3000 })
    } finally {
        saving.value = false
    }
}

const confirmDeleteWorker = (data) => {
    const name = data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Xodim'
    confirm.require({
        message: t('workers.messages.delete_confirm', { name }),
        header: t('workers.messages.delete_header'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('common.yes_delete'),
        rejectLabel: t('common.cancel'),
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await workersAPI.delete(data.id || data._id)
                toast.add({ 
                  severity: 'success', 
                  summary: t('common.deleted'), 
                  detail: t('workers.messages.deleted', { name }), 
                  life: 3000 
                })
                loadWorkers()
            } catch (error) {
                toast.add({ 
                  severity: 'error', 
                  summary: t('common.error'), 
                  detail: t('workers.messages.delete_error'), 
                  life: 3000 
                })
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
