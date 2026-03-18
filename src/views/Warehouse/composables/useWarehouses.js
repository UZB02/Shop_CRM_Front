import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { warehousesAPI } from '@/services/api'

export function useWarehouses() {
    const toast = useToast()
    const confirm = useConfirm()
    const { t } = useI18n()

    const warehouses = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const warehouseDialog = ref(false)
    const submitted = ref(false)
    const viewMode = ref('grid') // 'grid' or 'table'
    const searchQuery = ref('')

    // Pagination State
    const currentPage = ref(1)
    const rows = ref(10)
    const totalRecords = ref(0)

    const warehouse = ref({
        name: '',
        address: '',
        status: 'active'
    })

    const filteredWarehouses = computed(() => {
        if (!searchQuery.value.trim()) return warehouses.value
        const query = searchQuery.value.toLowerCase().trim()
        return warehouses.value.filter(w =>
            w.name?.toLowerCase().includes(query) ||
            w.address?.toLowerCase().includes(query)
        )
    })

    const loadWarehouses = async (page = 1) => {
        loading.value = true
        currentPage.value = page
        try {
            const res = await warehousesAPI.getAll({
                page,
                page_size: rows.value
            })

            console.log('Warehouses API Full Response:', res.data)

            if (res.data.results) {
                warehouses.value = res.data.results
                totalRecords.value = res.data.count || res.data.results.length
            } else {
                warehouses.value = Array.isArray(res.data) ? res.data : []
                totalRecords.value = warehouses.value.length
            }
            console.log('Warehouses List:', warehouses.value)
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: t('warehouse.messages.error'),
                detail: t('warehouse.messages.load_error'),
                life: 5000
            })
        } finally {
            loading.value = false
        }
    }

    const saveWarehouse = async () => {
        submitted.value = true
        if (!warehouse.value.name?.trim()) return

        saving.value = true
        try {
            const payload = {
                name: warehouse.value.name.trim(),
                address: warehouse.value.address?.trim() || '',
                status: warehouse.value.status || 'active'
            }

            const id = warehouse.value.id || warehouse.value._id
            if (id) {
                await warehousesAPI.update(id, payload)
                toast.add({ severity: 'success', summary: t('warehouse.messages.success'), detail: t('warehouse.messages.updated'), life: 5000 })
            } else {
                await warehousesAPI.create(payload)
                toast.add({ severity: 'success', summary: t('warehouse.messages.success'), detail: t('warehouse.messages.added'), life: 5000 })
            }

            warehouseDialog.value = false
            loadWarehouses(currentPage.value)
        } catch (error) {
            toast.add({ severity: 'error', summary: t('warehouse.messages.error'), detail: t('warehouse.messages.save_error'), life: 5000 })
        } finally {
            saving.value = false
        }
    }

    const confirmDelete = (data) => {
        confirm.require({
            message: t('warehouse.messages.delete_confirm', { name: data.name }),
            header: t('warehouse.messages.confirm_title'),
            icon: 'pi pi-exclamation-triangle',
            acceptClass: 'p-button-danger rounded-xl',
            rejectClass: 'p-button-text rounded-xl',
            accept: async () => {
                try {
                    await warehousesAPI.delete(data.id || data._id)
                    toast.add({ severity: 'success', summary: t('warehouse.messages.success'), detail: t('warehouse.messages.deleted'), life: 5000 })
                    loadWarehouses(currentPage.value)
                } catch (error) {
                    toast.add({ severity: 'error', summary: t('warehouse.messages.error'), detail: t('warehouse.messages.delete_error'), life: 5000 })
                }
            }
        })
    }

    const openNewDialog = () => {
        warehouse.value = { name: '', address: '', status: 'active' }
        submitted.value = false
        warehouseDialog.value = true
    }

    const editWarehouse = (data) => {
        console.log('Editing Warehouse:', data)
        console.log('Warehouse ID:', data.id || data._id)
        warehouse.value = {
            ...data,
            status: data.status || 'active'
        }
        warehouseDialog.value = true
    }

    const onPageChange = (event) => {
        loadWarehouses(event.page + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
        warehouses,
        loading,
        saving,
        warehouseDialog,
        submitted,
        viewMode,
        searchQuery,
        currentPage,
        rows,
        totalRecords,
        warehouse,
        filteredWarehouses,
        loadWarehouses,
        saveWarehouse,
        confirmDelete,
        openNewDialog,
        editWarehouse,
        onPageChange
    }
}
