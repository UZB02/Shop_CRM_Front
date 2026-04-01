<template>
  <div class="flex flex-wrap items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
    <div class="flex flex-col">
      <h1 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">{{ $t('customers.title') }}</h1>
      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ totalRecords }} {{ $t('customers.subtitle') }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative group/search min-w-[280px]">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs transition-colors group-focus-within/search:text-emerald-500"></i>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text" 
          :placeholder="$t('customers.search_placeholder')" 
          class="w-full pl-10 pr-4 py-2 text-[12px] font-bold rounded-xl bg-slate-50 dark:bg-slate-800/40 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
        />
      </div>

      <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

      <Button 
        :label="$t('customers.groups_btn')" 
        icon="pi pi-users" 
        severity="secondary" 
        text
        class="!text-[11px] !font-black !uppercase !tracking-widest !rounded-xl !px-3"
        @click="$router.push('/dashboard/customers/groups')" 
      />
      <Button 
        :label="$t('customers.new_customer')" 
        icon="pi pi-plus" 
        severity="success" 
        class="!text-[11px] !font-black !uppercase !tracking-widest !rounded-xl !px-4 !bg-emerald-500 !border-none !shadow-xl !shadow-emerald-500/10 active:scale-95 transition-all text-white"
        @click="$emit('add')" 
      />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'

const props = defineProps({
  totalRecords: { type: Number, default: 0 },
  searchQuery: { type: String, default: '' }
})

defineEmits(['update:searchQuery', 'add'])
</script>
