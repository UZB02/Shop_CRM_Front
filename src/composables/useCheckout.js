import { ref, computed, watch } from 'vue'

export function useCheckout(props, emit) {
  const paymentType = ref('cash')
  const paidAmount = ref(0)
  const cashAmount = ref(0)
  const cardAmount = ref(0)
  const note = ref('')

  const methods = [
    { id: 'cash', label: 'Naqd', icon: 'pi pi-money-bill' },
    { id: 'card', label: 'Karta', icon: 'pi pi-credit-card' },
    { id: 'mixed', label: 'Aralash', icon: 'pi pi-percentage' },
    { id: 'debt', label: 'Nasiya', icon: 'pi pi-history' }
  ]

  // Reactive initialization when total or visibility changes
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      if (paymentType.value !== 'mixed') {
        paidAmount.value = props.total
      } else {
        cashAmount.value = props.total
        cardAmount.value = 0
      }
    }
  })

  const isMixedValid = computed(() => {
    return Math.abs((cashAmount.value + cardAmount.value) - props.total) < 0.01
  })

  const isValid = computed(() => {
    if (paymentType.value === 'mixed') return isMixedValid.value
    if (paymentType.value === 'debt') return props.selectedCustomer && (paidAmount.value < props.total)
    if (paymentType.value === 'cash' || paymentType.value === 'card') return paidAmount.value >= props.total
    return true
  })

  const resetValues = () => {
    paymentType.value = 'cash'
    paidAmount.value = props.total
    cashAmount.value = 0
    cardAmount.value = 0
    note.value = ''
  }

  const handleConfirm = () => {
    if (!isValid.value) return

    const data = {
      payment_type: paymentType.value,
      paid_amount: paymentType.value === 'mixed' ? (cashAmount.value + cardAmount.value) : paidAmount.value,
      note: note.value
    }

    if (paymentType.value === 'mixed') {
      data.cash_amount = cashAmount.value
      data.card_amount = cardAmount.value
    }

    emit('confirm', data)
  }

  return {
    paymentType,
    paidAmount,
    cashAmount,
    cardAmount,
    note,
    methods,
    isMixedValid,
    isValid,
    handleConfirm,
    resetValues
  }
}
