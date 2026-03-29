<template>
  <div class="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto no-scrollbar pb-6">
    
    <!-- Type Selection -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{{ $t('warehouse.bulk.type') }}</h4>
      <div class="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
        <button 
          @click="$emit('update:type', 'in')"
          class="flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          :class="type === 'in' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 hover:text-slate-600'"
        >
          <i class="pi pi-download"></i>
          {{ $t('warehouse.bulk.in') }}
        </button>
        <button 
          @click="$emit('update:type', 'out')"
          class="flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          :class="type === 'out' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 hover:text-slate-600'"
        >
          <i class="pi pi-upload"></i>
          {{ $t('warehouse.bulk.out') }}
        </button>
      </div>
    </div>

    <!-- Note Section -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{{ $t('warehouse.bulk.notes') }}</h4>
      <Textarea 
        :modelValue="note"
        @update:modelValue="$emit('update:note', $event)"
        rows="5" 
        :placeholder="$t('warehouse.bulk.notes_ph')"
        class="w-full !rounded-xl !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !p-4 font-semibold text-[13px] outline-none focus:!border-blue-500 shadow-inner transition-all resize-none"
      />
    </div>

    <!-- Progress/Help Card -->
    <div class="bg-indigo-600 dark:bg-indigo-900/50 p-6 rounded-2xl border border-indigo-700 dark:border-indigo-800/50 shadow-xl shadow-indigo-600/10 text-white space-y-4">
      <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <i class="pi pi-info-circle text-white"></i>
      </div>
      <p class="text-[11px] font-bold leading-relaxed opacity-80 uppercase tracking-wide">
        {{ $t('warehouse.bulk.fifo_tip') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import Textarea from 'primevue/textarea'

defineProps({
  type: String,
  note: String
})

defineEmits(['update:type', 'update:note'])
</script>
