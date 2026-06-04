<template>
  <div v-if="product?.stock_locations?.length" class="bg-white dark:bg-[#131d31] rounded-[16px] border border-slate-200 dark:border-transparent p-4 flex flex-col shadow-sm">
    <div class="flex items-center justify-between gap-4 mb-4">
      <h3 class="text-[11px] font-black text-slate-900 dark:text-white tracking-[0.1em] flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
        <span class="leading-tight">{{ $te('products.detail.stock_locations') ? $t('products.detail.stock_locations') : 'ZAHIRA LOKATSIYALARI' }}</span>
      </h3>
      <span class="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-md shrink-0 flex items-center leading-none">
        {{ $t('products.detail.total') }}: {{ product.stock_total }} {{ product.unit_display }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="(loc, idx) in sortedLocations" 
        :key="idx"
        class="bg-slate-50/50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col transition-all hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5 group"
      >
        <!-- Location Header -->
        <div class="p-2.5 flex items-center justify-between gap-2 bg-white/50 dark:bg-transparent">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm" 
                 :class="loc.type === 'warehouse' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-500'">
              <i class="pi" :class="loc.type === 'warehouse' ? 'pi-box text-[11px]' : 'pi-building text-[11px]'"></i>
            </div>
            <div class="min-w-0">
              <span class="text-[8px] font-black tracking-widest block uppercase opacity-60 leading-none mb-0.5" 
                    :class="loc.type === 'warehouse' ? 'text-amber-600' : 'text-sky-600'">
                {{ loc.type === 'warehouse' ? $t('products.detail.warehouse') : $t('products.detail.branch') }}
              </span>
              <p class="text-[13px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight" :title="loc.name">
                {{ loc.name }}
              </p>
            </div>
          </div>
          <div class="text-right shrink-0">
             <div class="flex flex-col items-end justify-center">
               <span class="text-[13px] font-black text-slate-900 dark:text-white leading-none">{{ loc.quantity }}</span>
               <div class="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{{ product.unit_display }}</div>
             </div>
          </div>
        </div>

        <!-- Variants / Turlar List -->
        <div v-if="loc.turlar && loc.turlar.length" class="p-2 flex-1 flex flex-col gap-1.5 bg-slate-50/30 dark:bg-transparent border-t border-slate-100/60 dark:border-white/5">
          <div class="space-y-1">
             <div 
               v-for="(tur, tIdx) in loc.turlar" 
               :key="tIdx"
               class="flex items-center justify-between py-1 px-2 rounded-lg bg-white dark:bg-slate-900/40 border border-slate-100/50 dark:border-white/[0.03]"
             >
               <div class="flex items-center gap-1.5 min-w-0">
                  <div v-if="tur.tur_id" class="flex items-center gap-1 min-w-0">
                    <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{{ tur.tur_name }}</span>
                    <span v-if="tur.tur_color" class="text-[8px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold uppercase leading-none">{{ tur.tur_color }}</span>
                  </div>
                  <span v-else class="text-[10px] font-medium text-slate-400 italic">{{ $t('common.general') || 'Umumiy' }}</span>
               </div>
               <div class="flex items-center gap-1">
                 <span class="text-[11px] font-bold text-slate-900 dark:text-white">{{ tur.quantity }}</span>
               </div>
             </div>
          </div>
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


