<template>
  <!-- ── MOBILE: horizontal scrollable chips ── -->
  <div class="lg:hidden">
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        @click="selectBranch(null)"
        class="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap border"
        :class="!selectedId
          ? 'bg-emerald-500 text-white border-emerald-500'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
      >
        <i class="pi pi-home text-[12px]"></i>
        {{ $t('common.all') }}
        <span
          class="px-1.5 py-0.5 rounded-full text-[12px] font-semibold"
          :class="!selectedId ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
        >{{ totalWorkers }}</span>
      </button>

      <button
        v-for="branch in branches"
        :key="branch.id"
        @click="selectBranch(branch)"
        class="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap border"
        :class="isSelected(branch)
          ? 'bg-emerald-500 text-white border-emerald-500'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
      >
        {{ branch.name }}
      </button>
    </div>
  </div>

  <!-- ── DESKTOP: vertical sidebar ── -->
  <div class="hidden lg:flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-col sticky top-24 max-h-[calc(100vh-120px)]">

    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ $t('branches.title') }}</span>
        <span
          v-if="branches.length"
          class="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        >{{ branches.length }}</span>
      </div>
    </div>

    <!-- Search -->
    <div class="px-3 py-2.5 shrink-0 border-b border-slate-50 dark:border-slate-800/60">
      <div class="relative">
        <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-slate-400"></i>
        <input
          v-model="branchSearch"
          type="text"
          :placeholder="$t('common.search') + '...'"
          class="w-full h-7 pl-7 pr-3 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto no-scrollbar p-2 space-y-0.5">

      <button
        v-if="!branchSearch"
        @click="selectBranch(null)"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
        :class="!selectedId
          ? 'bg-emerald-500 text-white'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
      >
        <div class="flex items-center gap-2.5">
          <i class="pi pi-home text-xs"></i>
          <span class="font-medium text-xs">{{ $t('common.all') }}</span>
        </div>
        <span
          class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
          :class="!selectedId ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
        >{{ totalWorkers }}</span>
      </button>

      <div
        v-for="branch in filteredBranches"
        :key="branch.id"
        class="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm"
        :class="isSelected(branch)
          ? 'bg-emerald-500 text-white'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
        @click="selectBranch(branch)"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            class="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 transition-all"
            :class="isSelected(branch) ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600'"
          >{{ branch.name?.substring(0, 2).toUpperCase() }}</div>
          <span class="text-xs font-medium truncate">{{ branch.name }}</span>
        </div>
      </div>

      <div v-if="!filteredBranches.length" class="py-10 text-center">
        <i class="pi pi-home text-slate-300 dark:text-slate-600 text-xl mb-2 block"></i>
        <p class="text-xs text-slate-400">{{ $t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  branches: { type: Array, default: () => [] },
  selectedId: [String, Number, null],
  totalWorkers: Number
})

const emit = defineEmits(['select'])
const branchSearch = ref('')

const filteredBranches = computed(() => {
  const list = Array.isArray(props.branches) ? props.branches : []
  if (!branchSearch.value) return list
  const q = branchSearch.value.toLowerCase()
  return list.filter(b => b.name?.toLowerCase().includes(q))
})

const isSelected = (branch) => {
  if (!branch || props.selectedId == null) return false
  return (branch.id || branch._id).toString() === props.selectedId.toString()
}

const selectBranch = (branch) => emit('select', branch ? (branch.id || branch._id) : null)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


