<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
    <div class="px-4 py-2 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
      <h3 class="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
        {{ $t('common.recent_activity') }}
      </h3>
      <button 
        @click="$emit('viewAll')"
        class="text-[8px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest transition-colors"
      >
        {{ $t('common.view_all') }}
      </button>
    </div>
    <div class="divide-y divide-slate-50 dark:divide-slate-800/50">
      <div 
        v-for="trade in recentTrades" 
        :key="trade.id" 
        @click="$emit('selectTrade', trade)"
        class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
              <i class="pi pi-shopping-cart text-[10px] text-slate-400"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ trade.items?.[0]?.product_name || 'Savdo' }}</p>
                <span v-if="trade.items?.length > 1" class="text-[7px] font-black text-slate-400 uppercase tracking-widest">+{{ trade.items.length - 1 }} {{ $t('common.more') }}</span>
              </div>
              <p class="text-[8px] font-bold text-slate-400">
                <template v-if="trade.created_on">
                   {{ trade.created_on.split('|')[0] }} <span class="mx-1 text-slate-300">|</span> {{ trade.created_on.split('|')[1] }}
                </template>
                <template v-else-if="trade.created_at">
                   {{ formatDate(trade.created_at) }}
                </template>
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-800 dark:text-white mb-0.5">{{ formatCurrency(trade.net_price) }}</p>
            <span :class="['text-[6px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest', trade.payment_type === 'cash' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500']">
              {{ trade.payment_type_display || trade.payment_type }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="!recentTrades?.length" class="p-8 text-center">
        <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{ $t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recentTrades: {
    type: Array,
    default: () => []
  }
})

defineEmits(['viewAll', 'selectTrade'])

const formatCurrency = (val) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
