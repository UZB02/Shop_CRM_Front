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
          <template v-if="!isClosing">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <i class="pi pi-play text-emerald-400 text-sm" />
                </div>
                <div>
                  <h2 class="text-[15px] font-black text-white leading-none">{{ $t('pos.open_new_shift') }}</h2>
                  <p class="text-[11px] text-slate-500 font-medium mt-0.5">{{ $t('pos.prepare_cash_register') }}</p>
                </div>
              </div>
              <button @click="close" class="close-btn"><i class="pi pi-times text-xs" /></button>
            </div>

            <div class="px-5 pb-5 space-y-3">
              <!-- Branch -->
              <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500/8 border border-emerald-500/12">
                <i class="pi pi-map-marker text-emerald-400 text-sm flex-shrink-0" />
                <span class="text-[13px] font-bold text-emerald-300 truncate">
                  {{ authStore.user?.branch_name || authStore.user?.worker?.branch_name || $t('pos.unselected') }}
                </span>
              </div>

              <!-- Cash start -->
              <div>
                <label class="block text-[11px] font-black text-slate-500 tracking-widest uppercase mb-2">
                  {{ $t('pos.starting_cash') }}
                </label>
                <InputNumber
                  v-model="cashStart"
                  class="shift-input w-full"
                  :min="0"
                  placeholder="0"
                  autofocus
                  :use-grouping="true"
                />
              </div>

              <!-- Actions -->
              <div class="flex gap-2.5 pt-1">
                <button @click="close" class="btn-cancel flex-1">{{ 'Bekor qilish' }}</button>
                <button
                  @click="handleSubmit"
                  :disabled="loading || !hasBranchId"
                  class="btn-primary flex-[2] bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25"
                >
                  <i v-if="loading" class="pi pi-spin pi-spinner mr-1.5" />
                  <i v-else class="pi pi-play mr-1.5" />
                  {{ $t('pos.open_shift') }}
                </button>
              </div>
            </div>
          </template>

          <!-- CLOSE SHIFT -->
          <template v-else>
            <!-- Header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <i class="pi pi-lock text-rose-400 text-sm" />
                </div>
                <div>
                  <h2 class="text-[15px] font-black text-white leading-none">{{ $t('pos.close_shift') }}</h2>
                  <p class="text-[11px] text-slate-500 font-medium mt-0.5">
                    <i class="pi pi-clock mr-1" />
                    {{ formatDate(shift?.opened_at || shift?.start_time || shift?.created_at) }}
                  </p>
                </div>
              </div>
              <button @click="close" class="close-btn"><i class="pi pi-times text-xs" /></button>
            </div>

            <div class="px-5 pb-5 space-y-3">
              <!-- Stats: horizontal compact row -->
              <div class="grid grid-cols-2 gap-2">
                <div class="stat-row">
                  <i class="pi pi-wallet text-emerald-400 text-sm" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ $t('pos.final_cash') }}</p>
                    <p class="text-[13px] font-black text-white">{{ formatCurrency(displayCash) }}</p>
                  </div>
                </div>
                <div class="stat-row">
                  <i class="pi pi-chart-bar text-violet-400 text-sm" />
                  <div>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ $t('pos.cash_balance') }}</p>
                    <p class="text-[13px] font-black text-white">{{ formatCurrency(displayNetIncome) }}</p>
                  </div>
                </div>
              </div>

              <!-- Difference badge (closed shift) -->
              <div
                v-if="(shift?.status === 'closed' || shift?.cash_difference !== null) && shift?.cash_difference !== undefined"
                class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-[12px] font-bold"
                :class="diffClass.wrap"
              >
                <i :class="['text-sm', diffClass.pi]" />
                <span :class="diffClass.text">{{ diffMessage }}</span>
              </div>

              <!-- Cash count input -->
              <div v-if="shift?.status === 'open' && settingsStore.requireCashCount">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                    {{ $t('pos.counted_cash_in_register') }}
                  </label>
                  <span class="badge-required">Majburiy</span>
                </div>
                <InputNumber
                  v-model="cashCounted"
                  class="shift-input w-full"
                  :min="0"
                  placeholder="0"
                  autofocus
                  :use-grouping="true"
                />
              </div>

              <!-- No count needed info -->
              <div
                v-else-if="shift?.status === 'open' && !settingsStore.requireCashCount"
                class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/4 border border-white/8 text-[12px] font-medium text-slate-400"
              >
                <i class="pi pi-info-circle text-slate-500 flex-shrink-0" />
                {{ $t('pos.shift_will_close_without_count') }}
              </div>

              <!-- Discrepancy reason -->
              <div v-if="showReasonInput" class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-black text-rose-400 tracking-widest uppercase">
                    {{ $t('pos.discrepancy_reason') }}
                  </label>
                  <span class="badge-required">Majburiy</span>
                </div>
                <div
                  v-if="discrepancyError"
                  class="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[12px] font-bold text-rose-300"
                >
                  <i class="pi pi-exclamation-triangle text-rose-400 flex-shrink-0 mt-px" />
                  {{ discrepancyError }}
                </div>
                <textarea
                  v-model="discrepancyReason"
                  class="reason-textarea"
                  rows="2"
                  :placeholder="$t('pos.enter_discrepancy_reason')"
                />
              </div>

              <!-- Actions -->
              <div class="flex gap-2.5 pt-1">
                <button @click="close" class="btn-cancel flex-1">
                  {{ shift?.status === 'closed' ? $t('common.close') : 'Bekor qilish' }}
                </button>

                <!-- Download (closed) -->
                <button
                  v-if="shift?.status === 'closed'"
                  @click="$emit('download', shift.id)"
                  class="btn-primary flex-[2] bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                >
                  <i class="pi pi-download mr-1.5" />
                  {{ $t('common.download') }}
                </button>

                <!-- Submit (open) -->
                <button
                  v-else
                  @click="handleSubmit"
                  :disabled="submitDisabled"
                  class="btn-primary flex-[2] bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                >
                  <i v-if="loading" class="pi pi-spin pi-spinner mr-1.5" />
                  <i v-else class="pi pi-lock mr-1.5" />
                  {{ $t('pos.close_shift') }}
                </button>
              </div>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputNumber from 'primevue/inputnumber'
