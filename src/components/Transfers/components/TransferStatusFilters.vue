<template>
  <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
    <button
      v-for="s in statusOptions"
      :key="s.id"
      @click="$emit('update:modelValue', s.id)"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
      :class="modelValue === s.id
        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200'"
    >
      {{ s.label }}
      <span
        class="text-xs px-1.5 py-0.5 rounded-full font-semibold"
        :class="modelValue === s.id
          ? 'bg-white/20 dark:bg-black/20 text-inherit'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
      >{{ s.count }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  statusOptions: Array
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
