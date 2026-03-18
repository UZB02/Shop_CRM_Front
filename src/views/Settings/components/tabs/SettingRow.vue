<template>
  <div class="settings-row">
    <div class="flex-1">
      <p class="row-label">{{ label }}</p>
      <p v-if="desc" class="row-desc">{{ desc }}</p>
    </div>
    <button 
      type="button" 
      :disabled="disabled"
      @click="$emit('update:modelValue', !modelValue)" 
      class="toggle-switch flex-shrink-0" 
      :class="[
        modelValue ? 'toggle-on' : 'toggle-off',
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      ]"
    >
      <span class="toggle-knob" :class="modelValue ? 'knob-on' : 'knob-off'"></span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  desc:  { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Toggle switch — only used in this component */
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
