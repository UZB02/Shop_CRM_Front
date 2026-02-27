<template>
  <div class="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
    <!-- Decorative element -->
    <div class="absolute inset-y-0 left-0 w-1.5 bg-emerald-500 hidden sm:block"></div>

    <div class="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-3xl text-white font-black shadow-lg ring-4 ring-slate-50 dark:ring-slate-800 transition-transform duration-500 group-hover:scale-105"
             :style="getAvatarGradient(worker?.full_name)">
          {{ getInitials(worker?.full_name) }}
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-lg border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center transition-all duration-300"
             :class="statusStyles.bg">
          <i :class="['pi', statusStyles.icon, 'text-white text-[8px] md:text-[10px] font-black']"></i>
        </div>
      </div>

      <div class="space-y-1.5 mt-2 sm:mt-0">
        <div class="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
          <h1 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ worker?.full_name }}
          </h1>
          <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
            {{ worker?.role_display || worker?.role }}
          </span>
        </div>
        <div class="flex flex-wrap justify-center sm:justify-start items-center gap-3 md:gap-4">
           <span class="text-[11px] font-bold text-slate-400">@{{ worker?.username }}</span>
           <span class="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
           <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
             <i class="pi pi-map-marker text-emerald-500"></i>
             <span>{{ worker?.branch_name || '—' }}</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="hidden md:flex items-center gap-6 lg:gap-10 border-slate-100 dark:border-slate-800 md:border-x md:px-6 lg:px-10 h-12">
      <div class="text-center">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('workers.salary') }}</p>
        <div class="flex items-center justify-center gap-2">
          <p class="text-xs lg:text-sm font-black text-emerald-500 tracking-tight transition-all duration-300"
             :class="{ 'blur-[4px] select-none': !showSalary }">
            {{ formatCurrency(worker?.salary) }} 
            <span class="text-[10px] text-slate-400 font-medium ml-1">UZS</span>
          </p>
          <button @click="showSalary = !showSalary" 
                  class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-all">
            <i :class="['pi', showSalary ? 'pi-eye-slash' : 'pi-eye', 'text-[10px]']"></i>
          </button>
        </div>
      </div>
      <div class="text-center">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{{ $t('common.status') }} ID</p>
        <p class="text-xs lg:text-sm font-black text-slate-700 dark:text-slate-300 tracking-widest">#00{{ worker?.id }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center flex-wrap gap-2 md:gap-3 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0 border-slate-100 dark:border-slate-800">
      <Button icon="pi pi-arrow-left" 
              :label="$t('common.back')" 
              text 
              class="!text-slate-400 hover:!text-emerald-500 !font-bold !text-[10px] uppercase tracking-widest !px-2"
              @click="$router.back()" />
      <Button icon="pi pi-key" 
              label="Parol" 
              class="!rounded-xl !px-3 !py-2.5 !bg-slate-100 dark:!bg-slate-800 !border-none !text-slate-600 dark:!text-slate-300 !font-black !text-[10px] transition-all hover:-translate-y-0.5" 
              @click="$emit('change-password')" />
      <Button icon="pi pi-pencil" 
              :label="$t('common.edit')" 
              class="!rounded-xl !px-3 sm:!px-5 !py-2.5 !bg-emerald-500 hover:!bg-emerald-600 !border-none !text-white !font-black !text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5" 
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

defineEmits(['edit', 'change-password'])

const showSalary = ref(false)
const { getAvatarGradient, getInitials, getStatusStyles, formatCurrency } = useWorkerDetail()

const statusStyles = computed(() => getStatusStyles(props.worker?.status))
</script>
