<template>
  <div class="flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl w-fit mb-2 overflow-x-auto no-scrollbar max-w-full">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="$emit('update:modelValue', tab.id)"
      class="px-4 h-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
      :class="modelValue === tab.id 
        ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm' 
        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'"
    >
      <i :class="tab.icon" class="text-[10px]"></i>
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  tabs: Array
})
defineEmits(['update:modelValue'])
</script>
