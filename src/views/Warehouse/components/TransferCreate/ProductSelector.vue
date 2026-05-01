<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :showHeader="false"
    style="width: 100%; max-width: 540px;"
    pt:root:class="!rounded-[32px] !border-none !shadow-2xl overflow-hidden !bg-white dark:!bg-[#0f172a]"
    pt:mask:class="backdrop-blur-md bg-slate-900/40"
  >
    <div class="flex flex-col max-h-[85vh]">

      <!-- Dialog Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800/50">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 shrink-0">
            <i class="pi pi-search text-emerald-500 text-xs"></i>
          </div>
          <div>
            <h3 class="text-[16px] font-black text-slate-800 dark:text-white font-outfit tracking-tight uppercase leading-none mb-1">{{ $t('warehouse.transfer.select_product') }}</h3>
            <div class="flex items-center gap-1.5 opacity-60">
              <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ sourceName }}</span>
              <i class="pi pi-chevron-right text-[9px] text-slate-300"></i>
              <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ $t('warehouse.transfer.available_products') || 'Mahsulotlar' }}</span>
            </div>
          </div>
        </div>
        <button
          @click="$emit('update:visible', false)"
          class="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-90"
        >
          <i class="pi pi-times text-[12px]"></i>
        </button>
      </div>

      <!-- Premium Search Bar -->
      <div class="px-8 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-transparent">
        <div class="relative group">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            <i class="pi pi-search text-[13px]"></i>
          </div>
          <input
            :value="productSearch"
            @input="$emit('update:productSearch', $event.target.value)"
            type="text"
            :placeholder="$t('warehouse.transfer.name_or_barcode')"
            class="w-full h-11 pl-12 pr-6 text-[15px] font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
            autofocus
          />
        </div>
      </div>

      <!-- Product List -->
      <div class="overflow-y-auto flex-1 no-scrollbar p-4 space-y-2">
        <!-- Empty search result -->
        <div
          v-if="!products?.length"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
            <i class="pi pi-search text-slate-200 dark:text-slate-700 text-xl"></i>
          </div>
          <p class="text-[14px] font-black text-slate-400 uppercase tracking-widest">{{ $t('warehouse.transfer.no_product_found') }}</p>
        </div>

        <!-- Product Rows -->
        <button
          v-for="p in products"
          :key="p.product_id || p.id"
          @click="$emit('add', p)"
          class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-[#1e293b]/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 text-left transition-all group relative overflow-hidden"
        >
          <!-- Hover Accent -->
          <div class="absolute inset-y-0 left-0 w-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>

          <div class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <i class="pi pi-box text-slate-300 group-hover:text-emerald-500 text-sm transition-colors"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span class="text-[16px] font-black text-slate-800 dark:text-white font-outfit truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {{ p.product_name || p.name }}
              </span>
              <TurBadge :tur-name="p.tur_name" :tur-color="p.tur_color" class="scale-90 origin-left" />
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5">
                <i class="pi pi-barcode text-[11px] text-slate-300"></i>
                <code class="text-[12px] font-black tracking-wider text-slate-400">{{ p.barcode || 'NO BARCODE' }}</code>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="pi pi-database text-[11px] text-emerald-500/60"></i>
                <span class="text-[12px] font-black text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-tighter">{{ $t('warehouse.transfer.available_qty', { qty: p.quantity }) }}</span>
              </div>
            </div>
          </div>
          <div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
            <i class="pi pi-plus text-[12px]"></i>
          </div>
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import TurBadge from '@/components/common/TurBadge.vue'

defineProps({
  visible: Boolean,
  sourceName: String,
  products: Array,
  productSearch: String
});

defineEmits(['update:visible', 'update:productSearch', 'add']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>


