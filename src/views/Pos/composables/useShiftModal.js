import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

export function useShiftModal(props, emit) {
  const { t } = useI18n()
  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()

  // ── State ─────────────────────────────────────────────────────────────────────
  const cashStart = ref(0)
  const cashCounted = ref(null)
  const discrepancyReason = ref('')

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const formatCurrency = (val) => settingsStore.formatPrice(val)
  const formatDate = (val) => {
    if (!val) return ''
    const d = new Date(String(val).replace('|', '').trim())
    return isNaN(d.getTime()) ? val : d.toLocaleString('uz-UZ')
  }

  // ── Display values ────────────────────────────────────────────────────────────
  const displayCash = computed(() => {
    if (props.shift?.status === 'closed' && props.shift?.cash_end !== null) return props.shift.cash_end
    return props.xReport?.expected_cash ?? props.xReport?.cash_end ?? props.xReport?.total_cash
        ?? props.shift?.expected_cash ?? props.shift?.cash_start ?? 0
  })

  const displayNetIncome = computed(() =>
    props.xReport?.net_income ?? props.xReport?.total_income ?? props.xReport?.income
    ?? props.shift?.net_income ?? props.shift?.expected_cash ?? 0
  )

  const expectedCash = computed(() =>
    props.xReport?.expected_cash ?? props.shift?.expected_cash ?? 0
  )

  // ── Discrepancy ───────────────────────────────────────────────────────────────
  const needsReasonLocal = computed(() => {
    if (!settingsStore.requireCashCount || cashCounted.value === null) return false
    const diff = Math.abs(cashCounted.value - parseFloat(expectedCash.value))
    const threshold = parseFloat(settingsStore.cashDiscrepancyThreshold || 0)
    return diff > threshold
  })

  const localDiscrepancyError = computed(() => {
    if (!settingsStore.requireCashCount || cashCounted.value === null) return ''
    const diff = Math.abs(cashCounted.value - parseFloat(expectedCash.value))
    const threshold = parseFloat(settingsStore.cashDiscrepancyThreshold || 0)
    if (diff > threshold) {
      return `Katta kassa farqi aniqlandi (${formatCurrency(diff)}). Davom etish uchun sababini kiriting.`
    }
    return ''
  })

  const displayDiscrepancyError = computed(() => {
    if (localDiscrepancyError.value) return localDiscrepancyError.value
    return props.discrepancyError
  })

  const showReasonInput = computed(() => needsReasonLocal.value || !!props.discrepancyError)

  // ── Difference badge ──────────────────────────────────────────────────────────
  const diffClass = computed(() => {
    const d = parseFloat(props.shift?.cash_difference || 0)
    if (d === 0) return { wrap: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20', pi: 'pi pi-check-circle text-emerald-600 dark:text-emerald-400', text: 'text-emerald-700 dark:text-emerald-300' }
    if (d < 0)  return { wrap: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20', pi: 'pi pi-exclamation-triangle text-rose-600 dark:text-rose-400', text: 'text-rose-700 dark:text-rose-300' }
    return { wrap: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20', pi: 'pi pi-info-circle text-amber-600 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-300' }
  })

  const diffMessage = computed(() => {
    const d = parseFloat(props.shift?.cash_difference || 0)
    if (d === 0) return t('pos.cash_correct_no_diff') || 'Kassa to\'g\'ri, farq yo\'q'
    if (d < 0) return t('pos.cashier_shortage', { amount: formatCurrency(Math.abs(d)) }) || `Kamomad: ${formatCurrency(Math.abs(d))}`
    return t('pos.cashier_surplus', { amount: formatCurrency(d) }) || `Ortiqcha: ${formatCurrency(d)}`
  })

  // ── Submit ────────────────────────────────────────────────────────────────────
  const branchId = computed(() => {
    const u = authStore.user
    if (!u) return null
    if (u.branch_id) return u.branch_id
    if (u.worker?.branch) return u.worker.branch
    if (u.branch) return typeof u.branch === 'object' ? u.branch.id : u.branch
    return null
  })

  const hasBranchId = computed(() => !!branchId.value)

  const submitDisabled = computed(() => {
    if (props.loading) return true
    if (!props.isClosing) return !hasBranchId.value
    if (settingsStore.requireCashCount && cashCounted.value === null) return true
    if (showReasonInput.value && !discrepancyReason.value.trim()) return true
    return false
  })

  const close = () => emit('update:visible', false)

  const handleSubmit = () => {
    emit('update:discrepancyError', '')
    if (props.isClosing) {
      const payload = {}
      if (settingsStore.requireCashCount && cashCounted.value !== null) payload.cash_end = cashCounted.value
      if (showReasonInput.value && discrepancyReason.value) payload.discrepancy_reason = discrepancyReason.value
      emit('confirm', payload)
    } else {
      emit('confirm', {
        branch: branchId.value,
        cash_start: cashStart.value,
      })
    }
  }

  watch(() => props.visible, (val) => {
    if (!val) return
    if (!props.isClosing) {
      cashStart.value = 0
    } else {
      cashCounted.value = null
      discrepancyReason.value = ''
      emit('update:discrepancyError', '')
    }
  })

  return {
    authStore,
    settingsStore,
    cashStart,
    cashCounted,
    discrepancyReason,
    formatDate,
    displayCash,
    displayNetIncome,
    showReasonInput,
    displayDiscrepancyError,
    diffClass,
    diffMessage,
    hasBranchId,
    submitDisabled,
    close,
    handleSubmit
  }
}
