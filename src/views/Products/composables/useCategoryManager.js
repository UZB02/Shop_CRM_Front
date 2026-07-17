import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirmStore } from '@/store/confirm'
import { categoriesAPI, subcategoriesAPI } from '@/services/api'

export function useCategoryManager() {
  const toast = useToast()
  const confirm = useConfirmStore()
  const { t } = useI18n()

  const handleError = (error) => {
    console.error(error)
    const data = error.response?.data
    let detail = t('common.error_message')
    if (data) {
      if (typeof data === 'string') detail = data
      else if (data.detail) detail = data.detail
      else if (data.message) detail = data.message
      else if (typeof data === 'object') {
        const fieldErrors = Object.values(data)
          .map((errs) => Array.isArray(errs) ? errs.join(', ') : errs)
          .join('\n')
        if (fieldErrors) detail = fieldErrors
      }
    }
    toast.add({ severity: 'error', summary: t('common.error'), detail, life: 6000 })
  }

  // Reactive State
  const loading = ref(false)
  const saving = ref(false)
  const categories = ref([])
  const subcategories = ref([])
  const expandedId = ref(null)
  const searchQuery = ref('')
  const subSearchQuery = ref('')

  const filteredCategories = computed(() => {
    if (!searchQuery.value?.trim()) return categories.value
    const query = searchQuery.value.toLowerCase().trim()
    return categories.value.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    )
  })

  // Category Form State
  const panelVisible = ref(false)
  const isEditing = ref(false)
  const activeCategory = reactive({ id: null, name: '', description: '', status: 'active' })

  // Subcategory Form State
  const subPanelVisible = ref(false)
  const isEditingSub = ref(false)
  const savingSub = ref(false)
  const activeSubcategory = reactive({ id: null, name: '', description: '', categoryId: null, status: 'active' })

  const currentCategoryName = computed(() => {
    const cat = categories.value.find(c => (c.id || c._id) === activeSubcategory.categoryId)
    return cat ? cat.name : ''
  })

  const getSubcategories = (catId) => {
    let filtered = subcategories.value.filter(s => (s.category_id || s.category) === catId)
    if (subSearchQuery.value?.trim()) {
      const q = subSearchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
      )
    }
    return filtered
  }

  const toggleExpand = (id) => {
    if (expandedId.value !== id) {
      subSearchQuery.value = '' // Reset sub-search when switching categories
    }
    expandedId.value = expandedId.value === id ? null : id
  }

  // Data Fetching
  const loadData = async () => {
    loading.value = true
    try {
      const [catRes, subRes] = await Promise.all([
        categoriesAPI.getAll(),
        subcategoriesAPI.getAll()
      ])
      console.log('Categories data from API:', catRes.data)
      console.log('Subcategories data from API:', subRes.data)
      categories.value = catRes.data.results || catRes.data || []
      subcategories.value = subRes.data.results || subRes.data || []
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  // Category Handlers
  const openAddMode = () => {
    isEditing.value = false
    activeCategory.id = null
    activeCategory.name = ''
    activeCategory.description = ''
    activeCategory.status = 'active'
    panelVisible.value = true
  }

  const startEdit = (cat) => {
    isEditing.value = true
    activeCategory.id = cat.id || cat._id
    activeCategory.name = cat.name
    activeCategory.description = cat.description
    activeCategory.status = cat.status || 'active'
    panelVisible.value = true
  }

  const handleCategorySubmit = async () => {
    if (!activeCategory.name?.trim()) {
      toast.add({ severity: 'warn', summary: t('common.error'), detail: t('categories.messages.name_required'), life: 5000 })
      return
    }
    saving.value = true
    try {
      const payload = {
        name: activeCategory.name.trim(),
        description: activeCategory.description?.trim(),
        status: activeCategory.status
      }
      if (isEditing.value) {
        await categoriesAPI.update(activeCategory.id, payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('categories.messages.updated'), life: 5000 })
      } else {
        await categoriesAPI.create(payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('categories.messages.added'), life: 5000 })
      }
      panelVisible.value = false
      await loadData()
    } catch (error) {
      handleError(error)
    } finally { saving.value = false }
  }

  const confirmDeleteCategory = (cat) => {
    confirm.require({
      message: t('categories.messages.delete_confirm', { Name: cat.name }),
      header: t('common.confirm_title'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('common.yes_delete'),
      rejectLabel: t('common.cancel'),
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await categoriesAPI.delete(cat.id || cat._id)
          toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('categories.messages.deleted'), life: 5000 })
          loadData()
        } catch (error) {
          handleError(error)
        }
      }
    })
  }

  // Subcategory Handlers
  const openAddSubMode = (cat) => {
    isEditingSub.value = false
    activeSubcategory.id = null
    activeSubcategory.name = ''
    activeSubcategory.description = ''
    activeSubcategory.status = 'active'
    activeSubcategory.categoryId = cat.id || cat._id
    subPanelVisible.value = true
  }

  const startEditSub = (sub) => {
    isEditingSub.value = true
    activeSubcategory.id = sub.id || sub._id
    activeSubcategory.name = sub.name
    activeSubcategory.description = sub.description
    activeSubcategory.status = sub.status || 'active'
    activeSubcategory.categoryId = sub.category_id || sub.category
    subPanelVisible.value = true
  }

  const handleSubSubmit = async () => {
    if (!activeSubcategory.name?.trim()) {
      toast.add({ severity: 'warn', summary: t('common.error'), detail: t('subcategories.messages.name_required'), life: 5000 })
      return
    }
    savingSub.value = true
    try {
      const payload = {
        name: activeSubcategory.name.trim(),
        description: activeSubcategory.description?.trim(),
        category: activeSubcategory.categoryId,
        status: activeSubcategory.status
      }
      if (isEditingSub.value) {
        await subcategoriesAPI.update(activeSubcategory.id, payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('subcategories.messages.updated'), life: 5000 })
      } else {
        await subcategoriesAPI.create(payload)
        toast.add({ severity: 'success', summary: t('common.success'), detail: t('subcategories.messages.added'), life: 5000 })
      }
      subPanelVisible.value = false
      await loadData()
    } catch (error) {
      handleError(error)
    } finally { savingSub.value = false }
  }

  const confirmDeleteSub = (sub) => {
    confirm.require({
      message: t('subcategories.messages.delete_confirm', { Name: sub.name }),
      header: t('common.confirm_title'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('common.yes_delete'),
      rejectLabel: t('common.cancel'),
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await subcategoriesAPI.delete(sub.id || sub._id)
          toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('subcategories.messages.deleted'), life: 5000 })
          loadData()
        } catch (error) {
          handleError(error)
        }
      }
    })
  }

  return {
    loading, saving, categories, subcategories, expandedId,
    searchQuery, subSearchQuery, filteredCategories,
    panelVisible, isEditing, activeCategory,
    subPanelVisible, isEditingSub, savingSub, activeSubcategory,
    currentCategoryName, getSubcategories, toggleExpand,
    loadData, openAddMode, startEdit, handleCategorySubmit, confirmDeleteCategory,
    openAddSubMode, startEditSub, handleSubSubmit, confirmDeleteSub
  }
}


