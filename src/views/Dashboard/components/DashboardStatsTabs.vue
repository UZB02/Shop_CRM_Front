<template>
  <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-1.5 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl shadow-emerald-500/5 rounded-[1.25rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden group/tabs transition-colors duration-300">
    <!-- Subtle Background Glow -->
    <div class="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[80px] pointer-events-none"></div>
    
    <!-- Tabs Container -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 z-10 flex-1">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="$emit('update:modelValue', tab.id)"
        class="relative flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap overflow-hidden"
        :class="modelValue === tab.id 
          ? 'text-white translate-z-0' 
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'"
      >
        <!-- Active Background Gradient -->
        <Transition
          enter-active-class="transition-transform duration-500 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
        >
          <div v-if="modelValue === tab.id" class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 -z-10"></div>
        </Transition>

        <span class="flex items-center justify-center gap-2.5 relative z-10">
          <i :class="[tab.icon, modelValue === tab.id ? 'scale-110' : 'opacity-70']" class="text-[11px] transition-transform"></i>
          {{ tab.label }}
        </span>
      </button>
    </div>

    <!-- Summary Instrumental Panel -->
    <div class="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-white/5 backdrop-blur-md rounded-[1.1rem] border border-slate-100 dark:border-white/5 transition-all z-10 min-w-fit mx-1">
      <div class="flex flex-col items-start md:items-end">
        <span class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {{ $t('finance.net_profit') }}
        </span>
        <span class="text-sm font-black tracking-tighter tabular-nums"
              :class="netProfit >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'">
          {{ formatPrice(netProfit) }}
        </span>
      </div>
      <div class="w-10 h-10 rounded-xl flex items-center justify-center border transition-all shrink-0 shadow-lg shadow-emerald-500/10"
           :class="netProfit >= 0 
             ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
             : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'">
        <i :class="netProfit >= 0 ? 'pi pi-bolt' : 'pi pi-exclamation-triangle'" class="text-xs"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

defineProps({
  modelValue: String,
  tabs: Array,
  netProfit: { type: Number, default: 0 }
})

defineEmits(['update:modelValue'])

const formatPrice = (val) => settingsStore.formatPrice(val)
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
