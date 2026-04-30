<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Panel Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 shrink-0">
          <i class="pi pi-shopping-cart text-emerald-500 text-[10px] sm:text-xs"></i>
        </div>
        <div>
          <h3 class="text-[12px] sm:text-[14px] font-black text-slate-800 dark:text-white font-outfit tracking-tight uppercase leading-none mb-1 opacity-70">{{ $t('warehouse.transfer.items_list') || 'Ro\'yxat' }}</h3>
          <p class="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{{ items.length }} {{ $t('warehouse.transfer.products') }}</p>
        </div>
      </div>
      
      <div v-if="items.length" class="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
        <span class="hidden xs:inline text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-60">{{ $t('warehouse.transfer.total_qty') || 'Jami' }}:</span>
        <span class="text-[11px] sm:text-[13px] font-black text-slate-900 dark:text-white">{{ totalQuantity }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!items.length"
      class="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8 sm:p-12 bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[32px] sm:rounded-[40px] shadow-sm"
    >
      <div class="relative">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[32px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
          <i class="pi pi-inbox text-3xl sm:text-4xl text-slate-200 dark:text-slate-800"></i>
        </div>
        <div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-[#0f172a]">
          <i class="pi pi-plus text-[8px] sm:text-[10px]"></i>
        </div>
      </div>
      <div class="max-w-[240px]">
        <p class="text-[14px] sm:text-[16px] font-black text-slate-800 dark:text-white font-outfit uppercase tracking-tight">{{ $t('warehouse.transfer.no_items') }}</p>
        <p class="text-[11px] sm:text-[13px] font-bold text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">{{ $t('warehouse.transfer.no_items_desc') }}</p>
      </div>
    </div>

    <!-- Product Cards Scroll Area -->
    <div v-else class="flex-1 overflow-y-auto no-scrollbar pr-1 sm:pr-2 pb-10">
      <div class="grid grid-cols-1 gap-2.5 sm:gap-3">
        <TransitionGroup name="list">
          <div
            v-for="(item, idx) in items"
            :key="`${item.product.product_id || item.product.id}_${item.product.tur_id ?? 'no-tur'}`"
            class="group relative bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <!-- Delete Button -->


            <!-- Product Info -->
            <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img v-if="item.product.image" :src="item.product.image" class="w-full h-full object-contain p-1" />
                <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-lg sm:text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5 sm:mb-1">
                  <h4 class="text-[13px] sm:text-[15px] font-black text-slate-800 dark:text-white font-outfit truncate leading-tight uppercase">{{ item.product.product_name || item.product.name }}</h4>
                </div>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div class="flex items-center gap-1 opacity-70">
                    <i class="pi pi-barcode text-[9px] text-slate-400"></i>
                    <code class="text-[10px] font-bold tracking-tight text-slate-400 truncate max-w-[80px] sm:max-w-none">{{ item.product.barcode || '—' }}</code>
                  </div>
                  <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-70">{{ $t('warehouse.transfer.col_available') }}:</span>
                    <span class="text-[10px] sm:text-[12px] font-black text-emerald-600 dark:text-emerald-400">{{ item.product.quantity }}</span>
                  </div>
                  <TurBadge :tur-name="item.product.tur_name" :tur-color="item.product.tur_color" class="scale-[0.8] sm:scale-100 origin-left shrink-0" />
                </div>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 dark:border-slate-800/40">
              <div class="flex flex-row sm:flex-col items-center sm:items-end gap-1.5 flex-1 sm:flex-initial">
                <span class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 hidden xs:block">{{ $t('warehouse.transfer.col_quantity') }}</span>
                <div class="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200/40 dark:border-slate-800 shadow-inner group-focus-within:ring-4 group-focus-within:ring-emerald-500/5 transition-all w-full sm:w-auto justify-between"
                  :class="{ 'ring-2 ring-rose-500/30 border-rose-500/30': Number(item.quantity) >= Number(item.product.quantity) }"
                >
                  <button
                    @click="item.quantity = Math.max(1, Number(item.quantity) - 1)"
                    :disabled="Number(item.quantity) <= 1"
                    class="w-8 h-8 rounded-md sm:rounded-lg bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <i class="pi pi-minus text-[10px]"></i>
                  </button>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    :max="item.product.quantity"
                    step="1"
                    @blur="item.quantity = Math.min(Math.max(1, Number(item.quantity)), Number(item.product.quantity))"
                    @input="item.quantity = Number(item.quantity) > Number(item.product.quantity) ? Number(item.product.quantity) : Number(item.quantity)"
                    class="w-12 sm:w-14 h-8 text-center text-[12px] sm:text-[13px] font-black bg-transparent border-none outline-none focus:ring-0 p-0 transition-colors"
                    :class="Number(item.quantity) >= Number(item.product.quantity) ? 'text-rose-500' : 'text-slate-800 dark:text-white'"
                  />
                  <button
                    @click="item.quantity = Math.min(Number(item.product.quantity), Number(item.quantity) + 1)"
                    :disabled="Number(item.quantity) >= Number(item.product.quantity)"
                    class="relative w-8 h-8 rounded-md sm:rounded-lg bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    :title="Number(item.quantity) >= Number(item.product.quantity) ? $t('warehouse.transfer.max_qty_reached') || 'Maksimal miqdor' : ''"
                  >
                    <i class="pi pi-plus text-[10px]"></i>
                    <span
                      v-if="Number(item.quantity) >= Number(item.product.quantity)"
                      class="absolute -top-2 -right-2 text-[7px] font-black bg-rose-500 text-white rounded px-1 leading-4 tracking-wider shadow-sm"
                    >MAX</span>
                  </button>
                </div>
              </div>

              <!-- Action: Delete -->
              <div class="flex items-end self-end sm:self-center">
                <button
                  @click="$emit('remove', idx)"
                  class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 dark:border-rose-500/20 shadow-sm transition-all flex items-center justify-center active:scale-90"
                  title="Remove"
                >
                  <i class="pi pi-trash text-[14px]"></i>
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['remove'])

const totalQuantity = computed(() => {
  return props.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.list-enter-active, .list-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to { opacity: 0; transform: scale(0.95); }
</style>
