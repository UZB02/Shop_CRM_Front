<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <div v-for="branch in branches" :key="branch.id" 
         class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 relative overflow-hidden">
      <div class="flex items-start justify-between mb-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
          <i class="pi pi-sitemap text-xl"></i>
        </div>
      </div>
      <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">{{ branch.name }}</h4>
      <div class="space-y-2">
        <p class="text-[10px] font-bold text-slate-400 flex items-center gap-2">
          <i class="pi pi-map-marker text-[9px]"></i> {{ branch.address }}
        </p>
        <p class="text-[10px] font-bold text-slate-400 flex items-center gap-2">
          <i class="pi pi-phone text-[9px]"></i> {{ branch.phone }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  branches: {
    type: Array,
    default: () => []
  }
})
</script>
