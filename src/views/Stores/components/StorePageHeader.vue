<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ $t('stores.page_title') }}</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ storeName || '...' }} • {{ branchCount }} {{ $t('stores.count_suffix') }}</p>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="hasStore"
        @click="$emit('edit-store')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-pencil text-xs"></i>
        <span>{{ $t('common.edit') }}</span>
      </button>
      <button
        v-if="!hasStore"
        @click="$emit('add-store')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>{{ $t('stores.add_store') }}</span>
      </button>
      <button
        v-if="hasStore && showAddBranch"
        @click="$emit('add-branch')"
        class="flex-1 sm:flex-none h-8 px-3 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>{{ $t('stores.new_branch') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  storeName: String,
  branchCount: Number,
  hasStore: Boolean,
  showAddBranch: Boolean
})
defineEmits(['add-store', 'edit-store', 'add-branch'])
</script>
