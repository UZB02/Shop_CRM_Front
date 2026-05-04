import { ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { workersAPI, kpiAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useAppConfirm as useConfirm } from '@/composables/useAppConfirm'
import { useNotificationStore } from '@/store/notifications'
import { useSettingsStore } from '@/store/settings'
import { ROLE_PERMISSIONS } from './useWorkerForm'

export function useWorkerActions(loadWorkersCallback) {
    const { t } = useI18n()
    const toast = useToast()
    const confirm = useConfirm()
    const notificationStore = useNotificationStore()
    const settingsStore = useSettingsStore()

    const worker = ref({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone1: '',
        password: '',
        role: 'seller',
        salary: 0,
        branch: null,
        status: 'active',
        permissions: [...ROLE_PERMISSIONS.seller]
    })

    const workerDialog = ref(false)
    const saving = ref(false)
    const submitted = ref(false)
    const createLogin = ref(true)
    const originalWorker = ref(null)
    const targetModalVisible = ref(false)
    const selectedKpi = ref(null)

    const openNew = () => {
        worker.value = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            phone1: '',
            password: '',
            role: 'seller',
            salary: 0,
            branch: null,
            status: 'active',
            permissions: [...ROLE_PERMISSIONS.seller]
        }
        createLogin.value = true
        submitted.value = false
        workerDialog.value = true
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
            phone1: (fullData.phone1 || fullData.phone || '').replace(/\D/g, '').slice(-9),
            role: fullData.role || 'seller',
            branch: fullData.branch_id || fullData.branch?.id || fullData.branch?._id || fullData.branch || null,
            status: fullData.status || 'active',
            salary: parseFloat(fullData.salary) || 0,
            username: fullData.username || '',
            password: '',
            permissions: fullData.permissions || [],
        }

        createLogin.value = !!(fullData.user || fullData.userId || fullData.username)
        originalWorker.value = JSON.parse(JSON.stringify(worker.value))
        submitted.value = false
        workerDialog.value = true
    }

    const saveWorker = async () => {
        submitted.value = true
        if (!worker.value.first_name?.trim() || !worker.value.last_name?.trim() || !worker.value.email?.trim() || !worker.value.branch) return

        if (createLogin.value && worker.value.username?.trim().length < 5) {
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('workers.messages.username_min_length'),
                life: 5000
            })
            return
        }

        saving.value = true
        try {
            let payload = {}

            if (worker.value.id) {
                const current = worker.value
                const original = originalWorker.value

                if (current.first_name?.trim() !== original.first_name) payload.first_name = current.first_name.trim()
                if (current.last_name?.trim() !== original.last_name) payload.last_name = current.last_name.trim()
                if (current.username?.trim() !== original.username) payload.username = current.username?.trim() || ''
                if (current.email?.trim() !== original.email) payload.email = current.email?.trim() || ''
                if (current.password) payload.password = current.password
                if (current.role !== original.role) payload.role = current.role
                if (Number(current.salary) !== Number(original.salary)) payload.salary = Number(current.salary) || 0
                if (current.status !== original.status) payload.status = current.status
                if (current.branch !== original.branch) payload.branch = current.branch

                const currentPerms = [...toRaw(current.permissions || [])].sort()
                const originalPerms = [...toRaw(original.permissions || [])].sort()
                if (JSON.stringify(currentPerms) !== JSON.stringify(originalPerms)) {
                    payload.permissions = createLogin.value ? currentPerms : []
                }

                if (current.phone1 !== original.phone1) {
                    let digits = String(current.phone1).replace(/\D/g, '')
                    const cleanNumber = digits.length >= 9 ? digits.slice(-9) : digits
                    payload.phone1 = '+998' + cleanNumber
                }

                if (Object.keys(payload).length === 0) {
                    workerDialog.value = false
                    saving.value = false
                    return
                }
            } else {
                payload = {
                    first_name: worker.value.first_name.trim(),
                    last_name: worker.value.last_name.trim(),
                    username: worker.value.username?.trim() || '',
                    email: worker.value.email?.trim() || '',
                    phone1: '',
                    password: worker.value.password || '',
                    role: worker.value.role,
                    salary: Number(worker.value.salary) || 0,
                    status: worker.value.status,
                    branch: worker.value.branch,
                    permissions: createLogin.value ? [...toRaw(worker.value.permissions || [])] : []
                }

                if (worker.value.phone1) {
                    let digits = String(worker.value.phone1).replace(/\D/g, '')
                    const cleanNumber = digits.length >= 9 ? digits.slice(-9) : digits
                    payload.phone1 = '+998' + cleanNumber
                }
            }

            if (worker.value.id) {
                await workersAPI.update(worker.value.id, payload)
                toast.add({
                    severity: 'success',
                    summary: t('common.updated'),
                    detail: t('workers.messages.updated', { name: `${worker.value.first_name} ${worker.value.last_name}` }),
                    life: 5000
                })
            } else {
                await workersAPI.create(payload)
                toast.add({
                    severity: 'success',
                    summary: t('common.added'),
                    detail: t('workers.messages.added'),
                    life: 5000
                })
            }
            // Real-time sync of subscription limits
            notificationStore.fetchSubscription()
            workerDialog.value = false
            if (loadWorkersCallback) loadWorkersCallback()
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
            toast.add({ severity: 'error', summary: t('common.error'), detail: errorDetail, life: 5000 })
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
                    toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('workers.messages.deleted', { name }), life: 5000 })
                    
                    // Real-time sync of subscription limits after deletion
                    notificationStore.fetchSubscription()
                    
                    if (loadWorkersCallback) loadWorkersCallback()
                } catch (error) {
                    toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.delete_error'), life: 5000 })
                }
            }
        })
    }

    const hideDialog = () => {
        workerDialog.value = false
        submitted.value = false
    }

    const openTargetModal = async (workerData) => {
        if (!settingsStore.isKpiEnabled) {
            toast.add({
                severity: 'warn',
                summary: t('common.warning'),
                detail: 'KPI moduli o\'chirilgan. Iltimos, sozlamalardan yoqing.',
                life: 3000
            })
            return
        }

        const workerId = workerData.id || workerData._id
        if (!workerId) return

        try {
            // Backend documentation states that GET /workers/{id}/ returns full joriy oy KPI in 'current_kpi' field.
            // This is the most reliable way to get the KPI object with an ID.
            const res = await workersAPI.getById(workerId)
            let kpiData = res.data.current_kpi

            if (!kpiData || !kpiData.id) {
                // Fallback: Try the dedicated worker KPI endpoint with current period filters
                const now = new Date()
                const currentMonth = now.getMonth() + 1
                const currentYear = now.getFullYear()
                
                const kpiRes = await kpiAPI.getWorkerKpi(workerId, {
                    month: currentMonth,
                    year: currentYear
                })
                
                let rawData = kpiRes.data
                if (rawData?.results && Array.isArray(rawData.results)) {
                    rawData = rawData.results[0]
                } else if (Array.isArray(rawData)) {
                    rawData = rawData[0]
                }
                kpiData = rawData
            }

            // If kpiData is missing or has no ID, we still open the modal.
            // Documentation suggests that setting a target is how a KPI is "opened" (created).
            // In this case, we use the workerId as the primary identifier.
            const finalKpi = (kpiData && kpiData.id) ? kpiData : {
                id: workerId, 
                worker: workerId,
                worker_name: workerData.full_name || `${workerData.first_name || ''} ${workerData.last_name || ''}`.trim(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                target_amount: 0,
                bonus_amount: 0
            }

            selectedKpi.value = finalKpi
            targetModalVisible.value = true
        } catch (error) {
            console.error('❌ Error fetching KPI data:', error)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: 'Xodim KPI ma\'lumotlarini olishda xatolik yuz berdi.',
                life: 3000
            })
        }
    }

    return {
        worker,
        workerDialog,
        saving,
        submitted,
        createLogin,
        openNew,
        editWorker,
        saveWorker,
        confirmDeleteWorker,
        hideDialog,
        targetModalVisible,
        selectedKpi,
        openTargetModal
    }
}


