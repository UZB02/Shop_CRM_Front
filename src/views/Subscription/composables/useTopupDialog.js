import { ref, watch, onUnmounted } from 'vue'
import { useSettingsStore } from '@/store/settings'

/**
 * Composable for managing the state and interactions of the Topup Balance Dialog.
 * Handles scrolling lock, Escape key events, formatting helpers, and input sanitization.
 * 
 * @param {Object} props - Vue component props
 * @param {Function} emit - Vue component event emitter
 */
export function useTopupDialog(props, emit) {
  const settingsStore = useSettingsStore()

  // Selected payment provider (default: 'click')
  const provider = ref('click')
  
  // High-density quick select values
  const quickAmounts = [50000, 100000, 200000, 500000]

  /**
   * Formats prices with regional currency standards using Settings Store.
   */
  const formatPrice = (value) => {
    return settingsStore.formatPrice(value)
  }

  /**
   * Formats large numbers compactly (e.g. 100000 -> 100K).
   */
  const formatCompact = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace('.0', '') + 'M'
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K'
    }
    return value
  }

  /**
   * Sanitizes numeric input, emits value updates, and localizes displaying text.
   */
  const onAmountInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    const num = raw ? parseInt(raw) : 0
    emit('update:amount', num)
    e.target.value = raw ? Number(raw).toLocaleString('ru-RU') : ''
  }

  /**
   * Sets pre-defined quick amount.
   */
  const setQuickAmount = (val) => {
    emit('update:amount', val)
  }

  /**
   * Clears the current input amount to zero.
   */
  const clearAmount = () => {
    emit('update:amount', 0)
  }

  /**
   * Handles modal backdrop clicking (prevented if polling/payment is in progress).
   */
  const onBackdropClick = () => {
    if (!props.pollingActive) {
      emit('update:visible', false)
    }
  }

  /**
   * Handles keyboard escape key triggers.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && props.visible && !props.pollingActive) {
      emit('update:visible', false)
    }
  }

  // Manage body scroll-lock and keydown listeners reactively
  watch(() => props.visible, (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, { immediate: true })

  // Cleanup listeners on component unmounting
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  })

  return {
    provider,
    quickAmounts,
    formatPrice,
    formatCompact,
    onAmountInput,
    setQuickAmount,
    clearAmount,
    onBackdropClick
  }
}
