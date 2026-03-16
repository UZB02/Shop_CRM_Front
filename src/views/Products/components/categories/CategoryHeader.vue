<template>
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 sm:p-4 rounded-3xl sm:rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/5 dark:shadow-black/40 space-y-3 sm:space-y-0">
    <!-- Top Row: Back + Title + Add Button -->
    <div class="flex items-center justify-between gap-3 overflow-hidden">
      <div class="flex items-center gap-2 sm:gap-5 overflow-hidden">
        <button 
          @click="router.push('/dashboard/products')"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-90 border border-slate-100 dark:border-slate-700/50 shrink-0"
        >
          <i class="pi pi-chevron-left text-[10px] sm:text-sm font-bold"></i>
        </button>
        <div class="h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block"></div>
        <div class="overflow-hidden">
          <h1 class="text-[10px] sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate">{{ $t('categories.management') }}</h1>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse shrink-0"></span>
            <p class="text-[7px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] truncate">{{ totalCategories }} {{ $t('categories.all') }}</p>
          </div>
        </div>
      </div>

      <!-- Desktop Search & Add Container -->
      <div class="flex items-center gap-2 sm:gap-4 shrink-0 sm:flex-1 sm:justify-end">
        <div class="relative group/search hidden sm:block sm:max-w-xs w-full">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 group-focus-within/search:text-emerald-500 transition-colors"></i>
          <InputText 
            v-model="searchModel" 
            :placeholder="$t('common.search')" 
            class="!pl-10 !py-2.5 !text-[12px] !font-bold !rounded-2xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" 
          />
        </div>

        <Button 
          :label="$t('common.add')"
          icon="pi pi-plus" 
          severity="success"
          class="!text-[9px] sm:!text-[11px] !font-black !uppercase !tracking-wider sm:!tracking-[0.15em] !rounded-xl sm:!rounded-2xl !px-3 sm:!px-6 !h-8 sm:!h-11 !bg-emerald-500 !border-none !shadow-lg !shadow-emerald-500/20 active:scale-95 transition-all text-white shrink-0"
          @click="$emit('add')"
        />
      </div>
    </div>

    <!-- Bottom Row: Mobile Search (Full Width) -->
    <div class="sm:hidden w-full pt-1">
      <div class="relative group/search-mobile">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 group-focus-within/search-mobile:text-emerald-500 transition-colors"></i>
        <InputText 
          v-model="searchModel" 
          :placeholder="$t('common.search')" 
          class="!pl-9 !py-2 !text-[10px] !font-bold !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-transparent focus:!bg-white dark:focus:!bg-slate-900 focus:!ring-8 focus:!ring-emerald-500/5 transition-all w-full" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
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
