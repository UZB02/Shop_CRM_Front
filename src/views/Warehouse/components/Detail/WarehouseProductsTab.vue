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

      <!-- Products table (Desktop) -->
      <div v-if="products.length" class="hidden md:block overflow-x-auto">
        <table class="w-full text-left min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap w-10">№</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.col_product') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap">{{ $t('products.form.barcode') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center">{{ $t('products.form.amount') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('products.form.purchase_price') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-right">{{ $t('products.col_price') }}</th>
              <th class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center">{{ $t('common.created_at') }}</th>
              <th v-if="settingsStore.isWastageEnabled" class="px-4 py-2.5 text-[12px] font-bold text-slate-400 tracking-widest whitespace-nowrap text-center w-12">{{ $t('common.actions') }}</th>
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
                    <span class="text-[11px] text-slate-400 tracking-widest mt-0.5">{{ item.category_name }}</span>
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
                <div class="flex flex-col items-end justify-center">
                  <div v-if="item.active_promotion" class="flex items-center gap-1.5 mb-0.5">
                    <span class="text-[10px] font-black text-rose-500 bg-rose-500/10 px-1 rounded">-{{ item.active_promotion.discount_pct }}%</span>
                    <span class="text-[11px] font-bold text-slate-400 line-through">{{ Number(item.sale_price || 0).toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[13px] font-black tracking-tight" :class="item.active_promotion ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'">
                      {{ Number(item.active_promotion ? item.active_promotion.discounted_price : (item.sale_price || 0)).toLocaleString() }}
                    </span>
                    <span 
                      v-if="!item.active_promotion && item.purchase_price && item.sale_price > item.purchase_price" 
                      class="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded uppercase tracking-widest"
                      title="Ustama (Margin)"
                    >
                      +{{ Math.round(((item.sale_price - item.purchase_price) / item.purchase_price) * 100) }}%
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 text-center whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {{ item.added_on?.split('|')[0]?.trim() || '—' }}
              </td>
              <td v-if="settingsStore.isWastageEnabled" class="px-4 py-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button 
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

      <!-- Mobile Product Cards -->
      <div v-if="products.length" class="md:hidden grid grid-cols-1 gap-3 p-3">
        <div 
          v-for="(item, index) in products"
          :key="`mob-${item.product_id}`"
          class="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm relative transition-all active:scale-[0.98]"
        >
          <!-- Absolute Action Menu -->
          <div class="absolute top-3 right-3 flex items-center gap-1">
            <button 
              v-if="item.barcode"
              @click="$emit('show-barcode', item)"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 active:scale-95 shadow-sm"
            >
              <i class="pi pi-barcode text-sm"></i>
            </button>
            <button 
              v-if="settingsStore.isWastageEnabled"
              @click="$emit('open-wastage', item)"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 active:scale-95 shadow-sm"
            >
              <i class="pi pi-exclamation-circle text-sm"></i>
            </button>
          </div>

          <!-- Product Info -->
          <div class="flex gap-3">
            <div class="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
               <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover" />
               <i v-else class="pi pi-image text-slate-300 text-xl"></i>
            </div>
            <div class="flex-1 flex flex-col justify-center min-w-0 pr-16">
              <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{{ item.product_name }}</h3>
              <span class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 truncate">{{ item.category_name }}</span>
              <div class="mt-1.5 flex flex-wrap gap-1.5">
                 <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                 <span class="px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-widest" :class="settingsStore.isLowStockEnabled && item.quantity <= settingsStore.lowStockThreshold ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'">
                   {{ item.quantity }} dona
                 </span>
              </div>
            </div>
          </div>

          <!-- Price & Added Date -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{{ $t('products.form.purchase_price') }} / {{ $t('products.col_price') }}</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[12px] font-bold text-slate-500">{{ Number(item.purchase_price || 0).toLocaleString() }}</span>
                <i class="pi pi-angle-right text-[10px] text-slate-300"></i>
                
                <!-- If has promotion -->
                <template v-if="item.active_promotion">
                  <span class="text-[11px] font-bold text-slate-400 line-through">{{ Number(item.sale_price || 0).toLocaleString() }}</span>
                  <span class="text-[13px] font-black text-rose-500">{{ Number(item.active_promotion.discounted_price).toLocaleString() }}</span>
                  <span class="text-[9px] font-black text-rose-500 bg-rose-500/10 px-1 rounded">-{{ item.active_promotion.discount_pct }}%</span>
                </template>
                
                <!-- Normal price with margin -->
                <template v-else>
                  <span class="text-[13px] font-black text-emerald-600 dark:text-emerald-400">{{ Number(item.sale_price || 0).toLocaleString() }}</span>
                  <span 
                    v-if="item.purchase_price && item.sale_price > item.purchase_price" 
                    class="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded uppercase tracking-widest"
                  >
                    +{{ Math.round(((item.sale_price - item.purchase_price) / item.purchase_price) * 100) }}%
                  </span>
                </template>
              </div>
            </div>
            <div class="text-[10px] font-bold text-slate-400 text-right mt-auto">
              {{ item.added_on?.split('|')[0]?.trim() || '—' }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="!products.length" class="flex flex-col items-center justify-center py-12 text-center">
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


