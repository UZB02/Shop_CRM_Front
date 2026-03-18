<template>
  <div class="group relative overflow-hidden transition-all duration-500">
    <div 
      @click="$emit('expand', category.id || category._id)"
      class="relative z-10 flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] cursor-pointer transition-all duration-500 border"
      :class="[
        isExpanded 
          ? 'bg-white dark:bg-slate-900 border-emerald-500/30 shadow-2xl shadow-emerald-500/5' 
          : 'bg-white/40 dark:bg-slate-900/40 border-slate-100/50 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700',
        category.status === 'inactive' ? '!bg-rose-50/50 dark:!bg-rose-950/20 !border-rose-200 dark:!border-rose-800/50' : ''
      ]"
    >
      <div class="flex items-center gap-3 sm:gap-5 min-w-0">
        <div 
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shrink-0"
          :class="[
            category.status === 'inactive'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : (isExpanded
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 dark:group-hover:bg-emerald-500/10')
          ]"
        >
          <i class="pi pi-box text-base sm:text-lg"></i>
        </div>
        <div class="min-w-0 overflow-hidden">
          <h3 
            class="text-[11px] sm:text-[13px] font-black uppercase tracking-tight transition-colors duration-500 truncate" 
            :class="[
              category.status === 'inactive'
                ? 'text-rose-500 dark:text-rose-400'
                : (isExpanded ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200')
            ]"
          >
            {{ category.name }}
          </h3>
          <p v-if="category.description" class="text-[8px] sm:text-[10px] text-slate-400 font-bold mt-0.5 line-clamp-1 opacity-70 truncate">{{ category.description }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Quick Stats -->
        <div class="hidden xs:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50">
           <span class="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ subCount }}</span>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 sm:gap-1.5 ml-1">
          <button 
            @click.stop="$emit('edit', category)"
            class="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20"
          >
            <i class="pi pi-pencil text-[10px] sm:text-xs"></i>
          </button>
          <button 
            @click.stop="$emit('delete', category)"
            class="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <i class="pi pi-trash text-[10px] sm:text-xs"></i>
          </button>
          <div class="w-px h-5 sm:h-6 bg-slate-100 dark:bg-slate-800 mx-0.5 sm:mx-1"></div>
          <div 
            class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500"
            :class="[
              category.status === 'inactive'
                ? (isExpanded ? 'rotate-180 bg-rose-500/20 text-rose-500' : 'text-rose-400')
                : (isExpanded ? 'rotate-180 bg-emerald-500/10 text-emerald-500' : 'text-slate-300')
            ]"
          >
            <i class="pi pi-chevron-down text-[8px] sm:text-[10px] font-black"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Expanding Content -->
    <div 
      class="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="[isExpanded ? 'grid-rows-[1fr] opacity-100 mt-[-1rem]' : 'grid-rows-[0fr] opacity-0']"
    >
      <div class="overflow-hidden">
        <slot name="expanded"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: Object,
  isExpanded: Boolean,
  subCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['expand', 'edit', 'delete'])
</script>
