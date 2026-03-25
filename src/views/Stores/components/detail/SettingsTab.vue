<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
     <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
           <h4 class="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <i class="pi pi-cog text-emerald-500"></i> {{ $t('stores.detail.settings_title') }}
           </h4>
           <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                 <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{{ $t('stores.detail.main_currency') }}</span>
                 <span class="text-[10px] font-black text-slate-800 dark:text-slate-100">UZS</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                 <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{{ $t('stores.detail.vat') }}</span>
                 <span class="text-[10px] font-black text-slate-800 dark:text-slate-100">12%</span>
              </div>
           </div>
        </div>
        <div class="space-y-6">
           <h4 class="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <i class="pi pi-shield text-emerald-500"></i> {{ $t('stores.detail.security') }}
           </h4>
           <div class="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">
                 {{ $t('stores.detail.security_desc') }}
              </p>
           </div>
        </div>
     </div>
  </div>
</template>

<script setup>
defineProps({
  store: {
    type: Object,
    default: () => ({})
  }
})
</script>