import { useAuthStore }     from '@/store/auth'
import { useSettingsStore } from '@/store/settings'

const { t }         = useI18n()
const authStore     = useAuthStore()
const settingsStore = useSettingsStore()

const props = defineProps({
  visible:          Boolean,
  isClosing:        Boolean,
  shift:            Object,
  xReport:          Object,
  loading:          Boolean,
  discrepancyError: String,
})
const emit = defineEmits(['update:visible', 'update:discrepancyError', 'confirm', 'download'])

// ── State ─────────────────────────────────────────────────────────────────────
const cashStart         = ref(0)
const cashCounted       = ref(null)
const discrepancyReason = ref('')

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (val) => settingsStore.formatPrice(val)
const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(String(val).replace('|', '').trim())
  return isNaN(d.getTime()) ? val : d.toLocaleString('uz-UZ')
}

// ── Display values ────────────────────────────────────────────────────────────
const displayCash = computed(() => {
  if (props.shift?.status === 'closed' && props.shift?.cash_end !== null) return props.shift.cash_end
  return props.xReport?.expected_cash ?? props.xReport?.cash_end ?? props.xReport?.total_cash
      ?? props.shift?.expected_cash ?? props.shift?.cash_start ?? 0
})

const displayNetIncome = computed(() =>
  props.xReport?.net_income ?? props.xReport?.total_income ?? props.xReport?.income
  ?? props.shift?.net_income ?? props.shift?.expected_cash ?? 0
)

const expectedCash = computed(() =>
  props.xReport?.expected_cash ?? props.shift?.expected_cash ?? 0
)

// ── Discrepancy ───────────────────────────────────────────────────────────────
const needsReasonLocal = computed(() => {
  if (!settingsStore.requireCashCount || cashCounted.value === null) return false
  const diff      = Math.abs(cashCounted.value - parseFloat(expectedCash.value))
  const threshold = parseFloat(settingsStore.cashDiscrepancyThreshold || 0)
  return threshold > 0 && diff > threshold
})
const showReasonInput = computed(() => needsReasonLocal.value || !!props.discrepancyError)

