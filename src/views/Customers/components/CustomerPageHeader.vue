<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-home text-[9px]"></i>
          {{ $t('menu.dashboard') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-widest">{{ $t('customers.title') }}</span>
      </div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('customers.management_title') || 'Mijozlar Boshqaruvi' }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ totalRecords }} {{ $t('customers.subtitle') }}</p>
    </div>
    
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
      <div class="relative group/search w-full sm:min-w-[240px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] transition-colors group-focus-within/search:text-emerald-500"></i>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text" 
          :placeholder="$t('customers.search_placeholder')" 
          class="w-full h-9 sm:h-8 pl-8 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all outline-none"
        />
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="$router.push('/dashboard/customers/groups')"
          class="flex-1 h-9 sm:h-8 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-users text-[10px]"></i>
          <span>{{ $t('customers.groups_btn') }}</span>
        </button>
        <button 
          @click="$emit('add')"
          class="flex-1 h-9 sm:h-8 px-3 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <i class="pi pi-plus text-[10px]"></i>
          <span>{{ $t('customers.new_customer') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalRecords: { type: Number, default: 0 },
  searchQuery: { type: String, default: '' }
})
defineEmits(['update:searchQuery', 'add'])
</script>
