<template>
  <div class="space-y-3">
    <!-- Tab Loading Progress -->
    <div v-if="loading" class="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden rounded-full z-10">
      <div class="h-full bg-emerald-500/40 animate-loading"></div>
    </div>

    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none">
      <!-- Tab Header -->
      <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i class="pi pi-history text-emerald-500 text-sm"></i>
          </div>
          <div>
            <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-widest leading-none">{{ $t('warehouse.detail.incoming_title') }}</h3>
            <p class="text-[12px] text-slate-400 mt-1 font-medium">{{ $t('warehouse.detail.total_count', { count: incomingTotal }) }}</p>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div v-if="incomingHistory.length" class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left min-w-[900px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.amount') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.all') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_description') }}</th>
              <th class="px-5 py-3 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.date') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr v-for="item in incomingHistory" :key="item.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
              <td class="px-5 py-3.5">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center flex-wrap gap-2">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight group-hover:text-emerald-500 transition-colors">
                      {{ item.product_name }}
                    </span>
                    <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                  </div>
                  <span class="text-[11px] font-medium text-slate-400">{{ item.product_barcode }} | {{ item.product_unit }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[12px]">
                  {{ item.quantity }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right text-[12px] font-medium text-slate-500 dark:text-slate-400">
                {{ Number(item.unit_cost || 0).toLocaleString() }}
              </td>
              <td class="px-5 py-3.5 text-right font-black text-slate-800 dark:text-slate-100 text-[12px]">
                {{ Number(item.total_cost || 0).toLocaleString() }}
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white dark:border-slate-700 shadow-sm">
                    {{ item.worker_name?.charAt(0) }}
                  </div>
                  <span class="text-[12px] font-medium text-slate-600 dark:text-slate-400">{{ item.worker_name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span class="text-[12px] text-slate-400 italic font-medium max-w-[150px] truncate block" :title="item.description">
                  {{ item.description || '—' }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <span class="text-[12px] font-bold text-slate-400">{{ item.created_on }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 transition-transform hover:scale-110">
          <i class="pi pi-history text-slate-300 text-2xl"></i>
        </div>
        <h4 class="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-widest">{{ $t('warehouse.detail.no_incoming') }}</h4>
        <p class="text-[12px] text-slate-400 mt-2 max-w-[200px] leading-relaxed">{{ $t('common.no_results_desc') }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination
      v-if="incomingTotal > incomingRows"
      :current-page="incomingPage + 1"
      :total-records="incomingTotal"
      :rows-per-page="incomingRows"
      @page-change="fetchIncoming($event.page)"
    />
  </div>
</template>

<script setup>
import { useBranchIncoming } from '../composables/useBranchIncoming'
import TablePagination from '@/components/TablePagination.vue'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  branchId: { type: [Number, String], required: true }
})

const {
  incomingHistory, incomingTotal, incomingPage, incomingRows, loading, 
  fetchIncoming
} = useBranchIncoming(props.branchId)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
.animate-loading {
  animation: loading 1.5s infinite ease-in-out;
}
</style>


