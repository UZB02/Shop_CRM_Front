<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="$t('reports.import_result_title')"
    :style="{ width: '560px', maxWidth: '95vw' }"
    :pt="{
      root: { class: 'dark:bg-slate-900 border-none rounded-2xl shadow-2xl overflow-hidden' },
      header: { class: 'px-6 pt-6 pb-4 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800' },
      content: { class: 'px-6 py-5 dark:bg-slate-900' },
      footer: { class: 'px-6 pb-6 pt-3 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800' }
    }"
  >
    <template v-if="result">

      <!-- ─── Stats Grid ──────────────────────────────────────────── -->
      <!-- A format (products/import) → 4 kartochka -->
      <div v-if="isProductImport" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <!-- Yaratildi -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
            {{ result.created ?? 0 }}
          </span>
          <span class="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 mt-1.5 tracking-wide text-center">
            {{ $t('reports.import_created') }}
          </span>
        </div>

        <!-- Turlar yaratildi -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50">
          <span class="text-2xl font-black text-violet-600 dark:text-violet-400 leading-none">
            {{ result.turs_created ?? 0 }}
          </span>
          <span class="text-[10px] font-bold text-violet-500 dark:text-violet-400 mt-1.5 tracking-wide text-center">
            {{ $t('reports.import_turs_created') }}
          </span>
        </div>

        <!-- Kirim qilingan -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <span class="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
            {{ result.stock_added ?? 0 }}
          </span>
          <span class="text-[10px] font-bold text-blue-500 dark:text-blue-400 mt-1.5 tracking-wide text-center">
            {{ $t('reports.import_stock_added') }}
          </span>
        </div>

        <!-- O'tkazib yuborildi -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <span class="text-2xl font-black text-slate-500 dark:text-slate-400 leading-none">
            {{ result.skipped ?? 0 }}
          </span>
          <span class="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wide text-center">
            {{ $t('reports.import_skipped') }}
          </span>
        </div>
      </div>

      <!-- Eski format (customers/subcategories/movements) → 3 kartochka -->
      <div v-else class="grid grid-cols-3 gap-3 mb-5">
        <!-- Yaratildi -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
            {{ result.created ?? 0 }}
          </span>
          <span class="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mt-1.5 tracking-wide">
            {{ $t('reports.import_created') }}
          </span>
        </div>

        <!-- Yangilandi (mavjud bo'lsa) -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <span class="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
            {{ result.updated ?? 0 }}
          </span>
          <span class="text-[11px] font-bold text-blue-500 dark:text-blue-400 mt-1.5 tracking-wide">
            {{ $t('reports.import_updated') }}
          </span>
        </div>

        <!-- O'tkazib yuborildi -->
        <div class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <span class="text-2xl font-black text-slate-500 dark:text-slate-400 leading-none">
            {{ result.skipped ?? 0 }}
          </span>
          <span class="text-[11px] font-bold text-slate-400 mt-1.5 tracking-wide">
            {{ $t('reports.import_skipped') }}
          </span>
        </div>
      </div>

      <!-- ─── Errors Section ──────────────────────────────────────── -->
      <div class="mt-2">
        <div class="flex items-center gap-2 mb-2.5">
          <div
            class="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
            :class="hasErrors ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'"
          >
            <i :class="hasErrors ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle'" class="text-sm"></i>
            {{ $t('reports.import_errors') }}
            <span v-if="hasErrors" class="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px]">
              {{ result.errors.length }}
            </span>
          </div>
        </div>

        <!-- No Errors -->
        <div
          v-if="!hasErrors"
          class="py-4 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/40 flex items-center gap-2.5"
        >
          <i class="pi pi-check-circle text-emerald-500 text-lg"></i>
          <span class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {{ $t('reports.import_no_errors') }}
          </span>
        </div>

        <!-- Errors Table -->
        <div
          v-else
          class="rounded-xl border border-amber-100 dark:border-amber-800/40 overflow-hidden max-h-52 overflow-y-auto"
        >
          <table class="w-full text-xs">
            <thead class="sticky top-0">
              <tr class="bg-amber-50 dark:bg-amber-900/20">
                <th class="text-left px-3 py-2 font-bold text-amber-700 dark:text-amber-400 tracking-wider w-16">
                  {{ $t('reports.import_row') }}
                </th>
                <th class="text-left px-3 py-2 font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  {{ $t('reports.import_reason') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(err, idx) in result.errors"
                :key="idx"
                class="border-t border-amber-50 dark:border-amber-900/20"
                :class="idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-amber-50/30 dark:bg-amber-900/10'"
              >
                <td class="px-3 py-2 font-mono font-black text-slate-700 dark:text-slate-300">
                  #{{ err.row ?? (idx + 2) }}
                </td>
                <td class="px-3 py-2 text-slate-600 dark:text-slate-400">
                  {{ err.error || err.reason || err.message || 'Noma\'lum xatolik' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2.5 w-full">
        <button
          @click="$emit('update:visible', false)"
          class="h-9 px-5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          {{ $t('common.close') }}
        </button>
        <button
          @click="handleReload"
          class="h-9 px-5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="pi pi-refresh text-xs"></i>
          {{ $t('reports.import_reload') }}
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  visible: { type: Boolean, default: false },
  result: {
    type: Object,
    default: null
    // Eski format: { created, updated, skipped, errors: [{row, reason}] }
    // A format:   { created, turs_created, stock_added, skipped, errors: [{row, error}] }
    // D format:   { created, errors: [{row, error}] }
  }
})

const emit = defineEmits(['update:visible', 'reload'])

const hasErrors = computed(() =>
  Array.isArray(props.result?.errors) && props.result.errors.length > 0
)

// A (birlashgan products/import) formati: turs_created yoki stock_added mavjud
const isProductImport = computed(() =>
  props.result?.turs_created !== null && props.result?.turs_created !== undefined
  || props.result?.stock_added !== null && props.result?.stock_added !== undefined
)

const handleReload = () => {
  emit('reload')
  emit('update:visible', false)
}
</script>
