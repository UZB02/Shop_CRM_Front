<template>
  <div class="flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl w-fit mb-2 overflow-x-auto no-scrollbar max-w-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="$emit('update:modelValue', tab.id)"
      class="px-4 h-9 rounded-xl text-[10px] font-black tracking-widest transition-all duration-500 flex items-center gap-2 whitespace-nowrap relative group overflow-hidden"
      :class="modelValue === tab.id 
        ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' 
        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'"
    >
      <div v-if="modelValue === tab.id" class="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none"></div>
      <i :class="[tab.icon, modelValue === tab.id ? 'scale-110' : '']" class="text-[11px] transition-transform duration-500"></i>
      <span class="relative z-10">{{ tab.label }}</span>
      
      <!-- Bottom highlight for active tab -->
      <div 
        v-if="modelValue === tab.id" 
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-500 rounded-full"
      ></div>
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
