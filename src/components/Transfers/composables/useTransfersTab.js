import { ref, computed } from 'vue'
import { useTransfers } from '@/composables/useTransfers'

export function useTransfersTab(props, emit) {
  const {
    transfers, loading, subLoading,
    transferDialog, transferForm,
    warehouses, branches,
    fetchTransfers, fetchWarehouseTransfers,
    createTransfer, confirmTransfer, cancelTransfer, openNewTransfer
  } = useTransfers()

  const activeStatus = ref('all')
  const detailDialog = ref(false)
  const selectedTransfer = ref(null)

  const statusOptions = computed(() => {
    const pending = transfers.value.filter(t => t.status === 'pending').length
    emit('pending-count', pending)
    return [
      { id: 'all',       label: 'Barchasi',       count: transfers.value.length },
      { id: 'pending',   label: 'Kutilmoqda',     count: pending },
      { id: 'confirmed', label: 'Tasdiqlangan',   count: transfers.value.filter(t => t.status === 'confirmed').length },
      { id: 'cancelled', label: 'Bekor qilingan', count: transfers.value.filter(t => t.status === 'cancelled').length }
    ]
  })

  const filteredTransfers = computed(() => {
    if (activeStatus.value === 'all') return transfers.value
    return transfers.value.filter(t => t.status === activeStatus.value)
  })

  const loadTransfers = () => {
    if (props.sourceType === 'warehouse' && props.sourceId) {
      fetchWarehouseTransfers(props.sourceId)
    } else {
      fetchTransfers()
    }
  }

  const handleCreateTransfer = async () => {
    const success = await createTransfer()
    if (success) loadTransfers()
  }

  const confirmAction = async (t) => {
    const success = await confirmTransfer(t.id)
    if (success) loadTransfers()
  }

  const cancelAction = async (t) => {
    const success = await cancelTransfer(t.id)
    if (success) loadTransfers()
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
