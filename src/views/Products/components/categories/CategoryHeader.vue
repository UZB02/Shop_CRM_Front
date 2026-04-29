<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/products" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1 shrink-0">
          <i class="pi pi-chevron-left text-[9px]"></i>
          {{ $t('products.page_title') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300 shrink-0"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-widest truncate">{{ $t('categories.management') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('categories.management') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ totalCategories || 0 }} {{ $t('categories.all') }}</p>
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
      <div class="relative group/search flex-1 sm:w-64 sm:flex-initial">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 group-focus-within/search:text-emerald-500 transition-colors"></i>
        <InputText 
          v-model="searchModel" 
          :placeholder="$t('common.search')" 
          class="!h-9 !pl-9 !text-xs !font-semibold !rounded-lg !bg-white dark:!bg-slate-900/50 !border-slate-200 dark:!border-slate-800 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full shadow-sm" 
        />
      </div>
      
      <button 
        @click="$emit('add')"
        class="h-9 px-3.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-emerald-500/20 shrink-0 active:scale-95"
      >
        <i class="pi pi-plus text-[10px]"></i>
        <span>{{ $t('common.add') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'

const props = defineProps({
  totalCategories: Number,
  searchQuery: String
})

const emit = defineEmits(['update:searchQuery', 'add'])
const router = useRouter()

const searchModel = computed({
  get: () => props.searchQuery,
  set: (val) => emit('update:searchQuery', val)
})
</script>
