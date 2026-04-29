import { ref, watch } from 'vue'
import { workersAPI } from '@/services/api'

export function useWorkerHistory(workerId) {
  const activities = ref([])
  const activitiesLoading = ref(false)
  const activitiesPage = ref(1)
  const activitiesTotal = ref(0)
  const hasMoreActivities = ref(false)

  const historyFilters = ref({
    action: null,
    model: null,
    date_from: null,
    date_to: null
  })

  const actionOptions = [
    { label: 'Kiritish', value: 'create' },
    { label: 'Yangilash', value: 'update' },
    { label: 'O\'chirish', value: 'delete' },
    { label: 'Login', value: 'login' },
    { label: 'Logout', value: 'logout' }
  ]

  const modelOptions = [
    { label: 'Mijoz', value: 'Customer' },
    { label: 'Mahsulot', value: 'Product' },
    { label: 'Savdo', value: 'Sale' },
    { label: 'Xarajat', value: 'Expense' },
    { label: 'Xodim', value: 'Worker' }
  ]

  const loadActivities = async (page = 1) => {
    if (!workerId.value) return
    
    activitiesLoading.value = true
    try {
      const params = { page }
      if (historyFilters.value.action) params.action = historyFilters.value.action
      if (historyFilters.value.model) params.model = historyFilters.value.model
      if (historyFilters.value.date_from) {
        params.date_from = historyFilters.value.date_from.toISOString().split('T')[0]
      }
      if (historyFilters.value.date_to) {
        params.date_to = historyFilters.value.date_to.toISOString().split('T')[0]
      }

      const response = await workersAPI.getActivities(workerId.value, params)
      const { results, count, next } = response.data
      
      if (page === 1) {
        activities.value = results
      } else {
        activities.value = [...activities.value, ...results]
      }
      
      activitiesTotal.value = count
      hasMoreActivities.value = !!next
    } catch (error) {
      console.error('Activities load error:', error)
    } finally {
      activitiesLoading.value = false
    }
  }

  const loadMoreActivities = () => {
    activitiesPage.value++
    loadActivities(activitiesPage.value)
  }

  const getActionIcon = (action) => {
    const icons = {
      login: 'pi-sign-in',
      logout: 'pi-sign-out',
      create: 'pi-plus',
      update: 'pi-sync',
      delete: 'pi-trash',
      password_change: 'pi-key'
    }
    return icons[action] || 'pi-info'
  }

  const getActionClass = (action) => {
    const classes = {
      login: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      create: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      update: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      delete: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      password_change: 'bg-indigo-500 text-white border-indigo-500'
    }
    return classes[action] || 'bg-slate-100 text-slate-500 border-slate-200'
  }

  // Watch filters to reload
  watch(historyFilters, () => {
    activitiesPage.value = 1
    loadActivities(1)
  }, { deep: true })

  return {
    activities,
    activitiesLoading,
    activitiesTotal,
    hasMoreActivities,
    historyFilters,
    actionOptions,
    modelOptions,
    loadActivities,
    loadMoreActivities,
    getActionIcon,
    getActionClass
  }
}
