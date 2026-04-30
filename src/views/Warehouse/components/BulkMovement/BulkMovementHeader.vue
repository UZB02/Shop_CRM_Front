<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
    <div class="flex items-center gap-3 sm:gap-4">
      <button 
        @click="$emit('back')"
        class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
      >
        <i class="pi pi-arrow-left text-xs sm:text-sm"></i>
      </button>
      
      <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
      
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight truncate">
            {{ $t('warehouse.bulk.title') }}
          </h1>
          <Tag :value="warehouseName" severity="info" class="!text-[10px] sm:!text-[12px] !font-black !rounded-md !px-2" />
        </div>
        <p class="text-[10px] sm:text-[12px] font-bold text-slate-400 tracking-[0.2em] leading-none mt-0.5">
          {{ $t('warehouse.bulk.subtitle') }}
        </p>
      </div>
    </div>
    
    <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
      <div class="flex flex-col items-start sm:items-end pr-4 sm:border-r border-slate-100 dark:border-slate-800">
        <span class="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1">
          {{ $t('warehouse.bulk.filled') }}
        </span>
        <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 leading-none">{{ validCount }} / {{ totalCount }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="h-9 sm:h-11 px-4 sm:px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] sm:text-[13px] font-black tracking-widest hover:bg-slate-50 transition-all active:scale-95"
        >
          {{ $t('warehouse.bulk.cancel') }}
        </button>
        <button
          @click="$emit('save')"
          :disabled="saving || validCount === 0"
          class="h-9 sm:h-11 px-6 sm:px-8 rounded-xl text-white text-[11px] sm:text-[13px] font-black tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
          :class="type === 'in' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner text-[10px]"></i>
          <i v-else class="pi pi-cloud-upload text-[10px]"></i>
          {{ $t('warehouse.bulk.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tag from 'primevue/tag'

defineProps({
  warehouseName: String,
  validCount: Number,
  totalCount: Number,
  saving: Boolean,
  type: String
})

defineEmits(['back', 'save'])
</script>
