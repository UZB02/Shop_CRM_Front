<template>
  <div class="pt-[2rem] sm:pt-[2.5rem] pb-4 sm:pb-6 px-4 sm:px-6 rounded-b-[2rem] sm:rounded-b-[2.5rem] border-x border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/10 backdrop-blur-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 px-1 sm:px-2">
      <!-- Mobile Row 1 / Header Part -->
      <div class="flex items-center justify-between w-full sm:w-auto">
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="w-1.5 h-3 sm:w-2 sm:h-4 bg-emerald-500/40 rounded-full"></div>
          <h4 class="text-[10px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 whitespace-nowrap">{{ $t('subcategories.title') }}</h4>
        </div>
        
        <!-- Add Button (Mobile Only) -->
        <div class="sm:hidden">
          <Button 
            icon="pi pi-plus" 
            text
            class="!text-[9px] !font-black !uppercase !tracking-widest !py-2 !px-3 !rounded-xl !text-emerald-600 hover:!bg-emerald-500/10 shrink-0 border border-emerald-500/10"
            :label="$t('common.add')"
            @click="$emit('add')"
          />
        </div>
      </div>
      
      <!-- Search & Desktop Add Button -->
      <div class="flex items-center gap-2 w-full sm:w-auto min-w-0">
        <div class="relative group/subsearch flex-1 sm:w-[200px] sm:flex-initial">
          <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-slate-400 group-focus-within/subsearch:text-emerald-500 transition-colors"></i>
          <InputText 
            v-model="searchModel" 
            :placeholder="$t('common.search')" 
            class="!pl-8 !py-2 sm:!py-1.5 !text-[9px] sm:!text-[10px] !font-bold !rounded-xl !bg-white/50 dark:!bg-slate-900/50 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-4 focus:!ring-emerald-500/5 transition-all w-full" 
          />
        </div>
        
        <!-- Add Button Container (Desktop Only) -->
        <div class="hidden sm:block">
          <Button 
            icon="pi pi-plus" 
            text
            class="!text-[9px] sm:!text-[10px] !font-black !uppercase !tracking-widest sm:!py-1.5 !px-4 !rounded-xl !text-emerald-600 hover:!bg-emerald-500/10 shrink-0"
            :label="$t('common.add')"
            @click="$emit('add')"
          />
        </div>
      </div>
    </div>

    <!-- Subcategories List -->
    <div class="grid grid-cols-1 gap-2 sm:gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar overscroll-contain">
      <div 
        v-for="sub in subcategories" 
        :key="sub.id || sub._id"
        class="group/sub relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
      >
        <div class="flex items-center justify-between transition-all gap-4">
          <div class="overflow-hidden flex-1 flex items-center gap-4">
            <div class="w-2 h-2 rounded-full bg-emerald-500/20 group-hover/sub:bg-emerald-500 transition-colors shrink-0"></div>
            <div class="overflow-hidden">
              <h5 class="text-[10px] sm:text-[12px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">{{ sub.name }}</h5>
              <p v-if="sub.description" class="text-[8px] sm:text-[9px] text-slate-400 font-bold mt-0.5 line-clamp-1 opacity-70 truncate">{{ sub.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 sm:gap-1.5 opacity-0 group-hover/sub:opacity-100 transition-all translate-x-2 group-hover/sub:translate-x-0 shrink-0">
            <button @click="$emit('edit', sub)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
              <i class="pi pi-pencil text-[9px] sm:text-[10px]"></i>
            </button>
            <button @click="$emit('delete', sub)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
              <i class="pi pi-trash text-[9px] sm:text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="subcategories.length === 0" 
        class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-3xl opacity-30"
      >
        <i class="pi pi-box text-3xl mb-3"></i>
        <p class="text-[10px] font-black uppercase tracking-widest">{{ $t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps({
  subcategories: Array,
  searchQuery: String
})

const emit = defineEmits(['update:searchQuery', 'add', 'edit', 'delete'])

const searchModel = computed({
  get: () => props.searchQuery,
  set: (val) => emit('update:searchQuery', val)
})
</script>

<style scoped>
@reference "../../../../assets/styles/main.css";

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full;
}
</style>
