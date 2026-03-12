<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl h-full flex flex-col">
    <!-- Header -->
    <div class="px-8 py-5 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
      <h3 class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ $t('customers.trades.title') }}</h3>
      <div class="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-[9px] font-black text-indigo-500 uppercase tracking-widest">
        {{ $t('customers.trades.count', { count: trades.length }) }}
      </div>
    </div>

    <!-- Table -->
    <div class="flex-grow overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="bg-slate-50/30 dark:bg-slate-800/20">
            <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{{ $t('customers.trades.col_id_date') }}</th>
            <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{{ $t('customers.trades.col_products') }}</th>
            <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{{ $t('customers.trades.col_total') }}</th>
            <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">{{ $t('customers.trades.col_status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
          <template v-if="!trades.length">
            <tr>
              <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic text-sm">
                {{ $t('customers.trades.no_history') }}
              </td>
            </tr>
          </template>
          <tr v-for="t in trades" :key="t.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="text-[11px] font-black text-indigo-500 tracking-tight">#{{ t.tradeId || t.id }}</span>
                <span class="text-[9px] font-bold text-slate-400 mt-0.5">{{ formatDateTime(t.created_on || t.createdAt) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-0.5">
                <template v-if="t.products && t.products.length">
                  <div v-for="(item, idx) in t.products.slice(0, 2)" :key="idx" class="flex items-center gap-1">
                    <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {{ item.quantity }}x {{ item.product_name || item.product?.name || $t('customers.trades.product_placeholder') }}
                    </span>
                  </div>
                  <span v-if="t.products.length > 2" class="text-[8px] font-black text-slate-400 uppercase">
                    {{ $t('customers.trades.more_products', { count: t.products.length - 2 }) }}
                  </span>
                </template>
                <span v-else class="text-[10px] text-slate-400 tracking-tight">{{ $t('customers.trades.no_products') }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-[11px] font-black text-slate-800 dark:text-white tracking-tighter">
                {{ formatCurrency(t.total) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <span 
                class="inline-flex px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border"
                :class="getStatusClass(t.status)"
              >
                {{ t.status_display || t.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  trades: { type: Array, default: () => [] }
})

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val || 0)
}

const getStatusClass = (status) => {
  const s = String(status).toLowerCase()
  if (s.includes('yakunlangan') || s.includes('payed')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  if (s.includes('qisman') || s.includes('partial')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  if (s.includes('to\'lanmagan') || s.includes('unpaid')) return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
}
</script>

