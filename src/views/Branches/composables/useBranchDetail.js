import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { branchesAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

export function useBranchDetail() {
    const route = useRoute()
    const { t } = useI18n()
    const toast = useToast()

    const branch = ref(null)
    const loading = ref(true)
    const activeTab = ref('workers')

    // Edit State
    const editModalVisible = ref(false)
    const branchForm = ref({})
    const submitted = ref(false)
    const saving = ref(false)

    const tabs = computed(() => [
        { id: 'workers', label: t('menu.workers') },
        { id: 'products', label: t('menu.products') },
        { id: 'customers', label: t('menu.customers') }
    ])

    const fetchDetail = async () => {
        try {
            loading.value = true
            const res = await branchesAPI.getById(route.params.id)
            branch.value = res.data
        } catch (err) {
            console.error('Error fetching branch:', err)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('common.error_message'),
                life: 3000
            })
        } finally {
            loading.value = false
        }
    }

    const openEditModal = () => {
        branchForm.value = { ...branch.value }
        submitted.value = false
        editModalVisible.value = true
    }

    const handleSave = async (payload = null) => {
        submitted.value = true
        // If payload is passed, use it, otherwise use branchForm.value
        const data = payload && payload.name ? payload : branchForm.value

        if (!data.name?.trim() || !data.phone?.trim() || !data.address?.trim()) return

        saving.value = true
        try {
            const id = branch.value.id || branch.value._id
            await branchesAPI.update(id, data)

            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: t('stores.branch_updated'),
                life: 3000
            })

            editModalVisible.value = false
            await fetchDetail()
        } catch (err) {
            console.error('Error updating branch:', err)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: t('stores.save_error'),
                life: 3000
            })
        } finally {
            saving.value = false
        }
    }

    onMounted(() => {
        fetchDetail()
    })

    return {
        branch,
        loading,
        activeTab,
        tabs,
        editModalVisible,
        branchForm,
        submitted,
        saving,
        fetchDetail,
        openEditModal,
        handleSave
    }
}
