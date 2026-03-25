<template>
  <div class="space-y-4">
    <div v-if="!smenas?.length" class="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-100 dark:border-slate-800 text-center">
       <div class="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
         <i class="pi pi-calendar text-slate-300 text-2xl"></i>
       </div>
       <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $t('stores.detail.shifts_empty') }}</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="smena in smenas" :key="smena.id" class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <i class="pi pi-clock text-sm"></i>
          </div>
          <div>
            <p class="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{{ smena.pos_name }}</p>
            <p class="text-[9px] font-bold text-slate-400">{{ $t('stores.detail.shift_opened', { date: smena.opened_at }) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[11px] font-black text-emerald-500 tracking-tight">{{ Number(smena.cash_balance).toLocaleString() }} UZS</p>
          <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('stores.detail.cash_balance') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  smenas: {
    type: Array,
    default: () => []
  }
})
</script>
