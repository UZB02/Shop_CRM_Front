import { ref, onMounted, computed, watch } from 'vue'
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
    const tabLoading = ref(false)
    const activeTab = ref('workers')

    // Refresh only the relevant tab when changed
    watch(activeTab, (tab) => {
        if (tab === 'transfers' || tab === 'incoming') return // These have their own fetch logic
        fetchDetail(tab)
    })

    // Edit State
    const editModalVisible = ref(false)
    const branchForm = ref({})
    const submitted = ref(false)
    const saving = ref(false)

    const tabs = computed(() => [
        { id: 'workers', label: t('menu.workers') },
        { id: 'products', label: t('menu.products') },
        { id: 'transfers', label: t('warehouse.detail.transfers') },
        { id: 'incoming', label: t('warehouse.detail.incoming_history') },
        { id: 'customers', label: t('menu.customers') }
    ])

    const fetchDetail = async (tab = null) => {
        try {
            if (tab) tabLoading.value = true
            else if (!branch.value) loading.value = true

            const res = await branchesAPI.getById(route.params.id, tab ? { tab } : {})
            
            if (tab && branch.value) {
                // Merge only the specific tab data to keep other tab counts alive
                if (res.data[tab]) {
                    branch.value[tab] = res.data[tab]
                } else {
                    branch.value = res.data
                }
            } else {
                branch.value = res.data
            }
            console.log('Branch API Data:', res.data)
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
            tabLoading.value = false
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
        tabLoading,
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
