<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: 'min(850px, 96vw)' }"
    modal
    dismissableMask
    :showHeader="false"
    class="professional-worker-dialog font-inter"
    contentClass="!p-0 !border-none !bg-transparent !overflow-hidden !rounded-xl"
    @hide="$emit('hide')"
  >
    <div class="flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl" style="max-height: 90vh;">
      <!-- Header -->
      <DialogHeader :isEdit="!!worker.id" @close="$emit('update:visible', false)" />

      <!-- Body -->
      <div class="flex-1 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-y-auto custom-scrollbar">
        <!-- Left Column -->
        <div class="md:col-span-7 space-y-8">
          <div class="space-y-6">
            <PersonalInfoSection :worker="worker" :submitted="submitted" />
            <WorkInfoSection :worker="worker" :branches="branches" />
          </div>
        </div>

        <!-- Right Column -->
        <div class="md:col-span-12 lg:col-span-5 flex flex-col min-h-0">
          <SystemAccessPanel
            :worker="worker"
            v-model:createLogin="createLoginLocal"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 md:px-8 py-5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          @click="$emit('update:visible', false)"
          class="w-full sm:w-auto h-11 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="$emit('save')"
          :disabled="saving"
          class="w-full sm:w-auto h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner text-xs"></i>
          <i v-else class="pi pi-check text-xs"></i>
          {{ $t('common.save_worker') }}
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'

import DialogHeader      from './dialog/DialogHeader.vue'
import PersonalInfoSection from './dialog/PersonalInfoSection.vue'
import WorkInfoSection   from './dialog/WorkInfoSection.vue'
import SystemAccessPanel from './dialog/SystemAccessPanel.vue'

const props = defineProps({
  visible:     Boolean,
  worker:      Object,
  branches:    Array,
  saving:      Boolean,
  createLogin: Boolean,
  submitted:   Boolean,
})

const emit = defineEmits(['update:visible', 'save', 'hide', 'update:createLogin'])

// Role-based permissions mapping deleted - moved to WorkInfoSection.vue

const createLoginLocal = ref(props.createLogin)
watch(() => props.createLogin, v => { createLoginLocal.value = v })
watch(createLoginLocal, v => emit('update:createLogin', v))
</script>

<style scoped>
:deep(.professional-worker-dialog) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
:deep(.professional-worker-dialog .p-dialog-content) {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  outline: none !important;
}
:deep(.professional-worker-dialog .p-dialog-header) {
  display: none;
}
:deep(.p-dialog-mask.p-component-overlay) {
  backdrop-filter: blur(4px);
  background-color: rgba(15, 23, 42, 0.4) !important;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
