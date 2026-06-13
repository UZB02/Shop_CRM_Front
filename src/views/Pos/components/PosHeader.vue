<template>
  <header class="bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800/60 px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 sticky top-0 z-50">
    <!-- Search -->
    <div class="flex items-center flex-1 mr-2 sm:mr-4">
      <div class="flex w-full max-w-[320px] lg:max-w-[400px] relative group">
        <i class="pi pi-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-emerald-500 transition-colors text-xs sm:text-sm" />
        <input
          :ref="(el) => emit('search-ref', el)"
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          type="text"
          :placeholder="$t('pos.search_placeholder')"
          @keyup.enter="emit('search-enter')"
          class="w-full bg-[#f4f7fa] dark:bg-slate-950/40 border-none rounded-xl sm:rounded-2xl pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 placeholder:text-slate-300 dark:placeholder:text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-2 sm:gap-4 lg:gap-6">
      <!-- Worker avatar -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-sm flex-shrink-0">
          {{ workerInitial }}
        </div>
        <div class="hidden md:flex flex-col">
          <span class="text-[11px] font-black text-slate-400 tracking-widest leading-none mb-0.5">{{ $t('pos.employee') }}</span>
          <span class="text-xs font-black text-slate-800 dark:text-slate-200">{{ workerName }}</span>
        </div>
      </div>

      <div class="h-5 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />

      <!-- Shift & printer actions -->
      <div class="flex items-center gap-2">
        <slot name="printer" />

        <div class="h-5 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />

        <!-- Shift badge (desktop only) -->
        <div
          v-if="activeShift && isShiftEnabled"
          class="hidden sm:flex px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl items-center gap-2 border border-emerald-100 dark:border-emerald-500/20"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-pulse flex-shrink-0" />
          <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider whitespace-nowrap">
            {{ $t('pos.shift_number') }}{{ activeShift.id }}
          </span>
        </div>

        <!-- Shift button -->
        <button
          v-if="isShiftEnabled"
          @click="emit('shift-action')"
          class="px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-[12px] font-black transition-all shadow-lg active:scale-95 whitespace-nowrap"
          :class="activeShift?.status === 'open'
            ? 'bg-[#151c2f] text-white hover:bg-[#0f1422]'
            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'"
        >
          <span class="hidden sm:inline">{{ shiftBtnLabel }}</span>
          <i class="pi sm:hidden" :class="activeShift?.status === 'open' ? 'pi-times' : 'pi-play'" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  searchQuery:    { type: String, default: '' },
  activeShift:    { type: Object, default: null },
  isShiftEnabled: { type: Boolean, default: false },
  workerName:     { type: String, default: '' },
})

const emit = defineEmits([
  'update:searchQuery',
  'search-enter',
  'search-ref',
  'shift-action',
])

const workerInitial = computed(() => (props.workerName || 'U').charAt(0))

const shiftBtnLabel = computed(() => {
  if (!props.activeShift) return t('pos.open_shift')
  if (props.activeShift.status === 'open') return t('pos.close_shift')
  return t('pos.shift_report')
})
</script>

<style scoped>
.shadow-pulse {
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%   { transform: scale(1);   box-shadow: 0 0 0 0  rgba(16,185,129,0.4); }
  70%  { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(16,185,129,0); }
  100% { transform: scale(1);   box-shadow: 0 0 0 0  rgba(16,185,129,0); }
}
</style>
