<template>
  <div class="space-y-4">
    <!-- Enable Tur System Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ $t('turlar.enable_tur_system') }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('turlar.enable_tur_desc') }}</p>
        </div>
        <ToggleSwitch v-model="hasTur" @change="toggleTurSystem" :disabled="saving" />
      </div>
    </div>

    <!-- Turlar List Case -->
    <div v-if="product.has_tur" class="space-y-4">
       <!-- Add Button Header -->
       <div class="flex items-center justify-between px-2">
         <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-widest">{{ $t('turlar.title') }}</h3>
         <button 
           @click="openNewDialog"
           class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
         >
           <i class="pi pi-plus"></i>
           {{ $t('turlar.add') }}
         </button>
       </div>

       <!-- Turlar Cards/Table -->
       <div v-if="loadingTurlar" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-32 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
       </div>

       <div v-else-if="turlar.length === 0" class="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300">
            <i class="pi pi-tags text-xl"></i>
          </div>
          <p class="text-sm text-slate-500 font-medium">{{ $t('turlar.no_turlar') }}</p>
       </div>

       <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          <div 
            v-for="tur in turlar" 
            :key="tur.id"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all group"
          >
            <div class="flex justify-between items-start mb-3">
               <div class="space-y-0.5 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-bold text-slate-900 dark:text-white truncate">{{ tur.name }}</h4>
                    <span v-if="tur.color" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                       {{ tur.color }}
                    </span>
                  </div>
                  <p class="text-[10px] font-bold text-emerald-500 tracking-wider">{{ $t('turlar.effective_price') }}: {{ formatPrice(tur.effective_price) }}</p>
               </div>
               <div class="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editTur(tur)" class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button @click="confirmDelete(tur)" class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
               </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
               <div class="flex items-center gap-2">
                  <div :class="tur.is_active ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-300 dark:bg-slate-700'" class="w-1.5 h-1.5 rounded-full"></div>
                  <span class="text-[9px] font-bold text-slate-400 tracking-wider">{{ tur.is_active ? $t('common.active') : $t('common.inactive') }}</span>
               </div>
               <div v-if="tur.sale_price_override" class="text-[9px] font-bold text-slate-400 line-through">
                  {{ formatPrice(product.sale_price) }}
               </div>
            </div>
          </div>
       </div>
    </div>

    <!-- Tur Dialog -->
    <Dialog v-model:visible="turDialog" :header="editMode ? $t('common.edit') : $t('turlar.add')" modal class="w-full max-w-md" :pt="{ 
      root: { class: 'dark:bg-slate-900 border-none rounded-2xl shadow-2xl overflow-hidden' },
      header: { class: 'px-6 pt-6 pb-2 dark:bg-slate-900 border-none' },
      content: { class: 'px-6 dark:bg-slate-900' },
      footer: { class: 'px-6 pb-6 pt-2 dark:bg-slate-900 border-none' }
    }">
      <div class="space-y-5 pt-2">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 tracking-widest ml-1">{{ $t('turlar.name') }}</label>
          <div class="relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 shadow-sm">
            <i class="pi pi-tag absolute left-4 text-xs text-slate-400 group-focus-within/input:text-emerald-500 transition-colors"></i>
            <InputText 
              v-model="turForm.name" 
              class="flex-1 !bg-transparent !border-none !shadow-none !pl-11 !pr-4 !py-0 !h-full !text-sm font-bold text-slate-700 dark:text-slate-200 !outline-none" 
              :placeholder="$t('turlar.name')" 
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 tracking-widest ml-1">{{ $t('turlar.color') }} ({{ $t('common.optional') }})</label>
          <div class="relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 shadow-sm">
            <i class="pi pi-palette absolute left-4 text-xs text-slate-400 group-focus-within/input:text-emerald-500 transition-colors"></i>
            <InputText 
              v-model="turForm.color" 
              class="flex-1 !bg-transparent !border-none !shadow-none !pl-11 !pr-4 !py-0 !h-full !text-sm font-bold text-slate-700 dark:text-slate-200 !outline-none" 
              :placeholder="$t('turlar.color')" 
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 tracking-widest ml-1">{{ $t('turlar.sale_price_override') }}</label>
          <div class="relative group/input flex items-center h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300 shadow-sm">
            <span class="absolute left-4 text-[10px] font-black text-slate-400 group-focus-within/input:text-emerald-500 transition-colors tracking-tight">SUM</span>
            <InputNumber 
              v-model="turForm.sale_price_override" 
              mode="decimal" 
              :use-grouping="true"
              class="flex-1 h-full" 
              :placeholder="Number(product.sale_price).toString()" 
              :pt="{ 
                pcInputText: { 
                  root: { class: '!bg-transparent !border-none !shadow-none !pl-12 !pr-4 !py-0 !h-full !w-full !text-sm font-bold text-slate-700 dark:text-slate-200 !outline-none' } 
                } 
              }" 
            />
          </div>
        </div>

        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ $t('common.status') }}</span>
            <span class="text-[10px] text-slate-500">{{ turForm.is_active ? $t('common.active') : $t('common.inactive') }}</span>
          </div>
          <ToggleSwitch v-model="turForm.is_active" />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full">
          <button @click="turDialog = false" class="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors tracking-widest">
            {{ $t('common.cancel') }}
          </button>
          <button @click="saveTur" :disabled="savingTur" class="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 tracking-widest">
             <i v-if="savingTur" class="pi pi-spin pi-spinner mr-2"></i>
             {{ $t('common.save') }}
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { productsAPI } from '@/services/api'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['refresh'])

