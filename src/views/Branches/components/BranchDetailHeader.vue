<template>
  <div class="space-y-6">
    <!-- Breadcrumbs & Actions -->
    <div class="flex items-center justify-between gap-2 px-1">
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-0">
        <router-link to="/dashboard/stores" class="hover:text-emerald-500 transition-colors flex items-center gap-1.5 shrink-0">
          <i class="pi pi-building"></i>{{ $t('menu.stores') }}
        </router-link>
        <i class="pi pi-chevron-right text-[7px] opacity-30 shrink-0"></i>
        <span class="text-slate-600 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">{{ branch?.name || '...' }}</span>
      </div>

      <button 
        @click="$emit('edit')"
        class="flex items-center gap-2 group px-3 sm:px-5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 shrink-0"
      >
        <i class="pi pi-pencil text-[9px] text-emerald-500 group-hover:rotate-12 transition-transform"></i>
        <span class="hidden sm:inline">{{ $t('common.edit') }}</span>
      </button>
    </div>

    <!-- Header Card -->
    <div v-if="loading" class="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div class="col-span-2 flex items-center gap-6">
          <div class="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800"></div>
          <div class="space-y-3">
            <div class="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div class="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
       </div>
       <div class="flex gap-2">
         <div v-for="i in 3" :key="i" class="flex-1 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800"></div>
       </div>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-8 relative overflow-hidden group">
      <!-- Decor -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full"></div>
      
      <div class="relative flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 sm:gap-8 text-center lg:text-left">
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 transform transition-all group-hover:scale-105 group-hover:rotate-3">
            <i class="pi pi-sitemap text-white text-2xl sm:text-3xl font-black"></i>
          </div>
          <div class="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <div class="flex flex-col sm:flex-row items-center gap-2">
              <h1 class="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-loose sm:leading-none truncate max-w-full">
                {{ branch?.name }}
              </h1>
              <span 
                class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0"
                :class="branch?.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'"
              >
                {{ branch?.status_display }}
              </span>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-2">
                <i class="pi pi-building text-emerald-500 shrink-0"></i>
                <span class="truncate">{{ branch?.store_name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-map-marker text-emerald-500 shrink-0"></i>
                <span class="truncate">{{ branch?.address }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <i class="pi pi-phone text-emerald-500 shrink-0"></i>
                <span>{{ branch?.phone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Compact -->
        <div class="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-2 border-t lg:border-t-0 border-slate-50 dark:border-slate-800/50">
          <div v-for="stat in stats" :key="stat.key" class="flex-1 lg:flex-none p-2 sm:p-4 min-w-[75px] sm:min-w-[90px] rounded-xl sm:rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center transition-transform hover:-translate-y-1 shrink-0">
            <p class="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">{{ stat.label }}</p>
            <p class="text-sm sm:text-xl font-black text-slate-800 dark:text-white leading-none">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  branch: Object,
  loading: Boolean
})

const stats = computed(() => [
  { key: 'workers', label: t('stores.detail.stat_workers'), value: props.branch?.workers?.length || 0 },
  { key: 'products', label: t('stores.detail.stat_products'), value: props.branch?.products?.length || 0 },
  { key: 'customers', label: t('stores.detail.stat_customers'), value: props.branch?.customers?.length || 0 }
])

defineEmits(['edit'])
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
