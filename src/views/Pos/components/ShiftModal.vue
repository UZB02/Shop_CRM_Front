<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    modal 
    :header="isClosing ? 'Smenani yopish' : 'Yangi smena ochish'" 
    :style="{ width: '400px' }"
    class="shift-dialog"
  >
    <div class="space-y-6 pt-2">
      <!-- Icon/Header Illustration -->
      <div class="flex flex-col items-center gap-2 mb-4">
        <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <i class="pi pi-briefcase text-2xl" :class="isClosing ? 'text-rose-500' : 'text-emerald-500'"></i>
        </div>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">
           {{ isClosing ? "Kassa hisob-kitobi" : "Kassani tayyorlash" }}
        </p>
      </div>

      <!-- Opening Shift Inputs -->
      <div v-if="!isClosing" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-slate-400 uppercase ml-1">Boshlang'ich kassa (Naqd)</label>
          <InputNumber 
            v-model="cashStart" 
            class="w-full sr-input"
            :min="0"
            placeholder="0.00"
            autofocus
          />
        </div>
        <div class="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-500/10 flex items-center gap-3">
          <i class="pi pi-info-circle text-emerald-500"></i>
          <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
            Smena joriy filialda ({{ authStore.user?.branch_name || 'Aniqlanmagan' }}) ochiladi
          </span>
        </div>
      </div>

      <!-- Closing Shift Inputs -->
      <div v-else class="space-y-4">
        <div class="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
           <div class="flex justify-between text-xs font-bold">
             <span class="text-slate-500">Smena ID:</span>
             <span class="text-slate-800 dark:text-white">#{{ shift?.id }}</span>
           </div>
           <div class="flex justify-between text-xs font-bold">
             <span class="text-slate-500">Ochilgan vaqt:</span>
             <span class="text-slate-800 dark:text-white">{{ formatDate(shift?.created_at) }}</span>
           </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-slate-400 uppercase ml-1">Kassada sanalgan pul</label>
          <InputNumber 
            v-model="cashCounted" 
            class="w-full sr-input text-lg"
            :min="0"
            placeholder="0.00"
            autofocus
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          @click="$emit('update:visible', false)"
          class="flex-1 py-4 px-4 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 transition-all hover:bg-slate-200"
        >
          Bekor qilish
        </button>
        <button 
          @click="handleSubmit"
          :disabled="loading || (!isClosing && !authStore.user?.branch_id)"
          class="flex-[2] py-4 px-4 rounded-2xl font-bold text-white transition-all shadow-xl disabled:opacity-50"
          :class="[
             isClosing ? 'bg-rose-500 hover:bg-rose-600 hover:shadow-rose-400/30' : 'bg-[#10b981] hover:bg-[#059669] hover:shadow-emerald-500/30'
          ]"
        >
           <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
           {{ isClosing ? 'Smenani yopish' : 'Smenani ochish' }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import { useAuthStore } from '@/store/auth'

const props = defineProps({
  visible: Boolean,
  isClosing: Boolean,
  shift: Object,
  loading: Boolean
})

const emit = defineEmits(['update:visible', 'confirm'])

const authStore = useAuthStore()
const cashStart = ref(0)
const cashCounted = ref(0)

const handleSubmit = () => {
  if (props.isClosing) {
    emit('confirm', { cash_counted: cashCounted.value })
  } else {
    emit('confirm', { 
      branch: authStore.user?.branch_id, 
      cash_start: cashStart.value 
    })
  }
}

const formatDate = (val) => {
  if (!val) return ''
  return new Date(val).toLocaleString('uz-UZ')
}

// Reset state when opening
watch(() => props.visible, (newVal) => {
  if (newVal && !props.isClosing) {
    cashStart.value = 0
  } else if (newVal && props.isClosing) {
    cashCounted.value = 0
  }
})
</script>

<style scoped>
:deep(.shift-dialog) {
  border-radius: 32px !important;
  overflow: hidden;
  border: none;
  box-shadow: 0 40px 60px -20px rgb(0 0 0 / 0.3);
}

:deep(.shift-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  background: white;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
}

:deep(.shift-dialog .p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
  background: white;
}

.dark :deep(.shift-dialog .p-dialog-header),
.dark :deep(.shift-dialog .p-dialog-content) {
  background: #0f172a;
}
</style>
