<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#0f172a]">
    <!-- Compact Header -->
    <div class="p-2.5 sm:p-3 border-b border-slate-100 dark:border-slate-800/50 space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-[11px] sm:text-[12px] font-black text-slate-400 tracking-[0.1em] uppercase opacity-70">{{ $t('menu.products') }}</h4>
        <div class="flex items-center gap-2">
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase opacity-60">{{ products.length }} {{ $t('common.items') || 'items' }}</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative group">
        <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-emerald-500 transition-colors text-[12px]" />
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="$t('common.search') + '...'" 
          class="w-full h-8 sm:h-9 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg pl-8 sm:pl-9 pr-3 text-[12px] sm:text-[13px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 placeholder:text-slate-300 transition-all shadow-inner"
        />
      </div>
    </div>

    <!-- Available Product List -->
    <div class="flex-1 overflow-y-auto px-2 sm:px-2.5 py-1.5 sm:py-2.5 no-scrollbar">
      <div v-if="filteredProducts.length === 0" class="h-full flex flex-col items-center justify-center opacity-20 py-16 text-center">
         <i class="pi pi-search text-2xl mb-2"></i>
         <p class="font-black text-[12px] tracking-widest uppercase">{{ $t('common.no_data') }}</p>
      </div>

      <div v-else class="space-y-1.5">
        <div 
          v-for="product in filteredProducts" 
          :key="`${product.product_id || product.id}_${product.tur_id ?? 'no-tur'}`" 
          class="group transition-all"
          :class="remainingQty(product) > 0 ? 'cursor-pointer' : 'opacity-40 grayscale pointer-events-none'"
          @click="remainingQty(product) > 0 && $emit('add', product)"
        >
          <div class="flex items-center gap-3 p-1.5 sm:p-2 rounded-lg border border-transparent hover:border-emerald-500/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-200 relative overflow-hidden">
            <!-- Hover Accent -->
            <div v-if="remainingQty(product) > 0" class="absolute inset-y-0 left-0 w-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>

            <!-- Mini Thumb -->
            <div class="relative shrink-0">
              <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                <img v-if="product.image_url || product.image" :src="product.image_url || product.image" class="w-full h-full object-cover" />
                <i v-else class="pi pi-box text-slate-200 dark:text-slate-700 text-base"></i>
              </div>
              
              <!-- Quantity in Cart Overlay -->
              <Transition name="scale">
                <div v-if="getItemQty(product)" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border-[1.5px] border-white dark:border-slate-900 z-[20] tabular-nums">
                  {{ getItemQty(product) }}
                </div>
              </Transition>
            </div>
            
            <div class="flex-1 min-w-0">
              <h5 class="text-[13px] sm:text-[14px] font-black text-slate-700 dark:text-slate-300 truncate tracking-tight font-outfit">{{ product.product_name || product.name }}</h5>
              <div class="flex items-center gap-1.5 mt-0.5">
                <!-- Remaining stock badge -->
                <div class="flex items-center gap-1 opacity-70">
                  <i class="pi pi-database text-[10px]"
                    :class="remainingQty(product) === 0 ? 'text-rose-400' : remainingQty(product) <= product.quantity * 0.2 ? 'text-amber-500' : 'text-emerald-500'"
                  ></i>
                  <span class="text-[11px] sm:text-[12px] font-black uppercase tracking-tighter"
                    :class="remainingQty(product) === 0 ? 'text-rose-500' : remainingQty(product) <= product.quantity * 0.2 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'"
                  >{{ remainingQty(product) }}</span>
                  <span v-if="getItemQty(product) > 0" class="text-[10px] text-slate-400 font-bold">({{ $t('common.from') || 'dan' }} {{ product.quantity }})</span>
                </div>
                <TurBadge v-if="product.tur_name" :tur-name="product.tur_name" :tur-color="product.tur_color" class="scale-[0.65] origin-left" />
              </div>
            </div>

            <div 
              v-if="remainingQty(product) > 0" 
              class="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm active:scale-90"
            >
              <i class="pi pi-plus text-[10px]"></i>
            </div>
            <div v-else class="w-7 h-7 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center">
              <i class="pi pi-times text-[10px] text-rose-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TurBadge from '@/components/common/TurBadge.vue'

const props = defineProps({
  products: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  sourceName: String
})

const emit = defineEmits(['add'])

const searchQuery = ref('')

const getItemQty = (product) => {
  const pId = product.product_id || product.id
  const item = props.items.find(i => {
    const iPId = i.product.product_id || i.product.id
    return iPId === pId && i.product.tur_id === product.tur_id
  })
  return item ? item.quantity : 0
}

// Qolgan mavjud miqdor = bazadagi miqdor − tanlangan miqdor
const remainingQty = (product) => {
  const selected = getItemQty(product)
  return Math.max(0, Number(product.quantity) - Number(selected))
}

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return props.products
  const q = searchQuery.value.toLowerCase()
  return props.products.filter(p => 
    (p.product_name || p.name || '').toLowerCase().includes(q) ||
    (p.barcode || '').includes(q)
  )
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.scale-enter-active, .scale-leave-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.5); }
</style>


