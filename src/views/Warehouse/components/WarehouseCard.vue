<template>
  <div class="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 overflow-hidden font-inter text-left">
    <div class="relative flex flex-col gap-4">
      <!-- Card Header -->
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-6">
            <i class="pi pi-box text-base"></i>
          </div>
          <div>
            <h3 class="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
              {{ warehouse.name }}
            </h3>
            <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
              {{ $t('warehouse.warehouse_name') }}
            </p>
          </div>
        </div>

        <!-- Hover Actions -->
        <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            @click="$emit('edit', warehouse)"
            class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <i class="pi pi-pencil text-[10px]"></i>
          </button>
          <button
            @click="$emit('delete', warehouse)"
            class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <i class="pi pi-trash text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- Content Info -->
      <div class="flex items-center gap-3 py-3 border-y border-slate-50 dark:border-slate-800/50">
        <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
          <i class="pi pi-map-marker text-[10px] text-slate-400"></i>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
            {{ warehouse.address || '—' }}
          </p>
          <p class="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5">
            {{ $t('warehouse.warehouse_address') }}
          </p>
        </div>
      </div>

      <!-- Footer Area -->
      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-2">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="warehouse.status === 'inactive' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'"
          ></div>
          <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {{ warehouse.status === 'inactive' ? $t('common.inactive') : $t('common.active') }}
          </span>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('move', warehouse)"
            class="h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/10 flex items-center gap-1.5"
          >
            <i class="pi pi-sync text-[10px]"></i>
            {{ $t('warehouse.bulk.title') }}
          </button>
          <button
            @click="$router.push(`/dashboard/warehouse/${warehouse.id || warehouse._id}`)"
            class="h-8 px-3 rounded-lg bg-slate-900 dark:bg-slate-800 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <i class="pi pi-arrow-right text-[10px]"></i>
            {{ $t('common.view') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  warehouse: Object
})
defineEmits(['edit', 'delete', 'move'])
</script>

<style scoped>
</style>
