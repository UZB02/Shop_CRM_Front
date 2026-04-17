<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <GroupPageHeader :count="groups.length" @add="openAddMode" />

    <!-- List Container -->
    <div class="relative min-h-[500px]">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="h-24 bg-white dark:bg-slate-900 animate-pulse rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="groups.length === 0" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-all opacity-60">
        <div class="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
          <i class="pi pi-users text-2xl text-emerald-500/30"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{{ $t('customers.groups.no_groups') }}</p>
        <button @click="openAddMode" class="mt-6 h-8 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all">
           {{ $t('customers.groups.add_new') }}
        </button>
      </div>
      
      <!-- Grid Display -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        <div 
          v-for="g in groups" 
          :key="g.id || g._id"
          class="group/card relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex items-center justify-between"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/card:text-emerald-500 group-hover/card:bg-white dark:group-hover/card:bg-slate-700 shadow-sm transition-all duration-300 flex-shrink-0">
              <i class="pi pi-users text-sm"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight mb-1 truncate">{{ g.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-bold">{{ g.discount }}% OFF</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-1 group-hover/card:translate-x-0 ml-2">
            <button @click="startEdit(g)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20">
              <i class="pi pi-pencil text-[10px]"></i>
            </button>
            <button @click="confirmDelete(g)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20">
              <i class="pi pi-trash text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Side Over Panel -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="panelVisible" @click="closePanel" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[999]"></div>
      </Transition>

      <!-- Panel -->
      <Transition 
        enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
        enter-from-class="translate-x-full" 
        enter-to-class="translate-x-0" 
        leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
        leave-from-class="translate-x-0" 
        leave-to-class="translate-x-full"
      >
        <div v-if="panelVisible" class="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[1000] flex flex-col">
          <!-- Panel Header -->
          <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-emerald-500 uppercase tracking-widest">{{ isEditing ? $t('common.edit') : $t('customers.groups.add_subtitle') }}</span>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{{ $t('customers.groups.loyalty_system') }}</span>
            </div>
            <button @click="closePanel" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white transition-all shadow-sm">
              <i class="pi pi-times text-[10px]"></i>
            </button>
          </div>

          <!-- Panel Body -->
          <div class="p-6 space-y-6 flex-1 overflow-y-auto">
            <div class="space-y-4">
              <!-- Name Field -->
              <div class="field">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.groups.name') }}</label>
                <div class="relative group/input">
                  <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                  <InputText 
                    v-model="activeGroup.name" 
                    :placeholder="$t('customers.groups.name_placeholder')" 
                    class="!h-11 !pl-10 !text-sm !font-semibold !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" 
                    autofocus
                  />
                </div>
              </div>

              <!-- Discount Field -->
              <div class="field">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1.5 block">{{ $t('customers.groups.discount') }}</label>
                <div class="relative group/input">
                  <i class="pi pi-percentage absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 transition-colors group-focus-within/input:text-emerald-500 z-10"></i>
                  <InputNumber 
                    v-model="activeGroup.discount" 
                    :min="0" :max="100" 
                    placeholder="0"
                    class="w-full"
                    :inputClass="'!h-11 !pl-10 !text-sm !font-semibold !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full'"
                  />
                </div>
              </div>
            </div>
            
          </div>

          <!-- Panel Footer -->
          <div class="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex gap-3 items-center">
              <Button 
                :label="$t('common.cancel')"
                text
                class="!flex-1 !text-[10px] !font-bold !uppercase !tracking-widest !rounded-xl !text-slate-400 !h-10"
                @click="closePanel"
              />
              <Button 
                :label="isEditing ? $t('common.save') : $t('common.add')"
                :loading="saving" 
                @click="handleSubmit"
                class="!flex-[2] !h-10 !rounded-xl !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/20 active:scale-95 transition-all text-white !text-[10px] !font-bold !uppercase !tracking-widest"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { customerGroupsAPI } from '@/services/api'
import GroupPageHeader from './components/GroupPageHeader.vue'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()

// Reactive State
const loading = ref(false)
const saving = ref(false)
const panelVisible = ref(false)
const isEditing = ref(false)
const groups = ref([])

const activeGroup = reactive({
  id: null,
  name: '',
  discount: 0
})

const resetForm = () => {
  activeGroup.id = null
  activeGroup.name = ''
  activeGroup.discount = 0
}

const openAddMode = () => {
  isEditing.value = false
  resetForm()
  panelVisible.value = true
}

const closePanel = () => {
  panelVisible.value = false
}

const loadGroups = async () => {
  loading.value = true
  try {
    const response = await customerGroupsAPI.getAll()
    groups.value = response.data.results || response.data
  } catch (error) {
    console.error('Error loading groups:', error)
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.messages.load_error'), life: 5000 })
  } finally {
    loading.value = false
  }
}

const startEdit = (group) => {
  isEditing.value = true
  activeGroup.id = group.id || group._id
  activeGroup.name = group.name
  activeGroup.discount = group.discount
  panelVisible.value = true
}

const handleSubmit = async () => {
  if (!activeGroup.name?.trim()) {
    toast.add({ severity: 'warn', summary: t('common.error'), detail: t('customers.form.name_required'), life: 5000 })
    return
  }
  
  saving.value = true
  try {
    const payload = {
      name: activeGroup.name,
      discount: activeGroup.discount
    }

    if (isEditing.value) {
      await customerGroupsAPI.update(activeGroup.id, payload)
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.messages.updated'), life: 5000 })
    } else {
      await customerGroupsAPI.create(payload)
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.groups.added_message'), life: 5000 })
    }
    
    panelVisible.value = false
    resetForm()
    await loadGroups()
  } catch (error) {
    console.error('Save error:', error)
    const errData = error?.response?.data
    const errDetail = !errData
      ? t('customers.groups.add_error')
      : typeof errData === 'string'
        ? errData
        : errData?.detail || errData?.message || errData?.non_field_errors?.[0]
          || Object.values(errData).flat().join(' ')  
          || t('customers.groups.add_error')
    toast.add({ severity: 'error', summary: t('common.error'), detail: errDetail, life: 7000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (group) => {
  confirm.require({
    message: t('customers.groups.delete_confirm', { name: group.name }),
    header: t('common.confirm_title') || 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger p-button-sm !rounded-xl',
    accept: async () => {
      try {
        await customerGroupsAPI.delete(group.id || group._id)
        toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('customers.groups.deleted_message'), life: 5000 })
        loadGroups()
        if (activeGroup.id === (group.id || group._id)) panelVisible.value = false
      } catch (error) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.groups.delete_error'), life: 5000 })
      }
    }
  })
}

onMounted(loadGroups)
</script>

<style scoped>
:deep(.p-inputtext), :deep(.p-inputnumber-input) {
  border-color: transparent !important;
}
</style>
