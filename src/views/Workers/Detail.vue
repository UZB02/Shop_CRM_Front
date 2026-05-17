<template>
  <div class="space-y-4">
    <!-- Header -->
    <WorkerDetailPageHeader
      :worker="worker"
      @edit="handleEdit"
    />

    <!-- Main layout -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-60 xl:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-48"></div>
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-pulse h-96"></div>
    </div>

    <div v-else-if="worker" class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Sidebar Tabs -->
      <div class="w-full lg:w-60 xl:w-64 shrink-0">
        <WorkerTabsSidebar
          :tabs="navTabs"
          :active="activeTab"
          @select="activeTab = $event"
        />
      </div>

      <!-- Right: Tab Content -->
      <div class="flex-1 min-w-0">
        <Transition name="fade-slide" mode="out-in">
          <WorkerInfoTab v-if="activeTab === 'details'" key="details" :worker="worker" />
          <WorkerPermissionsTab v-else-if="activeTab === 'permissions'" key="permissions" :worker="worker" />
          <WorkerKpiTab v-else-if="activeTab === 'kpi'" key="kpi" :worker-id="worker?.id || worker?._id" />
          <WorkerHistoryTab v-else-if="activeTab === 'history'" key="history" :worker-id="worker?.id || worker?._id" />
        </Transition>
      </div>
    </div>

    <!-- Worker Dialog Component -->
    <WorkerDialog 
      v-model:visible="workerDialog"
      v-model:createLogin="createLogin"
      :worker="workerToEdit"
      :branches="stores"
      :saving="saving"
      :submitted="submitted"
      @save="saveWorker"
      @hide="hideDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { workersAPI, branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

import WorkerDialog from './components/WorkerDialog.vue'
import WorkerDetailPageHeader from './components/WorkerDetailPageHeader.vue'
import WorkerTabsSidebar from './components/WorkerTabsSidebar.vue'

// Tab components
import WorkerInfoTab from './components/detail/tabs/WorkerInfoTab.vue'
import WorkerPermissionsTab from './components/detail/tabs/WorkerPermissionsTab.vue'
import WorkerHistoryTab from './components/detail/tabs/WorkerHistoryTab.vue'
import WorkerKpiTab from './components/detail/tabs/WorkerKpiTab.vue'

import { useSettingsStore } from '@/store/settings'

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const settingsStore = useSettingsStore()
const worker = ref(null)
const loading = ref(false)
const activeTab = ref(route.query.tab || 'details')

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

// Prepare tabs
const navTabs = computed(() => {
  const tabs = [
    { id: 'details', label: t('workers.details'), icon: 'pi pi-id-card' },
    { id: 'permissions', label: t('workers.permissions'), icon: 'pi pi-shield' }
  ]
  
  if (settingsStore.isKpiEnabled && settingsStore.hasPlanKpi) {
    tabs.push({ id: 'kpi', label: t('kpi.title'), icon: 'pi pi-chart-bar' })
  }
  
  tabs.push({ id: 'history', label: t('workers.logs') || 'Tizim Jurnali', icon: 'pi pi-history' })
  return tabs
})

const loadWorker = async () => {
    loading.value = true
    try {
        const res = await workersAPI.getById(route.params.id)
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
        const response = await branchesAPI.getAll()
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
    if (route.query.tab) {
        activeTab.value = route.query.tab
    }
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
        phone2: (worker.value.phone2 || '').replace(/\D/g, '').slice(-9),
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
        if (current.phone2 !== original.phone2) {
            let digits = String(current.phone2).replace(/\D/g, '')
            if (digits) {
                const cleanNumber = digits.length >= 9 ? digits.slice(-9) : digits
                payload.phone2 = '+998' + cleanNumber
            } else {
                payload.phone2 = ''
            }
        }

        // If nothing changed, just close the dialog
        if (Object.keys(payload).length === 0) {
            workerDialog.value = false
            saving.value = false
            return
        }

        await workersAPI.update(workerToEdit.value.id, payload)
        toast.add({ 
            severity: 'success', 
            summary: t('common.updated'), 
            detail: t('workers.messages.updated', { name: `${workerToEdit.value.first_name} ${workerToEdit.value.last_name}` }), 
            life: 5000 
        })
        
        workerDialog.value = false
        loadWorker() 
    } catch (error) {
        console.error('❌ Error saving worker:', error)
        let errorDetail = t('workers.messages.save_error')
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
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>



