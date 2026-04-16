import { ref, computed, watch } from 'vue'
import { useSettingsStore } from '@/store/settings'

export function useCheckout(props, emit) {
  const settingsStore = useSettingsStore()
  const paymentType = ref('cash')
  const discountAmount = ref(0)
  const cashAmount = ref(0)
  const cardAmount = ref(0)
  const debtCashAmount = ref(0)
  const debtCardAmount = ref(0)
  const description = ref('')
  const vipMessage = ref('')

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
      vipMessage.value = ''
      debtCashAmount.value = 0
      debtCardAmount.value = 0
      cashAmount.value = props.total || 0
      cardAmount.value = 0
    }
  })

  const allowDiscount = computed(() => settingsStore.allowDiscount)

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
    if (!allowDiscount.value || !discountAmount.value) return true
    if (!maxDiscountPct.value) return true  // 0 = cheksiz
    return discountAmount.value <= maxDiscountAmount.value
  })

  // Haqiqiy to'lanadigan summa = asl narx - chegirma
  const paidAmount = computed(() => {
    const paid = (props.total || 0) - (discountAmount.value || 0)
    return paid > 0 ? paid : 0
  })

  // Har bir maydon paidAmount dan oshib ketdimi?
  const isCashOverflow  = computed(() => (cashAmount.value  || 0) > (paidAmount.value || 0))
  const isCardOverflow  = computed(() => (cardAmount.value  || 0) > (paidAmount.value || 0))
  const isSumOverflow   = computed(() => (cashAmount.value + cardAmount.value) > (paidAmount.value || 0))

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

  // VIP Mijoz Chegirma Mantiq
  watch(() => props.selectedCustomer, (val) => {
    vipMessage.value = ''
    if (!val || !props.customerGroups || props.customerGroups.length === 0) return

    let groupObj = null
    if (typeof val.customer_group === 'object' && val.customer_group !== null) {
      groupObj = val.customer_group
    } else if (typeof val.group === 'object' && val.group !== null) {
      groupObj = val.group
    } else {
      const gid = val.group_id || val.group || val.customer_group
      groupObj = props.customerGroups.find(g => g.id === gid)
    }

    if (groupObj && groupObj.discount && parseFloat(groupObj.discount) > 0) {
      const pct = parseFloat(groupObj.discount)
      let calculatedDiscount = Math.floor(((props.total || 0) * pct) / 100)
      
      // Limitdan oshib ketmasligi uchun
      if (maxDiscountAmount.value > 0 && calculatedDiscount > maxDiscountAmount.value) {
        calculatedDiscount = maxDiscountAmount.value
      }

      discountAmount.value = calculatedDiscount
      vipMessage.value = `${groupObj.name} VIP mijoz! ${pct}% chegirma avtomat hisoblandi.`
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
      return (discountAmount.value || 0) <= (props.total || 0)
    }
    return true
  })

  const resetValues = () => {
    paymentType.value = 'cash'
    discountAmount.value = 0
    vipMessage.value = ''
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
      data.cash_amount = debtCashAmount.value
      data.card_amount = debtCardAmount.value
    }

    emit('confirm', data)
  }

  return {
    paymentType,
    discountAmount,
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
    isValid,
    vipMessage,
    handleConfirm,
    resetValues
  }
}
