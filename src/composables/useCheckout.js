import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/store/settings'

export function useCheckout(props, emit) {
  const settingsStore = useSettingsStore()
  const paymentType = ref('cash')
  const discountAmount = ref(0)
  const totalDiscountAmount = computed(() => discountAmount.value || 0)
  const cashAmount = ref(0)
  const cardAmount = ref(0)
  const debtCashAmount = ref(0)
  const debtCardAmount = ref(0)
  const description = ref('')

  const isMixedUpdating = ref(false)
  
  // Mixed Payment Auto-calculate
  watch(cashAmount, (newVal) => {
    if (isMixedUpdating.value || paymentType.value !== 'mixed') return
    isMixedUpdating.value = true
    const other = paidAmount.value - newVal
    cardAmount.value = other > 0 ? other : 0
    setTimeout(() => { isMixedUpdating.value = false }, 50)
  })

  watch(cardAmount, (newVal) => {
    if (isMixedUpdating.value || paymentType.value !== 'mixed') return
    isMixedUpdating.value = true
    const other = paidAmount.value - newVal
    cashAmount.value = other > 0 ? other : 0
    setTimeout(() => { isMixedUpdating.value = false }, 50)
  })


  const methods = computed(() => {
    const list = []
    if (settingsStore.allowCash) list.push({ id: 'cash', label: 'Naqd', icon: 'pi pi-money-bill' })
    if (settingsStore.allowCard) list.push({ id: 'card', label: 'Karta', icon: 'pi pi-credit-card' })
    
    // Mixed only if both card and cash are allowed
    if (settingsStore.allowCash && settingsStore.allowCard) {
        list.push({ id: 'mixed', label: 'Aralash', icon: 'pi pi-percentage' })
    }
    
    if (settingsStore.allowDebt) list.push({ id: 'debt', label: 'Nasiya', icon: 'pi pi-history' })
    return list
  })

  // Reset & initialize on open
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      // Default to first available method or 'cash'
      paymentType.value = methods.value.length > 0 ? methods.value[0].id : 'cash'
      description.value = ''
      emit('update:selected-customer', null)
      discountAmount.value = 0
      debtCashAmount.value = 0
      debtCardAmount.value = 0
      cashAmount.value = props.total || 0
      cardAmount.value = 0
    }
  })

  const allowDiscount = computed(() => settingsStore.allowDiscount && settingsStore.hasPlanDiscount)

  // Settings dan chegirma limiti (0 = cheksiz)
  const maxDiscountPct = computed(() => settingsStore.maxDiscount)

  // Maksimal chegirma summasi (chegirma yoqilgan va limit bor bo'lganda)
  const maxDiscountAmount = computed(() => {
    if (!allowDiscount.value) return 0
    if (!maxDiscountPct.value) return props.total || 0  // cheksiz
    return Math.floor(((props.total || 0) * maxDiscountPct.value) / 100)
  })

  // Chegirma limiti tekshiruvi
  const isDiscountValid = computed(() => {
    if (!allowDiscount.value || !totalDiscountAmount.value) return true
    if (!maxDiscountPct.value) return true  // 0 = cheksiz
    return totalDiscountAmount.value <= maxDiscountAmount.value
  })

  // Haqiqiy to'lanadigan summa = asl narx - chegirma
  const paidAmount = computed(() => {
    const paid = (props.total || 0) - totalDiscountAmount.value
    return paid > 0 ? paid : 0
  })

  // Har bir maydon paidAmount dan oshib ketdimi?
  const isCashOverflow  = computed(() => (cashAmount.value  || 0) > (paidAmount.value || 0))
  const isCardOverflow  = computed(() => (cardAmount.value  || 0) > (paidAmount.value || 0))
  const isSumOverflow   = computed(() => (cashAmount.value + cardAmount.value) > (paidAmount.value || 0))
  const isDebtOverflow  = computed(() => (debtCashAmount.value + debtCardAmount.value) > (paidAmount.value || 0))

  // Aralash to'lov validatsiyasi
  const isMixedValid = computed(() => {
    return !isSumOverflow.value &&
      Math.abs((cashAmount.value + cardAmount.value) - paidAmount.value) < 0.01
  })

  // Nasiya uchun: Qolgan qarz miqdori
  const remainingDebt = computed(() => {
    const rem = paidAmount.value - (debtCashAmount.value + debtCardAmount.value)
    return rem > 0 ? rem : 0
  })



  // To'lanadigan summa o'zgarganda to'lov maydonlarini sinxronlash (Aralash to'lovda overflow bo'lmasligi uchun)
  watch(paidAmount, (newVal) => {
    if (paymentType.value === 'cash') {
      cashAmount.value = newVal
      cardAmount.value = 0
    } else if (paymentType.value === 'card') {
      cardAmount.value = newVal
      cashAmount.value = 0
    } else if (paymentType.value === 'mixed') {
      // Aralash to'lovda jami kiritilgan summa to'lovdan oshib ketmasligi uchun reset qilamiz
      // Bu foydalanuvchiga xatolik ko'rsatilishidan ko'ra yaxshiroq tajriba beradi
      cashAmount.value = newVal
      cardAmount.value = 0
    }
  })

  // To'lov turi o'zgarganda ham summalarni moslashtiramiz
  watch(paymentType, (val) => {
    if (val === 'cash') {
      cashAmount.value = paidAmount.value
      cardAmount.value = 0
    } else if (val === 'card') {
      cardAmount.value = paidAmount.value
      cashAmount.value = 0
    } else if (val === 'mixed') {
      cashAmount.value = paidAmount.value
      cardAmount.value = 0
    } else if (val === 'debt') {
      debtCashAmount.value = 0
      debtCardAmount.value = 0
    }
  })

  const isValid = computed(() => {
    // Chegirma limit tekshiruvi (barcha to'lov turlari uchun)
    if (!isDiscountValid.value) return false

    if (paymentType.value === 'mixed') {
      return isMixedValid.value && !isCashOverflow.value && !isCardOverflow.value && !isSumOverflow.value
    }
    if (paymentType.value === 'debt') {
      if (!props.selectedCustomer) return false
      return (debtCashAmount.value + debtCardAmount.value) <= paidAmount.value
    }
    if (paymentType.value === 'cash' || paymentType.value === 'card') {
      return totalDiscountAmount.value <= (props.total || 0)
    }
    return true
  })

  const resetValues = () => {
    paymentType.value = 'cash'
    discountAmount.value = 0
    cashAmount.value = 0
    cardAmount.value = 0
    debtCashAmount.value = 0
    debtCardAmount.value = 0
    description.value = ''
  }

  const handleConfirm = () => {
    if (!isValid.value) return

    let paid = paidAmount.value
    if (paymentType.value === 'mixed') {
      paid = (cashAmount.value + cardAmount.value)
    } else if (paymentType.value === 'debt') {
      paid = (debtCashAmount.value + debtCardAmount.value)
    }

    const data = {
      payment_type: paymentType.value,
      paid_amount: paid,
      description: description.value
    }

    if (totalDiscountAmount.value > 0) {
      data.discount_amount = totalDiscountAmount.value
    }

    if (paymentType.value === 'mixed') {
      data.cash_amount = cashAmount.value
      data.card_amount = cardAmount.value
    } else if (paymentType.value === 'card') {
      data.card_amount = paid
    } else if (paymentType.value === 'cash') {
      data.cash_amount = paid
    } else if (paymentType.value === 'debt') {
      data.cash_amount = debtCashAmount.value
      data.card_amount = debtCardAmount.value
    }

    emit('confirm', data)
  }

  return {
    paymentType,
    discountAmount,
    totalDiscountAmount,
    paidAmount,
    cashAmount,
    cardAmount,
    debtCashAmount,
    debtCardAmount,
    remainingDebt,
    description,
    methods,
    allowDiscount,
    maxDiscountPct,
    maxDiscountAmount,
    isDiscountValid,
    isMixedValid,
    isCashOverflow,
    isCardOverflow,
    isSumOverflow,
    isDebtOverflow,
    isValid,
    handleConfirm,
    resetValues
  }
}


