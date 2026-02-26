<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :style="{ width: 'min(850px, 96vw)' }"
    modal
    dismissableMask
    :showHeader="false"
    class="professional-worker-dialog"
    contentClass="!p-0 !border-none !bg-transparent !overflow-hidden !rounded-[28px]"
    @hide="$emit('hide')"
  >
    <div class="flex flex-col bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden" style="max-height: 90vh;">

      <!-- Header (fixed) -->
      <DialogHeader :isEdit="!!worker.id" @close="$emit('update:visible', false)" />

      <!-- Body -->
      <div class="flex-1 p-4 md:px-8 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 overflow-y-auto custom-scrollbar">
        
        <!-- Left: Personal + Work (7 cols on md+, full on mobile) -->
        <div class="col-span-1 md:col-span-7 space-y-6 md:space-y-8">
          <PersonalInfoSection :worker="worker" :submitted="submitted" />
          <WorkInfoSection :worker="worker" :stores="stores" :storesLoading="storesLoading" />
        </div>

        <!-- Right: System Access (5 cols on md+, full on mobile) -->
        <div class="col-span-1 md:col-span-5 flex flex-col">
          <SystemAccessPanel
            :worker="worker"
            v-model:createLogin="createLoginLocal"
          />
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 md:px-8 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
        <Button :label="$t('common.cancel')"
                text
                class="w-full sm:w-auto !px-6 !text-slate-500 hover:!bg-slate-200/50"
                @click="$emit('update:visible', false)" />
        <Button :label="$t('common.save_worker')"
                icon="pi pi-check"
                :loading="saving"
                class="w-full sm:w-auto !rounded-xl !px-8 !bg-emerald-600 !border-emerald-600 shadow-lg shadow-emerald-600/20 hover:!bg-emerald-700 hover:!border-emerald-700 transition-all font-black text-sm"
                @click="$emit('save')" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import DialogHeader      from './dialog/DialogHeader.vue'
import PersonalInfoSection from './dialog/PersonalInfoSection.vue'
import WorkInfoSection   from './dialog/WorkInfoSection.vue'
import SystemAccessPanel from './dialog/SystemAccessPanel.vue'

const props = defineProps({
  visible:     Boolean,
  worker:      Object,
  stores:      Array,
  storesLoading: Boolean,
  saving:      Boolean,
  createLogin: Boolean,
  submitted:   Boolean,
})

const emit = defineEmits(['update:visible', 'save', 'hide', 'update:createLogin'])

// createLogin local mirror (two-way sync)
const createLoginLocal = ref(props.createLogin)
watch(() => props.createLogin, v => { createLoginLocal.value = v })
watch(createLoginLocal, v => emit('update:createLogin', v))
</script>

<style scoped>
/* PrimeVue Dialog overrides */
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
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.6) !important;
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar       { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
