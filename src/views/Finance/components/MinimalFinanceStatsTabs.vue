<template>
  <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Tabs -->
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 flex-1">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="$emit('update:modelValue', tab.id)"
        class="flex-1 md:flex-none px-4 py-2 md:py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
        :class="modelValue === tab.id 
          ? 'bg-emerald-500 text-white' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        <span class="flex items-center justify-center gap-2">
          <i :class="tab.icon" class="text-[12px]"></i>
          {{ tab.label }}
        </span>
      </button>
    </div>

    <!-- Summary Badge (e.g. Net Profit) -->
    <div v-if="showSummary" class="flex items-center justify-between md:justify-end gap-3 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 transition-all min-w-fit">
      <div class="flex flex-col items-start md:items-end">
        <span class="text-[11px] font-bold tracking-widest text-slate-400">
          {{ $t('finance.net_profit') }}
        </span>
        <span class="text-xs font-semibold tracking-tight"
              :class="netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'">
          {{ formatPrice(netProfit) }}
        </span>
      </div>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0"
           :class="netProfit >= 0 
             ? 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' 
             : 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'">
        <i :class="netProfit >= 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'" class="text-[12px]"></i>
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
  netProfit: { type: Number, default: 0 },
  showSummary: { type: Boolean, default: true }
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


