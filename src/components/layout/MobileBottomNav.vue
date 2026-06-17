<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 lg:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
    <div class="flex items-center justify-around h-[68px] px-2">
      <!-- Dynamic menu items -->
      <router-link 
        v-for="item in displayItems" 
        :key="item.key" 
        :to="item.to" 
        class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform" 
        active-class="text-emerald-500 dark:text-emerald-400 font-bold"
      >
        <i :class="[item.icon, 'text-[22px] mb-1']"></i>
        <span class="text-[10px] truncate max-w-[64px] text-center">{{ item.label }}</span>
      </router-link>

      <!-- Menyu (always shown) -->
      <button 
        @click="$emit('open-menu')" 
        class="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
      >
        <i class="pi pi-bars text-[22px] mb-1"></i>
        <span class="text-[10px]">Menyu</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filteredMenu: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-menu'])

// Display the first 4 items from the filtered menu
const displayItems = computed(() => {
  return (props.filteredMenu || []).slice(0, 4)
})
</script>
