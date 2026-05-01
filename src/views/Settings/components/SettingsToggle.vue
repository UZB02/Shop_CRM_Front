<template>
  <button
    type="button"
    @click="toggle"
    class="flex items-start gap-3 text-left w-full group p-3 rounded-xl border transition-all duration-200 cursor-pointer"
    :class="modelValue
      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'"
  >
    <!-- Icon -->
    <div
      class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
      :class="modelValue ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'"
    >
      <i :class="['pi', icon, 'text-xs']"></i>
    </div>

    <!-- Label -->
    <div class="flex-1 min-w-0">
      <p class="text-xs font-black text-slate-800 dark:text-slate-200 leading-snug">{{ label }}</p>
      <p v-if="desc" class="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">{{ desc }}</p>
    </div>

    <!-- Toggle switch -->
    <div
      class="w-9 h-5 rounded-full flex-shrink-0 mt-1 transition-colors duration-200 relative"
      :class="modelValue ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'"
    >
      <span
        class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        :class="modelValue ? 'left-4' : 'left-0.5'"
      ></span>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  desc: { type: String, default: '' },
  icon: { type: String, default: 'pi-check' }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => emit('update:modelValue', !props.modelValue)
</script>


