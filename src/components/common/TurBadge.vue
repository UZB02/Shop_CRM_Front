<template>
  <div v-if="turName" class="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md">
    <span class="text-[10px] font-black text-slate-700 dark:text-slate-200 tracking-tight">{{ turName }}</span>
    
    <template v-if="turColor && turColor !== 'null' && turColor !== 'none' && turColor !== '#000000'">
      <div class="w-px h-2.5 bg-slate-300 dark:bg-slate-600"></div>
      <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 capitalize">{{ turColor }}</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  turName: {
    type: String,
    default: ''
  },
  turColor: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.inline-flex {
  user-select: none;
  cursor: default;
}
</style>
