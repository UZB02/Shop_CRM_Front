import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { workersAPI, storesAPI, branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { WORKER_ROLES, WORKER_STATUSES } from './useWorkerForm'

export function useWorkers() {
    const { t } = useI18n()
    const toast = useToast()

    const workers = ref([])
    const totalRecords = ref(0)
    const page = ref(1)
    const pageSize = ref(10)
    const loading = ref(false)

    const stores = ref([])
    const branches = ref([])
    const storesLoading = ref(false)

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

    const loadWorkers = async () => {
        loading.value = true
        try {
            const params = {
                page: page.value
            }

            if (filters.value.search) params.search = filters.value.search
            if (filters.value.status) params.status = filters.value.status
            if (filters.value.role) params.role = filters.value.role
            if (filters.value.branch) params.branch = filters.value.branch

            const response = await workersAPI.getAll(params)
            const data = response.data

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
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('workers.messages.load_error'),
                life: 5000
            })
        } finally {
            loading.value = false
        }
    }

    const loadLocations = async () => {
        storesLoading.value = true
        try {
            const [storesRes, branchesRes] = await Promise.all([
                storesAPI.getAll(),
                branchesAPI.getAll()
            ])
            stores.value = storesRes.data?.results ?? (Array.isArray(storesRes.data) ? storesRes.data : [])
            branches.value = branchesRes.data?.results ?? (Array.isArray(branchesRes.data) ? branchesRes.data : [])
        } catch (error) {
            console.error('Joylashuvlarni yuklashda xatolik:', error)
        } finally {
            storesLoading.value = false
        }
    }

    let debounceTimer = null
    watch(() => filters.value, () => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            page.value = 1
            loadWorkers()
        }, 500)
    }, { deep: true })

    return {
        workers,
        totalRecords,
        page,
        pageSize,
        loading,
        filters,
        stores,
        branches,
        storesLoading,
        roleOptions,
        statusOptions,
        loadWorkers,
        loadLocations
    }
}


