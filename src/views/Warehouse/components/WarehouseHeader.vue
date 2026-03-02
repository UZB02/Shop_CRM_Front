<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
    <div class="text-left">
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
        {{ $t('warehouse.page_title') }}
      </h1>
      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1 text-left">
        {{ $t('warehouse.page_subtitle') }}
      </p>
    </div>
    <button
      @click="$emit('add')"
      class="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 py-4 sm:py-3.5 rounded-[1.25rem] bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xl shadow-emerald-500/20 active:scale-95 border-b-4 border-emerald-700 hover:border-emerald-700 active:border-b-0"
    >
      <div class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
        <i class="pi pi-plus text-[10px] font-bold"></i>
      </div>
      <span class="text-[11px] font-black uppercase tracking-widest">{{ $t('warehouse.new_warehouse') }}</span>
    </button>
  </div>
</template>

<script setup>
defineEmits(['add'])
</script>
