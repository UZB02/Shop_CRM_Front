<template>
  <div class="space-y-1.5 focus-within:z-10 relative">
    <label v-if="label" class="flex items-end min-h-[32px] text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 pb-1 leading-tight">
      <span>
        {{ label }}
        <span v-if="required" class="text-rose-500 ml-0.5">*</span>
      </span>
    </label>
    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label:    { type: String,   default: '' },
  required: { type: Boolean,  default: false },
})
</script>
