<template>
  <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-wrap items-center gap-3 transition-all duration-300">
    
    <!-- Date Range Picker -->
    <div class="relative min-w-[240px] flex-1 sm:flex-none">
      <DatePicker
        v-model="dates"
        selectionMode="range"
        :manualInput="false"
        placeholder="Sana oralig'i"
        showIcon
        iconDisplay="input"
        @update:modelValue="onDateChange"
        class="w-full h-10"
        pt:root:class="!bg-transparent !border-none !h-10"
        pt:input:class="!w-full !h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 !bg-slate-50/50 dark:!bg-slate-800/40 focus:!border-indigo-500/50 focus:!ring-4 focus:!ring-indigo-500/10 !text-[11px] !font-black !pl-4 !shadow-none !uppercase !tracking-wider !text-slate-700 dark:!text-slate-200 placeholder:!text-slate-400"
      />
    </div>

    <!-- Branch Selector -->
    <div class="relative min-w-[200px] flex-1 sm:flex-none group">
      <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
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
        class="w-full h-10"
        pt:root:class="!h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 !bg-slate-50/50 dark:!bg-slate-800/40 focus:!border-indigo-500/50 focus:!ring-4 focus:!ring-indigo-500/10 transition-all shadow-none"
        pt:label:class="!text-[11px] !font-black !flex !items-center !py-0 !pl-9 !pr-3 !uppercase !tracking-wider !text-slate-700 dark:!text-slate-200"
      />
    </div>

    <!-- Spacer for desktop -->
    <div class="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

    <!-- Period Status Badge -->
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30">
      <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Ko'rsatish:</span>
      <div class="px-2 py-0.5 rounded-lg bg-indigo-500 text-white text-[9px] font-black shadow-sm shadow-indigo-500/20">
        {{ periodText }}
      </div>
    </div>

    <!-- Reset Filters Button -->
    <button
      v-if="hasFilters"
      @click="resetLocalFilters"
      class="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all active:scale-95 group"
      title="Filtrni tozalash"
    >
      <i class="pi pi-refresh text-[10px] group-hover:rotate-180 transition-transform duration-500"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'

const props = defineProps({
  filters: { type: Object, required: true },
  branches: { type: Array, default: () => [] },
  period: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:filters', 'reset'])

const dates = ref([new Date(props.filters.date_from), new Date(props.filters.date_to)])
const selectedBranch = ref(props.filters.branch)

const hasFilters = computed(() => {
  return props.filters.branch !== null || !!props.filters.category || !!props.filters.worker
})

const periodText = computed(() => {
  if (props.period.date_from && props.period.date_to) {
    return `${props.period.days || 0} kun`
  }
  return "Joriy"
})

const resetLocalFilters = () => {
  emit('reset')
}

const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const onDateChange = (val) => {
  if (val && val[0] && val[1]) {
    emit('update:filters', {
      date_from: formatDate(val[0]),
      date_to: formatDate(val[1])
    })
  }
}

const onFilterChange = () => {
  emit('update:filters', { branch: selectedBranch.value })
}

watch(() => props.filters, (newVal) => {
  dates.value = [new Date(newVal.date_from), new Date(newVal.date_to)]
  selectedBranch.value = newVal.branch
}, { deep: true })
</script>

<style scoped>
.bg-white\/70 {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

:deep(.p-select-clear-icon) {
  right: 2.5rem;
  color: #ef4444;
  font-size: 0.7rem;
}
</style>
