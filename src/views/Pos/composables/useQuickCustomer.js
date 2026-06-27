import { ref } from 'vue'
import { customersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useQuickCustomer(emit) {
  const toast = useToast()
  const { t } = useI18n()

  const customerDialogVisible = ref(false)
  const customerSaving = ref(false)
  const customerSubmitted = ref(false)
  const newCustomer = ref({
    name: '',
    phone: '',
    group: null,
    address: ''
  })

  const openAddCustomer = () => {
    newCustomer.value = { name: '', phone: '', group: null, address: '' }
    customerSubmitted.value = false
    customerDialogVisible.value = true
  }

  const closeAddCustomer = () => {
    customerDialogVisible.value = false
  }

  const handleSaveCustomer = async () => {
    customerSubmitted.value = true
    if (!newCustomer.value.name?.trim() || !newCustomer.value.phone?.trim()) return

    customerSaving.value = true
    try {
      const payload = {
        name: newCustomer.value.name,
        phone: newCustomer.value.phone,
        address: newCustomer.value.address || undefined
      }

      if (newCustomer.value.group) {
        payload.group = newCustomer.value.group
      }

      const response = await customersAPI.create(payload)
      const savedCustomer = response.data?.data || response.data

      toast.add({
        severity: 'success',
        summary: t('common.success') || 'Muvaffaqiyatli',
        detail: t('customers.messages.added') || 'Yangi mijoz qo\'shildi',
        life: 3000
      })

      if (emit) {
        emit('customer-added', savedCustomer)
        emit('update:selected-customer', savedCustomer)
      }

      customerDialogVisible.value = false
    } catch (error) {
      console.error('Error saving customer in POS:', error)
      toast.add({
        severity: 'error',
        summary: t('common.error') || 'Xato',
        detail: t('customers.messages.save_error') || 'Saqlashda xatolik yuz berdi',
        life: 5000
      })
    } finally {
      customerSaving.value = false
    }
  }

  return {
    customerDialogVisible,
    customerSaving,
    customerSubmitted,
    newCustomer,
    openAddCustomer,
    closeAddCustomer,
    handleSaveCustomer
  }
}
