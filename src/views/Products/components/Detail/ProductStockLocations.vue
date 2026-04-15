<template>
  <div v-if="product?.stock_locations?.length" class="bg-white dark:bg-[#131d31] rounded-[18px] border border-slate-200 dark:border-transparent p-6 sm:p-8 flex flex-col shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h3 class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
        <span class="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
        <span class="leading-tight">{{ $te('products.detail.stock_locations') ? $t('products.detail.stock_locations') : 'ZAHIRA LOKATSIYALARI' }}</span>
      </h3>
      <span class="text-[10px] font-bold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0 w-fit self-start sm:self-auto flex items-center leading-none">
        {{ $t('products.detail.total') }}: {{ product.stock_total }} {{ product.unit_display }}
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="(loc, idx) in sortedLocations" 
        :key="idx"
        class="p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02]"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" 
               :class="loc.type === 'warehouse' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-500'">
            <i class="pi" :class="loc.type === 'warehouse' ? 'pi-box' : 'pi-building'"></i>
          </div>
          <div>
            <span class="text-[8px] font-black uppercase tracking-widest block mb-0.5" 
                  :class="loc.type === 'warehouse' ? 'text-amber-500/70' : 'text-sky-500/70'">
              {{ loc.type === 'warehouse' ? $t('products.detail.warehouse') : $t('products.detail.branch') }}
            </span>
            <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 truncate max-w-[140px]">{{ loc.name }}</p>
          </div>
        </div>
        <div class="text-right">
           <p class="text-xl font-black tracking-tight" :class="loc.quantity > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'">
             {{ loc.quantity }}
           </p>
           <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">{{ product.unit_display }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: Object
})

const sortedLocations = computed(() => {
  if (!props.product?.stock_locations) return []
  return [...props.product.stock_locations].sort((a, b) => b.quantity - a.quantity)
})
</script>
