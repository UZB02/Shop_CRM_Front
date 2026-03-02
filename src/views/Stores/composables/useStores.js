import { ref, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { storesAPI, branchesAPI } from '@/services/api'

export function useStores() {
    const { t } = useI18n()
    const toast = useToast()
    const confirm = useConfirm()

    // Store State
    const store = ref({})
    const storeForm = ref({})
    const storeDialog = ref(false)
    const submitted = ref(false)
    const loading = ref(false)
    const saving = ref(false)

    // Branch State
    const branches = ref([])
    const branch = ref({ name: '', address: '', phone: '', status: 'active' })
    const branchDialog = ref(false)
    const branchSubmitted = ref(false)
    const branchSearch = ref('')
    const branchStatusFilter = ref('all')
    const branchPage = ref(1)
    const branchPageSize = ref(10)
    const branchTotalRecords = ref(0)
    const loadingBranches = ref(false)

    const allBranches = ref([])

    // ─── Load Branches (Senior Level: Auto-Pagination Fetcher) ────────────────
    const loadBranches = async () => {
        // Only show loading for the initial load
        if (allBranches.value.length === 0) loadingBranches.value = true

        try {
            let aggregatedData = []
            let page = 1
            let hasMore = true

            // Fetch all pages to ensure local filtering is 100% accurate
            while (hasMore) {
                const res = await branchesAPI.getAll({ page })
                console.log('Filiallar API javobi (page ' + page + '):', res.data)
                const data = res.data

                const results = data.results ?? (Array.isArray(data) ? data : [])
                aggregatedData = [...aggregatedData, ...results]

                // Detection: Is there another page?
                if (data.next && aggregatedData.length < (data.count || 1000)) {
                    page++
                } else {
                    hasMore = false
                }

                // Safety break for extremely large datasets
                if (page > 10) break
            }

            allBranches.value = aggregatedData
            applyLocalFilters()
        } catch (error) {
            console.error('Filiallarni yuklashda xatolik:', error)
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.load_error'), life: 3000 })
        } finally {
            loadingBranches.value = false
        }
    }

    // High-performance local processing engine
    const applyLocalFilters = () => {
        let result = [...allBranches.value]

        // 1. Precise status filtering
        if (branchStatusFilter.value !== 'all') {
            result = result.filter(b => b.status === branchStatusFilter.value)
        }

        // 2. Multi-column fuzzy search
        const q = branchSearch.value.trim().toLowerCase()
        if (q) {
            result = result.filter(b =>
                (b.name || '').toLowerCase().includes(q) ||
                (b.phone || '').toLowerCase().includes(q) ||
                (b.address || '').toLowerCase().includes(q)
            )
        }

        // 3. Update global metrics
        branchTotalRecords.value = result.length

        // 4. Reactive pagination management
        if (branchPage.value > Math.ceil(result.length / branchPageSize.value) && result.length > 0) {
            branchPage.value = 1
        }

        const start = (branchPage.value - 1) * branchPageSize.value
        branches.value = result.slice(start, start + branchPageSize.value)
    }

    // ─── Load All Data ───────────────────────────────────────
    const loadData = async () => {
        loading.value = true
        try {
            const storesRes = await storesAPI.getAll()
            const list = storesRes.data?.results ?? (Array.isArray(storesRes.data) ? storesRes.data : [])
            store.value = list.length > 0 ? list[0] : {}

            await loadBranches()
        } catch {
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.load_error'), life: 3000 })
        } finally {
            loading.value = false
        }
    }

    // ─── Store Actions ────────────────────────────────────────
    const openNewStoreDialog = () => {
        storeForm.value = { name: '', location: '', phone: '', status: 'active' }
        submitted.value = false
        storeDialog.value = true
    }

    const openEditStoreDialog = () => {
        storeForm.value = { ...store.value }
        submitted.value = false
        storeDialog.value = true
    }

    const saveStore = async () => {
        submitted.value = true
        if (!storeForm.value.name?.trim()) return
        saving.value = true
        try {
            const id = storeForm.value.id || storeForm.value._id
            if (id) {
                await storesAPI.update(id, storeForm.value)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_updated'), life: 3000 })
            } else {
                await storesAPI.create(storeForm.value)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_added'), life: 3000 })
            }
            storeDialog.value = false
            loadData()
        } catch {
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 3000 })
        } finally {
            saving.value = false
        }
    }

    // ─── Branch Actions ───────────────────────────────────────
    const openNewBranchDialog = () => {
        branch.value = { name: '', address: '', phone: '', status: 'active' }
        branchSubmitted.value = false
        branchDialog.value = true
    }

    const editBranch = (data) => {
        branch.value = { ...data }
        branchDialog.value = true
    }

    const saveBranch = async () => {
        branchSubmitted.value = true
        if (!branch.value.name?.trim()) return
        saving.value = true
        try {
            const id = branch.value.id || branch.value._id
            const payload = {
                name: branch.value.name,
                address: branch.value.address,
                phone: branch.value.phone,
                status: branch.value.status
            }
            if (id) {
                await branchesAPI.update(id, payload)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_updated'), life: 3000 })
            } else {
                await branchesAPI.create(payload)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_added'), life: 3000 })
            }
            branchDialog.value = false
            loadData()
        } catch {
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 3000 })
        } finally {
            saving.value = false
        }
    }

    const confirmDeleteBranch = (data) => {
        confirm.require({
            message: t('stores.branch_delete_confirm', { name: data.name }),
            header: t('stores.confirm_title'),
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    await branchesAPI.delete(data.id || data._id)
                    toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_deleted'), life: 3000 })
                    loadData()
                } catch {
                    toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.delete_error'), life: 3000 })
                }
            }
        })
    }

    // Watches for branch filters and search - Instant UI response
    watch([branchSearch, branchStatusFilter, branchPage], () => {
        applyLocalFilters()
    })

    onMounted(() => loadData())

    return {
        // Store
        store, storeForm, storeDialog, submitted, loading, saving,
        openNewStoreDialog, openEditStoreDialog, saveStore,

        // Branch
        branches, branch, branchDialog, branchSubmitted, branchSearch,
        branchStatusFilter, branchPage, branchPageSize, branchTotalRecords,
        loadingBranches, loadBranches, openNewBranchDialog, editBranch,
        saveBranch, confirmDeleteBranch
    }
}
