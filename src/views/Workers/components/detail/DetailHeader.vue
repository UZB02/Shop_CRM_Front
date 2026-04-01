<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl p-3 md:p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group">
    <!-- Decorative subtle glow -->
    <div class="absolute -left-10 -top-10 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>

    <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left flex-1 min-w-0">
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl text-white font-black shadow-md ring-2 ring-slate-50 dark:ring-slate-800 transition-transform duration-500 group-hover:scale-105"
             :style="getAvatarGradient(worker?.full_name)">
          {{ getInitials(worker?.full_name) }}
        </div>
        <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center"
             :class="statusStyles.bg">
          <i :class="['pi', statusStyles.icon, 'text-white text-[7px] font-black']"></i>
        </div>
      </div>

      <div class="space-y-1 min-w-0">
        <div class="flex flex-col sm:flex-row items-center gap-2">
          <h1 class="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-tight truncate">
            {{ worker?.full_name }}
          </h1>
          <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[8px] font-black uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap">
            {{ worker?.role_display || worker?.role }}
          </span>
        </div>
        <div class="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1">
           <span class="text-[10px] font-bold text-slate-400 tracking-tight">@{{ worker?.username }}</span>
           <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
             <i class="pi pi-map-marker text-emerald-500 text-[9px]"></i>
             <span class="truncate max-w-[150px]">{{ worker?.branch_name || '—' }}</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats & Actions -->
    <div class="flex items-center gap-4 lg:gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6 lg:pl-8 border-slate-100 dark:border-slate-800">
      <!-- Salary -->
      <div class="text-left md:text-right">
        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('workers.salary') }}</p>
        <div class="flex items-center gap-2">
          <p class="text-xs font-black text-emerald-500 tracking-tight transition-all duration-300"
             :class="{ 'blur-[4px] select-none': !showSalary }">
            {{ formatCurrency(worker?.salary) }} 
            <span class="text-[9px] text-slate-400 font-medium ml-1">UZS</span>
          </p>
          <button @click="showSalary = !showSalary" 
                  class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-300 hover:text-emerald-500 transition-all">
            <i :class="['pi', showSalary ? 'pi-eye-slash' : 'pi-eye', 'text-[9px]']"></i>
          </button>
        </div>
      </div>

      <Button icon="pi pi-pencil" 
              :label="$t('common.edit')" 
              class="!rounded-xl !px-4 !py-2 !bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !font-black !text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 transition-all hover:-translate-y-0.5" 
              @click="$emit('edit')" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import { useWorkerDetail } from '../../composables/useWorkerDetail'

const props = defineProps({
  worker: Object
})

defineEmits(['edit'])

const showSalary = ref(false)
const { getAvatarGradient, getInitials, getStatusStyles, formatCurrency } = useWorkerDetail()

const statusStyles = computed(() => getStatusStyles(props.worker?.status))
</script>
