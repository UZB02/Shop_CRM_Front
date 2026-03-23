<template>
  <div class="space-y-4">
    <!-- Desktop Table View: Hidden on mobile -->
    <div class="hidden md:block bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl transition-all">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-[800px]">
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
                  <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <i class="pi pi-sitemap text-[11px] text-emerald-500 group-hover:text-white"></i>
                  </div>
                  <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{{ data.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5 min-w-[150px]">
                  <i class="pi pi-map-marker text-[10px] text-slate-400 group-hover:text-emerald-500 transition-colors"></i>
                  <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">{{ data.address || '—' }}</span>
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
                <div class="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="$emit('edit', data)"
                    v-tooltip.top="$t('common.edit')"
                    class="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <i class="pi pi-pencil text-[10px]"></i>
                  </button>
                  <button
                    @click="$emit('delete', data)"
                    v-tooltip.top="$t('common.delete')"
                    class="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <i class="pi pi-trash text-[10px]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card View: Visible only on mobile -->
    <div class="grid grid-cols-1 gap-4 md:hidden">
      <!-- Loading Skeleton for cards -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
      </template>

      <!-- Empty State -->
      <template v-else-if="!branches.length">
        <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
           <i class="pi pi-sitemap text-3xl text-slate-200 mb-2"></i>
           <p class="text-[10px] font-black text-slate-400 uppercase">{{ $t('stores.no_branches') }}</p>
        </div>
      </template>

      <!-- Actual Cards -->
      <template v-else>
        <div v-for="data in branches" :key="data.id"
             class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                <i class="pi pi-sitemap text-sm"></i>
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase">{{ data.name }}</h4>
                <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5 block">{{ data.store_name }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="$emit('edit', data)" class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center active:bg-blue-500 active:text-white transition-all">
                 <i class="pi pi-pencil text-xs"></i>
              </button>
              <button @click="$emit('delete', data)" class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center active:bg-rose-500 active:text-white transition-all">
                 <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </div>

          <div class="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800/50">
            <div class="flex items-start gap-2.5">
               <i class="pi pi-map-marker text-[10px] text-slate-400 mt-0.5"></i>
               <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{{ data.address || '—' }}</p>
            </div>
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                  <i class="pi pi-phone text-[10px] text-slate-400"></i>
                  <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ data.phone || '—' }}</span>
               </div>
               <span :class="[
                  'px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border',
                  data.status === 'active'
                    ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
               ]">
                  {{ data.status === 'active' ? 'FAOL' : 'NOFAOL' }}
               </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="totalRecords > 0" 
         class="px-6 py-4 bg-white/50 dark:bg-slate-900/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-inter">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {{ totalRecords }} ta filialdan {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalRecords) }} ko'rsatilmoqda
      </p>
      <div class="flex items-center gap-1">
        <button @click="currentPage--" :disabled="currentPage === 1"
                class="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
          <i class="pi pi-angle-left text-xs"></i>
        </button>
        
        <div class="flex items-center gap-1.5 mx-1">
          <template v-for="p in displayedPages" :key="p">
            <button v-if="typeof p === 'number'" @click="currentPage = p"
                    class="w-9 h-9 rounded-2xl text-[11px] font-black transition-all shadow-sm border focus:outline-none"
                    :class="currentPage === p 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'">
              {{ p }}
            </button>
            <span v-else class="px-2 text-slate-300 text-xs">...</span>
          </template>
        </div>

        <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all disabled:opacity-30
                       border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
          <i class="pi pi-angle-right text-xs"></i>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
