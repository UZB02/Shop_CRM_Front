<template>
  <div class="group relative bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden backdrop-blur-xl">
    <!-- Decorative background element -->
    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

    <div class="relative flex flex-col gap-5 text-left">
      <!-- Top header -->
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-500">
            <i class="pi pi-box text-xl text-slate-400 group-hover:text-white transition-all duration-500"></i>
          </div>
          <div class="text-left">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
              {{ warehouse.name }}
            </h3>
            <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {{ $t('warehouse.warehouse_name') }}
            </p>
          </div>
        </div>

        <!-- Desktop hover actions / Mobile always visible actions -->
        <div class="flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0">
          <button
            @click="$emit('edit', warehouse)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <i class="pi pi-pencil text-[10px] sm:text-[11px]"></i>
          </button>
          <button
            @click="$emit('delete', warehouse)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <i class="pi pi-trash text-[10px] sm:text-[11px]"></i>
          </button>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-1 gap-4 py-2 border-y border-slate-50 dark:border-slate-800/50">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
            <i class="pi pi-map-marker text-[10px] text-slate-400"></i>
          </div>
          <div class="text-left">
            <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ $t('warehouse.warehouse_address') }}
            </p>
            <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 tracking-tight leading-tight mt-0.5">
              {{ warehouse.address || '—' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer/Action area -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div 
            class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            :class="warehouse.status === 'inactive' ? 'bg-rose-500 shadow-rose-500/30' : 'bg-emerald-500 animate-pulse shadow-emerald-500/30'"
          ></div>
          <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {{ warehouse.status === 'inactive' ? $t('common.inactive') : $t('common.active') }}
          </span>
        </div>
        <button
          @click="$emit('edit', warehouse)"
          class="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-slate-100 dark:border-slate-700 hover:border-emerald-500"
        >
          {{ $t('common.view') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  warehouse: Object
})
defineEmits(['edit', 'delete'])
</script>
