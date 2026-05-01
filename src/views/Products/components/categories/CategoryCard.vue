<template>
  <div class="group relative transition-all duration-300">
    <!-- Main Card Body -->
    <div 
      @click="$emit('expand', category.id || category._id)"
      class="relative z-10 flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border bg-white dark:bg-slate-900 shadow-sm"
      :class="[
        isExpanded 
          ? 'border-emerald-500/30' 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        category.status === 'inactive' ? '!bg-rose-50/10 dark:!bg-rose-950/10 !border-rose-200 dark:!border-rose-800/40' : ''
      ]"
    >
      <div class="flex items-center gap-4 min-w-0">
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm"
          :class="[
            category.status === 'inactive'
              ? 'bg-rose-500 text-white shadow-rose-500/20'
              : (isExpanded
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500')
          ]"
        >
          <i class="pi pi-box text-sm"></i>
        </div>
        <div class="min-w-0">
          <h3 
            class="text-[15px] font-semibold tracking-tight transition-colors duration-300 truncate" 
            :class="[
              category.status === 'inactive'
                ? 'text-rose-600 dark:text-rose-400'
                : (isExpanded ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200')
            ]"
          >
            {{ category.name }}
          </h3>
          <p v-if="category.description" class="text-[12px] text-slate-400 mt-0.5 line-clamp-1 truncate">{{ category.description }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Quick Stats -->
        <div class="hidden xs:flex items-center px-1.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
           <span class="text-[11px] font-bold text-slate-400 tracking-widest">{{ subCount }} subs</span>
        </div>

        <div class="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            @click.stop="$emit('edit', category)"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
          >
            <i class="pi pi-pencil text-[12px]"></i>
          </button>
          <button 
            @click.stop="$emit('delete', category)"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
          >
            <i class="pi pi-trash text-[12px]"></i>
          </button>
        </div>
        
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ml-1"
          :class="[isExpanded ? 'rotate-180 text-emerald-500' : 'text-slate-300']"
        >
          <i class="pi pi-chevron-down text-[12px] font-bold"></i>
        </div>
      </div>
    </div>

    <!-- Expanding Content -->
    <div 
      class="grid transition-all duration-300 ease-in-out overflow-hidden"
      :class="[isExpanded ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr] mt-0']"
    >
      <div class="min-h-0">
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


