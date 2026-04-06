import { ref, computed, watch } from 'vue'

export function useCheckout(props, emit) {
  const paymentType = ref('cash')
  // Xodim bu yerga chegirma MIQDORINI yozadi (masalan: 8200)
  const discountAmount = ref(0)
  const cashAmount = ref(0)
  const cardAmount = ref(0)
  const description = ref('')

  const methods = [
    { id: 'cash', label: 'Naqd', icon: 'pi pi-money-bill' },
    { id: 'card', label: 'Karta', icon: 'pi pi-credit-card' },
    { id: 'mixed', label: 'Aralash', icon: 'pi pi-percentage' },
    { id: 'debt', label: 'Nasiya', icon: 'pi pi-history' }
  ]

  // Reset & initialize on open
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      paymentType.value = 'cash'
      description.value = ''
      emit('update:selected-customer', null)
      discountAmount.value = 0
      cashAmount.value = props.total
      cardAmount.value = 0
    }
  })

  const isMixedValid = computed(() => {
    return Math.abs((cashAmount.value + cardAmount.value) - props.total) < 0.01
  })

  // Haqiqiy to'lanadigan summa = asl narx - chegirma
  const paidAmount = computed(() => {
    const paid = (props.total || 0) - (discountAmount.value || 0)
    return paid > 0 ? paid : 0
  })

  const isValid = computed(() => {
    if (paymentType.value === 'mixed') return isMixedValid.value
    if (paymentType.value === 'debt') return !!props.selectedCustomer
    // Chegirma summasi totaldan oshmasligi kerak
    if (paymentType.value === 'cash' || paymentType.value === 'card') {
      return (discountAmount.value || 0) <= (props.total || 0)
    }
    return true
  })

  const resetValues = () => {
    paymentType.value = 'cash'
    discountAmount.value = 0
    cashAmount.value = 0
    cardAmount.value = 0
    note.value = ''
  }

  const handleConfirm = () => {
    if (!isValid.value) return

    const paid = paymentType.value === 'mixed'
      ? (cashAmount.value + cardAmount.value)
      : paidAmount.value

    const data = {
      payment_type: paymentType.value,
      paid_amount: paid,
      description: description.value
    }

    // discount_amount faqat 0 dan katta bo'lsa yuboriladi
    if ((discountAmount.value || 0) > 0) {
      data.discount_amount = discountAmount.value
    }

    if (paymentType.value === 'mixed') {
      data.cash_amount = cashAmount.value
      data.card_amount = cardAmount.value
    } else if (paymentType.value === 'card') {
      data.card_amount = paid
    } else if (paymentType.value === 'cash') {
      data.cash_amount = paid
    } else if (paymentType.value === 'debt') {
      // Debt: qisman to'langan summa cash_amount ga yoziladi
      if (paid > 0) {
        data.cash_amount = paid
      }
    }

    emit('confirm', data)
  }

  return {
    paymentType,
    discountAmount,
    paidAmount,
    cashAmount,
    cardAmount,
    description,
    methods,
    isMixedValid,
    isValid,
    handleConfirm,
    resetValues
  }
}
