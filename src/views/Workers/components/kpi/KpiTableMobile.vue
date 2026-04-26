<template>
  <div class="lg:hidden flex flex-col gap-3">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse h-48"></div>
    </template>
    <template v-else-if="sortedData.length > 0">
      <div v-for="(item, index) in sortedData" :key="item.id" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <!-- Rank/Medal on Top Right -->
        <div class="absolute top-4 right-4">
          <i v-if="isTopThree(item)" :class="['pi pi-star-fill text-sm', getMedalColor(item)]"></i>
          <span v-else class="text-[10px] font-bold text-slate-300">#{{ index + 1 }}</span>
        </div>

        <!-- Header Info -->
        <div class="flex items-center gap-3 mb-4 cursor-pointer group-active:scale-[0.98] transition-transform" @click="navigateToDetail(item)">
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
            :style="getAvatarGradient(item?.worker_name)"
          >
            {{ (item?.worker_name || '??').split(' ').filter(n => n).map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
          </div>
          <div class="flex flex-col min-w-0">
             <h3 class="text-xs font-black text-slate-800 dark:text-white truncate">{{ item?.worker_name || '---' }}</h3>
             <span class="text-[10px] font-medium text-slate-400">ID: {{ item.worker }}</span>
          </div>
        </div>

        <!-- Grid Stats -->
        <div class="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
          <div>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.net_sales') }}</span>
            <span class="text-xs font-black text-emerald-500">{{ settingsStore.formatPrice(item.net_sales_amount) }}</span>
          </div>
          <div class="text-right">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.returns_count') }}</span>
            <span :class="['text-xs font-black', parseFloat(item.returns_amount) > 0 ? 'text-rose-500' : 'text-slate-300']">
               {{ parseFloat(item.returns_amount) > 0 ? settingsStore.formatPrice(item.returns_amount) : '-' }}
            </span>
          </div>
          <div>
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.sales_count') }}</span>
             <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ item.sales_count }}</span>
                <span class="text-[10px] text-slate-400">/ {{ settingsStore.formatPrice(item.sales_amount) }}</span>
             </div>
          </div>
          <div class="text-right">
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{{ $t('kpi.table.target') }}</span>
             <div class="flex flex-col items-end leading-none">
                <span v-if="parseFloat(item.target_amount) > 0" class="text-xs font-black text-slate-700 dark:text-slate-200">
                   {{ settingsStore.formatPrice(item.target_amount) }}
                </span>
                <span v-else class="text-[10px] font-bold text-slate-300 italic">No Target</span>
             </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/50">
          <div class="flex justify-between items-center mb-1.5">
             <div class="flex items-center gap-2">
                 <span class="text-[11px] font-black" :class="getCompletionColor(item.completion_pct, 'text')">
                    {{ item.completion_pct ? parseFloat(item.completion_pct).toFixed(0) + '%' : '0%' }}
                 </span>
                 <span class="px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter shadow-sm" :class="getSmartStatusBadge(item.completion_pct)">
                    {{ getSmartStatusLabel(item.completion_pct) }}
                 </span>
             </div>
             <button @click="$emit('open-target', item)" class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-slate-400 flex items-center justify-center shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700">
                <i class="pi pi-pencil text-[9px]"></i>
             </button>
          </div>
          <div class="h-1.5 w-full bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
             <div 
                class="h-full rounded-full transition-all duration-1000"
                :class="getCompletionColor(item.completion_pct, 'bg')"
                :style="{ width: Math.min(parseFloat(item.completion_pct || 0), 100) + '%' }"
             ></div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
         <i class="pi pi-inbox text-3xl text-slate-200 mb-3 block"></i>
         <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('common.no_results') }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/store/settings'
import { useKpiTable } from '../../composables/useKpiTable'

const props = defineProps({
  data: Array,
  fullList: Array,
  loading: Boolean
})

const emit = defineEmits(['open-target'])
const router = useRouter()

const navigateToDetail = (item) => {
  if (!item?.worker) return
  router.push({ 
    name: 'worker-detail', 
    params: { id: item.worker },
    query: { tab: 'kpi' }
  })
}

const settingsStore = useSettingsStore()
const {
  sortedData,
  isTopThree,
  getMedalColor,
  getSmartStatusLabel,
  getSmartStatusBadge,
  getCompletionColor,
  getAvatarGradient
} = useKpiTable(props)
</script>
