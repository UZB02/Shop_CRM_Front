<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
    <!-- Ma'lumot: N–M dan K ta -->
    <p class="text-[11px] font-bold text-slate-400 tracking-wide">
      {{ $t('reports.pagination.showing', { from: from, to: to, total: total }) }}
    </p>

    <!-- Sahifalar -->
    <div class="flex items-center gap-1">
      <button
        @click="emit('change', page - 1)"
        :disabled="page <= 1"
        class="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        <i class="pi pi-chevron-left text-[10px]"></i>
      </button>

      <!-- Sahifa raqamlari -->
      <template v-for="p in visiblePages" :key="p">
        <span v-if="p === '...'" class="px-1 text-slate-400 text-xs">···</span>
        <button
          v-else
          @click="emit('change', p)"
          :class="[
            'h-8 w-8 rounded-lg text-xs font-black transition-all',
            p === page
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          ]"
        >
          {{ p }}
        </button>
      </template>

      <button
        @click="emit('change', page + 1)"
        :disabled="page >= totalPages"
        class="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        <i class="pi pi-chevron-right text-[10px]"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total:    { type: Number, required: true },
  page:     { type: Number, required: true },
  pageSize: { type: Number, default: 20 },
})
const emit = defineEmits(['change'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const from       = computed(() => Math.min((props.page - 1) * props.pageSize + 1, props.total))
const to         = computed(() => Math.min(props.page * props.pageSize, props.total))

// Smart pagination: 1 2 3 ... 8 9 10
const visiblePages = computed(() => {
  const tp = totalPages.value
  const cp = props.page
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)

  const pages = []
  if (cp <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', tp)
  } else if (cp >= tp - 3) {
    pages.push(1, '...', tp - 4, tp - 3, tp - 2, tp - 1, tp)
  } else {
    pages.push(1, '...', cp - 1, cp, cp + 1, '...', tp)
  }
  return pages
})
</script>
