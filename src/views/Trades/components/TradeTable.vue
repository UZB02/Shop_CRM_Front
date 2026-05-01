<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm backdrop-blur-xl border border-slate-100/50 dark:border-slate-800/30">
    <div class="overflow-x-auto min-h-[400px]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.trades.col_id_date') }}</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.table.name') }}</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter">Filial / Xodim</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter text-right">Summa</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter text-center">To'lov turi</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter text-center">{{ $t('customers.trades.col_status') }}</th>
            <th class="px-6 py-4 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 font-inter text-right">{{ $t('customers.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <!-- Loading -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td v-for="j in 7" :key="j" class="px-6 py-4">
                <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" :class="j === 1 ? 'w-24' : 'w-full'"></div>
              </td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!trades.length">
            <tr>
              <td colspan="7" class="py-20 text-center">
                <div class="space-y-4">
                  <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                    <i class="pi pi-receipt text-slate-300"></i>
                  </div>
                  <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">Savdolar topilmadi</p>
                </div>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <tr 
            v-for="trade in trades" 
            :key="trade.id" 
            @click="$emit('view', trade)"
            class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0"
          >
            <!-- ID & Date -->
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="text-[13px] font-black text-slate-900 dark:text-white leading-none mb-1">#{{ trade.id }}</span>
                <span class="text-[11px] font-bold text-slate-400 tracking-tighter italic">
                  {{ trade.created_on }}
                </span>
              </div>
            </td>

            <!-- Customer -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                  <i class="pi pi-user text-[12px]"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-[13px] font-black text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {{ trade.customer_name || 'Amaliyotchi Mijoz' }}
                  </span>
                  <span v-if="!trade.customer_name" class="text-[10px] font-black text-slate-400 tracking-widest mt-0.5">Tezkor savdo</span>
                </div>
              </div>
            </td>

            <!-- Branch & Worker -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <i class="pi pi-map-marker text-[11px] text-emerald-500"></i>
                  <span class="text-[12px] font-black truncate max-w-[120px]">{{ trade.branch_name }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                  <i class="pi pi-user text-[10px]"></i>
                  <span class="text-[11px] font-bold">{{ trade.worker_name }}</span>
                </div>
              </div>
            </td>

            <!-- Pricing -->
            <td class="px-6 py-4 text-right">
              <div class="flex flex-col">
                <span class="text-[14px] font-black text-slate-900 dark:text-white tracking-tighter">{{ formatCurrency(trade.total_price) }}</span>
                <div v-if="parseFloat(trade.discount_amount) > 0" class="flex items-center justify-end gap-1 mt-0.5">
                  <span class="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1 rounded">-{{ formatCurrency(trade.discount_amount) }}</span>
                </div>
              </div>
            </td>

            <!-- Payment Type -->
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center">
                <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest flex items-center gap-1.5 border', getPaymentStyle(trade.payment_type)]">
                  <div :class="['w-1 h-1 rounded-full', getPaymentDotColor(trade.payment_type)]"></div>
                  {{ trade.payment_type_display }}
                </span>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 text-center">
              <div class="flex justify-center">
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest border', getStatusStyle(trade.status)]">
                  {{ trade.status_display }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20 active:scale-95">
                <i class="pi pi-eye text-[12px]"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalRecords > 0" 
         class="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div class="text-[12px] font-black text-slate-400 tracking-widest leading-none">
        SAHIFA {{ page }} / {{ Math.ceil(totalRecords / pageSize) }}
      </div>
      <div class="flex items-center gap-1">
        <button @click="$emit('page-change', page - 1)" :disabled="page <= 1"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-left text-[12px]"></i>
        </button>
        
        <button @click="$emit('page-change', page + 1)" :disabled="page * pageSize >= totalRecords"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
          <i class="pi pi-angle-right text-[12px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  trades: Array,
  loading: Boolean,
  totalRecords: Number,
  page: Number,
  pageSize: Number
})

defineEmits(['view', 'page-change'])

const formatCurrency = (val) => settingsStore.formatPrice(val)

const getPaymentStyle = (type) => {
  switch (type) {
    case 'cash': return 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10'
    case 'card': return 'bg-blue-500/5 text-blue-600 border-blue-500/10'
    case 'mixed': return 'bg-amber-500/5 text-amber-600 border-amber-500/10'
    case 'debt': return 'bg-rose-500/5 text-rose-600 border-rose-500/10'
    default: return 'bg-slate-500/5 text-slate-600 border-slate-500/10'
  }
}

const getPaymentDotColor = (type) => {
  switch (type) {
    case 'cash': return 'bg-emerald-500'
    case 'card': return 'bg-blue-500'
    case 'mixed': return 'bg-amber-500'
    case 'debt': return 'bg-rose-500'
    default: return 'bg-slate-500'
  }
}

const getStatusStyle = (status) => {
  if (status === 'completed') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  if (status === 'pending') return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
}
</script>


