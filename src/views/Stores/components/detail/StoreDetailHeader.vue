<template>
  <div class="relative bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-4 sm:p-6 overflow-hidden shadow-sm transition-all duration-300">
    <!-- Subtle Background Element -->
    <div class="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none"></div>
    
    <div class="relative flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
      <div class="flex flex-row items-center gap-4 w-full md:w-auto">
        <!-- Compact Icon for Mobile and Large for Desktop -->
        <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 transform transition-transform hover:scale-105">
          <i class="pi pi-building text-white text-2xl sm:text-3xl font-black"></i>
        </div>
        
        <div class="min-w-0 flex-1">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2 text-left">
            <h1 class="text-base sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate leading-tight">
              {{ store?.name }}
            </h1>
            <div 
              class="w-fit px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/10"
              :class="store?.status === 'active' ? 'bg-emerald-500/5 text-emerald-500' : 'bg-rose-500/5 text-rose-500'"
            >
              <span class="w-1 h-1 rounded-full" :class="store?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></span>
              {{ store?.status === 'active' ? 'FAOL' : 'NOFAOL' }}
            </div>
          </div>
          
          <!-- Contact Info: Hidden some detail on smallest screens -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
            <div v-if="store?.address" class="flex items-center gap-1.5 group">
              <i class="pi pi-map-marker text-emerald-500 text-[9px]"></i>
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
                {{ store.address }}
              </span>
            </div>
            <div v-if="store?.phone" class="flex items-center gap-1.5">
              <i class="pi pi-phone text-emerald-500 text-[9px]"></i>
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {{ store.phone }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Quick Stats Grid: Row on mobile -->
      <div class="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-slate-800/50 justify-center sm:justify-end">
        <div class="flex-1 sm:flex-none p-3 sm:min-w-[100px] rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center sm:flex-col justify-center gap-2 sm:gap-1 text-center group">
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors shrink-0">Filiallar</span>
          <span class="text-sm sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-none">{{ store?.branches?.length || 0 }}</span>
        </div>
        
        <div class="flex-1 sm:flex-none p-3 sm:min-w-[100px] rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center sm:flex-col justify-center gap-2 sm:gap-1 text-center group">
          <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors shrink-0">Xodimlar</span>
          <span class="text-sm sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-none">{{ store?.workers?.length || 0 }}</span>
        </div>
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
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
