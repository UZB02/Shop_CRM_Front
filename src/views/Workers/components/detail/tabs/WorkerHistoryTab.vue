<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
    <!-- Header with Filters -->
    <div class="px-8 py-5 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">
            <i class="pi pi-history text-sm"></i>
          </div>
          <h2 class="text-[11px] font-black text-slate-700 dark:text-gray-200 uppercase tracking-widest">{{ $t('workers.logs') || 'Tizim Jurnali' }}</h2>
        </div>
        <div class="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
            <span class="text-[10px] font-black text-slate-700 dark:text-slate-300">{{ activitiesTotal }}</span>
            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">umumiy amal</span>
        </div>
      </div>

      <!-- Modern Filter Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white dark:bg-slate-900/40 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-inner">
        <Select v-model="historyFilters.action" :options="actionOptions" showClear optionLabel="label" optionValue="value" 
                  class="!text-[10px] !font-black !uppercase !tracking-tighter !h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 flex items-center px-2"
                  placeholder="Amal turi" />

        <DatePicker v-model="historyFilters.date_from" dateFormat="yy-mm-dd" showIcon iconDisplay="input" 
                    class="!h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full" 
                    inputClass="!text-[10px] !font-black !uppercase !tracking-tighter !h-10 !bg-transparent !border-none !px-4"
                    placeholder="Dan" />

        <DatePicker v-model="historyFilters.date_to" dateFormat="yy-mm-dd" showIcon iconDisplay="input" 
                    class="!h-10 !rounded-xl !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full" 
                    inputClass="!text-[10px] !font-black !uppercase !tracking-tighter !h-10 !bg-transparent !border-none !px-4"
                    placeholder="Gacha" />
      </div>
    </div>

    <!-- List Section -->
    <div class="p-0">
      <div v-if="activitiesLoading && !activities.length" class="p-16 text-center">
        <i class="pi pi-spin pi-spinner text-xl text-amber-500 mb-3"></i>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
      </div>
      <div v-else-if="!activities.length" class="p-16 text-center opacity-40">
        <i class="pi pi-calendar-times text-3xl text-slate-300 mb-3"></i>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Hozircha amallar mavjud emas</p>
      </div>
      <div v-else class="divide-y divide-slate-50 dark:divide-slate-800/50">
        <div v-for="(act, idx) in activities" :key="act.id" 
             class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors relative">
          
          <!-- Left: Icon & Badge -->
          <div class="flex items-center gap-3 min-w-0 sm:min-w-[140px]">
            <div class="w-7 h-7 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border transition-all duration-300"
                 :class="getActionClass(act.action)">
              <i :class="getActionIcon(act.action)" class="text-[9px]"></i>
            </div>
            <div class="flex flex-col min-w-0 overflow-hidden">
              <span class="text-[10px] sm:text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">
                {{ act.action_label }}
              </span>
              <span v-if="act.model_label" class="text-[8px] font-bold text-slate-400/80 uppercase tracking-tighter truncate">
                {{ act.model_label }}
              </span>
            </div>
          </div>

          <!-- Middle: Description -->
          <div class="flex-1 min-w-0">
            <p class="text-[11px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 sm:truncate leading-normal sm:leading-none">
              {{ act.description }}
              <span v-if="act.target_id" class="ml-1.5 text-[9px] font-black text-slate-300 dark:text-slate-600">#{{ act.target_id }}</span>
            </p>
          </div>

          <!-- Right: Time -->
          <div class="flex items-center gap-2 sm:pl-4 border-l-0 sm:border-l border-slate-50 dark:border-slate-800/50 pt-1 sm:pt-0">
            <i class="pi pi-clock text-[8px] text-slate-300"></i>
            <span class="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-tight whitespace-nowrap">{{ act.created_at }}</span>
          </div>
        </div>

        <!-- Pagination / Load More -->
        <div v-if="hasMoreActivities" class="p-4 text-center bg-slate-50/20 dark:bg-slate-800/10">
          <Button 
            :label="activitiesLoading ? 'Yuklanmoqda...' : 'Yana yuklash'" 
            :icon="activitiesLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
            text
            @click="loadMoreActivities"
            class="!text-[10px] !font-black !uppercase !tracking-widest !text-slate-400 hover:!text-amber-500 !transition-colors !p-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { useWorkerHistory } from '../../../composables/useWorkerHistory'

const props = defineProps({
  workerId: { type: [String, Number], required: true }
})

const workerIdRef = computed(() => props.workerId)
const { 
  activities, activitiesLoading, activitiesTotal, hasMoreActivities,
  historyFilters, actionOptions, modelOptions,
  loadActivities, loadMoreActivities, getActionIcon, getActionClass 
} = useWorkerHistory(workerIdRef)

onMounted(() => {
  loadActivities(1)
})
</script>
