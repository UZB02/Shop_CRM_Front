<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Panel Header -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 shrink-0">
          <i class="pi pi-shopping-cart text-emerald-500 text-[11px] sm:text-xs"></i>
        </div>
        <div>
          <h3 class="text-[13px] sm:text-[14px] font-black text-slate-800 dark:text-white font-outfit tracking-tight uppercase leading-none mb-0.5 opacity-70">{{ $t('warehouse.transfer.items_list') || 'Ro\'yxat' }}</h3>
          <p class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{{ items.length }} {{ $t('warehouse.transfer.products') }}</p>
        </div>
      </div>
      
      <div v-if="items.length" class="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
        <span class="hidden xs:inline text-[11px] sm:text-[12px] font-black text-slate-500 uppercase tracking-widest opacity-60">{{ $t('warehouse.transfer.total_qty') || 'Jami' }}:</span>
        <span class="text-[12px] sm:text-[13px] font-black text-slate-900 dark:text-white">{{ totalQuantity }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!items.length"
      class="flex-1 flex flex-col items-center justify-center gap-4 p-6 sm:p-8 bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm text-center"
    >
      <div class="relative">
        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
          <i class="pi pi-inbox text-2xl sm:text-3xl text-slate-200 dark:text-slate-800"></i>
        </div>
        <div class="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-[#0f172a]">
          <i class="pi pi-plus text-[8px] sm:text-[10px]"></i>
        </div>
      </div>
      <div class="max-w-[220px]">
        <p class="text-[14px] sm:text-[15px] font-black text-slate-800 dark:text-white font-outfit uppercase tracking-tight">{{ $t('warehouse.transfer.no_items') }}</p>
        <p class="text-[12px] sm:text-[13px] font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{{ $t('warehouse.transfer.no_items_desc') }}</p>
      </div>
    </div>

    <!-- Product Cards Scroll Area -->
    <div v-else class="flex-1 overflow-y-auto no-scrollbar pr-1 sm:pr-2 pb-6">
      <div class="grid grid-cols-1 gap-2">
        <TransitionGroup name="list">
          <div
            v-for="(item, idx) in items"
            :key="`${item.product.product_id || item.product.id}_${item.product.tur_id ?? 'no-tur'}`"
            class="group relative bg-white dark:bg-[#1e293b]/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <!-- Product Info -->
            <div class="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img v-if="item.product.image_url || item.product.image" :src="item.product.image_url || item.product.image" class="w-full h-full object-cover" />
                <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-base sm:text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <h4 class="text-[13px] sm:text-[14px] font-black text-slate-800 dark:text-white font-outfit truncate leading-tight uppercase">{{ item.product.product_name || item.product.name }}</h4>
                </div>
                <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                  <div class="flex items-center gap-1 opacity-70">
                    <i class="pi pi-barcode text-[10px] text-slate-400"></i>
                    <code class="text-[11px] font-bold tracking-tight text-slate-400 truncate max-w-[70px] sm:max-w-none">{{ item.product.barcode || '—' }}</code>
                  </div>
                  <div class="flex items-center gap-1 px-1 py-0.5 rounded-md bg-emerald-500/5 border border-emerald-500/10">
                    <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-70">{{ $t('warehouse.transfer.col_available') }}:</span>
                    <span class="text-[11px] sm:text-[12px] font-black text-emerald-600 dark:text-emerald-400">{{ item.product.quantity }}</span>
                  </div>
                  <TurBadge :tur-name="item.product.tur_name" :tur-color="item.product.tur_color" class="scale-[0.75] origin-left shrink-0" />
                </div>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800/40">
              <div class="flex flex-row sm:flex-col items-center sm:items-end gap-1 flex-1 sm:flex-initial">
                <span class="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60 hidden xs:block">{{ $t('warehouse.transfer.col_quantity') }}</span>
                <div class="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/40 dark:border-slate-800 shadow-inner group-focus-within:ring-4 group-focus-within:ring-emerald-500/5 transition-all w-full sm:w-auto justify-between"
                  :class="{ 'ring-2 ring-rose-500/30 border-rose-500/30': Number(item.quantity) >= Number(item.product.quantity) }"
                >
                  <button
                    @click="item.quantity = Math.max(1, Number(item.quantity) - 1)"
                    :disabled="Number(item.quantity) <= 1"
                    class="w-7 h-7 rounded-md bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
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
                    class="w-10 sm:w-11 h-7 text-center text-[12px] sm:text-[13px] font-black bg-transparent border-none outline-none focus:ring-0 p-0 transition-colors"
                    :class="Number(item.quantity) >= Number(item.product.quantity) ? 'text-rose-500' : 'text-slate-800 dark:text-white'"
                  />
                  <button
                    @click="item.quantity = Math.min(Number(item.product.quantity), Number(item.quantity) + 1)"
                    :disabled="Number(item.quantity) >= Number(item.product.quantity)"
                    class="relative w-7 h-7 rounded-md bg-white dark:bg-slate-700 text-slate-400 hover:text-emerald-500 shadow-sm flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                    :title="Number(item.quantity) >= Number(item.product.quantity) ? $t('warehouse.transfer.max_qty_reached') || 'Maksimal miqdor' : ''"
                  >
                    <i class="pi pi-plus text-[10px]"></i>
                    <span
                      v-if="Number(item.quantity) >= Number(item.product.quantity)"
                      class="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-rose-500 text-white rounded px-0.5 leading-3 tracking-wider shadow-sm"
                    >MAX</span>
                  </button>
                </div>
              </div>

              <!-- Action: Delete -->
              <div class="flex items-end self-end sm:self-center">
                <button
                  @click="$emit('remove', idx)"
                  class="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 dark:border-rose-500/20 shadow-sm transition-all flex items-center justify-center active:scale-90"
                  title="Remove"
                >
                  <i class="pi pi-trash text-[13px] sm:text-[14px]"></i>
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


