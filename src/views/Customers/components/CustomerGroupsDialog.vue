<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '92vw', maxWidth: '480px' }"
    :breakpoints="{ '641px': '92vw', '480px': '95vw' }"
    :header="$t('customers.groups.manage_title')" 
    :modal="true"
    :draggable="false"
    class="p-fluid sr-professional-dialog"
    pt:root:class="!rounded-[2rem] !border-none !shadow-2xl overflow-hidden shadow-emerald-500/5"
    pt:header:class="!px-6 !pt-6 !pb-4 !bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !font-black !!tracking-tighter !text-lg"
    pt:content:class="!px-6 !pb-6 !bg-white dark:!bg-slate-900"
    pt:closeButton:class="!rounded-xl hover:!bg-slate-100 dark:hover:!bg-slate-800 transition-all"
  >
    <div class="space-y-5">
      <!-- Create New Group Section (Ultra Compact) -->
      <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-[1.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative p-4 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[9px] font-black tracking-[0.2em] text-slate-400">{{ $t('customers.groups.add_subtitle') }}</span>
          </div>
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div class="flex-1 flex flex-col gap-1.5 min-w-0">
              <label class="text-[9px] font-black tracking-widest text-slate-400 ml-1">{{ $t('customers.groups.name') }}</label>
              <div class="relative">
                <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 transition-colors group-focus-within:text-emerald-500"></i>
                <InputText 
                  v-model="newGroup.name" 
                  :placeholder="$t('customers.groups.name_placeholder')" 
                  class="!h-9 !pl-8 !text-[11px] !font-bold !rounded-xl !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-700 focus:!ring-4 focus:!ring-emerald-500/10 transition-all w-full" 
                />
              </div>
            </div>
            
            <div class="w-full sm:w-[130px] flex flex-col gap-1.5 flex-shrink-0">
              <label class="text-[9px] font-black tracking-widest text-slate-400 ml-1">{{ $t('customers.groups.discount') }}</label>
              <div class="flex gap-2">
                <div class="relative flex-1 flex items-center">
                  <InputNumber 
                    v-model="newGroup.discount" 
                    :min="0" :max="100" 
                    placeholder="0" 
                    mode="decimal" 
                    class="w-full"
                    pt:root:class="!h-9"
                    pt:input:class="!h-9 !px-3 !text-[11px] !font-bold !rounded-xl !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-700 w-full !text-left focus:!border-emerald-500/50"
                  />
                </div>
                <Button 
                  icon="pi pi-check" 
                  :loading="saving" 
                  @click="addGroup"
                  class="!w-9 !h-9 !rounded-xl !bg-emerald-500 !border-none !shadow-lg !shadow-emerald-500/20 active:scale-90 transition-all flex-shrink-0 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="flex items-center gap-4 py-1">
        <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
        <span class="text-[8px] font-black tracking-[0.3em] text-slate-300 dark:text-slate-600">{{ $t('customers.groups.list_separator') }}</span>
        <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
      </div>

      <!-- Groups List -->
      <div class="min-h-[200px] max-h-[320px] overflow-y-auto pr-1 custom-scrollbar-professional">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-14 bg-slate-50 dark:bg-slate-800/40 animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800/50"></div>
        </div>
        
        <div v-else-if="groups.length === 0" class="flex flex-col items-center justify-center py-10 opacity-30">
          <i class="pi pi-box text-3xl mb-2"></i>
          <p class="text-[10px] font-black tracking-widest">{{ $t('customers.groups.no_groups') }}</p>
        </div>
        
        <div v-else class="space-y-2.5">
          <div 
            v-for="g in groups" 
            :key="g.id || g._id"
            class="group/item flex items-center justify-between p-2.5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 group-hover/item:bg-emerald-500/10 transition-colors">
                <i class="pi pi-users text-xs"></i>
              </div>
              <div class="flex flex-col">
                <p class="text-[12px] font-black text-slate-700 dark:text-slate-200 tracking-tighter leading-none mb-1">{{ g.name }}</p>
                <div class="flex items-center gap-1.5 leading-none">
                  <span class="text-[9px] font-bold text-emerald-500 tracking-wider">{{ g.discount }}% OFF</span>
                  <div class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <span class="text-[8px] font-medium text-slate-400 tracking-widest">{{ $t('customers.groups.loyalty_system') }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-1">
              <button 
                @click="confirmDelete(g)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover/item:opacity-100 active:scale-90"
              >
                <i class="pi pi-trash text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { customerGroupsAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'groups-updated'])
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const groups = ref([])
const newGroup = ref({ name: '', discount: 0 })

const loadGroups = async () => {
  loading.value = true
  try {
    const response = await customerGroupsAPI.getAll()
    groups.value = response.data.results || response.data
  } catch (error) {
    console.error('Error loading groups:', error)
  } finally {
    loading.value = false
  }
}

const addGroup = async () => {
  if (!newGroup.value.name.trim()) return
  
  saving.value = true
  try {
    await customerGroupsAPI.create(newGroup.value)
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('customers.groups.added_message') || "Guruh qo'shildi", life: 5000 })
    newGroup.value = { name: '', discount: 0 }
    loadGroups()
    emit('groups-updated')
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.groups.add_error') || "Guruh qo'shishda xatolik", life: 5000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (group) => {
  confirm.require({
    message: t('customers.groups.delete_confirm', { name: group.name }),
    header: t('common.confirm') || 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: t('common.cancel') || 'Bekor qilish', severity: 'secondary', outlined: true },
    acceptProps: { label: t('common.delete') || "O'chirish", severity: 'danger' },
    accept: async () => {
      try {
        await customerGroupsAPI.delete(group.id || group._id)
        toast.add({ severity: 'success', summary: t('common.deleted'), detail: t('customers.groups.deleted_message') || "Guruh o'chirildi", life: 5000 })
        loadGroups()
        emit('groups-updated')
      } catch (error) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: t('customers.groups.delete_error') || "Guruhni o'chirishda xatolik", life: 5000 })
      }
    }
  })
}

watch(() => props.visible, (newVal) => {
  if (newVal) loadGroups()
})

onMounted(() => {
  if (props.visible) loadGroups()
})
</script>

<style scoped>
.custom-scrollbar-professional::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar-professional::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-professional::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar-professional::-webkit-scrollbar-thumb {
  background: #334155;
}

.sr-professional-dialog :deep(.p-dialog-header-close-icon) {
  width: 10px;
  height: 10px;
}
</style>
