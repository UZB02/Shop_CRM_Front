<script setup>
defineProps({
  search: String,
  selectedStatus: String,
  selectedPriority: String
})

const emit = defineEmits(['update:search', 'update:selectedStatus', 'update:selectedPriority'])
</script>

<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Search query -->
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        <input 
          :value="search"
          @input="emit('update:search', $event.target.value)"
          type="text"
          :placeholder="$t('support_page.search_placeholder')"
          class="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>
      <!-- Status filter -->
      <div class="relative">
        <select 
          :value="selectedStatus"
          @change="emit('update:selectedStatus', $event.target.value)"
          class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-all cursor-pointer"
        >
          <option value="all">{{ $t('support_page.all_statuses') }}</option>
          <option value="open">{{ $t('support_page.statuses.open') }} (Open)</option>
          <option value="in_progress">{{ $t('support_page.statuses.in_progress') }} (In Progress)</option>
          <option value="resolved">{{ $t('support_page.statuses.resolved') }} (Resolved)</option>
          <option value="closed">{{ $t('support_page.statuses.closed') }} (Closed)</option>
        </select>
        <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"></i>
      </div>
      <!-- Priority filter -->
      <div class="relative">
        <select 
          :value="selectedPriority"
          @change="emit('update:selectedPriority', $event.target.value)"
          class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-all cursor-pointer"
        >
          <option value="all">{{ $t('support_page.all_priorities') }}</option>
          <option value="low">{{ $t('support_page.priorities.low') }} (Low)</option>
          <option value="medium">{{ $t('support_page.priorities.medium') }} (Medium)</option>
          <option value="high">{{ $t('support_page.priorities.high') }} (High)</option>
          <option value="urgent">{{ $t('support_page.priorities.urgent') }} (Urgent)</option>
        </select>
        <i class="pi pi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"></i>
      </div>
    </div>
  </div>
</template>
