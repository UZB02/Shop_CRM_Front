export function useTradeUtils() {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { 
      style: 'currency', 
      currency: 'UZS', 
      maximumFractionDigits: 0 
    }).format(val || 0)
  }

  const getStatusClass = (status) => {
    const s = String(status).toLowerCase()
    if (s === 'cash' || s === 'card') {
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
    }
    if (s === 'mixed') {
      return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
    }
    if (s === 'debt') {
      return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
    }
    return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-600/50'
  }

  return {
    formatCurrency,
    getStatusClass
  }
}
