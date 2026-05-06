<template>
  <div class="flex gap-3 mt-1">
    <button 
      @click="$emit('cancel')"
      class="flex-1 py-4 px-4 rounded-2xl font-black text-[11px] tracking-widest text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all active:scale-95"
    >
      {{ $t('common.cancel') }}
    </button>
    <button 
      @click="$emit('confirm')"
      :disabled="!isValid || loading"
      class="flex-[1.5] py-4 px-4 rounded-2xl font-black text-[12px] tracking-[0.2em] text-white transition-all shadow-xl disabled:opacity-30 active:scale-95 relative overflow-hidden group"
      :class="[
         loading ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
      ]"
    >
      <div class="flex items-center justify-center gap-2 relative z-10">
        <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
        <span>{{ loading ? '...' : $t('pos.sell') }}</span>
        <i v-if="!loading" class="pi pi-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isValid: Boolean,
  loading: Boolean
})
defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
@keyframes shimmer { 100% { transform: translateX(100%); } }
.group-hover\:animate-shimmer { animation: shimmer 1s infinite; }
</style>


