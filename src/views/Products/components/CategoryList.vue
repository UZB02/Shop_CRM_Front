<template>
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl sm:rounded-[2rem] overflow-hidden sticky top-24 shadow-xl shadow-slate-200/5 dark:shadow-black/20 flex flex-col max-h-[calc(100vh-120px)] transition-all duration-500">
    <!-- Header -->
    <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shadow-lg shadow-emerald-500/5">
          <i class="pi pi-grid text-emerald-500 text-[10px] font-black"></i>
        </div>
        <span class="font-black text-[10px] sm:text-[11px] text-slate-800 dark:text-white uppercase tracking-[0.15em]">{{ $t('categories.title') }}</span>
      </div>
      <Button 
        v-if="!readonly"
        icon="pi pi-plus" 
        rounded 
        size="small" 
        @click="$emit('add')" 
        class="!h-8 !w-8 !bg-emerald-500 !text-white !border-none hover:!scale-110 active:!scale-95 transition-all shadow-lg shadow-emerald-500/20"
        v-tooltip.top="$t('products.new_category')"
      />
    </div>

    <!-- Category Search -->
    <div class="px-4 sm:px-5 py-3 shrink-0">
      <div class="relative group/search">
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] group-focus-within/search:text-emerald-500 transition-colors"></i>
        <input 
          v-model="catSearch"
          type="text" 
          :placeholder="$t('categories.search_ph')"
          class="w-full bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
        />
      </div>
    </div>
    
    <!-- List Area Wrapper -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- "All" segment -->
      <div class="px-3 sm:px-4 mb-2 shrink-0">
        <div 
          v-if="!catSearch"
          class="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent"
          :class="[!selectedId ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'hover:bg-white dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400']"
          @click="selectCategory(null)"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500"
              :class="[!selectedId ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-900/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 text-slate-400 group-hover:text-emerald-500']"
            >
              <i class="pi pi-filter text-[10px]"></i>
            </div>
            <span class="text-[11px] font-black uppercase tracking-tight">{{ $t('categories.all') }}</span>
          </div>
          <div 
            v-if="totalProducts" 
            class="px-2 py-0.5 rounded-lg text-[9px] font-black"
            :class="[!selectedId ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400']"
          >
            {{ totalProducts }}
          </div>
        </div>
      </div>

      <!-- Scrollable Category List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-4 pb-4 space-y-2 overscroll-contain">
        <!-- Category Items -->
        <div v-for="cat in filteredCategories" :key="cat._id || cat.id" 
          class="group flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all duration-500 border border-transparent"
          :class="[isSelected(cat) ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'hover:bg-white dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400']"
          @click="selectCategory(cat)"
        >
          <div class="flex items-center gap-3 overflow-hidden flex-1">
            <div 
              class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0"
              :class="[isSelected(cat) ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-900/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 text-slate-400 group-hover:text-emerald-500']"
            >
              <span class="text-[9px] font-black uppercase">{{ cat.name?.substring(0, 2) || '' }}</span>
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="text-[11px] font-black uppercase tracking-tight truncate transition-colors duration-500" :class="isSelected(cat) ? 'text-white' : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-500'">{{ cat.name }}</span>
              <span v-if="cat.description" class="text-[8px] font-bold opacity-60 truncate tracking-wide" :class="isSelected(cat) ? 'text-emerald-50' : 'text-slate-400'">{{ cat.description }}</span>
            </div>
          </div>

          <!-- Category Count or Actions -->
          <div class="flex items-center gap-2">
            <div 
               v-if="cat.product_count !== undefined"
               class="px-2 py-0.5 rounded-lg text-[9px] font-black transition-all duration-500"
               :class="[
                 isSelected(cat) ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500',
                 !readonly && 'group-hover:hidden'
               ]"
            >
              {{ cat.product_count }}
            </div>
            
            <div v-if="!readonly" class="hidden group-hover:flex gap-1 animate-in fade-in zoom-in duration-300">
              <Button icon="pi pi-pencil" text rounded size="small" class="!h-7 !w-7 !p-0 !text-inherit hover:!bg-emerald-500/10" @click.stop="$emit('edit', cat)" />
              <Button icon="pi pi-trash" text rounded size="small" class="!h-7 !w-7 !p-0 !text-inherit hover:!bg-rose-500/20" @click.stop="$emit('delete', cat)" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!filteredCategories.length" class="py-12 text-center">
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700/50">
            <i class="pi pi-folder-open text-slate-300 text-sm"></i>
          </div>
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ $t('common.no_results') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedId: [String, Number, null],
  totalProducts: Number,
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'add', 'edit', 'delete'])

const catSearch = ref('')

const filteredCategories = computed(() => {
  const list = Array.isArray(props.categories) ? props.categories : []
  if (!catSearch.value) return list
  const query = catSearch.value.toLowerCase()
  return list.filter(c => c.name?.toLowerCase().includes(query))
})

const isSelected = (cat) => {
  if (!cat || props.selectedId == null) return false
  return Number(props.selectedId) === Number(cat.id)
}

const selectCategory = (cat) => {
  emit('select', cat ?? null)
}
</script>

<style scoped>
@reference "../../../assets/styles/main.css";

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


