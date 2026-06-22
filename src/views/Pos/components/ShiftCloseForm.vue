<template>
  <!-- Header -->
  <div class="flex items-center justify-between px-5 pt-5 pb-4">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/10 dark:border-rose-500/20 flex items-center justify-center">
        <i class="pi pi-lock text-rose-500 dark:text-rose-400 text-sm" />
      </div>
      <div>
        <h2 class="text-[15px] font-black text-slate-900 dark:text-white leading-none">{{ $t('pos.close_shift') }}</h2>
        <p class="text-[11px] text-slate-500 font-medium mt-0.5">
          <i class="pi pi-clock mr-1" />
          {{ formattedDate }}
        </p>
      </div>
    </div>
    <button @click="$emit('close')" class="close-btn"><i class="pi pi-times text-xs" /></button>
  </div>

  <div class="px-5 pb-5 space-y-3">
    <!-- Stats: horizontal compact row -->
    <div class="grid grid-cols-2 gap-2">
      <div class="stat-row">
        <i class="pi pi-wallet text-emerald-500 dark:text-emerald-400 text-sm" />
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ $t('pos.final_cash') }}</p>
          <p class="text-[13px] font-black text-slate-900 dark:text-white">{{ formatCurrency(displayCash) }}</p>
        </div>
      </div>
      <div class="stat-row">
        <i class="pi pi-chart-bar text-violet-500 dark:text-violet-400 text-sm" />
        <div>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ $t('pos.cash_balance') }}</p>
          <p class="text-[13px] font-black text-slate-900 dark:text-white">{{ formatCurrency(displayNetIncome) }}</p>
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
    <div v-if="shift?.status === 'open' && requireCashCount">
      <div class="flex items-center justify-between mb-2">
        <label class="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase">
          {{ $t('pos.counted_cash_in_register') }}
        </label>
        <span class="badge-required">Majburiy</span>
      </div>
      <InputNumber
        :model-value="cashCounted"
        @input="$emit('update:cashCounted', $event.value)"
        class="shift-input w-full"
        :min="0"
        placeholder="0"
        autofocus
        :use-grouping="true"
      />
    </div>

    <!-- No count needed info -->
    <div
      v-else-if="shift?.status === 'open' && !requireCashCount"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/8 text-[12px] font-medium text-slate-600 dark:text-slate-400"
    >
      <i class="pi pi-info-circle text-slate-400 dark:text-slate-500 flex-shrink-0" />
      {{ $t('pos.shift_will_close_without_count') }}
    </div>

    <!-- Discrepancy reason -->
    <div v-if="showReasonInput" class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-[11px] font-black text-rose-500 dark:text-rose-400 tracking-widest uppercase">
          {{ $t('pos.discrepancy_reason') }}
        </label>
        <span class="badge-required">Majburiy</span>
      </div>
      <div
        v-if="displayDiscrepancyError"
        class="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-[12px] font-bold text-rose-700 dark:text-rose-300"
      >
        <i class="pi pi-exclamation-triangle text-rose-500 dark:text-rose-400 flex-shrink-0 mt-px" />
        {{ displayDiscrepancyError }}
      </div>
      <textarea
        :value="discrepancyReason"
        @input="$emit('update:discrepancyReason', $event.target.value)"
        class="reason-textarea"
        rows="2"
        :placeholder="$t('pos.enter_discrepancy_reason')"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-2.5 pt-1">
      <button @click="$emit('close')" class="btn-cancel flex-1">
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
        @click="$emit('submit')"
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

<script setup>
import InputNumber from 'primevue/inputnumber'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()
const formatCurrency = (val) => settingsStore.formatPrice(val)

defineProps({
  shift: Object,
  displayCash: Number,
  displayNetIncome: Number,
  formattedDate: String,
  requireCashCount: Boolean,
  showReasonInput: Boolean,
  displayDiscrepancyError: String,
  diffClass: Object,
  diffMessage: String,
  submitDisabled: Boolean,
  loading: Boolean,
  cashCounted: Number,
  discrepancyReason: String
})

defineEmits([
  'update:cashCounted',
  'update:discrepancyReason',
  'close',
  'download',
  'submit'
])
</script>

<style scoped>
/* ── Close button ────────────────────────────────────────── */
.close-btn {
  width: 30px; height: 30px;
  border-radius: 10px;
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #64748b;
  transition: all .15s;
  flex-shrink: 0;
}
.close-btn:hover { background: rgba(0,0,0,0.08); color: #0f172a; }
.close-btn:active { transform: scale(0.9); }

.dark .close-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: #64748b;
}
.dark .close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* ── Stat rows ───────────────────────────────────────────── */
.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
}
.dark .stat-row {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
}

/* ── Badges ──────────────────────────────────────────────── */
.badge-required {
  font-size: 9px; font-weight: 900;
  color: #ef4444;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.dark .badge-required {
  color: #f87171;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
}

/* ── InputNumber ─────────────────────────────────────────── */
.shift-input :deep(.p-inputnumber-input) {
  width: 100%;
  background: rgba(0,0,0,0.03) !important;
  border: 1px solid rgba(0,0,0,0.08) !important;
  border-radius: 14px !important;
  padding: 12px 16px !important;
  font-size: 18px !important;
  font-weight: 900 !important;
  color: #0f172a !important;
  outline: none !important;
  box-shadow: none !important;
  transition: border-color .2s, background .2s;
}
.shift-input :deep(.p-inputnumber-input:focus) {
  border-color: rgba(16,185,129,0.35) !important;
  background: rgba(0,0,0,0.05) !important;
}
.shift-input :deep(.p-inputnumber-input::placeholder) { color: #94a3b8 !important; font-weight: 700 !important; }

.dark .shift-input :deep(.p-inputnumber-input) {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  color: #fff !important;
}
.dark .shift-input :deep(.p-inputnumber-input:focus) {
  border-color: rgba(16,185,129,0.35) !important;
  background: rgba(255,255,255,0.07) !important;
  color: #fff !important;
}
.dark .shift-input :deep(.p-inputnumber-input::placeholder) { color: #374151 !important; }

/* ── Textarea ────────────────────────────────────────────── */
.reason-textarea {
  width: 100%;
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  resize: none;
  outline: none;
  transition: border-color .2s;
}
.reason-textarea:focus { border-color: rgba(239,68,68,0.4); }
.reason-textarea::placeholder { color: #94a3b8; }

.dark .reason-textarea {
  background: rgba(255,255,255,0.04);
  color: #e2e8f0;
}
.dark .reason-textarea::placeholder { color: #374151; }

/* ── Buttons ─────────────────────────────────────────────── */
.btn-cancel {
  padding: 11px 16px;
  border-radius: 14px;
  font-size: 13px; font-weight: 800;
  color: #64748b;
  background: rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.06);
  transition: all .15s;
}
.btn-cancel:hover { background: rgba(0,0,0,0.06); color: #475569; }
.btn-cancel:active { transform: scale(0.98); }

.dark .btn-cancel {
  color: #94a3b8;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
}
.dark .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #cbd5e1; }

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
</style>
