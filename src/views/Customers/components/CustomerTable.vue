<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm backdrop-blur-xl border border-slate-100/50 dark:border-slate-800/30">
    <div class="overflow-x-auto overflow-y-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.table.name') }}</th>
            <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.table.contact_address') }}</th>
            <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center font-inter">{{ $t('customers.table.trades') }}</th>
            <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-inter">{{ $t('customers.table.total_spent') }}</th>
            <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right font-inter">{{ $t('customers.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <!-- Loading -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12 mx-auto animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-20 ml-auto animate-pulse"></div></td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!customers.length">
            <tr>
              <td colspan="5" class="px-6 py-14 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-users text-xl text-slate-400"></i>
                </div>
                <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ $t('customers.table.no_results') }}</p>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <tr 
            v-for="data in customers" 
            :key="data.id" 
            class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all border-b border-slate-50 dark:border-slate-800 last:border-0"
          >
            <!-- Name & Group -->
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <i class="pi pi-user text-sm"></i>
                </div>
                <div>
                  <p class="text-[12px] font-black text-slate-800 dark:text-slate-200 tracking-tight">{{ data.name }}</p>
                  <div v-if="data.group_name" class="flex mt-0.5">
                    <span class="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest border border-amber-500/20">
                      {{ data.group_name }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Contact & Address -->
            <td class="px-4 py-2.5">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <i class="pi pi-phone text-[9px] text-slate-400"></i>
                  <span class="text-[11px] font-semibold tracking-tight">{{ data.phone }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <i class="pi pi-map-marker text-[9px]"></i>
                  <span class="text-[10px] font-medium truncate max-w-[180px]">{{ data.address || '—' }}</span>
                </div>
              </div>
            </td>

            <!-- Stats -->
            <td class="px-4 py-2.5 text-center">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {{ data.tradesCount || 0 }}
              </span>
            </td>

            <!-- Total Spent -->
            <td class="px-4 py-2.5 text-right">
              <div class="flex flex-col">
                <span class="text-[12px] font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                  {{ formatCurrency(data.totalSpent) }}
                </span>
                <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{{ $t('customers.table.total_spent_label') }}</span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1 transition-opacity">
                <button
                  @click="$emit('view-history', data.id)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                  :title="$t('customers.table.history_tooltip')"
                >
                  <i class="pi pi-history text-[10px]"></i>
                </button>
                <button
                  @click="$emit('edit', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                  :title="$t('customers.table.edit_tooltip')"
                >
                  <i class="pi pi-pencil text-[10px]"></i>
                </button>
                <button
                  @click="$emit('delete', data)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  :title="$t('customers.table.delete_tooltip')"
                >
                  <i class="pi pi-trash text-[10px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalRecords > 0" 
         class="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        Showing {{ (currentPage-1)*pageSize + 1 }} - {{ Math.min(currentPage*pageSize, totalRecords) }} of {{ totalRecords }}
      </div>
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
  customers: { type: Array, default: () => [] },
  loading: Boolean,
  totalRecords: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['edit', 'delete', 'view-history', 'update:page', 'page-change'])

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

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'currency', 
    currency: 'UZS', 
    maximumFractionDigits: 0 
  }).format(val || 0)
}
</script>

