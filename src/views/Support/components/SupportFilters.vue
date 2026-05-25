<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const props = defineProps({
  search: String,
  selectedStatus: String,
  selectedPriority: String
})

const emit = defineEmits(['update:search', 'update:selectedStatus', 'update:selectedPriority'])

const { t } = useI18n()

// Options for status dropdown
const statusOptions = computed(() => [
  { label: t('support_page.all_statuses'), value: 'all' },
  { label: `${t('support_page.statuses.open')} (Open)`, value: 'open' },
  { label: `${t('support_page.statuses.in_progress')} (In Progress)`, value: 'in_progress' },
  { label: `${t('support_page.statuses.resolved')} (Resolved)`, value: 'resolved' },
  { label: `${t('support_page.statuses.closed')} (Closed)`, value: 'closed' }
])

// Options for priority dropdown
const priorityOptions = computed(() => [
  { label: t('support_page.all_priorities'), value: 'all' },
  { label: `${t('support_page.priorities.low')} (Low)`, value: 'low' },
  { label: `${t('support_page.priorities.medium')} (Medium)`, value: 'medium' },
  { label: `${t('support_page.priorities.high')} (High)`, value: 'high' },
  { label: `${t('support_page.priorities.urgent')} (Urgent)`, value: 'urgent' }
])

// Helper for status colored indicator
const getStatusColorClass = (value) => {
  switch (value) {
    case 'open': return 'bg-sky-500 shadow-sm shadow-sky-500/40 animate-pulse'
    case 'in_progress': return 'bg-amber-500 shadow-sm shadow-amber-500/40'
    case 'resolved': return 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
    case 'closed': return 'bg-slate-400 dark:bg-slate-600'
    default: return 'bg-slate-300 dark:bg-slate-700'
  }
}

const getStatusLabel = (value) => {
  const option = statusOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}

// Helper for priority colored indicator
const getPriorityColorClass = (value) => {
  switch (value) {
    case 'urgent': return 'bg-rose-500 shadow-sm shadow-rose-500/40 animate-pulse'
    case 'high': return 'bg-orange-500 shadow-sm shadow-orange-500/40'
    case 'medium': return 'bg-amber-500 shadow-sm shadow-amber-500/40'
    case 'low': return 'bg-slate-400 dark:bg-slate-600'
    default: return 'bg-slate-300 dark:bg-slate-700'
  }
}

const getPriorityLabel = (value) => {
  const option = priorityOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>

<template>
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <!-- Search query field -->
      <div class="relative group">
        <IconField class="w-full relative">
          <InputIcon class="pi pi-search text-slate-400 text-xs transition-colors group-focus-within:text-emerald-500" />
          <InputText 
            :value="search"
            @input="emit('update:search', $event.target.value)"
            type="text"
            :placeholder="$t('support_page.search_placeholder')"
            class="w-full h-11"
            pt:root:class="!w-full !h-11 !pl-10 !pr-4 !text-xs !font-black !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 !bg-slate-50/50 dark:!bg-slate-800/40 focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 !text-slate-800 dark:!text-slate-100 placeholder:!text-slate-400 transition-all !tracking-wide"
          />
        </IconField>
      </div>

      <!-- Status filter dropdown -->
      <div>
        <Select 
          :modelValue="selectedStatus"
          @update:modelValue="emit('update:selectedStatus', $event)"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          pt:root:class="!h-11 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all"
          pt:label:class="!text-xs !font-black !flex !items-center !py-0 !px-4 !tracking-wide !text-slate-700 dark:!text-slate-200"
        >
          <!-- Custom value display -->
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full flex shrink-0" :class="getStatusColorClass(slotProps.value)"></span>
              <span class="font-extrabold text-xs tracking-wide">{{ getStatusLabel(slotProps.value) }}</span>
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>

          <!-- Custom option display in overlay panel -->
          <template #option="slotProps">
            <div class="flex items-center gap-2.5 py-0.5">
              <span class="w-2.5 h-2.5 rounded-full flex shrink-0" :class="getStatusColorClass(slotProps.option.value)"></span>
              <span class="font-black text-xs tracking-wide text-slate-700 dark:text-slate-200">{{ slotProps.option.label }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Priority filter dropdown -->
      <div>
        <Select 
          :modelValue="selectedPriority"
          @update:modelValue="emit('update:selectedPriority', $event)"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          pt:root:class="!h-11 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all"
          pt:label:class="!text-xs !font-black !flex !items-center !py-0 !px-4 !tracking-wide !text-slate-700 dark:!text-slate-200"
        >
          <!-- Custom value display -->
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full flex shrink-0" :class="getPriorityColorClass(slotProps.value)"></span>
              <span class="font-extrabold text-xs tracking-wide">{{ getPriorityLabel(slotProps.value) }}</span>
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>

          <!-- Custom option display in overlay panel -->
          <template #option="slotProps">
            <div class="flex items-center gap-2.5 py-0.5">
              <span class="w-2.5 h-2.5 rounded-full flex shrink-0" :class="getPriorityColorClass(slotProps.option.value)"></span>
              <span class="font-black text-xs tracking-wide text-slate-700 dark:text-slate-200">{{ slotProps.option.label }}</span>
            </div>
          </template>
        </Select>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Overriding standard overlay position behavior slightly if needed */
:deep(.p-select-overlay) {
  margin-top: 4px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
  background: white !important;
}
.dark :deep(.p-select-overlay) {
  background: #0f172a !important;
  border-color: #1e293b !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
</style>