// ── Difference badge ──────────────────────────────────────────────────────────
const diffClass = computed(() => {
  const d = parseFloat(props.shift?.cash_difference || 0)
  if (d === 0) return { wrap: 'bg-emerald-500/10 border-emerald-500/20', pi: 'pi pi-check-circle text-emerald-400', text: 'text-emerald-300' }
  if (d < 0)  return { wrap: 'bg-rose-500/10 border-rose-500/20',        pi: 'pi pi-exclamation-triangle text-rose-400', text: 'text-rose-300' }
  return              { wrap: 'bg-amber-500/10 border-amber-500/20',      pi: 'pi pi-info-circle text-amber-400',  text: 'text-amber-300' }
})
const diffMessage = computed(() => {
  const d = parseFloat(props.shift?.cash_difference || 0)
  if (d === 0) return t('pos.cash_correct_no_diff')     || 'Kassa to\'g\'ri, farq yo\'q'
  if (d < 0)  return t('pos.cashier_shortage', { amount: formatCurrency(Math.abs(d)) }) || `Kamomad: ${formatCurrency(Math.abs(d))}`
  return              t('pos.cashier_surplus',  { amount: formatCurrency(d) })           || `Ortiqcha: ${formatCurrency(d)}`
})

// ── Submit ────────────────────────────────────────────────────────────────────
const branchId = computed(() => {
  const u = authStore.user
  if (!u) return null
  if (u.branch_id) return u.branch_id
  if (u.worker?.branch) return u.worker.branch
  if (u.branch) return typeof u.branch === 'object' ? u.branch.id : u.branch
  return null
})
const hasBranchId    = computed(() => !!branchId.value)
const submitDisabled = computed(() => {
  if (props.loading) return true
  if (!props.isClosing) return !hasBranchId.value
  if (settingsStore.requireCashCount && cashCounted.value === null) return true
  if (showReasonInput.value && !discrepancyReason.value.trim()) return true
  return false
})

const close = () => emit('update:visible', false)

const handleSubmit = () => {
  emit('update:discrepancyError', '')
  if (props.isClosing) {
    const payload = {}
    if (settingsStore.requireCashCount && cashCounted.value !== null) payload.cash_end = cashCounted.value
    if (showReasonInput.value && discrepancyReason.value) payload.discrepancy_reason = discrepancyReason.value
    emit('confirm', payload)
  } else {
    emit('confirm', {
      branch:     branchId.value,
      cash_start: cashStart.value,
    })
  }
}

watch(() => props.visible, (val) => {
  if (!val) return
  if (!props.isClosing) { cashStart.value = 0 }
  else { cashCounted.value = null; discrepancyReason.value = ''; emit('update:discrepancyError', '') }
})
</script>

<style scoped>
/* ── Panel ───────────────────────────────────────────────── */
.modal-panel {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset;
}

/* ── Close button ────────────────────────────────────────── */
.close-btn {
  width: 30px; height: 30px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #64748b;
  transition: all .15s;
  flex-shrink: 0;
}
.close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.close-btn:active { transform: scale(0.9); }

/* ── Stat rows ───────────────────────────────────────────── */
.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
}

/* ── Badges ──────────────────────────────────────────────── */
.badge-required {
  font-size: 9px; font-weight: 900;
  color: #f87171;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── InputNumber ─────────────────────────────────────────── */
:deep(.shift-input .p-inputnumber-input) {
  width: 100%;
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 14px !important;
  padding: 12px 16px !important;
  font-size: 18px !important;
  font-weight: 900 !important;
  color: #fff !important;
  outline: none !important;
  box-shadow: none !important;
  transition: border-color .2s, background .2s;
}
:deep(.shift-input .p-inputnumber-input:focus) {
  border-color: rgba(16,185,129,0.35) !important;
  background: rgba(255,255,255,0.07) !important;
}
:deep(.shift-input .p-inputnumber-input::placeholder) { color: #374151 !important; font-weight: 700 !important; }

/* ── Textarea ────────────────────────────────────────────── */
.reason-textarea {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
  resize: none;
  outline: none;
  transition: border-color .2s;
}
.reason-textarea:focus { border-color: rgba(239,68,68,0.4); }
.reason-textarea::placeholder { color: #374151; }

/* ── Buttons ─────────────────────────────────────────────── */
.btn-cancel {
  padding: 11px 16px;
  border-radius: 14px;
  font-size: 13px; font-weight: 800;
  color: #64748b;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  transition: all .15s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
.btn-cancel:active { transform: scale(0.98); }

.btn-primary {
  padding: 11px 16px;
  border-radius: 14px;
  font-size: 13px; font-weight: 900;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
  box-shadow: 0 4px 16px var(--tw-shadow-color, rgba(0,0,0,0.3));
}
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; filter: none; }

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
