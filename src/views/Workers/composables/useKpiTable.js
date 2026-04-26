import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useKpiTable(props) {
  const { t } = useI18n()

  // 1. Leaderboard & Stats Logic
  const sortedData = computed(() => {
    if (!props.data) return []
    return [...props.data].sort((a, b) => {
      return parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0)
    })
  })

  const isTopThree = (data) => {
    if (!props.fullList) return false
    const sorted = [...props.fullList].sort((a,b) => parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0))
    const rank = sorted.findIndex(item => item.id === data.id)
    return rank >= 0 && rank < 3 && parseFloat(data.completion_pct) > 0
  }

  const getMedalColor = (data) => {
    if (!props.fullList) return ''
    const sorted = [...props.fullList].sort((a,b) => parseFloat(b.completion_pct || 0) - parseFloat(a.completion_pct || 0))
    const rank = sorted.findIndex(item => item.id === data.id)
    if (rank === 0) return 'text-amber-400'
    if (rank === 1) return 'text-slate-400'
    if (rank === 2) return 'text-amber-700'
    return ''
  }

  // 2. Visual Status Helpers
  const getSmartStatusLabel = (pct) => {
    const val = parseFloat(pct || 0)
    if (val >= 100) return t('kpi.labels.star')
    if (val >= 90) return t('kpi.labels.expert')
    if (val >= 70) return t('kpi.labels.solid')
    if (val >= 50) return t('kpi.labels.growing')
    return t('kpi.labels.lagging')
  }

  const getSmartStatusBadge = (pct) => {
    const val = parseFloat(pct || 0)
    if (val >= 100) return 'bg-emerald-500 text-white'
    if (val >= 90) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    if (val >= 70) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    if (val >= 50) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
  }

  const getCompletionColor = (pct, target = 'text') => {
    if (pct === null || pct === undefined) {
      return target === 'text' ? 'text-slate-300' : 'bg-slate-100 dark:bg-slate-800'
    }
    const val = parseFloat(pct)
    if (val >= 100) return target === 'text' ? 'text-emerald-500' : 'bg-emerald-500'
    if (val >= 70) return target === 'text' ? 'text-amber-500' : 'bg-amber-500'
    return target === 'text' ? 'text-rose-500' : 'bg-rose-500'
  }

  const getQualityRatio = (data) => {
    const sales = parseFloat(data.sales_amount || 0)
    const returns = parseFloat(data.returns_amount || 0)
    if (sales === 0) return 100
    return Math.max(0, ((sales - returns) / sales) * 100)
  }

  // 3. Avatar Helpers
  const gradients = [
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #06b6d4, #0891b2)',
    'linear-gradient(135deg, #84cc16, #65a30d)',
    'linear-gradient(135deg, #f97316, #ea580c)',
  ]

  const getAvatarGradient = (fullName) => {
    if (!fullName) return { background: gradients[0] }
    const index = fullName.charCodeAt(0) % gradients.length
    return { background: gradients[index] }
  }

  return {
    sortedData,
    isTopThree,
    getMedalColor,
    getSmartStatusLabel,
    getSmartStatusBadge,
    getCompletionColor,
    getQualityRatio,
    getAvatarGradient
  }
}
