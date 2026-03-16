<template>
  <div class="flex flex-wrap gap-3 items-center">

    <!-- Search Input -->
    <div class="flex-1 min-w-[260px] relative group">
      <!-- Icon -->
      <div class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none z-10 transition-colors group-focus-within:text-emerald-500 text-slate-400">
        <i class="pi pi-search text-sm"></i>
      </div>
      <!-- Input -->
      <InputText
        :modelValue="searchQuery"
        @update:modelValue="onSearch"
        :placeholder="$t('products.search_placeholder')"
        class="w-full"
        pt:root:class="!w-full !h-10 sm:!h-12 !pl-10 sm:!pl-11 !pr-4 !rounded-xl sm:!rounded-2xl !border !border-slate-200 dark:!border-slate-700/60 !bg-white dark:!bg-slate-800/70 !text-[13px] sm:!text-sm !font-medium !text-slate-700 dark:!text-slate-200 placeholder:!text-slate-400 dark:placeholder:!text-slate-500 !shadow-none focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 !transition-all !duration-300"
      />
      <!-- Clear button -->
      <button
        v-if="searchQuery"
        @click="onSearch('')"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
      >
        <i class="pi pi-times text-[10px]"></i>
      </button>
    </div>

    <!-- Status Filter -->
    <div class="flex items-center gap-2">
      <Select
        :modelValue="selectedStatus"
        @update:modelValue="$emit('update:selectedStatus', $event)"
        :placeholder="$t('common.status')"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        showClear
        @change="$emit('change')"
        pt:root:class="!h-10 sm:!h-12 !min-w-[140px] !rounded-xl sm:!rounded-2xl !border !border-slate-200 dark:!border-slate-700/60 !bg-white dark:!bg-slate-800/70 !shadow-none focus:!border-emerald-500"
        pt:label:class="!text-xs sm:!text-sm !font-semibold !text-slate-700 dark:!text-slate-200"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center gap-2">
            <div :class="['w-1.5 h-1.5 rounded-full', slotProps.value === 'active' ? 'bg-emerald-500' : 'bg-rose-500']"></div>
            <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-white">{{ statusOptions.find(s => s.value === slotProps.value)?.label }}</span>
          </div>
          <span v-else class="text-xs sm:text-sm text-slate-400 font-medium">{{ slotProps.placeholder }}</span>
        </template>
      </Select>

      <!-- Refresh -->
      <button
        @click="$emit('refresh')"
        :disabled="loading"
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/70 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-400/50 transition-all disabled:opacity-50 group"
      >
        <i class="pi pi-refresh text-xs sm:text-sm transition-transform duration-500 group-hover:rotate-180" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const props = defineProps({
  searchQuery: String,
  selectedStatus: [String, null],
  loading: Boolean
})

const emit = defineEmits(['update:searchQuery', 'update:selectedStatus', 'change', 'refresh', 'search'])

const statusOptions = [
  { label: 'Faol', value: 'active' },
  { label: 'Nofaol', value: 'inactive' }
]
let searchTimeout = null
const onSearch = (val) => {
  emit('update:searchQuery', val)
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', val)
  }, 500)
}
</script>
