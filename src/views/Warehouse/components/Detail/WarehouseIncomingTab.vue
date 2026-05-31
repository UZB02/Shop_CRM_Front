<template>
  <div class="space-y-3">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <!-- Table header info -->
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
        <h3 class="text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.incoming_title') }}</h3>
        <span class="text-[12px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {{ $t('warehouse.detail.total_count', { count: total }) }}
        </span>
      </div>

      <!-- Incoming table -->
      <div v-if="history.length" class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left min-w-[950px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.amount') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.all') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('menu.suppliers') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_description') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.date') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr
              v-for="item in history"
              :key="item.id"
              class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
              :class="{ 'opacity-60 bg-slate-50/10 dark:bg-slate-800/5': item.is_void || item.is_voided || item.status === 'voided' }"
            >
              <!-- Product -->
              <td class="px-4 py-2.5">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-xs font-bold tracking-tight"
                      :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-700 dark:text-slate-200' ]"
                    >
                      {{ item.product_name }}
                    </span>
                    <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                  </div>
                  <span class="text-[11px] font-medium text-slate-400">
                     {{ item.product_barcode }} | {{ item.product_unit }}
                  </span>
                </div>
              </td>
              <!-- Quantity -->
              <td class="px-4 py-2.5 text-right">
                <span 
                  class="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold text-[12px]"
                  :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' ]"
                >
                  {{ item.quantity }}
                </span>
              </td>
              <!-- Price -->
              <td class="px-4 py-2.5 text-right text-[12px] text-slate-500 dark:text-slate-400">
                {{ Number(item.unit_cost).toLocaleString() }}
              </td>
              <!-- Total -->
              <td class="px-4 py-2.5 text-right font-black text-[12px]">
                <span 
                  :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 line-through decoration-rose-500/40' : 'text-slate-800 dark:text-slate-100' ]"
                >
                  {{ Number(item.total_cost).toLocaleString() }}
                </span>
              </td>
              <!-- Supplier -->
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-1.5" v-if="item.supplier_name">
                  <div class="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-500 border border-indigo-100 dark:border-indigo-500/20">
                    {{ item.supplier_name.charAt(0) }}
                  </div>
                  <span class="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                    {{ item.supplier_name }}
                  </span>
                </div>
                <span v-else class="text-[12px] text-slate-400">—</span>
              </td>
              <!-- Worker -->
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {{ item.worker_name?.charAt(0) }}
                  </div>
                  <span class="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                    {{ item.worker_name }}
                  </span>
                </div>
              </td>
              <!-- Description -->
              <td class="px-4 py-2.5">
                <div class="flex flex-col gap-1 text-left">
                  <span 
                    class="text-[12px] font-medium max-w-[150px] truncate block" 
                    :class="[ (item.is_void || item.is_voided || item.status === 'voided') ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-600 dark:text-slate-300' ]"
                    :title="item.description"
                  >
                    {{ item.description || '—' }}
                  </span>
                  <span 
                    v-if="(item.is_void || item.is_voided || item.status === 'voided') && item.void_reason" 
                    class="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-500 dark:text-rose-400 tracking-wide bg-rose-500/5 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/10 max-w-[180px] truncate"
                    :title="item.void_reason"
                  >
                    <i class="pi pi-info-circle text-[9px]"></i>
                    {{ item.void_reason }}
                  </span>
                </div>
              </td>
              <!-- Date -->
              <td class="px-4 py-2.5 text-right text-[12px] text-slate-400">
                {{ item.created_on }}
              </td>
              <!-- Actions -->
              <td class="px-4 py-2.5 text-right">
                <div class="flex items-center justify-end">
                  <span 
                    v-if="item.is_void || item.is_voided || item.status === 'voided'" 
                    class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm"
                    :title="`${$t('warehouse.detail.void_status_voided')}${item.void_reason ? ': ' + item.void_reason : ''}`"
                  >
                    <i class="pi pi-times text-sm"></i>
                  </span>
                  <button 
                    v-else 
                    @click="$emit('void', item)" 
                    class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-slate-100 dark:border-slate-800/60 active:scale-90 transition-all flex items-center justify-center" 
                    :title="$t('warehouse.detail.void_btn')"
                  >
                    <i class="pi pi-trash text-sm"></i>
                  </button>
                </div>
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

defineEmits(['page-change', 'void'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
