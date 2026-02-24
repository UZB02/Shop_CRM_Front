<template>
  <div class="space-y-2">
    <label v-if="label" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
      {{ label }}
      <span v-if="required" class="text-rose-500"> *</span>
    </label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label:    String,
  required: Boolean,
})
</script>
