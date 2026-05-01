<template>
  <div class="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm backdrop-blur-xl border border-slate-100/50 dark:border-slate-800/30">

    <!-- Table header: search -->
    <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/30">
      <span class="text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">
        {{ $t('finance.list') }}
      </span>
      <div class="relative w-full sm:w-64 group/search">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] group-focus-within/search:text-rose-500 transition-colors"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('finance.search_ph')"
          class="w-full h-8 pl-8 pr-4 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">{{ $t('finance.date') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">{{ $t('finance.category') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 hidden md:table-cell">{{ $t('finance.branch') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 hidden sm:table-cell">{{ $t('finance.worker') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400">{{ $t('finance.amount') }}</th>
            <th class="px-4 py-3 text-[12px] font-black tracking-widest text-slate-500 dark:text-slate-400 text-right">{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">

          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="i in 6" :key="i">
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 animate-pulse"></div></td>
              <td class="px-4 py-3 hidden md:table-cell"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28 animate-pulse"></div></td>
              <td class="px-4 py-3 hidden sm:table-cell"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20 animate-pulse"></div></td>
              <td class="px-4 py-3"><div class="h-7 bg-slate-100 dark:bg-slate-800 rounded-lg w-20 ml-auto animate-pulse"></div></td>
            </tr>
          </template>

          <!-- Empty state -->
          <template v-else-if="!filteredExpenses.length">
            <tr>
              <td colspan="6" class="px-6 py-14 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <i class="pi pi-wallet text-xl text-slate-400"></i>
                </div>
                <p class="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest">{{ $t('finance.no_results') }}</p>
              </td>
            </tr>
          </template>

          <!-- Data rows -->
          <tr
            v-for="item in filteredExpenses"
            :key="item.id"
            @click="$emit('view', item)"
            class="group hover:bg-rose-50/30 dark:hover:bg-rose-500/5 transition-all border-b border-slate-50 dark:border-slate-800 last:border-0 cursor-pointer"
          >
            <!-- Sana -->
            <td class="px-4 py-2.5">
              <div class="flex flex-col">
                <span class="text-[14px] font-black text-slate-800 dark:text-slate-200 tracking-tight">{{ formatDate(item.date) }}</span>
                <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{{ formatTime(item.created_on) }}</span>
              </div>
            </td>

            <!-- Kategoriya -->
            <td class="px-4 py-2.5">
              <div class="flex flex-col">
                <span class="text-[14px] font-black text-slate-800 dark:text-slate-200 group-hover:text-rose-500 transition-colors">{{ item.category_name }}</span>
                <p v-if="item.description" class="text-[11px] font-medium text-slate-400 truncate max-w-[180px] mt-0.5 italic">{{ item.description }}</p>
              </div>
            </td>

            <!-- Filial -->
            <td class="px-4 py-2.5 hidden md:table-cell">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[12px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {{ item.branch_name || '—' }}
              </span>
            </td>

            <!-- Xodim -->
            <td class="px-4 py-2.5 hidden sm:table-cell">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[12px] font-black text-slate-500 shrink-0">
                  {{ item.worker_name?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <span class="text-[13px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{{ item.worker_name || '—' }}</span>
              </div>
            </td>

            <!-- Summa -->
            <td class="px-4 py-2.5">
              <div class="flex flex-col">
                <span class="text-[15px] font-black text-rose-500 tracking-tight">{{ settingsStore.formatPrice(item.amount) }}</span>
              </div>
            </td>

            <!-- Amallar -->
            <td class="px-4 py-2.5 text-right">
              <div class="flex justify-end gap-1">
                <!-- Chekni ko'rish: hammaga -->
                <button
                  v-if="item.receipt_image"
                  @click.stop="viewReceipt(item.receipt_image)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                  :title="$t('finance.receipt_view')"
                >
                  <i class="pi pi-image text-[12px]"></i>
                </button>
                <!-- Tahrirlash: faqat Manager+ -->
                <button
                  v-if="isManager"
                  @click.stop="$emit('edit', item)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                  :title="$t('common.edit')"
                >
                  <i class="pi pi-pencil text-[12px]"></i>
                </button>
                <!-- O'chirish: faqat Manager+ -->
                <button
                  v-if="isManager"
                  @click.stop="$emit('delete', item)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                  :title="$t('common.delete')"
                >
                  <i class="pi pi-trash text-[12px]"></i>
                </button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Footer info -->
    <div v-if="filteredExpenses.length > 0" class="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <span class="text-[11px] font-black text-slate-400 tracking-widest">
        {{ $t('finance.results_count', { count: filteredExpenses.length }) }}
      </span>
      <span class="text-[11px] font-black text-slate-400 tracking-widest">
        {{ $t('common.total_amount') }}: <span class="text-rose-500">{{ settingsStore.formatPrice(totalAmount) }}</span>
      </span>
    </div>

    <!-- Receipt preview overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="receiptVisible" @click="receiptVisible = false" class="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
          <div class="relative max-w-2xl w-full" @click.stop>
            <button @click="receiptVisible = false" class="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
              <i class="pi pi-times text-xs"></i>
            </button>
            <div class="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
              <img :src="receiptUrl" class="w-full h-auto rounded-xl max-h-[70vh] object-contain" :alt="$t('finance.receipt')" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const props = defineProps({
  expenses: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  isManager: { type: Boolean, default: false }
})

defineEmits(['edit', 'delete', 'view'])

const searchQuery = ref('')
const receiptVisible = ref(false)
const receiptUrl = ref('')

const filteredExpenses = computed(() => {
  if (!searchQuery.value.trim()) return props.expenses
  const q = searchQuery.value.toLowerCase()
  return props.expenses.filter(item =>
    item.category_name?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q) ||
    item.worker_name?.toLowerCase().includes(q) ||
    item.branch_name?.toLowerCase().includes(q)
  )
})

const totalAmount = computed(() =>
  filteredExpenses.value.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr // Return original string if invalid
  return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

const viewReceipt = (url) => {
  receiptUrl.value = url
  receiptVisible.value = true
}
</script>


