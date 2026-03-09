<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: '600px' }" 
    header="Mijoz Guruhlarini Boshqarish" 
    :modal="true" 
    class="p-fluid"
  >
    <div class="space-y-6 pt-4">
      <!-- Create New Group -->
      <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight flex items-center gap-2">
          <i class="pi pi-plus-circle text-emerald-500"></i>
          Yangi Guruh Qo'shish
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Guruh Nomi</label>
            <InputText v-model="newGroup.name" placeholder="Masalan: VIP mijozlar" class="sr-input" />
          </div>
          <div class="field">
            <label class="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Chegirma (%)</label>
            <InputNumber v-model="newGroup.discount" :min="0" :max="100" placeholder="0.00" mode="decimal" :minFractionDigits="2" class="sr-number" />
          </div>
        </div>
        <div class="flex justify-end">
          <Button 
            label="Guruhni qo'shish" 
            icon="pi pi-plus" 
            :loading="saving" 
            severity="success" 
            size="small"
            class="!rounded-xl"
            @click="addGroup" 
          />
        </div>
      </div>

      <!-- Groups List -->
      <div class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mavjud Guruhlar</h3>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
        </div>
        <div v-else-if="groups.length === 0" class="text-center py-6 text-slate-400 italic text-sm">
          Guruhlar topilmadi.
        </div>
        <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="g in groups" 
            :key="g.id"
            class="group flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl transition-all hover:border-emerald-500/30"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <i class="pi pi-users text-sm"></i>
              </div>
              <div>
                <p class="text-sm font-black text-slate-700 dark:text-slate-200">{{ g.name }}</p>
                <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{{ g.discount }}% chegirma</span>
              </div>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="confirmDelete(g)" />
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

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'groups-updated'])
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const groups = ref([])
const newGroup = ref({ name: '', discount: 0 })

const loadGroups = async () => {
  loading.value = true
  try {
    const response = await customerGroupsAPI.getAll()
    // Depending on backend structure, might be response.data or response.data.results
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
    toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Guruh qo'shildi", life: 3000 })
    newGroup.value = { name: '', discount: 0 }
    loadGroups()
    emit('groups-updated')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: "Guruh qo'shishda xatolik", life: 3000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (group) => {
  if (!confirm(`"${group.name}" guruhini o'chirishni tasdiqlaysizmi?`)) return
  
  try {
    await customerGroupsAPI.delete(group.id)
    toast.add({ severity: 'success', summary: 'O\'chirildi', detail: "Guruh o'chirildi", life: 3000 })
    loadGroups()
    emit('groups-updated')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: "Guruhni o'chirishda xatolik. Mijozlar bog'langan bo'lishi mumkin.", life: 3000 })
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) loadGroups()
})

onMounted(() => {
  if (props.visible) loadGroups()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
