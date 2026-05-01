<template>
  <div class="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
    <!-- Main Filter Bar -->
    <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-wrap items-end gap-5">
      
      <!-- Year Selection Group -->
      <div class="flex flex-col gap-2 min-w-[120px]">
         <div class="flex items-center gap-1.5 ml-1">
            <i class="pi pi-calendar text-[12px] text-rose-500"></i>
            <span class="text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">Yil</span>
         </div>
         <DatePicker
           v-model="yearDate"
           view="year"
           dateFormat="yy"
           placeholder="2026"
           class="w-full"
           pt:root:class="!h-11 !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 transition-all shadow-sm"
           pt:input:class="!bg-transparent !border-none !shadow-none !text-xs !font-black !pl-4 !h-full !text-slate-700 dark:!text-slate-100"
         />
      </div>

      <!-- Month Selection Group (Upgraded to MultiSelect for Enterprise UX) -->
      <div class="flex flex-col gap-2 flex-grow min-w-[300px]">
         <div class="flex items-center justify-between ml-1">
            <div class="flex items-center gap-1.5">
               <i class="pi pi-chart-bar text-[12px] text-rose-500"></i>
               <span class="text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">Hisobot oylari</span>
            </div>
            <!-- Professional Quarter Presets -->
            <div class="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
               <button @click="setMonths('all')" class="text-[10px] font-black tracking-tight text-rose-500 hover:scale-105 transition-all">Barchasi</button>
               <div class="w-px h-2 bg-slate-200 dark:bg-slate-700"></div>
               <div class="flex gap-2.5">
                  <button @click="setMonths('q1')" :class="isQuarterActive('q1') ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'" class="text-[10px] font-black tracking-tight transition-all">1-Chorak</button>
                  <button @click="setMonths('q2')" :class="isQuarterActive('q2') ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'" class="text-[10px] font-black tracking-tight transition-all">2-Chorak</button>
                  <button @click="setMonths('q3')" :class="isQuarterActive('q3') ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'" class="text-[10px] font-black tracking-tight transition-all">3-Chorak</button>
                  <button @click="setMonths('q4')" :class="isQuarterActive('q4') ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'" class="text-[10px] font-black tracking-tight transition-all">4-Chorak</button>
               </div>
            </div>
         </div>
         
         <MultiSelect
           v-model="filters.months"
           :options="monthOptions"
           optionLabel="name"
           optionValue="id"
           placeholder="Oylarni tanlang"
           display="chip"
           class="w-full"
           :maxSelectedLabels="3"
           :selectedItemsLabel="`{0} ta oy tanlandi`"
           pt:root:class="!min-h-[2.75rem] !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 transition-all shadow-sm !flex !items-center !px-1"
           pt:labelContainer:class="!py-1"
           pt:chip:root:class="!bg-rose-50 dark:!bg-rose-500/10 !text-rose-600 dark:!text-rose-400 !text-[12px] !font-black !px-3 !py-1 !rounded-xl !border-none"
           pt:label:class="!text-xs !font-black !text-slate-700 dark:!text-slate-100 !px-4"
           pt:checkbox:root:class="!rounded-lg"
           pt:checkbox:box:class="!rounded-lg"
         />
      </div>

      <!-- Branch Selection -->
      <div v-if="isManager" class="flex flex-col gap-2 min-w-[200px]">
         <div class="flex items-center gap-1.5 ml-1">
            <i class="pi pi-map-marker text-[12px] text-rose-500"></i>
            <span class="text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">Filial</span>
         </div>
         <Select
           v-model="filters.branch"
           :options="branches"
           optionLabel="name"
           optionValue="id"
           placeholder="Barcha filiallar"
           showClear
           class="w-full"
           pt:root:class="!h-11 !rounded-2xl !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800/40 hover:!border-rose-400 shadow-sm"
           pt:label:class="!text-xs !font-black !h-full !flex !items-center !px-4 !text-slate-700 dark:!text-slate-100"
         />
      </div>

      <!-- Action Button -->
      <div class="shrink-0">
        <button 
          @click="$emit('refresh')"
          class="h-11 px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-[13px] font-black tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-rose-500/30 group"
        >
          <i class="pi pi-sync text-xs group-hover:rotate-180 transition-transform duration-700"></i>
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
import MultiSelect from 'primevue/multiselect'

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

// Month Options
const monthOptions = [
  { id: 1, name: 'Yanvar' },
  { id: 2, name: 'Fevral' },
  { id: 3, name: 'Mart' },
  { id: 4, name: 'Aprel' },
  { id: 5, name: 'May' },
  { id: 6, name: 'Iyun' },
  { id: 7, name: 'Iyul' },
  { id: 8, name: 'Avgust' },
  { id: 9, name: 'Sentyabr' },
  { id: 10, name: 'Oktyabr' },
  { id: 11, name: 'Noyabr' },
  { id: 12, name: 'Dekabr' }
]

// Sync numeric year with Date object for DatePicker
const yearDate = computed({
  get: () => props.filters.year ? new Date(props.filters.year, 0, 1) : null,
  set: (val) => {
    if (val instanceof Date) {
      props.filters.year = val.getFullYear()
    }
  }
})

const isQuarterActive = (type) => {
  const m = props.filters.months || []
  if (type === 'q1') return m.length === 3 && m.includes(1) && m.includes(3)
  if (type === 'q2') return m.length === 3 && m.includes(4) && m.includes(6)
  if (type === 'q3') return m.length === 3 && m.includes(7) && m.includes(9)
  if (type === 'q4') return m.length === 3 && m.includes(10) && m.includes(12)
  return false
}

// Professional UX: Quick selection presets
const setMonths = (type) => {
  if (type === 'all') {
    props.filters.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  } else if (type === 'q1') {
    props.filters.months = [1, 2, 3]
  } else if (type === 'q2') {
    props.filters.months = [4, 5, 6]
  } else if (type === 'q3') {
    props.filters.months = [7, 8, 9]
  } else if (type === 'q4') {
    props.filters.months = [10, 11, 12]
  }
}
</script>