const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()

const hasTur = ref(props.product.has_tur)
const turlar = ref([])
const loadingTurlar = ref(false)
const saving = ref(false)

const turDialog = ref(false)
const editMode = ref(false)
const savingTur = ref(false)
const currentTurId = ref(null)

const turForm = ref({
  name: '',
  color: '',
  sale_price_override: null,
  is_active: true
})

const formatPrice = (price) => {
  if (price === null || price === undefined) return '0'
  return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS'
}

const fetchTurlar = async () => {
  if (!props.product.id || !hasTur.value) return
  loadingTurlar.value = true
  try {
    const res = await productsAPI.getTurlar(props.product.id)
    turlar.value = res.data
  } catch (err) {
    console.error('Fetch turlar error:', err)
  } finally {
    loadingTurlar.value = false
  }
}

const toggleTurSystem = async () => {
  saving.value = true
  try {
    await productsAPI.update(props.product.id, { has_tur: hasTur.value })
    toast.add({ severity: 'success', summary: t('common.updated'), life: 3000 })
    emit('refresh')
    if (hasTur.value) {
      fetchTurlar()
    }
  } catch (err) {
    hasTur.value = !hasTur.value
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.response?.data?.detail || t('common.error_message'), life: 3000 })
  } finally {
    saving.value = false
  }
}

const openNewDialog = () => {
  editMode.value = false
  currentTurId.value = null
  turForm.value = {
    name: '',
    color: '',
    sale_price_override: null,
    is_active: true
  }
  turDialog.value = true
}

const editTur = (tur) => {
  editMode.value = true
  currentTurId.value = tur.id
  turForm.value = {
    name: tur.name,
    color: tur.color,
    sale_price_override: tur.sale_price_override ? parseFloat(tur.sale_price_override) : null,
    is_active: tur.is_active
  }
  turDialog.value = true
}

const saveTur = async () => {
  if (!turForm.value.name) {
    toast.add({ severity: 'warn', summary: t('common.required_field'), detail: t('turlar.validation.name_required'), life: 3000 })
    return
  }

  savingTur.value = true
  try {
    if (editMode.value) {
      await productsAPI.updateTur(props.product.id, currentTurId.value, turForm.value)
      toast.add({ severity: 'success', summary: t('turlar.messages.updated'), life: 3000 })
    } else {
      await productsAPI.createTur(props.product.id, turForm.value)
      toast.add({ severity: 'success', summary: t('turlar.messages.added'), life: 3000 })
    }
    turDialog.value = false
    fetchTurlar()
    emit('refresh')
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.response?.data?.detail || t('common.error_message'), life: 5000 })
  } finally {
    savingTur.value = false
  }
}

const confirmDelete = (tur) => {
  confirm.require({
    message: t('turlar.delete_confirm'),
    header: t('common.confirm_title'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await productsAPI.deleteTur(props.product.id, tur.id)
        toast.add({ severity: 'success', summary: t('turlar.messages.deleted'), life: 3000 })
        fetchTurlar()
        emit('refresh')
      } catch (err) {
        toast.add({ severity: 'error', summary: t('common.error'), detail: err.response?.data?.detail || t('turlar.messages.delete_error_stock'), life: 5000 })
      }
    }
  })
}

onMounted(() => {
  if (hasTur.value) fetchTurlar()
})

watch(() => props.product.has_tur, (newVal) => {
  hasTur.value = newVal
  if (newVal) fetchTurlar()
})
</script>
