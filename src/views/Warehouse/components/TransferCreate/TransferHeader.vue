<template>
  <div class="flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-10 py-3 sm:py-3.5 border-b border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-[#0f172a] shrink-0">
    <!-- Left: Title & Navigation -->
    <div class="flex items-center gap-3 sm:gap-5 min-w-0">
      <button
        @click="$emit('back')"
        class="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 border border-slate-100 dark:border-slate-800 transition-all shadow-sm shrink-0 active:scale-90"
      >
        <i class="pi pi-arrow-left text-[12px]"></i>
      </button>
      
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-2 mb-0.5 overflow-hidden">
          <span class="text-[9px] sm:text-[11px] font-black text-slate-400 tracking-[0.1em] sm:tracking-[0.15em] uppercase truncate opacity-70">{{ sourceName }}</span>
          <i class="pi pi-chevron-right text-[8px] text-slate-300 shrink-0"></i>
          <span class="text-[9px] sm:text-[11px] font-black text-emerald-500 tracking-[0.1em] sm:tracking-[0.15em] uppercase whitespace-nowrap">{{ $t('warehouse.transfer.create') }}</span>
        </div>
        <h1 class="text-[14px] sm:text-[17px] font-black text-slate-800 dark:text-white font-outfit tracking-tight truncate uppercase leading-tight">
          {{ $t('warehouse.transfer.new_transfer_title') || $t('warehouse.detail.new_transfer') }}
        </h1>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 sm:gap-4 shrink-0">
      <button
        @click="$emit('back')"
        class="hidden sm:block h-9 px-4 rounded-xl text-[12px] font-black tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all uppercase"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="$emit('submit')"
        :disabled="loading || !isValid"
        class="h-9 sm:h-10 px-4 sm:px-8 rounded-xl text-[10px] sm:text-[12px] font-black tracking-[0.1em] sm:tracking-[0.15em] bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/15 active:scale-95 uppercase"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner text-[12px]"></i>
        <i v-else class="pi pi-send text-[10px] sm:text-[11px]"></i>
        <span class="hidden xs:block">{{ $t('warehouse.transfer.send') }}</span>
        <span class="xs:hidden"><i class="pi pi-check"></i></span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sourceName: String,
  loading: Boolean,
  isValid: Boolean
});

defineEmits(['back', 'submit']);
</script>
