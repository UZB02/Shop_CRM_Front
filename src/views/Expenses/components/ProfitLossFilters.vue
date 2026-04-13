<template>
  <div class="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
    <!-- Main Filter Bar -->
    <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-wrap items-end gap-4">
      
      <!-- Year Selection Group -->
      <div class="flex flex-col gap-2 min-w-[140px]">
         <div class="flex items-center gap-1.5 ml-1">
            <i class="pi pi-calendar text-[10px] text-rose-500"></i>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Yil</span>
         </div>
         <DatePicker
           v-model="yearDate"
           view="year"
           dateFormat="yy"
           placeholder="Yilni tanlang"
           class="w-full"
           pt:root:class="!h-10 !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 transition-all shadow-sm"
           pt:input:class="!bg-transparent !border-none !shadow-none !text-xs !font-black !pl-4 !h-full !text-slate-700 dark:!text-slate-100"
         />
      </div>

      <!-- Month Selection Group -->
      <div class="flex flex-col gap-2 flex-1 min-w-[260px]">
         <div class="flex items-center justify-between ml-1">
            <div class="flex items-center gap-1.5">
               <i class="pi pi-chart-bar text-[10px] text-rose-500"></i>
               <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Hisobot oylari</span>
            </div>
            <!-- Quick Presets for Months (Enterprise UX feature) -->
            <div class="flex gap-2">
               <button @click="setMonths('all')" class="text-[8px] font-black uppercase tracking-tight text-rose-500 hover:text-rose-600 transition-colors">Barchasi</button>
               <button @click="setMonths('q1')" class="text-[8px] font-black uppercase tracking-tight text-slate-400 hover:text-rose-500 transition-colors">1-Chorak</button>
               <button @click="setMonths('q2')" class="text-[8px] font-black uppercase tracking-tight text-slate-400 hover:text-rose-500 transition-colors">2-Chorak</button>
            </div>
         </div>
         <DatePicker
           v-model="monthsDates"
           view="month"
           selectionMode="multiple"
           placeholder="Oylarni belgilang"
           class="w-full"
           :dateFormat="customDateFormat"
           pt:root:class="!h-10 !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 transition-all shadow-sm"
           pt:input:class="!bg-transparent !border-none !shadow-none !text-xs !font-black !pl-4 !h-full !text-slate-700 dark:!text-slate-100"
         />
      </div>

      <!-- Branch Selection (Manager only) -->
      <div v-if="isManager" class="flex flex-col gap-2 min-w-[180px]">
         <div class="flex items-center gap-1.5 ml-1">
            <i class="pi pi-map-marker text-[10px] text-rose-500"></i>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Filial</span>
         </div>
         <Select
           v-model="filters.branch"
           :options="branches"
           optionLabel="name"
           optionValue="id"
           placeholder="Barcha filiallar"
           showClear
           class="w-full"
           pt:root:class="!h-10 !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 shadow-sm"
           pt:label:class="!text-xs !font-black !h-full !flex !items-center !px-4 !text-slate-700 dark:!text-slate-100"
         />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button 
          @click="$emit('refresh')"
          class="h-10 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-rose-500/30 group"
        >
          <i class="pi pi-sync text-[10px] group-hover:rotate-180 transition-transform duration-500"></i>
          Hisobotni ko'rish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  branches: {
    type: Array,
    default: () => []
  },
  isManager: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

// Sync numeric year with Date object for DatePicker
const yearDate = computed({
  get: () => props.filters.year ? new Date(props.filters.year, 0, 1) : null,
  set: (val) => {
    if (val instanceof Date) {
      props.filters.year = val.getFullYear()
    }
  }
})

// Sync numeric months array with Date objects array for Multi-Month DatePicker
const monthsDates = computed({
  get: () => {
    if (!props.filters.months || !props.filters.months.length) return null
    return props.filters.months.map(m => new Date(props.filters.year || new Date().getFullYear(), m - 1, 1))
  },
  set: (vals) => {
    if (Array.isArray(vals)) {
      props.filters.months = vals.map(d => d.getMonth() + 1).sort((a, b) => a - b)
    } else if (!vals) {
      props.filters.months = []
    }
  }
})

// UX Refinement: Professional label formatting instead of raw dates
const customDateFormat = computed(() => {
  if (!props.filters.months || props.filters.months.length === 0) return 'mm'
  
  // If many months selected, show a count summary (Premium SaaS behavior)
  if (props.filters.months.length > 3) {
    return `'${props.filters.months.length} ta oy tanlandi'`.replace(/'/g, "'") // Properly quoted for DatePicker
  }
  
  // For few months, show short names (Yan, Fev...)
  return 'M' 
})

// Professional UX: Quick selection presets
const setMonths = (type) => {
  if (type === 'all') {
    props.filters.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  } else if (type === 'q1') {
    props.filters.months = [1, 2, 3]
  } else if (type === 'q2') {
    props.filters.months = [4, 5, 6]
  }
  // No need to emit, watcher in logic will pick up change
}
</script>
