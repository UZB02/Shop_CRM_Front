<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-20 flex flex-col items-center justify-center opacity-40 min-h-[300px]">
      <i class="pi pi-id-card text-4xl mb-4 text-slate-300"></i>
      <p class="text-[10px] font-black uppercase tracking-widest">{{ $t('stores.branch_detail.no_customers') }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customers: Array
})
</script>
