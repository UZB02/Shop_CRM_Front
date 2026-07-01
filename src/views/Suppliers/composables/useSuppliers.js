import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useConfirmStore } from '@/store/confirm'
import { suppliersAPI, supplierPaymentsAPI } from '@/services/api'

export function useSuppliers() {
    const toast = useToast()
    const { t } = useI18n()
    const confirmStore = useConfirmStore()

    // ── State ─────────────────────────────────────────────────────────────
    const suppliers = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const paymentSaving = ref(false)

    // Pagination
    const currentPage = ref(1)
    const rows = ref(20)
    const totalRecords = ref(0)

    // Filters
    const searchQuery = ref('')
    const statusFilter = ref('active') // 'active' | 'inactive' | ''
    const hasDebtFilter = ref(false)

    // Dialogs
    const supplierDialog = ref(false)
    const paymentDialog = ref(false)
    const submitted = ref(false)

    // Selected
    const supplier = ref(null)
    const selectedSupplier = ref(null)

    // Form
    const supplierForm = ref({
        name: '',
        phone: '',
        company: '',
        address: '',
        description: '',
        initial_debt: null
    })

    const paymentForm = ref({
        supplier: null,
        amount: '',
        payment_type: 'cash',
        description: '',
        smena: null
    })

    // ── Computed ──────────────────────────────────────────────────────────
    const filteredSuppliers = computed(() => {
        if (!searchQuery.value) return suppliers.value
        const q = searchQuery.value.toLowerCase()
        return suppliers.value.filter(s =>
            s.name?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q) ||
            s.company?.toLowerCase().includes(q) ||
            s.address?.toLowerCase().includes(q)
        )
    })

    // ── API Calls ─────────────────────────────────────────────────────────
    const loadSuppliers = async (page = 1) => {
        loading.value = true
        currentPage.value = page
        try {
            const params = { page, page_size: rows.value }
            if (statusFilter.value) params.status = statusFilter.value
            if (hasDebtFilter.value) params.has_debt = 'true'
            const res = await suppliersAPI.getAll(params)
            const data = res.data
            if (data.results !== undefined) {
                suppliers.value = data.results
                totalRecords.value = data.count || data.results.length
            } else {
                suppliers.value = Array.isArray(data) ? data : []
                totalRecords.value = suppliers.value.length
            }
        } catch (err) {
            const status = err.response?.status
            if (status === 403) {
                toast.add({
                    severity: 'warn',
                    summary: t('plan.plan_required'),
                    detail: t('suppliers.plan_required_detail'),
                    life: 6000
                })
            } else {
                toast.add({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('common.error_message'),
                    life: 3000
                })
            }
        } finally {
            loading.value = false
        }
    }

    const saveSupplier = async () => {
        submitted.value = true
        if (!supplierForm.value.name?.trim()) return
        if (supplierForm.value.phone && supplierForm.value.phone.trim().length < 13) return

        saving.value = true
        try {
            const payload = {
                name: supplierForm.value.name.trim(),
                phone: supplierForm.value.phone?.trim() || '',
                company: supplierForm.value.company?.trim() || '',
                address: supplierForm.value.address?.trim() || '',
                description: supplierForm.value.description?.trim() || ''
            }

            if (supplier.value?.id) {
                await suppliersAPI.update(supplier.value.id, payload)
                toast.add({
                    severity: 'success',
                    summary: t('common.success'),
                    detail: t('suppliers.messages.updated', { Name: payload.name }),
                    life: 3000
                })
            } else {
                if (supplierForm.value.initial_debt && parseFloat(supplierForm.value.initial_debt) !== 0) {
                    payload.initial_debt = supplierForm.value.initial_debt.toString()
                }
                await suppliersAPI.create(payload)
                toast.add({
                    severity: 'success',
                    summary: t('common.success'),
                    detail: t('suppliers.messages.added'),
                    life: 3000
                })
            }

            supplierDialog.value = false
            submitted.value = false
            await loadSuppliers(currentPage.value)
        } catch (err) {
            const msg = err.response?.data?.name?.[0]
                || err.response?.data?.detail
                || t('common.error_message')
            toast.add({ severity: 'error', summary: t('common.error'), detail: msg, life: 5000 })
        } finally {
            saving.value = false
        }
    }

    const confirmDelete = (sup) => {
        confirmStore.require({
            message: t('suppliers.messages.delete_confirm', { Name: sup.name }),
            header: t('suppliers.messages.delete_header'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: t('common.yes_delete'),
            rejectLabel: t('common.cancel'),
            acceptClass: 'p-button-danger',
            accept: async () => {
                try {
                    const res = await suppliersAPI.delete(sup.id)
                    const backendMsg = res?.data?.message || res?.data?.detail || t('suppliers.messages.deleted', { Name: sup.name })
                    
                    toast.add({
                        severity: 'success',
                        summary: t('common.success'),
                        detail: backendMsg,
                        life: 3000
                    })
                    await loadSuppliers(currentPage.value)
                } catch (err) {
                    const errorMsg = err.response?.data?.message || err.response?.data?.detail || t('suppliers.messages.delete_error')
                    toast.add({
                        severity: 'error',
                        summary: t('common.error'),
                        detail: errorMsg,
                        life: 4000
                    })
                }
            }
        })
    }

    // ── Payment ───────────────────────────────────────────────────────────
    const savePayment = async () => {
        submitted.value = true
        if (!paymentForm.value.amount || Number(paymentForm.value.amount) <= 0) return

        paymentSaving.value = true
        try {
            const payload = {
                supplier: paymentForm.value.supplier,
                amount: String(paymentForm.value.amount),
                payment_type: paymentForm.value.payment_type,
                description: paymentForm.value.description?.trim() || ''
            }
            if (paymentForm.value.smena) payload.smena = paymentForm.value.smena

            await supplierPaymentsAPI.create(payload)
            toast.add({
                severity: 'success',
                summary: t('common.success'),
                detail: t('suppliers.messages.payment_added'),
                life: 3000
            })
            paymentDialog.value = false
            submitted.value = false
            await loadSuppliers(currentPage.value)
        } catch (err) {
            const data = err.response?.data
            const msg =
                (data?.non_field_errors && data.non_field_errors[0]) ||
                data?.detail ||
                data?.amount?.[0] ||
                t('common.error_message')
            toast.add({ severity: 'error', summary: t('common.error'), detail: msg, life: 5000 })
        } finally {
            paymentSaving.value = false
        }
    }

    // ── Export ────────────────────────────────────────────────────────────
    const exportSuppliers = async (format = 'xlsx') => {
        try {
            const params = { format }
            if (statusFilter.value) params.status = statusFilter.value
            const res = await suppliersAPI.export(params)
            const ext = format === 'pdf' ? 'pdf' : 'xlsx'
            const url = URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement('a')
            a.href = url
            a.download = `suppliers.${ext}`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error_message'), life: 3000 })
        }
    }

    // ── Dialog Helpers ────────────────────────────────────────────────────
    const openNew = () => {
        supplier.value = null
        supplierForm.value = { name: '', phone: '', company: '', address: '', description: '', initial_debt: null }
        submitted.value = false
        supplierDialog.value = true
    }

    const editSupplier = (sup) => {
        supplier.value = { ...sup }
        supplierForm.value = {
            name: sup.name || '',
            phone: sup.phone || '',
            company: sup.company || '',
            address: sup.address || '',
            description: sup.description || ''
        }
        submitted.value = false
        supplierDialog.value = true
    }

    const openPayment = (sup) => {
        selectedSupplier.value = sup
        paymentForm.value = {
            supplier: sup.id,
            amount: '',
            payment_type: 'cash',
            description: '',
            smena: null
        }
        submitted.value = false
        paymentDialog.value = true
    }

    const onPageChange = (event) => {
        const page = Math.floor(event.first / event.rows) + 1
        loadSuppliers(page)
    }

    const handleSearch = () => {
        // client-side filter via filteredSuppliers computed
    }

    return {
        // State
        suppliers,
        loading,
        saving,
        paymentSaving,
        supplierDialog,
        paymentDialog,
        submitted,
        supplier,
        selectedSupplier,
        supplierForm,
        paymentForm,
        searchQuery,
        statusFilter,
        hasDebtFilter,
        currentPage,
        rows,
        totalRecords,
        // Computed
        filteredSuppliers,
        // Methods
        loadSuppliers,
        saveSupplier,
        confirmDelete,
        savePayment,
        exportSuppliers,
        openNew,
        editSupplier,
        openPayment,
        onPageChange,
        handleSearch
    }
}
