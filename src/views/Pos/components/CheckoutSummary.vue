<template>
  <div class="relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 p-5 rounded-[28px] border border-slate-100 dark:border-slate-800/60 text-center">
    <!-- Background shimmer effects -->
    <div class="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full animate-pulse"></div>
    <div class="absolute -bottom-16 -right-16 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full animate-pulse-slow"></div>
    
    <span class="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-2 opacity-60">Umumiy to'lanishi lozim</span>
    <div class="flex flex-col items-center gap-0.5">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter leading-none">
        {{ formatCurrency(total).replace('UZS','') }}
      </h2>
      <span class="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">O'zbek so'mi (UZS)</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ total: Number })
const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
</script>

<style scoped>
.animate-pulse-slow { animation: pulse 6s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
</style>
