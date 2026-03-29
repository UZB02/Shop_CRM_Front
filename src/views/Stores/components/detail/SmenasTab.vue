<template>
  <div class="space-y-6">
    <!-- Sub-tabs for Smena Type -->
    <div class="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl w-fit">
      <button 
        v-for="st in subTabs" :key="st.id"
        @click="activeSubTab = st.id"
        class="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
        :class="activeSubTab === st.id 
          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600' 
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
      >
        {{ st.label }}
      </button>
    </div>

    <!-- Shifts Grid -->
    <div v-if="currentShifts.length === 0" class="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-100 dark:border-slate-800 text-center">
       <div class="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
         <i class="pi pi-calendar text-slate-300 text-2xl"></i>
       </div>
       <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
         {{ activeSubTab === 'open' ? $t('stores.detail.shifts_empty_open') : $t('stores.detail.shifts_empty_closed') }}
       </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="smena in currentShifts" :key="smena.id" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <!-- Status Badge -->
        <div class="absolute top-0 right-0 px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest border-l border-b border-slate-100 dark:border-slate-700 rounded-bl-xl text-slate-400">
          {{ smena.status_display }}
        </div>

        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm shrink-0"
               :class="activeSubTab === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'">
            <i :class="activeSubTab === 'open' ? 'pi pi-clock' : 'pi pi-calendar-times transition-transform group-hover:scale-110'"></i>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{{ smena.branch_name }}</p>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ smena.worker_open_name || smena.worker_name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
          <div class="space-y-1">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('stores.detail.shift_opened', { date: '' }).replace(':', '') }}</p>
            <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300">{{ smena.start_time || smena.opened_at }}</p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {{ activeSubTab === 'open' ? $t('stores.detail.cash_start') : $t('stores.detail.shift_closed', { date: '' }).replace(':', '') }}
            </p>
            <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {{ activeSubTab === 'open' ? Number(smena.cash_start || 0).toLocaleString() + ' UZS' : (smena.end_time || smena.closed_at) }}
            </p>
          </div>
        </div>

        <div v-if="activeSubTab === 'closed'" class="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-800">
           <div class="space-y-1">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('stores.detail.cash_start') }}</p>
            <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300">{{ Number(smena.cash_start || 0).toLocaleString() }} <span class="text-[8px] opacity-50 uppercase">UZS</span></p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{{ $t('stores.detail.cash_end') }}</p>
            <p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{{ Number(smena.cash_end || 0).toLocaleString() }} <span class="text-[8px] opacity-70 uppercase">UZS</span></p>
          </div>
        </div>
        
        <div v-else class="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
           <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ $t('stores.detail.cash_balance') }}</p>
           <p class="text-xs font-black text-emerald-500 tracking-tight">{{ Number(smena.cash_start || 0).toLocaleString() }} UZS</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  openSmenas: { type: Array, default: () => [] },
  closedSmenas: { type: Array, default: () => [] }
})

const activeSubTab = ref('open')

const subTabs = computed(() => [
  { id: 'open',   label: t('stores.detail.tab_open_shifts') },
  { id: 'closed', label: t('stores.detail.tab_closed_shifts') }
])

const currentShifts = computed(() => {
  return activeSubTab.value === 'open' ? props.openSmenas : props.closedSmenas
})
</script>
