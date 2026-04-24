<template>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
    <!-- Title & Status -->
    <div class="min-w-0">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-inner">
           <i class="pi pi-th-large text-lg"></i>
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">Boshqaruv Markazi</h1>
          <div class="flex items-center gap-3 mt-1">
            <div v-if="loading" class="w-2.5 h-2.5 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
            <div v-else class="flex items-center gap-2">
               <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 dark:bg-emerald-500/10">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em]">Monitoring Faol</span>
               </div>
               <span v-if="periodText" class="text-[9px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 dark:border-slate-800 pl-3">
                 {{ periodText }}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Integrated Filters Bar -->
    <div class="flex flex-wrap items-center gap-2  grow lg:grow-0 lg:max-w-3xl">
      <!-- Date Range -->
      <div class="relative min-w-[220px] flex-1 sm:flex-none">
        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          placeholder="Sana oralig'i"
          showIcon
          iconDisplay="input"
          @update:modelValue="onDateChange"
          class="w-full h-10 custom-dashboard-input"
          pt:root:class="!bg-transparent !border-none !h-10"
          pt:input:class="!w-full !h-10 !rounded-2xl !border !border-slate-200/50 dark:!border-slate-700/30 !bg-slate-50 dark:!bg-slate-800 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !text-[10px] !font-black !pl-4 !shadow-none !uppercase !tracking-wider !text-slate-700 dark:!text-slate-200 placeholder:!text-slate-400"
        />
      </div>

      <!-- Branch Selection -->
      <div class="relative min-w-[180px] flex-1 sm:flex-none group">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
          <i class="pi pi-map-marker text-[10px]"></i>
        </div>
        <Select
          v-model="selectedBranch"
          :options="branches"
          optionLabel="name"
          optionValue="branch_id"
          placeholder="Barcha filiallar"
          showClear
          @change="onFilterChange"
          class="w-full h-10 custom-dashboard-input"
          pt:root:class="!h-10 !rounded-2xl !border !border-slate-200/50 dark:!border-slate-700/30 !bg-slate-50 dark:!bg-slate-800 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 transition-all shadow-none"
          pt:label:class="!text-[10px] !font-black !flex !items-center !py-0 !pl-9 !pr-3 !uppercase !tracking-wider !text-slate-700 dark:!text-slate-200"
        />
      </div>

      <!-- Refresh & Reset -->
      <div class="flex items-center gap-1.5 ml-auto">
        <button
          v-if="hasFilters"
          @click="$emit('reset')"
          class="h-10 w-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 border border-slate-200/50 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/50 transition-all active:scale-95 group"
          title="Filtrlarni tozalash"
        >
          <i class="pi pi-filter-slash text-[10px] group-hover:rotate-12 transition-transform"></i>
        </button>

        <button
          @click="$emit('refresh')"
          :disabled="loading"
          class="h-10 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95 group"
        >
          <i :class="['pi pi-sync text-[11px] transition-transform duration-700', loading ? 'animate-spin' : 'group-hover:rotate-180']"></i>
          <span class="text-[10px] font-black uppercase tracking-widest hidden sm:block">Yangilash</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'

const props = defineProps({
  loading: Boolean,
  filters: { type: Object, required: true },
  branches: { type: Array, default: () => [] },
  period: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['refresh', 'update:filters', 'reset'])

const dates = ref([new Date(props.filters.date_from), new Date(props.filters.date_to)])
const selectedBranch = ref(props.filters.branch)

const hasFilters = computed(() => {
  return props.filters.branch !== null || !!props.filters.category || !!props.filters.worker
})

const periodText = computed(() => {
  if (!props.period?.date_from || !props.period?.date_to) return null
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
    return `${d.getDate()} ${months[d.getMonth()]}`
  }

  return `${formatDate(props.period.date_from)} — ${formatDate(props.period.date_to)} (${props.period.days} kun)`
})

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const onDateChange = (val) => {
  if (val && val[0] && val[1]) {
    emit('update:filters', {
      ...props.filters,
      date_from: formatDate(val[0]),
      date_to: formatDate(val[1])
    })
  }
}

const onFilterChange = () => {
  emit('update:filters', { ...props.filters, branch: selectedBranch.value })
}

watch(() => props.filters, (newVal) => {
  dates.value = [new Date(newVal.date_from), new Date(newVal.date_to)]
  selectedBranch.value = newVal.branch
}, { deep: true })
</script>

<style scoped>
:deep(.p-datepicker-input), :deep(.p-select) {
  background-color: transparent !important;
}
</style>
