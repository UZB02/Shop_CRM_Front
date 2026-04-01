import { ref, reactive, toRef } from 'vue'
import { workersAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'

/**
 * Composable for user profile view/edit logic.
 * @param {import('vue').Ref | Object} userRef - Reactive ref OR plain props.user
 * @param {Function} onUpdated - Called after successful save
 */
export function useUserProfile(userRef, onUpdated) {
  const toast = useToast()
  const currentWorker = ref(null)
  const isEditing = ref(false)
  const saving = ref(false)

  const editForm = reactive({
    email: '',
    phone1: '',
    phone2: '',
    current_password: '',
    new_password: '',
    new_password2: ''
  })

  // Helper: unwrap reactive ref or plain object
  const getUser = () => (typeof userRef === 'object' && 'value' in userRef) ? userRef.value : userRef

  // Strip InputMask formatting characters → raw phone string for API
  const cleanPhone = (val) => {
    if (!val) return ''
    // Remove spaces, parens, dashes, underscores (mask placeholders)
    return val.replace(/[\s\(\)\-_]/g, '')
  }

  const fetchMe = async () => {
    try {
      const res = await workersAPI.getMe()
      currentWorker.value = res.data
      console.log('[Profile] Fetched /workers/me/:', res.data)
    } catch (e) {
      console.error('[Profile] fetchMe error:', e)
    }
  }

  const startEditing = () => {
    const user = getUser()
    // API dan kelgan ma'lumotlar prioritet — localStorage faqat fallback
    const cw = currentWorker.value
    editForm.email            = cw?.email    || user?.email    || ''
    editForm.phone1           = cw?.phone1   || user?.phone1   || ''
    editForm.phone2           = cw?.phone2   || user?.phone2   || ''
    editForm.current_password = ''
    editForm.new_password     = ''
    editForm.new_password2    = ''
    isEditing.value = true
    console.log('[Profile] startEditing — form (from API):', { ...editForm })
  }

  const saveChanges = async () => {
    // Validate passwords
    if (editForm.new_password && editForm.new_password !== editForm.new_password2) {
      toast.add({ severity: 'error', summary: 'Хатолик', detail: 'Пароллар мос келмади', life: 3000 })
      return
    }
    if (editForm.new_password && !editForm.current_password) {
      toast.add({ severity: 'warn', summary: 'Диққат', detail: 'Жорий паролни киритинг', life: 3000 })
      return
    }

    saving.value = true
    try {
      const p1 = cleanPhone(editForm.phone1)
      const p2 = cleanPhone(editForm.phone2)

      const payload = {
        email:  editForm.email  || undefined,
        phone1: p1              || undefined,
        phone2: p2              || undefined,
      }

      // Backend requires ALL THREE password fields together, or none
      const hasPasswordChange = editForm.current_password && editForm.new_password && editForm.new_password2
      if (hasPasswordChange) {
        payload.current_password = editForm.current_password
        payload.new_password     = editForm.new_password
        payload.new_password2    = editForm.new_password2   // backend needs this too!
      }

      // Remove undefined keys
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

      console.log('[Profile] PATCH /workers/me/ payload:', payload)

      const res = await workersAPI.updateMe(payload)
      console.log('[Profile] PATCH response:', res.data)

      toast.add({ severity: 'success', summary: 'Муваффақият', detail: 'Маълумотлар янгиланди', life: 3000 })
      isEditing.value = false
      await fetchMe()
      if (onUpdated) onUpdated()
    } catch (e) {
      console.error('[Profile] saveChanges error:', e.response?.data || e)
      // Show the most informative error message possible
      const data = e.response?.data
      let detail = 'Хатолик юз берди'
      if (data) {
        if (typeof data === 'string') detail = data
        else if (data.detail) detail = data.detail
        else if (data.message) detail = data.message
        else {
          // Field-level errors: { phone1: ['Enter a valid phone number.'], ... }
          const fieldErrors = Object.entries(data)
            .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' | ')
          if (fieldErrors) detail = fieldErrors
        }
      }
      toast.add({ severity: 'error', summary: 'Хатолик', detail, life: 6000 })
    } finally {
      saving.value = false
    }
  }

  return {
    currentWorker,
    isEditing,
    saving,
    editForm,
    fetchMe,
    startEditing,
    saveChanges
  }
}
