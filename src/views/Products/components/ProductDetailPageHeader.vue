<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <router-link to="/dashboard/products" class="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
          <i class="pi pi-shopping-bag text-[9px]"></i>
          {{ $t('menu.products') }}
        </router-link>
        <i class="pi pi-chevron-right text-[8px] text-slate-300"></i>
        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 tracking-widest truncate">{{ product?.name || '...' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{{ product?.name || '...' }}</h1>
        <span
          v-if="product?.status"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider shrink-0 border"
          :class="product.status === 'active'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'"
        >
          {{ product.status_display || product.status }}
        </span>
      </div>
      <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium truncate">{{ product?.category_name || $t('common.not_specified') }} • SKU: {{ product?.sku || product?.barcode || '—' }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="$emit('edit')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-pencil text-xs text-emerald-500"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
      <button
        @click="$emit('delete')"
        class="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700"
      >
        <i class="pi pi-trash text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ product: Object })
defineEmits(['edit', 'delete'])
</script>
