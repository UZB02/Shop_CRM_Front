<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden sticky top-24 shadow-sm flex flex-col max-h-[calc(100vh-120px)]">
    <!-- Header -->
    <div class="p-3.5 sm:p-5 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5 sm:gap-3">
        <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <i class="pi pi-th-large text-emerald-500 text-xs sm:text-sm"></i>
        </div>
        <span class="font-bold sm:font-extrabold text-[13px] sm:text-base text-slate-800 dark:text-white tracking-tight">{{ $t('categories.title') }}</span>
      </div>
      <Button 
        icon="pi pi-plus" 
        rounded 
        size="small" 
        @click="$emit('add')" 
        class="!h-7 !w-7 sm:!h-8 sm:!w-8 !bg-emerald-500/10 !text-emerald-500 !border-none hover:!bg-emerald-500 hover:!text-white transition-all scale-90 sm:scale-100"
        v-tooltip.top="$t('products.new_category')"
      />
    </div>

    <!-- Category Search -->
    <div class="px-3 sm:px-4 py-2 sm:py-3 shrink-0">
      <div class="relative group">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] group-focus-within:text-emerald-500 transition-colors"></i>
        <input 
          v-model="catSearch"
          type="text" 
          :placeholder="$t('categories.search_ph')"
          class="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg sm:rounded-xl py-1.5 sm:py-2 pl-8 sm:pl-9 pr-4 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
        />
      </div>
    </div>
    
    <!-- List Area -->
    <div class="p-2 sm:p-3 pt-0 space-y-1 shrink-0">
      <!-- All Categories Option -->
      <div 
        v-if="!catSearch"
        class="group flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300"
        :class="[!selectedId ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400']"
        @click="selectCategory(null)"
      >
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div 
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors"
            :class="[!selectedId ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']"
          >
            <i class="pi pi-columns text-[10px] sm:text-xs"></i>
          </div>
          <span class="text-xs sm:text-sm font-bold tracking-tight">{{ $t('categories.all') }}</span>
        </div>
        <Badge v-if="totalProducts" :value="totalProducts" :severity="!selectedId ? 'info' : 'secondary'" class="!rounded-lg !text-[9px] !px-1.5 !min-w-[1.25rem] !h-5" />
      </div>

      <div v-if="!catSearch" class="h-px bg-slate-50 dark:bg-slate-800/50 my-1 sm:my-2 mx-4"></div>
    </div>

    <!-- Scrollable Category List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-3 pt-0 space-y-1 max-h-[320px]">
      <!-- Category Items -->
      <div v-for="cat in filteredCategories" :key="cat._id || cat.id" 
        class="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-300"
        :class="[isSelected(cat) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400']"
        @click="selectCategory(cat)"
      >
        <div class="flex items-center gap-2.5 sm:gap-3 overflow-hidden flex-1">
          <div 
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors shrink-0"
            :class="[isSelected(cat) ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']"
          >
            <span class="text-[9px] sm:text-[10px] font-black uppercase">{{ cat.name?.substring(0, 2) || '' }}</span>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-xs sm:text-sm font-bold tracking-tight truncate">{{ cat.name }}</span>
            <span v-if="cat.description" class="text-[10px] opacity-60 truncate font-medium">{{ cat.description }}</span>
          </div>
        </div>

        <!-- Category Badge or Actions -->
        <div class="flex items-center gap-2">
          <Badge v-if="cat.product_count !== undefined" :value="cat.product_count" :severity="isSelected(cat) ? 'info' : 'secondary'" class="!rounded-lg group-hover:hidden" />
          
          <div class="hidden group-hover:flex gap-1 animate-in fade-in zoom-in duration-200">
            <Button icon="pi pi-pencil" text rounded size="small" class="h-7 w-7 !p-0 !text-inherit" @click.stop="$emit('edit', cat)" />
            <Button icon="pi pi-trash" text rounded size="small" class="h-7 w-7 !p-0 !text-inherit hover:!bg-rose-500/20" @click.stop="$emit('delete', cat)" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredCategories.length" class="p-10 text-center space-y-3">
        <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-folder-open text-slate-300 text-2xl"></i>
        </div>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ catSearch ? $t('common.no_results') || 'Hech nima topilmadi' : $t('workers.no_data_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const props = defineProps({
  categories: Array,
  selectedId: [String, Number],
  totalProducts: Number
})

const emit = defineEmits(['select', 'add', 'edit', 'delete'])

const catSearch = ref('')

const filteredCategories = computed(() => {
  if (!catSearch.value) return props.categories
  const query = catSearch.value.toLowerCase()
  return props.categories.filter(c => c.name?.toLowerCase().includes(query))
})

const isSelected = (cat) => {
  if (!cat || !props.selectedId) return false
  const catId = cat._id || cat.id
  return props.selectedId === catId || props.selectedId === cat.name
}

const selectCategory = (cat) => {
  if (!cat) {
    emit('select', null)
  } else {
    emit('select', cat)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
</style>
