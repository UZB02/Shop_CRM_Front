import { ref, computed } from 'vue'
import { transfersAPI, warehousesAPI, branchesAPI } from '@/services/api'
import { getErrorMessage } from '@/services/axios'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useTransfers() {
    const toast = useToast()
    const { t } = useI18n()

    const transfers = ref([])
    const loading = ref(false)
    const subLoading = ref(false)
    
    // Dialog state
    const transferDialog = ref(false)
    const transferForm = ref({
        from_branch: null,
        from_warehouse: null,
        to_branch: null,
        to_warehouse: null,
        items: [],
        note: ''
    })
    
    const warehouses = ref([])
    const branches = ref([])

    const fetchTransfers = async (params = {}) => {
        loading.value = true
        try {
            const res = await transfersAPI.getAll(params)
            transfers.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching transfers:', error)
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

    const fetchWarehouseTransfers = async (warehouseId, params = {}) => {
        loading.value = true
        try {
            const res = await warehousesAPI.getTransfers(warehouseId, params)
            transfers.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching warehouse transfers:', error)
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

    const fetchBranchTransfers = async (branchId, params = {}) => {
        loading.value = true
        try {
            const res = await branchesAPI.getTransfers(branchId, params)
            transfers.value = res.data.results || res.data
        } catch (error) {
            console.error('Error fetching branch transfers:', error)
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

    const fetchLocations = async () => {
        try {
            const [wRes, bRes] = await Promise.all([
                warehousesAPI.getAll(),
                branchesAPI.getAll()
            ])
            warehouses.value = wRes.data.results || wRes.data
            branches.value = bRes.data.results || bRes.data
        } catch (error) {
            console.error('Error fetching locations:', error)
        }
    }

    const createTransfer = async () => {
        if (!transferForm.value.items.length) {
            toast.add({
                severity: 'warn',
                summary: t('common.warning'),
                detail: 'Kamida bitta mahsulot qo\'shing',
                life: 3000
            })
            return
        }

        // Must have at least one target (branch or warehouse)
        if (!transferForm.value.to_branch && !transferForm.value.to_warehouse) {
            toast.add({
                severity: 'warn',
                summary: t('common.warning'),
                detail: 'Qabul qiluvchi joyni tanlang',
                life: 3000
            })
            return
        }

        subLoading.value = true
        try {
            // Clean up the form data: from_branch and from_warehouse - only one should be sent
            // to_branch and to_warehouse - only one should be sent
            const payload = {
                items: transferForm.value.items.map(item => {
                    const itemData = {
                        product: item.product.id || item.product.product_id,
                        quantity: item.quantity,
                        note: item.note || ''
                    }
                    if (item.product.has_tur && item.product.tur_id != null) {
                        itemData.tur_id = item.product.tur_id
                    }
                    return itemData
                }),
                note: transferForm.value.note
            }

            if (transferForm.value.from_branch != null) payload.from_branch = transferForm.value.from_branch
            else if (transferForm.value.from_warehouse != null) payload.from_warehouse = transferForm.value.from_warehouse

            if (transferForm.value.to_branch != null) payload.to_branch = transferForm.value.to_branch
            else if (transferForm.value.to_warehouse != null) payload.to_warehouse = transferForm.value.to_warehouse

            await transfersAPI.create(payload)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Transfer muvaffaqiyatli yaratildi',
                life: 3000
            })
            transferDialog.value = false
            return true
        } catch (error) {
            console.error('Error creating transfer:', error)
            const errorData = error.response?.data
            
            // If it's a validation error from our backend (zero_stock or insufficient_stock)
            if (errorData && (errorData.zero_stock || errorData.insufficient_stock)) {
                return { success: false, validationErrors: errorData }
            }

            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: getErrorMessage(error),
                life: 5000
            })
            return { success: false }
        } finally {
            subLoading.value = false
        }
    }

    const confirmTransfer = async (id) => {
        subLoading.value = true
        try {
            await transfersAPI.confirm(id)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Transfer tasdiqlandi',
                life: 3000
            })
            return true
        } catch (error) {
            console.error('Error confirming transfer:', error)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: getErrorMessage(error),
                life: 3000
            })
        } finally {
            subLoading.value = false
        }
    }

    const cancelTransfer = async (id) => {
        subLoading.value = true
        try {
            await transfersAPI.cancel(id)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: 'Transfer bekor qilindi',
                life: 3000
            })
            return true
        } catch (error) {
            console.error('Error cancelling transfer:', error)
            toast.add({
                severity: 'error',
                summary: t('common.error'),
                detail: getErrorMessage(error),
                life: 3000
            })
        } finally {
            subLoading.value = false
        }
    }

    const openNewTransfer = (from = null) => {
        transferForm.value = {
            from_branch: from?.type === 'branch' ? (from.id || from._id) : null,
            from_warehouse: from?.type === 'warehouse' ? (from.id || from._id) : null,
            to_branch: null,
            to_warehouse: null,
            items: [],
            note: ''
        }
        transferDialog.value = true
        fetchLocations()
    }

    return {
        transfers,
        loading,
        subLoading,
        transferDialog,
        transferForm,
        warehouses,
        branches,
        fetchTransfers,
        fetchWarehouseTransfers,
        fetchBranchTransfers,
        fetchLocations,
        createTransfer,
        confirmTransfer,
        cancelTransfer,
        openNewTransfer
    }
}


