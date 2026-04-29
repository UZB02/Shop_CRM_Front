<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none p-4 sm:p-5 relative overflow-hidden group">
    <!-- Backdrop Glow -->
    <div class="absolute -top-24 -right-24 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>
    
    <div class="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      <!-- Icon -->
      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 transform transition-transform group-hover:scale-105">
        <i class="pi pi-building text-white text-xl sm:text-2xl font-black"></i>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 pr-10 sm:pr-0">
        <div class="flex flex-wrap items-center gap-2 mb-1 sm:mb-1.5">
          <h2 class="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate">
             {{ store?.name || '...' }}
          </h2>
          <span 
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-widest border"
            :class="store?.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="store?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></span>
            {{ store?.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
          </span>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <i class="pi pi-map-marker text-emerald-500 text-[10px]"></i>
            <span class="truncate">{{ store?.address || '...' }}</span>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <i class="pi pi-phone text-emerald-500 text-[10px]"></i>
            <span>{{ store?.phone || '...' }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="absolute sm:static top-0 right-0 sm:pt-0">
        <button
          @click="$emit('edit')"
          class="w-9 h-9 sm:w-auto sm:px-4 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500 sm:hover:bg-slate-100 dark:sm:hover:bg-slate-700 hover:text-white sm:hover:text-emerald-500 text-slate-400 dark:text-slate-500 sm:text-slate-600 dark:sm:text-slate-300 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black tracking-widest transition-all border border-slate-100 dark:border-slate-800 sm:hover:border-emerald-500/30"
        >
          <i class="pi pi-pencil text-[11px] sm:text-[10px]"></i>
          <span class="hidden sm:inline">{{ $t('common.edit') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  store: {
    type: Object,
    default: () => ({})
  }
})
defineEmits(['edit'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
