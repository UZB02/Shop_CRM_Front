<template>
  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-8 relative overflow-hidden group">
    <!-- Backdrop Glow -->
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
    
    <div class="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <!-- Icon -->
      <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 transform transition-transform group-hover:scale-105">
        <i class="pi pi-building text-white text-2xl sm:text-3xl font-black"></i>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0 pr-10 sm:pr-0">
        <div class="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
          <h2 class="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none truncate">
            {{ store?.name || '...' }}
          </h2>
          <span 
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
            :class="store?.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="store?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></span>
            {{ store?.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
          </span>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker text-emerald-500 text-[10px]"></i>
            <span class="truncate">{{ store?.address || '...' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-phone text-emerald-500 text-[10px]"></i>
            <span>{{ store?.phone || '...' }}</span>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="absolute sm:static top-0 right-0 sm:pt-0">
        <button
          @click="$emit('edit')"
          class="w-10 h-10 sm:w-auto sm:px-5 sm:py-3 rounded-2xl sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500 sm:hover:bg-slate-100 dark:sm:hover:bg-slate-700 hover:text-white sm:hover:text-emerald-500 text-slate-400 dark:text-slate-500 sm:text-slate-600 dark:sm:text-slate-300 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 dark:border-slate-800 sm:hover:border-emerald-500/30"
        >
          <i class="pi pi-pencil text-[12px] sm:text-[10px]"></i>
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
