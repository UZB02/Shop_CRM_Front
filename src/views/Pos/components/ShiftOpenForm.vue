<template>
  <!-- Header -->
  <div class="flex items-center justify-between px-5 pt-5 pb-4">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/10 dark:border-emerald-500/20 flex items-center justify-center">
        <i class="pi pi-play text-emerald-500 dark:text-emerald-400 text-sm" />
      </div>
      <div>
        <h2 class="text-[15px] font-black text-slate-900 dark:text-white leading-none">{{ $t('pos.open_new_shift') }}</h2>
        <p class="text-[11px] text-slate-500 font-medium mt-0.5">{{ $t('pos.prepare_cash_register') }}</p>
      </div>
    </div>
    <button @click="$emit('close')" class="close-btn"><i class="pi pi-times text-xs" /></button>
  </div>

  <div class="px-5 pb-5 space-y-3">
    <!-- Branch -->
    <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/8 border border-emerald-500/10 dark:border-emerald-500/12">
      <i class="pi pi-map-marker text-emerald-500 dark:text-emerald-400 text-sm flex-shrink-0" />
      <span class="text-[13px] font-bold text-emerald-600 dark:text-emerald-300 truncate">
        {{ branchName || $t('pos.unselected') }}
      </span>
    </div>

    <!-- Cash start -->
    <div>
      <label class="block text-[11px] font-black text-slate-500 tracking-widest uppercase mb-2">
        {{ $t('pos.starting_cash') }}
      </label>
      <InputNumber
        :model-value="modelValue"
        @input="$emit('update:modelValue', $event.value)"
        class="shift-input w-full"
        :min="0"
        placeholder="0"
        autofocus
        :use-grouping="true"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-2.5 pt-1">
      <button @click="$emit('close')" class="btn-cancel flex-1">{{ 'Bekor qilish' }}</button>
      <button
        @click="$emit('submit')"
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

<script setup>
import InputNumber from 'primevue/inputnumber'

defineProps({
  branchName: String,
  loading: Boolean,
  hasBranchId: Boolean,
  modelValue: Number
})

defineEmits(['update:modelValue', 'close', 'submit'])
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
}
.dark .shift-input :deep(.p-inputnumber-input::placeholder) { color: #374151 !important; }

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
