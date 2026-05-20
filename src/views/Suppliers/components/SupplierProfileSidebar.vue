<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-xl p-4 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group h-fit">
    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-1000"></div>
    
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-14 h-14 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-100 dark:border-white/10 flex items-center justify-center text-xl font-black mb-3 shadow-inner text-emerald-500">
        {{ initials }}
      </div>
      <h2 class="text-xs sm:text-sm font-black tracking-tight mb-2 text-center w-full">{{ supplier.name }}</h2>
      <div class="flex flex-wrap justify-center gap-1.5 mb-6">
        <span class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest whitespace-nowrap"
          :class="supplier.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'">
          {{ supplier.status === 'active' ? $t('common.active') : $t('common.inactive') }}
        </span>
      </div>
      
      <div class="w-full space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('suppliers.table.phone') }}</span>
            <span class="text-[12px] font-black text-slate-700 dark:text-slate-300 truncate">{{ supplier.phone || '—' }}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('suppliers.form.address') }}</span>
            <span class="text-[12px] font-black text-slate-700 dark:text-slate-300 truncate" :title="supplier.address">{{ supplier.address || '—' }}</span>
        </div>
        <div class="flex items-center justify-between gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest leading-none">{{ $t('common.created_at') }}</span>
            <span class="text-[11px] font-black text-slate-700 dark:text-slate-300">{{ supplier.created_on || '-' }}</span>
        </div>
      </div>

      <button 
        v-if="supplier.status === 'active'"
        @click="$emit('payDebt')"
        class="w-full mt-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black tracking-[0.15em] shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <i class="pi pi-wallet text-[12px]"></i>
        {{ $t('suppliers.pay_tooltip') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  supplier: {
    type: Object,
    required: true
  }
})

defineEmits(['payDebt'])

const initials = computed(() => {
  if (!props.supplier.name) return '?'
  const parts = props.supplier.name.split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
})
</script>
