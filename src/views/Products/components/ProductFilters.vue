<template>
  <div class="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
    <!-- Search -->
    <div class="relative flex-1 min-w-[200px]">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none"></i>
      <input
        :value="searchQuery"
        @input="onSearch($event.target.value)"
        @keyup.enter="handleEnter"
        @focus="$event.target.select()"
        type="text"
        :placeholder="$t('products.search_placeholder')"
        class="w-full h-10 sm:h-9 pl-9 pr-8 text-[13px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
      />
      <button
        v-if="searchQuery"
        @click="onSearch('')"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md flex items-center justify-center text-slate-300 hover:text-slate-500 transition-all"
      >
        <i class="pi pi-times text-[11px]"></i>
      </button>
    </div>

    <!-- Filters Group -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
      <!-- Subcategory filter -->
      <select
        v-if="subcategories && subcategories.length > 0"
        :value="selectedSubcategory"
        @change="$emit('update:selectedSubcategory', $event.target.value || null); $emit('change')"
        class="h-10 sm:h-9 px-3 text-[12px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all appearance-none pr-8 min-w-[130px] shadow-sm"
      >
        <option value="">{{ $t('subcategories.title') }}</option>
        <option v-for="s in subcategories" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>

      <!-- Promotion filter -->
      <select
        :value="selectedPromotion"
        @change="$emit('update:selectedPromotion', $event.target.value); $emit('change')"
        class="h-10 sm:h-9 px-3 text-[12px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all appearance-none pr-8 min-w-[130px] shadow-sm"
      >
        <option value="">{{ $t('products.filter_all_prices') }}</option>
        <option value="true">{{ $t('products.filter_promo') }}</option>
        <option value="false">{{ $t('products.filter_no_promo') }}</option>
      </select>

      <!-- Status filter -->
      <select
        :value="selectedStatus"
        @change="$emit('update:selectedStatus', $event.target.value || null); $emit('change')"
        class="h-10 sm:h-9 px-3 text-[12px] font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all appearance-none pr-8 min-w-[110px] shadow-sm"
      >
        <option value="">{{ $t('common.status') }}</option>
        <option value="active">Faol</option>
        <option value="inactive">Nofaol</option>
      </select>

      <!-- Refresh -->
      <button
        @click="$emit('refresh')"
        :disabled="loading"
        class="w-10 h-10 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all disabled:opacity-50 shrink-0 shadow-sm"
      >
        <i class="pi pi-refresh text-[14px]" :class="{ 'animate-spin': loading }"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: String,
  selectedStatus: [String, null],
  selectedPromotion: [String, Boolean, null],
  selectedSubcategory: [String, Number, null],
  subcategories: { type: Array, default: () => [] },
  loading: Boolean
})

const emit = defineEmits([
  'update:searchQuery',
  'update:selectedStatus',
  'update:selectedPromotion',
  'update:selectedSubcategory',
  'change',
  'refresh',
  'search'
])

let searchTimeout = null
const onSearch = (val) => {
  emit('update:searchQuery', val)
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => emit('search', val), 400)
}

const handleEnter = (e) => {
  clearTimeout(searchTimeout)
  emit('search', props.searchQuery)
  e.target.select()
}
</script>


