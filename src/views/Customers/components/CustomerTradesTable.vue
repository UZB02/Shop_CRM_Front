<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <i class="pi pi-shopping-bag text-xs"></i>
        </div>
        <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">{{ $t('customers.trades.title') }}</h3>
      </div>
      <div class="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600/50 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
        {{ $t('customers.trades.count', { count: trades.length }) }}
      </div>
    </div>

    <!-- Table -->
    <div class="flex-grow overflow-x-auto custom-scrollbar">
      <table class="w-full text-left min-w-[500px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800/50">
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900">{{ $t('customers.trades.col_id_date') }}</th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900">{{ $t('customers.trades.col_products') }}</th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900">{{ $t('customers.trades.col_total') }}</th>
            <th class="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 text-right">{{ $t('customers.trades.col_status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/40">
          <template v-if="!trades.length">
            <tr>
              <td colspan="4" class="px-5 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <i class="pi pi-inbox text-lg text-slate-300 dark:text-slate-600"></i>
                  </div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ $t('customers.trades.no_history') }}</p>
                </div>
              </td>
            </tr>
          </template>
          <tr v-for="t in trades" :key="t.id" class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200">
            <td class="px-5 py-3.5">
              <div class="flex flex-col">
                <span class="text-[11px] font-black text-indigo-600 dark:text-indigo-400 tracking-tight">#{{ t.tradeId || t.id }}</span>
                <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                  <i class="pi pi-clock text-[7px]"></i>
                  {{ formatDateTime(t.created_on || t.createdAt) }}
                </span>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex flex-col gap-0.5">
                <template v-if="t.products && t.products.length">
                  <div v-for="(item, idx) in t.products.slice(0, 2)" :key="idx" class="flex items-center gap-1.5">
                    <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                      <span class="text-slate-400 mr-0.5">{{ item.quantity }}x</span>{{ item.product_name || item.product?.name || $t('customers.trades.product_placeholder') }}
                    </span>
                  </div>
                  <span v-if="t.products.length > 2" class="text-[8px] font-black text-indigo-500 uppercase flex items-center gap-1 mt-0.5">
                    <i class="pi pi-plus text-[6px]"></i> {{ $t('customers.trades.more_products', { count: t.products.length - 2 }) }}
                  </span>
                </template>
                <span v-else class="text-[10px] font-bold text-slate-400 italic">{{ $t('customers.trades.no_products') }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex flex-col">
                <span class="text-xs font-black text-slate-800 dark:text-white tracking-tighter">
                  {{ formatCurrency(t.total) }}
                </span>
                <span v-if="t.discount > 0" class="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">
                  -{{ formatCurrency(t.discount) }}
                </span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <span 
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border"
                :class="getStatusClass(t.status)"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-current opacity-75"></div>
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
  if (s.includes('yakunlangan') || s.includes('payed')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
  if (s.includes('qisman') || s.includes('partial')) return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
  if (s.includes('to\'lanmagan') || s.includes('unpaid')) return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
  return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-600/50'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>

