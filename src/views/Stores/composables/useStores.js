import { ref, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAppConfirm as useConfirm } from '@/composables/useAppConfirm'
import { useI18n } from 'vue-i18n'
import { storesAPI, branchesAPI, regionsAPI } from '@/services/api'
import { useNotificationStore } from '@/store/notifications'

export function useStores() {
    const { t } = useI18n()
    const toast = useToast()
    const confirm = useConfirm()
    const notificationStore = useNotificationStore()

    // Store State
    const store = ref({})
    const storeForm = ref({})
    const storeDialog = ref(false)
    const submitted = ref(false)
    const loading = ref(false)
    const saving = ref(false)
    const regions = ref([])

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
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.load_error'), life: 5000 })
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
            const [storesRes, regionsRes] = await Promise.all([
                storesAPI.getAll(),
                regionsAPI.getAll()
            ])
            
            const list = storesRes.data?.results ?? (Array.isArray(storesRes.data) ? storesRes.data : [])
            store.value = list.length > 0 ? list[0] : {}
            
            regions.value = regionsRes.data?.results ?? (Array.isArray(regionsRes.data) ? regionsRes.data : [])

            await loadBranches()
        } catch (error) {
            console.error('Error loading data:', error)
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.load_error'), life: 5000 })
        } finally {
            loading.value = false
        }
    }

    // ─── Store Actions ────────────────────────────────────────
    const openNewStoreDialog = () => {
        storeForm.value = { name: '', address: '', phone: '', status: 'active', region_id: null, district_id: null }
        submitted.value = false
        storeDialog.value = true
    }

    const openEditStoreDialog = async () => {
        const id = store.value.id || store.value._id
        if (!id) return

        try {
            const res = await storesAPI.getById(id)
            console.log('API dan kelgan do\'kon ma\'lumotlari (detail):', res.data)
            storeForm.value = { ...res.data }
            submitted.value = false
            storeDialog.value = true
        } catch (error) {
            console.error('Do\'kon ma\'lumotlarini olishda xatolik:', error)
            // Fallback to existing list data
            storeForm.value = { ...store.value }
            storeDialog.value = true
        }
    }

    const saveStore = async () => {
        submitted.value = true
        if (!storeForm.value.name?.trim() || !storeForm.value.address?.trim() || !storeForm.value.phone?.trim() || !storeForm.value.region_id || !storeForm.value.district_id) return
        saving.value = true
        try {
            const id = storeForm.value.id || storeForm.value._id
            const payload = {
                name: storeForm.value.name,
                address: storeForm.value.address,
                phone: storeForm.value.phone,
                status: storeForm.value.status,
                region_id: storeForm.value.region_id,
                district_id: storeForm.value.district_id
            }
            if (id) {
                await storesAPI.update(id, payload)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_updated'), life: 5000 })
            } else {
                await storesAPI.create(payload)
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.store_added'), life: 5000 })
            }
            storeDialog.value = false
            loadData()
        } catch {
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 5000 })
        } finally {
            saving.value = false
        }
    }

    // ─── Branch Actions ───────────────────────────────────────
    const openNewBranchDialog = () => {
        branch.value = { name: '', address: '', phone: '', status: 'active', region_id: null, district_id: null }
        branchSubmitted.value = false
        branchDialog.value = true
    }

    const editBranch = (data) => {
        console.log(
            "%c[Branches Edit Open]%c Tahrirlash uchun ochilgan filial ma'lumotlari:", 
            "background: #eab308; color: black; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
            "color: #eab308; font-weight: bold;", 
            JSON.parse(JSON.stringify(data))
        )
        branch.value = { ...data }
        branchDialog.value = true
    }

    const saveBranch = async () => {
        branchSubmitted.value = true
        if (!branch.value.name?.trim() || !branch.value.phone?.trim() || !branch.value.address?.trim() || !branch.value.region_id || !branch.value.district_id) {
            console.warn(
                "%c[Branches Validation Failed]%c To'ldirilgan ma'lumotlar to'liq emas yoki noto'g'ri:", 
                "background: #f43f5e; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
                "color: #f43f5e; font-weight: bold;", 
                JSON.parse(JSON.stringify(branch.value))
            )
            return
        }
        saving.value = true
        try {
            const id = branch.value.id || branch.value._id
            const payload = {
                name: branch.value.name,
                address: branch.value.address,
                phone: branch.value.phone,
                status: branch.value.status,
                region_id: branch.value.region_id,
                district_id: branch.value.district_id
            }
            
            console.log(
                "%c[Branches Save Payload]%c Backendga yuborilayotgan ma'lumotlar (Payload):", 
                "background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
                "color: #10b981; font-weight: bold;", 
                JSON.parse(JSON.stringify(payload))
            )
            
            if (id) {
                const res = await branchesAPI.update(id, payload)
                console.log(
                    "%c[Branches API Success]%c API dan qaytgan javob (Update - PATCH):", 
                    "background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
                    "color: #3b82f6; font-weight: bold;", 
                    res.data
                )
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_updated'), life: 5000 })
            } else {
                const res = await branchesAPI.create(payload)
                console.log(
                    "%c[Branches API Success]%c API dan qaytgan javob (Create - POST):", 
                    "background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
                    "color: #10b981; font-weight: bold;", 
                    res.data
                )
                toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_added'), life: 5000 })
                // Real-time sync of subscription limits
                notificationStore.fetchSubscription()
            }
            branchDialog.value = false
            loadData()
        } catch (error) {
            console.error(
                "%c[Branches API Error]%c Filialni saqlashda xatolik yuz berdi:", 
                "background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;", 
                "color: #ef4444; font-weight: bold;", 
                error
            )
            toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.save_error'), life: 5000 })
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
                    toast.add({ severity: 'success', summary: t('stores.success'), detail: t('stores.branch_deleted'), life: 5000 })
                    // Real-time sync of subscription limits after deletion
                    notificationStore.fetchSubscription()
                    loadData()
                } catch {
                    toast.add({ severity: 'error', summary: t('stores.error'), detail: t('stores.delete_error'), life: 5000 })
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
        regions,
        openNewStoreDialog, openEditStoreDialog, saveStore,

        // Branch
        branches, branch, branchDialog, branchSubmitted, branchSearch,
        branchStatusFilter, branchPage, branchPageSize, branchTotalRecords,
        loadingBranches, loadBranches, openNewBranchDialog, editBranch,
        saveBranch, confirmDeleteBranch
    }
}


