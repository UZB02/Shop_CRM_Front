import { ref, computed, toRaw, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { workersAPI, branchesAPI } from '@/services/api'
import { useNotificationStore } from '@/store/notifications'
import { useAuthStore } from '@/store/auth'
import { ROLE_PERMISSIONS, WORKER_ROLES, WORKER_STATUSES, PERMISSIONS_LIST } from './useWorkerForm'

export function useWorkerEdit() {
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const toast = useToast()
  const notificationStore = useNotificationStore()
  const authStore = useAuthStore()

  const isManager = computed(() => {
    const role = (authStore.user?.role || authStore.user?.worker?.role || '').toLowerCase()
    return role === 'manager'
  })

  const workerId = computed(() => route.params.id)
  const isEdit = computed(() => !!workerId.value)

  const worker = ref({
    first_name: '', last_name: '', username: '', email: '',
    phone1: '', phone2: '', password: '',
    role: 'seller', salary: 0, branch: null,
    status: 'active', permissions: [...ROLE_PERMISSIONS.seller]
  })
  const branches = ref([])
  const saving = ref(false)
  const submitted = ref(false)
  const createLogin = ref(true)
  const originalWorker = ref(null)

  const localizedRoles = computed(() => WORKER_ROLES.map(r => ({ ...r, label: t(`workers.roles.${r.value}`) })))
  const localizedStatuses = computed(() => WORKER_STATUSES.map(s => ({ ...s, label: t(`workers.statuses.${s.value}`) })))

  const getStatusLabel = computed(() => {
    return localizedStatuses.value.find(s => s.value === worker.value.status)?.label || worker.value.status
  })

  const onRoleChange = (e) => {
    if (ROLE_PERMISSIONS[e.value]) worker.value.permissions = [...ROLE_PERMISSIONS[e.value]]
  }

  // Permissions helpers
  const isSelected = (val) => worker.value.permissions?.includes(val) ?? false
  const allSelected = computed(() => PERMISSIONS_LIST.every(p => isSelected(p.value)))
  const togglePerm = (val) => {
    if (!Array.isArray(worker.value.permissions)) worker.value.permissions = []
    const idx = worker.value.permissions.indexOf(val)
    if (idx === -1) worker.value.permissions.push(val)
    else worker.value.permissions.splice(idx, 1)
  }
  const toggleAll = () => {
    worker.value.permissions = allSelected.value ? [] : PERMISSIONS_LIST.map(p => p.value)
  }

  // Avatar
  const avatarColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']
  const avatarStyle = computed(() => {
    const c = avatarColors[(worker.value.first_name?.charCodeAt(0) || 0) % avatarColors.length]
    return { background: `linear-gradient(135deg, ${c}99, ${c})` }
  })

  // Fill progress
  const fillPercent = computed(() => {
    const f = [worker.value.first_name, worker.value.last_name, worker.value.email, worker.value.phone1, worker.value.branch, worker.value.role]
    return Math.round(f.filter(Boolean).length / f.length * 100)
  })

  // Right panel checklist
  const checklist = computed(() => [
    { key: 'name', label: t('workers.form.checklist_name'), done: !!(worker.value.first_name && worker.value.last_name), value: `${worker.value.first_name} ${worker.value.last_name}`.trim() },
    { key: 'email', label: t('workers.form.checklist_email'), done: !!worker.value.email, value: worker.value.email },
    { key: 'phone', label: t('workers.form.checklist_phone'), done: !!worker.value.phone1, value: worker.value.phone1 ? `+998${worker.value.phone1}` : null },
    { key: 'branch', label: t('workers.form.checklist_branch'), done: !!worker.value.branch, value: null },
    { key: 'login', label: t('workers.form.checklist_login'), done: !!(createLogin.value && worker.value.username), value: worker.value.username },
  ])

  const loadWorker = async () => {
    try {
      const res = await workersAPI.getById(workerId.value)
      const fullData = res.data
      let firstName = fullData.first_name || ''
      let lastName = fullData.last_name || ''
      if (!firstName && !lastName && fullData.full_name) {
        const parts = fullData.full_name.trim().split(' ')
        firstName = parts[0] || ''
        lastName = parts.slice(1).join(' ') || ''
      }
      worker.value = {
        id: fullData.id || fullData._id,
        first_name: firstName,
        last_name: lastName,
        email: fullData.email || '',
        phone1: (fullData.phone1 || fullData.phone || '').replace(/\D/g, '').slice(-9),
        phone2: (fullData.phone2 || '').replace(/\D/g, '').slice(-9),
        role: fullData.role || 'seller',
        branch: fullData.branch_id || fullData.branch?.id || fullData.branch?._id || fullData.branch || null,
        status: fullData.status || 'active',
        salary: parseFloat(fullData.salary) || 0,
        username: fullData.username || '',
        password: '',
        permissions: fullData.permissions || [],
      }
      originalWorker.value = JSON.parse(JSON.stringify(worker.value))
      createLogin.value = !!(fullData.user || fullData.userId || fullData.username)
    } catch (err) {
      console.error('Error loading worker details:', err)
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.load_error') })
    }
  }

  onMounted(async () => {
    try {
      const res = await branchesAPI.getAll()
      branches.value = res.data?.results ?? (Array.isArray(res.data) ? res.data : [])
    } catch (e) { console.error(e) }

    if (isEdit.value) {
      await loadWorker()
    }
  })

  const handleSave = async () => {
    submitted.value = true
    const w = worker.value
    if (!w.first_name?.trim() || !w.last_name?.trim() || !w.email?.trim() || !w.branch) return
    if (createLogin.value && (w.username?.trim().length ?? 0) < 5) {
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('workers.messages.username_min_length'), life: 5000 })
      return
    }
    saving.value = true
    try {
      let phone1 = ''
      if (w.phone1) { const d = String(w.phone1).replace(/\D/g, ''); phone1 = '+998' + (d.length >= 9 ? d.slice(-9) : d) }

      let phone2 = ''
      if (w.phone2) { const d = String(w.phone2).replace(/\D/g, ''); phone2 = '+998' + (d.length >= 9 ? d.slice(-9) : d) }

      let payload = {}

      if (isEdit.value && originalWorker.value) {
        const o = originalWorker.value

        if (w.first_name?.trim() !== o.first_name) payload.first_name = w.first_name.trim()
        if (w.last_name?.trim() !== o.last_name) payload.last_name = w.last_name.trim()
        if ((w.username?.trim() || '') !== o.username) payload.username = w.username?.trim() || ''
        if ((w.email?.trim() || '') !== o.email) payload.email = w.email?.trim() || ''
        if (w.phone1 !== o.phone1) payload.phone1 = phone1
        if (w.phone2 !== o.phone2) payload.phone2 = phone2
        if (w.role !== o.role) payload.role = w.role
        if ((Number(w.salary) || 0) !== Number(o.salary)) payload.salary = Number(w.salary) || 0
        if (w.status !== o.status) payload.status = w.status
        if (w.branch !== o.branch) payload.branch = w.branch
        if (w.password) payload.password = w.password

        const currentPerms = createLogin.value ? [...toRaw(w.permissions || [])].sort() : []
        const originalPerms = [...toRaw(o.permissions || [])].sort()
        if (JSON.stringify(currentPerms) !== JSON.stringify(originalPerms)) {
          payload.permissions = currentPerms
        }

        if (Object.keys(payload).length === 0) {
          router.push({ name: 'workers' })
          saving.value = false
          return
        }
      } else {
        payload = {
          first_name: w.first_name.trim(),
          last_name: w.last_name.trim(),
          username: w.username?.trim() || '',
          email: w.email?.trim() || '',
          phone1,
          phone2,
          role: w.role,
          salary: Number(w.salary) || 0,
          status: w.status,
          branch: w.branch,
          permissions: createLogin.value ? [...toRaw(w.permissions || [])] : []
        }
        if (w.password) payload.password = w.password
      }

      // Explicitly remove restricted fields for managers to prevent 400 errors from backend
      if (isManager.value) {
        delete payload.role
        delete payload.salary
        delete payload.permissions
      }

      if (isEdit.value) {
        await workersAPI.update(workerId.value, payload)
        toast.add({ severity: 'success', summary: t('common.updated'), detail: t('workers.messages.updated', { name: `${w.first_name} ${w.last_name}` }), life: 4000 })
      } else {
        await workersAPI.create(payload)
        toast.add({ severity: 'success', summary: t('common.added'), detail: t('workers.messages.added'), life: 4000 })
      }
      notificationStore.fetchSubscription()
      router.push({ name: 'workers' })
    } catch (error) {
      let msg = t('workers.messages.save_error')
      const d = error.response?.data
      if (d) { if (typeof d === 'string') msg = d; else { const k = Object.keys(d)[0]; if (k) { const v = d[k]; msg = Array.isArray(v) ? v[0] : v } } }
      toast.add({ severity: 'error', summary: t('common.error'), detail: msg, life: 5000 })
    } finally { saving.value = false }
  }

  return {
    isEdit,
    worker,
    branches,
    saving,
    submitted,
    createLogin,
    localizedRoles,
    localizedStatuses,
    getStatusLabel,
    onRoleChange,
    isSelected,
    allSelected,
    togglePerm,
    toggleAll,
    avatarStyle,
    fillPercent,
    checklist,
    handleSave,
    router,
    PERMISSIONS_LIST
  }
}
