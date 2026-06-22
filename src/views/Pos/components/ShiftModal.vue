<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[300] flex items-center justify-center p-4"
        @mousedown.self="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />

        <!-- ── Modal Panel ──────────────────────────────────────────────── -->
        <div class="modal-panel relative w-full max-w-sm flex flex-col rounded-3xl overflow-hidden">

          <!-- OPEN SHIFT -->
          <ShiftOpenForm
            v-if="!isClosing"
            v-model="cashStart"
            :branch-name="authStore.user?.branch_name || authStore.user?.worker?.branch_name"
            :loading="loading"
            :has-branch-id="hasBranchId"
            @close="close"
            @submit="handleSubmit"
          />

          <!-- CLOSE SHIFT -->
          <ShiftCloseForm
            v-else
            v-model:cashCounted="cashCounted"
            v-model:discrepancyReason="discrepancyReason"
            :shift="shift"
            :display-cash="displayCash"
            :display-net-income="displayNetIncome"
            :formatted-date="formatDate(shift?.opened_at || shift?.start_time || shift?.created_at)"
            :require-cash-count="settingsStore.requireCashCount"
            :show-reason-input="showReasonInput"
            :display-discrepancy-error="displayDiscrepancyError"
            :diff-class="diffClass"
            :diff-message="diffMessage"
            :submit-disabled="submitDisabled"
            :loading="loading"
            @close="close"
            @download="$emit('download', $event)"
            @submit="handleSubmit"
          />

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useShiftModal } from '../composables/useShiftModal'
import ShiftOpenForm from './ShiftOpenForm.vue'
import ShiftCloseForm from './ShiftCloseForm.vue'

const props = defineProps({
  visible:          Boolean,
  isClosing:        Boolean,
  shift:            Object,
  xReport:          Object,
  loading:          Boolean,
  discrepancyError: String,
})
const emit = defineEmits(['update:visible', 'update:discrepancyError', 'confirm', 'download'])

const {
  authStore,
  settingsStore,
  cashStart,
  cashCounted,
  discrepancyReason,
  formatDate,
  displayCash,
  displayNetIncome,
  showReasonInput,
  displayDiscrepancyError,
  diffClass,
  diffMessage,
  hasBranchId,
  submitDisabled,
  close,
  handleSubmit
} = useShiftModal(props, emit)
</script>

<style scoped>
/* ── Panel ───────────────────────────────────────────────── */
.modal-panel {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 32px 64px -16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.02) inset;
}
.dark .modal-panel {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset;
}

/* ── Transition ──────────────────────────────────────────── */
.modal-fade-enter-active { transition: opacity .25s ease; }
.modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active  .modal-panel {
  transition: transform .28s cubic-bezier(0.22,1,0.36,1), opacity .25s ease;
}
.modal-fade-enter-from .modal-panel { transform: scale(0.95) translateY(10px); opacity: 0; }
.modal-fade-leave-to  .modal-panel  { transform: scale(0.97) translateY(6px);  opacity: 0; }

.font-outfit { font-family: 'Outfit', sans-serif; }
</style>
