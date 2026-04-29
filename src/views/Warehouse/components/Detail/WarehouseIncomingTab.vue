<template>
  <div class="space-y-3">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <!-- Table header info -->
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.incoming_title') }}</h3>
        <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {{ $t('warehouse.detail.total_count', { count: total }) }}
        </span>
      </div>

      <!-- Incoming table -->
      <div v-if="history.length" class="overflow-x-auto">
        <table class="w-full text-left min-w-[900px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.amount') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('common.all') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $t('warehouse.detail.col_description') }}</th>
              <th class="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{{ $t('common.date') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr
              v-for="item in history"
              :key="item.id"
              class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
            >
              <td class="px-4 py-2.5">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                      {{ item.product_name }}
                    </span>
                    <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                  </div>
                  <span class="text-[9px] font-medium text-slate-400">
                     {{ item.product_barcode }} | {{ item.product_unit }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2.5 text-right">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  {{ item.quantity }}
                </span>
              </td>
              <td class="px-4 py-2.5 text-right text-[10px] text-slate-500 dark:text-slate-400">
                {{ Number(item.unit_cost).toLocaleString() }}
              </td>
              <td class="px-4 py-2.5 text-right font-black text-slate-800 dark:text-slate-100 text-[10px]">
                {{ Number(item.total_cost).toLocaleString() }}
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                    {{ item.worker_name?.charAt(0) }}
                  </div>
                  <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {{ item.worker_name }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2.5">
                <span class="text-[10px] text-slate-400 italic">
                  {{ item.description || '—' }}
                </span>
              </td>
              <td class="px-4 py-2.5 text-right text-[10px] text-slate-400">
                {{ item.created_on }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
          <i class="pi pi-history text-slate-400 text-lg"></i>
        </div>
        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {{ $t('warehouse.detail.no_incoming') }}
        </p>
      </div>

      <!-- Pagination -->
      <div class="border-t border-slate-100 dark:border-slate-800">
        <TablePagination
          :currentPage="page"
          :totalRecords="total"
          :rowsPerPage="rows"
          @page-change="$emit('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import TablePagination from '@/components/TablePagination.vue'
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  history: { type: Array, required: true },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  rows: { type: Number, default: 10 }
})

defineEmits(['page-change'])
</script>
