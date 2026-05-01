<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
    <!-- Header with Filters (Compact) -->
    <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">
            <i class="pi pi-history text-[12px]"></i>
          </div>
          <h2 class="text-[13px] font-black text-slate-700 dark:text-gray-200 tracking-widest">{{ $t('workers.logs') || 'Tizim Jurnali' }}</h2>
        </div>
        <div class="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
            <span class="text-[12px] font-black text-slate-700 dark:text-slate-300">{{ activitiesTotal }}</span>
            <span class="text-[10px] font-bold text-slate-400 tracking-tighter">{{ $t('common.total') || 'Jami' }}</span>
        </div>
      </div>

      <!-- Compact Filter Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white dark:bg-slate-900/40 p-1 rounded-xl border border-slate-100 dark:border-slate-800/50">
        <Select v-model="historyFilters.action" :options="actionOptions" showClear optionLabel="label" optionValue="value" 
                  class="!text-[11px] !font-black !!tracking-tight !h-8 !rounded-lg !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 flex items-center px-2"
                  placeholder="Amal turi" />

        <DatePicker v-model="historyFilters.date_from" dateFormat="yy-mm-dd" showIcon iconDisplay="input" 
                    class="!h-8 !rounded-lg !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full" 
                    inputClass="!text-[11px] !font-black !!tracking-tight !h-8 !bg-transparent !border-none !px-3"
                    placeholder="Dan" />

        <DatePicker v-model="historyFilters.date_to" dateFormat="yy-mm-dd" showIcon iconDisplay="input" 
                    class="!h-8 !rounded-lg !bg-slate-50 dark:!bg-slate-800/40 !border-none !ring-0 !w-full" 
                    inputClass="!text-[11px] !font-black !!tracking-tight !h-8 !bg-transparent !border-none !px-3"
                    placeholder="Gacha" />
      </div>
    </div>

    <!-- Table Section (Compact) -->
    <div class="overflow-x-auto">
      <div v-if="activitiesLoading && !activities.length" class="py-12 text-center">
        <i class="pi pi-spin pi-spinner text-lg text-amber-500 mb-2"></i>
        <p class="text-[12px] font-bold tracking-widest text-slate-400">Yuklanmoqda...</p>
      </div>
      <div v-else-if="!activities.length" class="py-12 text-center opacity-40">
        <i class="pi pi-calendar-times text-2xl text-slate-300 mb-2"></i>
        <p class="text-[12px] font-bold tracking-widest text-slate-400">Hozircha amallar mavjud emas</p>
      </div>
      <table v-else class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/30">
            <th class="px-4 py-2 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('common.action') || 'Amal' }}</th>
            <th class="px-4 py-2 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">{{ $t('common.description') || 'Tavsif' }}</th>
            <th class="px-4 py-2 text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 text-right w-32">{{ $t('common.date') || 'Sana' }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <tr v-for="act in activities" :key="act.id" 
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            
            <td class="px-4 py-2">
              <div class="flex items-center gap-2.5">
                <div class="w-6 h-6 rounded-md flex items-center justify-center border border-slate-100 dark:border-slate-800 transition-all"
                     :class="getActionClass(act.action)">
                  <i :class="getActionIcon(act.action)" class="text-[10px]"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-[12px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                    {{ act.action_label }}
                  </span>
                  <span v-if="act.model_label" class="text-[10px] font-bold text-slate-400 tracking-tighter">
                    {{ act.model_label }}
                  </span>
                </div>
              </div>
            </td>

            <td class="px-4 py-2">
              <div class="max-w-md">
                <p class="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-normal line-clamp-1 group-hover:line-clamp-none transition-all">
                  {{ act.description }}
                  <span v-if="act.target_id" class="ml-1 text-[11px] font-bold text-slate-300 dark:text-slate-700">#{{ act.target_id }}</span>
                </p>
              </div>
            </td>

            <td class="px-4 py-2 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <i class="pi pi-clock text-[10px] text-slate-300"></i>
                <span class="text-[12px] font-bold text-slate-400 tracking-tight whitespace-nowrap">{{ act.created_at }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Load More (Compact) -->
      <div v-if="hasMoreActivities" class="p-3 text-center border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/10">
        <Button 
          :label="activitiesLoading ? 'Yuklanmoqda...' : 'Yana yuklash'" 
          :icon="activitiesLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"
          text
          @click="loadMoreActivities"
          class="!text-[11px] !font-black !!tracking-widest !text-slate-400 hover:!text-amber-500 !transition-colors !p-0 !h-auto"
        />
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


