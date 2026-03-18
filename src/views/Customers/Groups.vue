<template>
  <div class="max-w-6xl mx-auto relative min-h-[80vh]">
    <!-- Main Content Layer -->
    <div class="space-y-4 animate-in fade-in duration-700">
      <!-- Senior Management Header -->
      <div class="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/5 dark:shadow-black/20">
        <div class="flex items-center gap-4">
          <button 
            @click="router.push('/dashboard/customers')"
            class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-90"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
          <div class="h-6 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
          <div>
            <h1 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">{{ $t('customers.groups.manage_title') }}</h1>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ groups.length }} {{ $t('customers.groups.count_unit') }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <Button 
            :label="$t('customers.groups.add_new')"
            icon="pi pi-plus" 
            severity="success"
            class="!text-[10px] !font-black !uppercase !tracking-widest !rounded-xl !px-4 !h-9 !bg-emerald-500 !border-none !shadow-lg !shadow-emerald-500/20 active:scale-95 transition-all text-white"
            @click="openAddMode"
          />
        </div>
      </div>

      <!-- List Container -->
      <div class="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden min-h-[500px]">
        <div class="px-6 py-3 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
              <i class="pi pi-list text-[9px] text-slate-400"></i>
            </div>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{{ $t('customers.groups.list_separator') }}</span>
          </div>
        </div>

        <div class="p-6">
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="h-20 bg-white dark:bg-slate-800/40 animate-pulse rounded-2xl border border-slate-50 dark:border-slate-800/50"></div>
          </div>
          
          <div v-else-if="groups.length === 0" class="flex flex-col items-center justify-center py-24 opacity-30">
            <i class="pi pi-folder-open text-4xl mb-3"></i>
            <p class="text-[10px] font-black uppercase tracking-[0.3em]">{{ $t('customers.groups.no_groups') }}</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="g in groups" 
              :key="g.id || g._id"
              class="group/card relative bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 p-4 rounded-3xl hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/card:text-emerald-500 group-hover/card:bg-white dark:group-hover/card:bg-slate-700 shadow-sm transition-all duration-300">
                  <i class="pi pi-users text-sm"></i>
                </div>
                <div>
                  <h3 class="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight mb-1">{{ g.name }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black">{{ g.discount }}% OFF</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-1 group-hover/card:translate-x-0">
                <button @click="startEdit(g)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
                  <i class="pi pi-pencil text-[10px]"></i>
                </button>
                <button @click="confirmDelete(g)" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Senior Custom Overlays (Not Dialogs) -->
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="panelVisible" @click="closePanel" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[99]"></div>
    </Transition>

    <!-- Slide-over Panel -->
    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
      enter-from-class="translate-x-full" 
      enter-to-class="translate-x-0" 
      leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)" 
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div v-if="panelVisible" class="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.1)] z-[100] flex flex-col">
        <!-- Panel Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full" :class="isEditing ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'"></div>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              {{ isEditing ? $t('common.edit') : $t('customers.groups.add_subtitle') }}
            </span>
          </div>
          <button @click="closePanel" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-white transition-all shadow-sm">
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-8 flex-1 overflow-y-auto">
          <div class="space-y-6">
            <!-- Name Field -->
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{{ $t('customers.groups.name') }}</label>
              <div class="relative group/input">
                <i class="pi pi-tag absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 transition-colors group-focus-within/input:text-emerald-500"></i>
                <InputText 
                  v-model="activeGroup.name" 
                  :placeholder="$t('customers.groups.name_placeholder')" 
                  class="!h-12 !pl-11 !text-xs !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" 
                  autofocus
                />
              </div>
            </div>

            <!-- Discount Field -->
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{{ $t('customers.groups.discount') }}</label>
              <div class="relative group/input">
                <i class="pi pi-percentage absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 transition-colors group-focus-within/input:text-emerald-500 z-10"></i>
                <InputNumber 
                  v-model="activeGroup.discount" 
                  :min="0" :max="100" 
                  placeholder="0"
                  class="w-full"
                  :inputClass="'!h-12 !pl-11 !text-xs !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full'"
                />
              </div>
            </div>
          </div>
          
        </div>

        <!-- Panel Footer -->
        <div class="px-6 py-3 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div class="flex gap-3 items-center">
            <Button 
              :label="$t('common.cancel')"
              text
              class="!flex-1 !text-[10px] !font-black !uppercase !tracking-widest !rounded-2xl !text-slate-400 !h-10"
              @click="closePanel"
            />
            <Button 
              :label="isEditing ? $t('common.save') : $t('common.add')"
              :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'" 
              :loading="saving" 
              @click="handleSubmit"
              class="!flex-[2] !h-10 !rounded-2xl !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/20 active:scale-95 transition-all text-white !text-[10px] !font-black !uppercase !tracking-widest"
            />
          </div>
        </div>
      </div>
    </Transition>
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
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.error_message') || "Xatolik yuz berdi", life: 5000 })
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

/* Custom cubic-bezier for senior-level silk smooth animation */
.transition {
  transition-property: transform, opacity;
}
</style>
