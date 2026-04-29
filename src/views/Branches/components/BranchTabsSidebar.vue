<template>
  <!-- ── MOBILE: horizontal scrollable chips ── -->
  <div class="lg:hidden shrink-0 -mx-4 px-4 overflow-x-auto no-scrollbar pb-1">
    <div class="flex items-center gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('select', tab.id)"
        class="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap border"
        :class="active === tab.id
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'
          : 'bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800' "
      >
        <i :class="[tab.icon, 'text-[10px]']"></i>
        <span>{{ tab.label }}</span>
        <span v-if="tab.count !== undefined" class="text-[9px] opacity-70">({{ tab.count }})</span>
      </button>
    </div>
  </div>

  <!-- ── DESKTOP: vertical sidebar ── -->
  <div class="hidden lg:flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-col sticky top-24 max-h-[calc(100vh-120px)]">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 text-xs font-semibold text-slate-400 tracking-widest ">
      {{ $t('common.actions') }}
    </div>

    <!-- Tab List -->
    <div class="p-2 space-y-0.5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('select', tab.id)"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
        :class="active === tab.id
          ? 'bg-emerald-500 text-white'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'"
      >
        <div class="flex items-center gap-2.5">
          <i :class="[tab.icon, 'text-xs']"></i>
          <span class="font-medium text-xs">{{ tab.label }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span v-if="tab.count !== undefined" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md" :class="active === tab.id ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'">
            {{ tab.count }}
          </span>
          <i v-if="active === tab.id" class="pi pi-chevron-right text-[8px]"></i>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: Array,
  active: String
})
defineEmits(['select'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
