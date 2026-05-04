<template>
  <div class="space-y-3">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <!-- Table toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            type="text"
            :placeholder="$t('warehouse.detail.search_products')"
            class="h-8 pl-8 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 w-64 transition-all"
          />
        </div>
        <div class="text-[12px] font-bold text-slate-400 tracking-widest">
          {{ products.length }} / {{ totalProducts }} {{ $t('products.title') }}
        </div>
      </div>

      <!-- Products table -->
      <div v-if="products.length" class="overflow-x-auto">
        <table class="w-full text-left min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest w-10">№</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest">{{ $t('products.form.barcode') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-center">{{ $t('products.form.amount') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.col_price') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.date') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest text-center w-12">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr
              v-for="(item, index) in products"
              :key="item.product_id"
              class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group"
            >
              <td class="px-4 py-2 text-[12px] text-slate-400">{{ index + 1 }}</td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover" />
                    <i v-else class="pi pi-image text-slate-300 text-[12px]"></i>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center flex-wrap gap-2">
                      <span class="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors truncate max-w-[180px]">
                        {{ item.product_name }}
                      </span>
                      <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                    </div>
                    <span v-if="item.category_name" class="text-[11px] text-slate-400 tracking-widest mt-0.5">{{ item.category_name }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <code class="text-[12px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    {{ item.barcode || '—' }}
                  </code>
                  <button 
                    v-if="item.barcode"
                    @click="$emit('show-barcode', item)"
                    class="w-5 h-5 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                    v-tooltip.right="$t('products.view_barcode') || 'Shtrix-kodni ko\'rish'"
                  >
                    <i class="pi pi-barcode text-[12px]"></i>
                  </button>
                </div>
              </td>
              <td class="px-4 py-2 text-center text-[12px]">
                <span 
                  class="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
                  :class="settingsStore.isLowStockEnabled && item.quantity <= settingsStore.lowStockThreshold 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'"
                 >
                  {{ item.quantity }} <span class="ml-1 opacity-60 font-medium">{{ $t('common.pcs') || 'dona' }}</span>
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                  {{ Number(item.purchase_price || 0).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  {{ Number(item.sale_price || 0).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-right text-[12px] text-slate-400">
                {{ item.added_on?.split('|')[0]?.trim() || '—' }}
              </td>
              <td class="px-4 py-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button 
                    v-if="settingsStore.isWastageEnabled"
                    @click="$emit('open-wastage', item)"
                    v-tooltip.left="$t('warehouse.wastage.create_title')"
                    class="w-7 h-7 rounded-lg bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-90"
                  >
                    <i class="pi pi-exclamation-circle text-[11px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3">
          <i class="pi pi-inbox text-slate-400 text-lg"></i>
        </div>
        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {{ search ? $t('warehouse.detail.no_search_results') : $t('warehouse.detail.no_warehouse_products') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  products: { type: Array, required: true },
  totalProducts: { type: Number, default: 0 },
  search: { type: String, default: '' }
})

defineEmits(['update:search', 'show-barcode', 'open-wastage'])

const settingsStore = useSettingsStore()
</script>


