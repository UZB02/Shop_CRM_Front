<template>
  <div class="max-w-[1600px] mx-auto pb-8 px-4 sm:px-6 lg:px-8 space-y-5 transition-all duration-300">

    <!-- Page Nav -->
    <div class="flex items-center gap-3">
      <button
        @click="$router.back()"
        class="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm hover:shadow-emerald-500/10"
      >
        <i class="pi pi-arrow-left text-xs"></i>
      </button>
      <div class="flex items-center gap-2 text-xs">
        <span
          class="text-slate-400 dark:text-slate-500 hover:text-emerald-500 cursor-pointer font-semibold transition-colors"
          @click="$router.push('/dashboard/workers')"
        >{{ $t('workers.title') }}</span>
        <i class="pi pi-angle-right text-slate-300 dark:text-slate-600 text-[10px]"></i>
        <span class="text-slate-700 dark:text-slate-300 font-bold">{{ worker?.full_name || '...' }}</span>
      </div>
    </div>

    <!-- HEADER -->
    <DetailHeader :worker="worker" @edit="handleEdit" />

    <div class="space-y-6">

      <!-- ACCORDION (Details & Permissions) -->
      <DetailAccordion :worker="worker" />
    </div>

    <!-- Worker Dialog Component -->
    <WorkerDialog 
      v-model:visible="workerDialog"
      v-model:createLogin="createLogin"
      :worker="workerToEdit"
      :stores="stores"
      :storesLoading="storesLoading"
      :saving="saving"
      :submitted="submitted"
      @save="saveWorker"
      @hide="hideDialog"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { workersAPI, storesAPI, branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

import WorkerDialog from './components/WorkerDialog.vue'
import DetailHeader from './components/detail/DetailHeader.vue'
import DetailAccordion from './components/detail/DetailAccordion.vue'

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const worker = ref(null)
const loading = ref(false)

const workerDialog = ref(false)
const saving = ref(false)
const submitted = ref(false)
const createLogin = ref(true)
const originalWorker = ref(null)
const stores = ref([])
const storesLoading = ref(false)
const workerToEdit = ref({
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

const loadWorker = async () => {
    loading.value = true
    try {
        const res = await workersAPI.getById(route.params.id)
        console.log('Worker detail data from API:', res.data)
        worker.value = res.data
    } catch (e) {
        console.error('Worker load error:', e)
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
        } catch (e) {
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

onMounted(() => {
    loadWorker()
    loadStores()
})

const handleEdit = () => {
    if (!worker.value) return

    let firstName = worker.value.first_name || ''
    let lastName = worker.value.last_name || ''
    if (!firstName && !lastName && worker.value.full_name) {
        const parts = worker.value.full_name.trim().split(' ')
        firstName = parts[0] || ''
        lastName = parts.slice(1).join(' ') || ''
    }

    workerToEdit.value = {
        id: worker.value.id || worker.value._id,
        first_name: firstName,
        last_name: lastName,
        email: worker.value.email || '',
        phone1: (worker.value.phone1 || worker.value.phone || '').replace(/\D/g, '').slice(-9),
        role: worker.value.role || 'seller',
        branch: worker.value.branch?.id || worker.value.branch?._id || (typeof worker.value.branch === 'object' ? null : worker.value.branch) || null,
        status: worker.value.status || 'active',
        salary: parseFloat(worker.value.salary) || 0,
        username: worker.value.username || '',
        password: '',
        permissions: worker.value.permissions || [],
    }

    createLogin.value = !!(worker.value.user || worker.value.userId || worker.value.username)
    originalWorker.value = JSON.parse(JSON.stringify(workerToEdit.value))
    submitted.value = false
    workerDialog.value = true
}

const hideDialog = () => {
    workerDialog.value = false
    submitted.value = false
}

const saveWorker = async () => {
    submitted.value = true
    if (!workerToEdit.value.first_name?.trim() || !workerToEdit.value.last_name?.trim() || !workerToEdit.value.email?.trim()) return

    saving.value = true
    try {
        const payload = {}
        const current = workerToEdit.value
        const original = originalWorker.value

        if (current.first_name?.trim() !== original.first_name) payload.first_name = current.first_name.trim()
        if (current.last_name?.trim() !== original.last_name) payload.last_name = current.last_name.trim()
        if (current.email?.trim() !== original.email) payload.email = current.email?.trim() || ''
        if (current.role !== original.role) payload.role = current.role
        if (current.status !== original.status) payload.status = current.status
        if (Number(current.salary) !== Number(original.salary)) payload.salary = Number(current.salary) || 0
        if (current.branch !== original.branch) payload.branch = current.branch
        if (current.username?.trim() !== original.username) payload.username = current.username?.trim() || ''
        if (current.password) payload.password = current.password

        // Permissions comparison
        const currentPerms = [...toRaw(current.permissions || [])].sort()
        const originalPerms = [...toRaw(original.permissions || [])].sort()
        if (JSON.stringify(currentPerms) !== JSON.stringify(originalPerms)) {
            payload.permissions = createLogin.value ? currentPerms : []
        }

        // Phone formatting check
        if (current.phone1 !== original.phone1) {
            let digits = String(current.phone1).replace(/\D/g, '')
            const cleanNumber = digits.length >= 9 ? digits.slice(-9) : digits
            payload.phone1 = '+998' + cleanNumber
        }

        // If nothing changed, just close the dialog
        if (Object.keys(payload).length === 0) {
            workerDialog.value = false
            saving.value = false
            return
        }

        console.group("🚀 Xodim ma'lumotlarini yuborish (Detail - PATCH)");
        console.log("Final API Payload:", payload);
        console.groupEnd();

        await workersAPI.update(workerToEdit.value.id, payload)
        toast.add({ 
            severity: 'success', 
            summary: t('common.updated'), 
            detail: t('workers.messages.updated', { name: `${workerToEdit.value.first_name} ${workerToEdit.value.last_name}` }), 
            life: 3000 
        })
        
        workerDialog.value = false
        loadWorker() 
    } catch (error) {
        console.error('❌ Error saving worker:', error)
        let errorDetail = t('workers.messages.save_error')
        if (error.response?.data) {
            const data = error.response.data
            if (typeof data === 'string') {
                errorDetail = data
            } else {
                const firstKey = Object.keys(data)[0]
                if (firstKey) {
                    const message = data[firstKey]
                    errorDetail = Array.isArray(message) ? message[0] : message
                }
            }
        }
        toast.add({ 
            severity: 'error', 
            summary: t('common.error'), 
            detail: errorDetail, 
            life: 5000 
        })
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
/* Any view-specific styles can remain here, but most were moved to components */
</style>
