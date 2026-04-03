import { ref, computed, watch } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useTransfers } from '@/composables/useTransfers'
import i18n from '@/i18n'

export function useTransfersTab(props, emit) {
  const confirm = useConfirm()
  const {
    transfers, loading, subLoading,
    transferDialog, transferForm,
    warehouses, branches,
    fetchTransfers, fetchWarehouseTransfers, fetchBranchTransfers,
    createTransfer, confirmTransfer, cancelTransfer, openNewTransfer
  } = useTransfers()

  const activeStatus = ref('all')
  const detailDialog = ref(false)
  const selectedTransfer = ref(null)
  
  // Refresh data when tab changes
  watch(activeStatus, () => {
    loadTransfers()
  })

  const statusOptions = computed(() => {
    const pending = transfers.value.filter(t => t.status === 'pending').length
    emit('pending-count', pending)
    return [
      { id: 'all',       label: i18n.global.t('transfers.status.all'),       count: transfers.value.length },
      { id: 'pending',   label: i18n.global.t('transfers.status.pending'),   count: pending },
      { id: 'confirmed', label: i18n.global.t('transfers.status.confirmed'), count: transfers.value.filter(t => t.status === 'confirmed').length },
      { id: 'cancelled', label: i18n.global.t('transfers.status.cancelled'), count: transfers.value.filter(t => t.status === 'cancelled').length }
    ]
  })

  const filteredTransfers = computed(() => {
    if (activeStatus.value === 'all') return transfers.value
    return transfers.value.filter(t => t.status === activeStatus.value)
  })

  const loadTransfers = () => {
    if (props.sourceType === 'warehouse' && props.sourceId) {
      fetchWarehouseTransfers(props.sourceId)
    } else if (props.sourceType === 'branch' && props.sourceId) {
      fetchBranchTransfers(props.sourceId)
    } else {
      fetchTransfers()
    }
  }

  const handleCreateTransfer = async () => {
    const success = await createTransfer()
    if (success) loadTransfers()
  }

  const confirmAction = (t) => {
    confirm.require({
      message: i18n.global.t('transfers.confirm_msg'),
      header: i18n.global.t('common.confirm_title'),
      icon: 'pi pi-check-circle',
      acceptClass: 'p-button-success',
      acceptLabel: i18n.global.t('transfers.yes_confirm'),
      rejectLabel: i18n.global.t('transfers.cancel_btn'),
      accept: async () => {
        const success = await confirmTransfer(t.id)
        if (success) loadTransfers()
      }
    })
  }

  const cancelAction = (t) => {
    confirm.require({
      message: i18n.global.t('transfers.cancel_msg'),
      header: i18n.global.t('transfers.cancel_btn'),
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      acceptLabel: i18n.global.t('transfers.yes_cancel'),
      rejectLabel: i18n.global.t('transfers.back_btn'),
      accept: async () => {
        const success = await cancelTransfer(t.id)
        if (success) loadTransfers()
      }
    })
  }

  const viewDetail = (t) => {
    selectedTransfer.value = t
    detailDialog.value = true
  }

  return {
    transfers, loading, subLoading,
    transferDialog, transferForm,
    warehouses, branches,
    activeStatus, detailDialog, selectedTransfer,
    statusOptions, filteredTransfers,
    loadTransfers, handleCreateTransfer,
    confirmAction, cancelAction, viewDetail,
    createTransfer, openNewTransfer
  }
}
