<template>
  <div class="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/60 mt-1">
    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-2">
        <div class="w-1 h-3 bg-emerald-500/50 rounded-full"></div>
        <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-500">{{ $t('subcategories.title') }}</h4>
      </div>
      
      <div class="flex items-center gap-2 flex-1 max-w-[240px]">
        <div class="relative group/subsearch flex-1">
          <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 group-focus-within/subsearch:text-emerald-500 transition-colors"></i>
          <InputText 
            v-model="searchModel" 
            :placeholder="$t('common.search')" 
            class="!h-7 !pl-8 !text-[10px] !font-medium !rounded-lg !bg-white/80 dark:!bg-slate-900/80 !border-slate-200 dark:!border-slate-700/50 focus:!ring-4 focus:!ring-emerald-500/5 transition-all w-full shadow-sm" 
          />
        </div>
        
        <button 
          @click="$emit('add')"
          class="h-7 px-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all whitespace-nowrap uppercase tracking-widest"
        >
          <i class="pi pi-plus text-[8px] mr-1"></i>
          {{ $t('common.add') }}
        </button>
      </div>
    </div>

    <!-- Subcategories Grid/List -->
    <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
      <div 
        v-for="sub in subcategories" 
        :key="sub.id || sub._id"
        class="group/sub relative p-3 rounded-xl transition-all duration-300 border bg-white dark:bg-slate-900"
        :class="[
          sub.status === 'inactive' 
            ? 'border-rose-100 dark:border-rose-800/40 bg-rose-50/5 dark:bg-rose-950/10' 
            : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 shadow-sm'
        ]"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div 
              class="w-1.5 h-1.5 rounded-full shrink-0"
              :class="sub.status === 'inactive' ? 'bg-rose-500' : 'bg-emerald-500'"
            ></div>
            <div class="min-w-0">
              <h5 class="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">{{ sub.name }}</h5>
              <p v-if="sub.description" class="text-[9px] text-slate-400 mt-0.5 truncate">{{ sub.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-all">
            <button @click="$emit('edit', sub)" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
              <i class="pi pi-pencil text-[9px]"></i>
            </button>
            <button @click="$emit('delete', sub)" class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
              <i class="pi pi-trash text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="subcategories.length === 0" 
        class="py-8 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl opacity-40 bg-white/30"
      >
        <i class="pi pi-box text-xl mb-2 text-slate-300"></i>
        <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.slate.200');
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.slate.800');
}
</style>
