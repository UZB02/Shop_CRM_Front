<template>
  <div class="space-y-3">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <!-- Table toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
        <div class="relative flex-1 max-w-full sm:max-w-xs">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            type="text"
            :placeholder="$t('warehouse.detail.search_products')"
            class="h-9 pl-9 pr-4 text-[13px] font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 w-full transition-all"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-start md:justify-end flex-1">
          <!-- Jami zaxira tannarxi -->
          <div class="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl">
            <span class="text-[9px] font-black text-emerald-600/70 dark:text-emerald-400/60 uppercase tracking-[0.12em]">Zaxira tannarxi</span>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 font-outfit">{{ settingsStore.formatPrice(totalStockValue) }}</span>
          </div>

          <div class="text-[12px] font-bold text-slate-400 tracking-widest pl-1">
            {{ products.length }} / {{ totalProducts }} {{ $t('products.title') }}
          </div>
        </div>
      </div>

      <!-- Products table -->
      <div v-if="products.length" class="overflow-x-auto">
        <table class="w-full text-left min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase w-10">№</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase hidden md:table-cell">{{ $t('products.form.barcode') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase text-center">{{ $t('products.form.amount') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase text-right hidden sm:table-cell">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase text-right">{{ $t('products.col_price') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase text-right hidden lg:table-cell">{{ $t('common.date') }}</th>
              <th class="px-4 py-2.5 text-[11px] font-black text-slate-400 tracking-widest uppercase text-center w-12">{{ $t('common.actions') }}</th>
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
                    <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                      <span class="text-[13px] font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                        {{ item.product_name }}
                      </span>
                      <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                    </div>
                    <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                      <span v-if="item.category_name" class="text-[10px] font-black text-slate-400 tracking-widest uppercase">{{ item.category_name }}</span>
                      <span v-if="item.barcode" class="md:hidden text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">#{{ item.barcode }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 hidden md:table-cell">
                <div class="flex items-center gap-2">
                  <code class="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    {{ item.barcode || '—' }}
                  </code>
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
              <td class="px-4 py-2 text-right hidden sm:table-cell">
                <span class="text-[12px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                  {{ Number(item.purchase_price || 0).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <span class="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  {{ Number(item.sale_price || 0).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-right hidden lg:table-cell">
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
import { computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  products: { type: Array, required: true },
  totalProducts: { type: Number, default: 0 },
  search: { type: String, default: '' }
})

defineEmits(['update:search', 'show-barcode', 'open-wastage'])

const settingsStore = useSettingsStore()

const totalStockValue = computed(() => {
  if (!props.products) return 0
  return props.products.reduce((acc, p) => acc + ((parseFloat(p.purchase_price) || 0) * (parseFloat(p.quantity) || 0)), 0)
})
</script>


