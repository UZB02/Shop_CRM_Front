<template>
  <div class="settings-row">
    <div class="flex-1">
      <p class="row-label">{{ label }}</p>
      <p v-if="desc" class="row-desc">{{ desc }}</p>
    </div>
    <!-- Toggle Switch -->
    <button
      type="button"
      @click="$emit('update:modelValue', !modelValue)"
      class="toggle-switch flex-shrink-0"
      :class="modelValue ? 'toggle-on' : 'toggle-off'"
    >
      <span class="toggle-knob" :class="modelValue ? 'knob-on' : 'knob-off'"></span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  desc: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}
.settings-row:last-child { border-bottom: none; }
.dark .settings-row { border-color: #1e293b; }
.settings-row:hover { background: #f8fafc; }
.dark .settings-row:hover { background: rgba(255,255,255,0.02); }

.row-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}
.dark .row-label { color: #e2e8f0; }

.row-desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}
.dark .row-desc { color: #475569; }

/* Toggle */
.toggle-switch {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-on  { background: #10b981; }
.toggle-off { background: #cbd5e1; }
.dark .toggle-off { background: #334155; }

.toggle-knob {
  position: absolute;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
}
.knob-on  { left: 18px; }
.knob-off { left: 2px; }
</style>


