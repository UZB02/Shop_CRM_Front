<template>
  <div class="p-1.5 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl shadow-emerald-500/5 rounded-[1.25rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
    <!-- Background glow -->
    <div class="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[80px] pointer-events-none"></div>

    <!-- Mobile: tabs scroll + metric stacked -->
    <div class="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between z-10 relative">

      <!-- Tabs: scrollable on mobile, overflow hidden -->
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar p-0.5 flex-1">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="$emit('update:modelValue', tab.id)"
          :class="[
            'relative shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-[12px] font-black tracking-[0.08em] sm:tracking-[0.1em] transition-all duration-300 whitespace-nowrap overflow-hidden',
            modelValue === tab.id
              ? 'text-white'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
          ]"
        >
          <!-- Active gradient background -->
          <Transition enter-active-class="transition-transform duration-400 ease-out" enter-from-class="scale-0 opacity-0" enter-to-class="scale-100 opacity-100">
            <div v-if="modelValue === tab.id" class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20 -z-10 rounded-xl"></div>
          </Transition>
          <i :class="[tab.icon, 'text-[12px] sm:text-[13px] transition-transform', modelValue === tab.id ? 'scale-110' : 'opacity-60']"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Net profit metric: inline on sm+, full width below on xs -->
      <div class="flex items-center justify-between sm:justify-end gap-3 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-[0.9rem] border border-slate-100 dark:border-white/5 mx-0.5 sm:mx-0 sm:shrink-0">
        <div class="flex flex-col">
          <span class="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500">{{ $t('dashboard.metrics.net_profit') }}</span>
          <span class="text-sm font-black tracking-tighter tabular-nums leading-none"
                :class="netProfit >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'">
            {{ formatPrice(netProfit) }}
          </span>
        </div>

        <!-- Optional: sales count badge -->
        <div v-if="salesCount" class="hidden md:flex flex-col items-end border-l border-slate-200 dark:border-slate-700 pl-3">
          <span class="text-[10px] font-black tracking-[0.2em] text-slate-400">{{ $t('dashboard.metrics.sales') }}</span>
          <span class="text-sm font-black tracking-tighter tabular-nums text-slate-800 dark:text-white">{{ salesCount }}</span>
        </div>

        <!-- Smena count badge -->
        <div v-if="settingsStore.isShiftEnabled && smenaCount" class="hidden md:flex flex-col items-end border-l border-slate-200 dark:border-slate-700 pl-3">
          <span class="text-[10px] font-black tracking-[0.2em] text-emerald-500">{{ $t('dashboard.metrics.smena') }}</span>
          <span class="text-sm font-black tracking-tighter tabular-nums text-emerald-500">{{ $t('dashboard.metrics.open_count', { count: smenaCount }) }}</span>
        </div>

        <div class="w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 shadow-md"
             :class="netProfit >= 0
               ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
               : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'">
          <i :class="netProfit >= 0 ? 'pi pi-bolt' : 'pi pi-exclamation-triangle'" class="text-xs"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

defineProps({
  modelValue: String,
  tabs:        Array,
  netProfit:   { type: Number, default: 0 },
  salesCount:  { type: Number, default: 0 },
  smenaCount:  { type: Number, default: 0 },
  vsPrev:      { type: Object, default: null }
})

defineEmits(['update:modelValue'])

const formatPrice = (val) => settingsStore.formatPrice(val)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


