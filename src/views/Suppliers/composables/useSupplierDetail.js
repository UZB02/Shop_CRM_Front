import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { suppliersAPI, supplierPaymentsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useConfirmStore } from '@/store/confirm'

export function useSupplierDetail() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const confirmStore = useConfirmStore()

  const loading = ref(true)
  const supplier = ref(null)

  // Dialogs and Forms
  const supplierDialog = ref(false)
  const paymentDialog = ref(false)
  const submitted = ref(false)
  const saving = ref(false)
  const paymentSaving = ref(false)

  const supplierForm = ref({
    name: '',
    phone: '',
    company: '',
    address: '',
    description: ''
  })

  const paymentForm = ref({
    supplier: null,
    amount: '',
    payment_type: 'cash',
    description: '',
    smena: null
  })

  const loadSupplierData = async () => {
    loading.value = true
    try {
      const id = route.params.id
      if (!id) return
      
      const response = await suppliersAPI.getById(id)
      supplier.value = response.data
    } catch (error) {
      console.error('Error loading supplier details:', error)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error_message'), life: 5000 })
    } finally {
      loading.value = false
    }
  }

  const editSupplier = () => {
    if (!supplier.value) return
    supplierForm.value = {
      name: supplier.value.name || '',
      phone: supplier.value.phone || '',
      company: supplier.value.company || '',
      address: supplier.value.address || '',
      description: supplier.value.description || ''
    }
    submitted.value = false
    supplierDialog.value = true
  }

  const saveSupplier = async () => {
    submitted.value = true
    if (!supplierForm.value.name?.trim()) return

    saving.value = true
    try {
      const payload = {
        name: supplierForm.value.name.trim(),
        phone: supplierForm.value.phone?.trim() || '',
        company: supplierForm.value.company?.trim() || '',
        address: supplierForm.value.address?.trim() || '',
        description: supplierForm.value.description?.trim() || ''
      }

      await suppliersAPI.update(supplier.value.id, payload)
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('suppliers.messages.updated', { Name: payload.name }),
        life: 3000
      })

      supplierDialog.value = false
      submitted.value = false
      await loadSupplierData()
    } catch (err) {
      const msg = err.response?.data?.name?.[0]
          || err.response?.data?.detail
          || t('common.error_message')
      toast.add({ severity: 'error', summary: t('common.error'), detail: msg, life: 5000 })
    } finally {
      saving.value = false
    }
  }

  const openPayment = () => {
    if (!supplier.value) return
    paymentForm.value = {
      supplier: supplier.value.id,
      amount: '',
      payment_type: 'cash',
      description: '',
      smena: null
    }
    submitted.value = false
    paymentDialog.value = true
  }

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
      await loadSupplierData()
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.amount?.[0] || t('common.error_message')
      toast.add({ severity: 'error', summary: t('common.error'), detail: msg, life: 5000 })
    } finally {
      paymentSaving.value = false
    }
  }

  const confirmDelete = () => {
    if (!supplier.value) return
    const isActivating = supplier.value.status === 'inactive'
    const actKey = isActivating ? 'suppliers.activate' : 'suppliers.messages.delete_confirm'
    const actHead = isActivating ? 'Tasdiqlash' : 'suppliers.messages.delete_header' // Or standard translation

    confirmStore.require({
      message: t(isActivating ? 'Buni faollashtirmoqchimisiz?' : 'suppliers.messages.delete_confirm', { Name: supplier.value.name }),
      header: t('suppliers.messages.delete_header'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t(isActivating ? 'common.yes' : 'common.yes_delete'),
      rejectLabel: t('common.cancel'),
      acceptClass: isActivating ? 'p-button-success' : 'p-button-danger',
      accept: async () => {
        try {
          if (isActivating) {
            await suppliersAPI.update(supplier.value.id, { status: 'active' })
            toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.updated'), life: 3000 })
            await loadSupplierData()
          } else {
            await suppliersAPI.delete(supplier.value.id)
            toast.add({
              severity: 'success',
              summary: t('common.success'),
              detail: t('suppliers.messages.deleted', { Name: supplier.value.name }),
              life: 3000
            })
            router.push('/dashboard/suppliers')
          }
        } catch (err) {
          toast.add({
            severity: 'error',
            summary: t('common.error'),
            detail: t('suppliers.messages.delete_error'),
            life: 3000
          })
        }
      }
    })
  }

  return {
    loading,
    supplier,
    supplierDialog,
    paymentDialog,
    submitted,
    saving,
    paymentSaving,
    supplierForm,
    paymentForm,
    loadSupplierData,
    editSupplier,
    saveSupplier,
    openPayment,
    savePayment,
    confirmDelete
  }
}
