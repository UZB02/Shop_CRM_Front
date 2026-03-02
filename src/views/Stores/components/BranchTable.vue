<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/30">
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_branch') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_address') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_store') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_phone') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ $t('stores.col_status') }}</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">{{ $t('stores.col_actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <!-- Loading -->
          <template v-if="loading">
            <tr v-for="i in 4" :key="i">
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-40 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-14 animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-16 ml-auto animate-pulse"></div></td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!branches.length">
            <tr>
              <td colspan="6" class="px-6 py-14 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-sitemap text-xl text-slate-400"></i>
                </div>
                <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ $t('stores.no_branches') }}</p>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <tr
            v-for="data in branches"
            :key="data.id"
            class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-sitemap text-[10px] text-emerald-500"></i>
                </div>
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ data.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5">
                <i class="pi pi-map-marker text-[10px] text-slate-400"></i>
                <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{{ data.address || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {{ data.store_name || '—' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5">
                <i class="pi pi-phone text-[10px] text-slate-400"></i>
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ data.phone || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider',
                data.status === 'active'
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              ]">
                {{ data.status === 'active' ? $t('stores.status_active') : $t('stores.status_inactive') }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  @click="$emit('edit', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                  :title="$t('common.edit')"
                >
                  <i class="pi pi-pencil text-[10px]"></i>
                </button>
                <button
                  @click="$emit('delete', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  :title="$t('common.delete')"
                >
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div v-if="totalRecords > 0" 
         class="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end font-inter">
      <div class="flex items-center gap-1">
        <button @click="currentPage--" :disabled="currentPage === 1"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
          <i class="pi pi-angle-left text-[10px]"></i>
        </button>
        
        <div class="flex items-center gap-1 mx-1">
          <template v-for="p in displayedPages" :key="p">
            <button @click="currentPage = p"
                    class="w-8 h-8 rounded-xl text-[11px] font-black transition-all shadow-sm border focus:outline-none"
                    :class="currentPage === p 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
              {{ p }}
            </button>
          </template>
        </div>

        <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
          <i class="pi pi-angle-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  branches: { type: Array, default: () => [] },
  loading: Boolean,
  totalRecords: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['edit', 'delete', 'update:page', 'page-change'])

const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
    emit('page-change')
  }
})

const totalPages = computed(() => Math.ceil(props.totalRecords / props.pageSize))

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (currentPage.value <= 3) return [1, 2, 3, 4, 5]
  if (currentPage.value >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total]
  return [currentPage.value - 2, currentPage.value - 1, currentPage.value, currentPage.value + 1, currentPage.value + 2]
})
</script>
