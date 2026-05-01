<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Search -->
    <div class="relative flex-1 min-w-[220px]">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"></i>
      <input
        v-model="modelValue.search"
        type="text"
        :placeholder="$t('common.search') + '...'"
        class="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
      />
      <button
        v-if="modelValue.search"
        @click="modelValue.search = ''"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
      >
        <i class="pi pi-times text-[11px]"></i>
      </button>
    </div>

    <!-- Role Filter -->
    <select
      v-model="modelValue.role"
      class="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none pr-8 min-w-[140px]"
    >
      <option :value="null">{{ $t('workers.role') }}</option>
      <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <!-- Status Filter -->
    <select
      v-model="modelValue.status"
      class="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none pr-8 min-w-[120px]"
    >
      <option :value="null">{{ $t('common.status') }}</option>
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>

    <!-- Branch Filter (Fallback for mobile/no-sidebar view if needed, or simply removed if sidebar exists) -->
    <!-- We keep it as a select for mobile compatibility if sidebar is hidden -->
    <select
      v-model="modelValue.branch"
      class="lg:hidden h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none pr-8 min-w-[140px]"
    >
      <option :value="null">{{ $t('workers.branch') }}</option>
      <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  roleOptions: Array,
  statusOptions: Array,
  branches: Array,
  loadingLocations: Boolean
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Remove PrimeVue styles since we're using native elements */
</style>



