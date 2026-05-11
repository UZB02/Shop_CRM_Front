<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="text-xs font-bold text-slate-500 tracking-widest border-b border-slate-50 dark:border-slate-800 pb-3">{{ $t('subscription.faq') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer flex justify-between items-center group">
          <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300">{{ $t('subscription.faq_question_1') }}</span>
          <i class="pi pi-chevron-right text-[10px] text-slate-400 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>

    <div class="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-500/10">
      <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div>
        <h3 class="text-sm font-bold tracking-tight mb-2">{{ $t('subscription.enterprise_title') }}</h3>
        <p class="text-[12px] text-indigo-100 font-medium leading-relaxed opacity-90">{{ $t('subscription.enterprise_desc') }}</p>
      </div>
      <Button :label="$t('subscription.contact_us')" severity="contrast" class="!rounded-lg !py-2 !text-[12px] !font-bold !!tracking-widest mt-6 !w-full" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>
