<template>
  <div v-if="product?.stock_locations?.length" class="bg-white dark:bg-[#131d31] rounded-[18px] border border-slate-200 dark:border-transparent p-6 sm:p-8 flex flex-col shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h3 class="text-[12px] font-black text-slate-900 dark:text-white tracking-[0.2em] flex items-center gap-3">
        <span class="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
        <span class="leading-tight">{{ $te('products.detail.stock_locations') ? $t('products.detail.stock_locations') : 'ZAHIRA LOKATSIYALARI' }}</span>
      </h3>
      <span class="text-[12px] font-bold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0 w-fit self-start sm:self-auto flex items-center leading-none">
        {{ $t('products.detail.total') }}: {{ product.stock_total }} {{ product.unit_display }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="(loc, idx) in sortedLocations" 
        :key="idx"
        class="bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 group"
      >
        <!-- Location Header -->
        <div class="p-5 flex items-start justify-between gap-4 border-b border-slate-100/60 dark:border-white/5 bg-white/50 dark:bg-transparent">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" 
                 :class="loc.type === 'warehouse' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-500'">
              <i class="pi" :class="loc.type === 'warehouse' ? 'pi-box text-xl' : 'pi-building text-xl'"></i>
            </div>
            <div class="min-w-0">
              <span class="text-[10px] font-black tracking-[0.15em] block mb-0.5 uppercase opacity-60" 
                    :class="loc.type === 'warehouse' ? 'text-amber-600' : 'text-sky-600'">
                {{ loc.type === 'warehouse' ? $t('products.detail.warehouse') : $t('products.detail.branch') }}
              </span>
              <p class="text-[15px] font-black text-slate-800 dark:text-slate-100 truncate leading-tight tracking-tight">
                {{ loc.name }}
              </p>
            </div>
          </div>
          <div class="text-right shrink-0">
             <div class="flex items-baseline justify-end gap-1">
               <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">{{ loc.quantity }}</span>
               <span class="text-[10px] font-black tracking-widest text-slate-400 uppercase">{{ product.unit_display }}</span>
             </div>
             <div class="text-[9px] font-black text-slate-400 tracking-widest uppercase mt-0.5">{{ $t('products.detail.total') }}</div>
          </div>
        </div>

        <!-- Variants / Turlar List -->
        <div class="p-5 flex-1 flex flex-col gap-2">
          <div v-if="loc.turlar && loc.turlar.length" class="space-y-1.5">
             <div 
               v-for="(tur, tIdx) in loc.turlar" 
               :key="tIdx"
               class="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-100/50 dark:border-white/[0.03] hover:border-indigo-500/20 transition-colors group/item"
             >
               <div class="flex items-center gap-2 min-w-0">
                  <div v-if="tur.tur_id" class="flex items-center gap-1.5 min-w-0">
                    <span class="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate">{{ tur.tur_name }}</span>
                    <span v-if="tur.tur_color" class="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold uppercase tracking-tighter">{{ tur.tur_color }}</span>
                  </div>
                  <span v-else class="text-[11px] font-bold text-slate-400 italic">{{ $t('common.general') || 'Umumiy' }}</span>
               </div>
               <div class="flex items-center gap-1.5">
                 <span class="text-[13px] font-black text-slate-900 dark:text-white">{{ tur.quantity }}</span>
                 <span class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">{{ product.unit_display }}</span>
               </div>
             </div>
          </div>
          <div v-else class="flex-1 flex items-center justify-center py-4 opacity-30">
             <span class="text-[10px] font-black tracking-widest uppercase">{{ $t('common.no_data') }}</span>
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


