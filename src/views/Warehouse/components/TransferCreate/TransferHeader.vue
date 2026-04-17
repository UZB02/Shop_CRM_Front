<template>
  <div class="flex items-center justify-between gap-4 px-1 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
    <div class="flex items-center gap-3">
      <button
        @click="$emit('back')"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <i class="pi pi-arrow-left text-sm"></i>
      </button>
      <div>
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
          <span class="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" @click="$emit('back')">{{ $t('warehouse.detail.transfers') }}</span>
          <i class="pi pi-chevron-right text-[9px]"></i>
          <span class="text-slate-600 dark:text-slate-300">{{ $t('warehouse.transfer.create') }}</span>
        </div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">
          {{ sourceName || '...' }} → {{ $t('warehouse.transfer.create') }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="$emit('back')"
        class="h-8 px-4 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
      >
        {{ $t('common.cancel') }}
      </button>
      <button
        @click="$emit('submit')"
        :disabled="loading || !isValid"
        class="h-8 px-4 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
        <i v-else class="pi pi-send text-xs"></i>
        {{ $t('warehouse.transfer.send') }}
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
