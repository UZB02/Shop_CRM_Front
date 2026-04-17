<template>
  <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col min-h-0 overflow-hidden">

    <!-- Panel toolbar -->
    <div class="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ $t('warehouse.transfer.products') }}</h3>
        <span
          v-if="items.length"
          class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >{{ items.length }}</span>
      </div>
      <button
        @click="$emit('openSearch')"
        class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium hover:opacity-90 transition-all"
      >
        <i class="pi pi-plus text-[11px]"></i>
        {{ $t('warehouse.transfer.add_product') }}
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="!items.length"
      class="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8"
    >
      <div class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <i class="pi pi-inbox text-2xl text-slate-300 dark:text-slate-600"></i>
      </div>
      <div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ $t('warehouse.transfer.no_items') }}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ $t('warehouse.transfer.no_items_desc') }}</p>
      </div>
      <button
        @click="$emit('openSearch')"
        class="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
      >
        <i class="pi pi-plus text-xs"></i>
        {{ $t('warehouse.transfer.add_product') }}
      </button>
    </div>

    <!-- Products table -->
    <div v-else class="flex-1 overflow-y-auto no-scrollbar">
      <table class="w-full text-sm text-left">
        <thead class="sticky top-0 z-10">
          <tr class="bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide w-8">#</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ $t('warehouse.transfer.col_product') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ $t('warehouse.transfer.col_barcode') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center w-36">{{ $t('warehouse.transfer.col_available') }}</th>
            <th class="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center w-36">{{ $t('warehouse.transfer.col_quantity') }}</th>
            <th class="px-5 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/60">
          <tr
            v-for="(item, idx) in items"
            :key="idx"
            class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
          >
            <td class="px-5 py-3.5 text-xs text-slate-400">{{ idx + 1 }}</td>
            <td class="px-5 py-3.5">
              <span class="font-medium text-slate-700 dark:text-slate-200">
                {{ item.product.product_name || item.product.name }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <code class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {{ item.product.barcode || '—' }}
              </code>
            </td>
            <td class="px-5 py-3.5 text-center">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ item.product.quantity ?? '—' }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-center">
              <div class="flex items-center justify-center gap-1">
                <!-- Minus -->
                <button
                  @click="item.quantity = Math.max(1, Number(item.quantity) - 1)"
                  class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <i class="pi pi-minus text-[9px]"></i>
                </button>
                <input
                  v-model="item.quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  class="w-16 h-7 text-center text-sm font-semibold rounded-lg border transition-all outline-none"
                  :class="item.quantity > 0
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                    : 'border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600'"
                />
                <!-- Plus -->
                <button
                  @click="item.quantity = Number(item.quantity) + 1"
                  class="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <i class="pi pi-plus text-[9px]"></i>
                </button>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button
                @click="$emit('remove', idx)"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Table footer summary -->
      <div class="sticky bottom-0 px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 backdrop-blur-sm flex items-center justify-between">
        <span class="text-xs text-slate-400">
          {{ $t('warehouse.transfer.total_items', { count: items.length }) }}
        </span>
        <button
          @click="$emit('openSearch')"
          class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <i class="pi pi-plus text-[10px]"></i>
          {{ $t('warehouse.transfer.add_more') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array
});

defineEmits(['remove', 'openSearch']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
