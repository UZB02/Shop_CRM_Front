<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :showHeader="false"
    style="width: 100%; max-width: 480px;"
    pt:root:class="!rounded-2xl !border-none !shadow-2xl overflow-hidden"
    pt:mask:class="backdrop-blur-sm bg-black/40"
  >
    <div class="flex flex-col max-h-[80vh]">

      <!-- Dialog header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('warehouse.transfer.select_product') }}</h3>
          <p class="text-xs text-slate-400 mt-0.5">{{ $t('warehouse.transfer.warehouse_products', { name: sourceName }) }}</p>
        </div>
        <button
          @click="$emit('update:visible', false)"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Search -->
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            :value="productSearch"
            @input="$emit('update:productSearch', $event.target.value)"
            type="text"
            :placeholder="$t('warehouse.transfer.name_or_barcode')"
            class="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            autofocus
          />
        </div>
      </div>

      <!-- Product list -->
      <div class="overflow-y-auto flex-1 custom-scrollbar">
        <!-- Empty search result -->
        <div
          v-if="!products?.length"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <i class="pi pi-search text-slate-400"></i>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ $t('warehouse.transfer.no_product_found') }}</p>
        </div>

        <!-- Product rows -->
        <div v-else class="divide-y divide-slate-50 dark:divide-slate-800/60">
          <button
            v-for="p in products"
            :key="p.product_id || p.id"
            @click="$emit('add', p)"
            class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 text-left transition-colors group"
          >
            <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
              <i class="pi pi-box text-slate-400 group-hover:text-emerald-500 text-xs transition-colors"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <div class="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate transition-colors">
                  {{ p.product_name || p.name }}
                </div>
                <TurBadge :tur-name="p.tur_name" :tur-color="p.tur_color" />
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <code v-if="p.barcode" class="text-xs text-slate-400">{{ p.barcode }}</code>
                <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">{{ $t('warehouse.transfer.available_qty', { qty: p.quantity }) }}</span>
              </div>
            </div>
            <i class="pi pi-plus text-xs text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0"></i>
          </button>
        </div>
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
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
