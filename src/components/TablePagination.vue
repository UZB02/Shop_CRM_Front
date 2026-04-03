<template>
  <div
    v-if="totalRecords > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
  >
    <!-- Range Info -->
    <p class="text-xs text-slate-400">
      {{ (currentPage - 1) * rowsPerPage + 1 }}–{{ Math.min(currentPage * rowsPerPage, totalRecords) }}
      <span class="text-slate-300 dark:text-slate-600 mx-1">/</span>
      {{ totalRecords }} ta
    </p>

    <!-- Navigation Controls -->
    <div class="flex items-center gap-1">
      <!-- First Page -->
      <button
        :disabled="currentPage === 1"
        @click="changePage(1)"
        class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        title="Birinchi sahifa"
      >
        <i class="pi pi-angle-double-left text-xs"></i>
      </button>

      <!-- Prev Page -->
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        title="Oldingi"
      >
        <i class="pi pi-angle-left text-xs"></i>
      </button>

      <!-- Page Numbers -->
      <button
        v-for="p in displayedPages"
        :key="p"
        @click="changePage(p)"
        class="w-7 h-7 rounded-lg text-xs font-semibold transition-all active:scale-95"
        :class="p === currentPage
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        {{ p }}
      </button>

      <!-- Next Page -->
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        title="Keyingi"
      >
        <i class="pi pi-angle-right text-xs"></i>
      </button>

      <!-- Last Page -->
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(totalPages)"
        class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        title="Oxirgi sahifa"
      >
        <i class="pi pi-angle-double-right text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  totalRecords: { type: Number, default: 0 },
  rowsPerPage: { type: Number, default: 10 }
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalRecords / props.rowsPerPage)))

const displayedPages = computed(() => {
  const cur = props.currentPage
  const total = totalPages.value
  const pages = []
  
  let start = Math.max(1, cur - 1)
  let end = Math.min(total, start + 2)
  
  if (end === total) {
    start = Math.max(1, end - 2)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', { page: page - 1, rows: props.rowsPerPage })
  }
}
</script>
