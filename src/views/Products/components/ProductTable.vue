<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm transition-all duration-500">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.col_product') }}</th>
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.col_stock') }}</th>
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.col_price') }}</th>
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">{{ $t('products.col_actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <!-- Loading State -->
            <tr v-if="loading" v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                  <div class="space-y-2">
                    <div class="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div class="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><div class="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div></td>
              <td class="px-6 py-4"><div class="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div></td>
            </tr>

            <!-- Content -->
            <tr v-else v-for="item in products" :key="item.id || item._id" 
              class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300"
            >
              <td class="px-3 sm:px-5 py-2.5 sm:py-3.5">
                <div class="flex items-center gap-2.5 sm:gap-3">
                  <div class="relative group/img shrink-0">
                    <div class="w-9 h-9 sm:w-11 sm:h-11 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-sm group-hover/img:shadow-md transition-all">
                      <img v-if="item.image" :src="item.image" class="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                      <i v-else class="pi pi-image text-base sm:text-lg text-slate-300"></i>
                    </div>
                    <div v-if="item.status === 'inactive'" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0">
                    <p class="font-bold text-xs sm:text-sm text-slate-800 dark:text-white tracking-tight group-hover:text-emerald-500 transition-colors truncate">{{ item.name }}</p>
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <span class="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md truncate">{{ item.category_name }}</span>
                      <span v-if="item.barcode" class="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate hidden xs:inline">#{{ item.barcode }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col gap-1.5 sm:gap-2 min-w-[100px] sm:min-w-[140px]">
                  <div class="flex items-end justify-between px-0.5">
                    <span :class="['text-[10px] sm:text-xs font-black uppercase tracking-wider', (item.amount || 0) < 10 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400']">
                      {{ item.amount ?? 0 }} {{ $t('units.' + (item.unit || 'dona')) }}
                    </span>
                    <span class="text-[8px] sm:text-[10px] font-bold text-slate-300 dark:text-slate-600">{{ Math.min(Math.round(((item.amount || 0) / 100) * 100), 100) }}%</span>
                  </div>
                  <div class="h-1 sm:h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      class="h-full transition-all duration-1000 rounded-full"
                      :class="(item.amount || 0) < 10 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' "
                      :style="`width: ${Math.min(((item.amount || 0) / 100) * 100, 100)}%`"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col">
                  <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">{{ formatCurrency(item.sale_price) }}</span>
                  <span v-if="item.purchase_price" class="text-[8px] sm:text-[10px] font-bold text-slate-400 line-through decoration-slate-300/50 italic">{{ formatCurrency(item.purchase_price) }}</span>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-right">
                <div class="flex gap-0.5 sm:gap-1 justify-end">
                  <Button icon="pi pi-pencil" text rounded severity="secondary" @click="router.push(`/dashboard/products/edit/${item.id || item._id}`)" class="!h-7 !w-7 sm:!h-9 sm:!w-9 hover:!bg-emerald-500/10 hover:!text-emerald-500 transition-all !p-0" />
                  <Button icon="pi pi-trash" text rounded severity="secondary" @click="$emit('delete', item)" class="!h-7 !w-7 sm:!h-9 sm:!w-9 hover:!bg-rose-500/10 hover:!text-rose-500 transition-all !p-0" />
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && products.length === 0">
              <td colspan="4" class="px-6 py-20 text-center">
                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="pi pi-box text-slate-200 dark:text-slate-700 text-3xl"></i>
                </div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">{{ $t('products.not_found') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Pagination -->
    <div v-if="totalRecords > 10" class="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl shadow-sm">
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {{ $t('products.page_info', { current: (currentPage - 1) * 10 + 1 + '-' + Math.min(currentPage * 10, totalRecords), total: totalRecords }) }}
      </p>
      <div class="flex items-center gap-2">
        <Button 
          icon="pi pi-angle-double-left" 
          text 
          rounded 
          :disabled="currentPage === 1" 
          @click="changePage(1)" 
          class="!h-10 !w-10"
        />
        <Button 
          icon="pi pi-angle-left" 
          text 
          rounded 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)" 
          class="!h-10 !w-10"
        />
        
        <div class="flex items-center gap-1">
          <Button 
            v-for="p in displayedPages" 
            :key="p"
            :label="p.toString()" 
            :severity="p === currentPage ? 'success' : 'secondary'"
            :text="p !== currentPage"
            @click="changePage(p)"
            class="!h-10 !w-10 !rounded-xl font-bold transition-all shadow-sm"
            :class="p === currentPage ? 'shadow-emerald-500/20' : ''"
          />
        </div>

        <Button 
          icon="pi pi-angle-right" 
          text 
          rounded 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)" 
          class="!h-10 !w-10"
        />
        <Button 
          icon="pi pi-angle-double-right" 
          text 
          rounded 
          :disabled="currentPage === totalPages" 
          @click="changePage(totalPages)" 
          class="!h-10 !w-10"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

const props = defineProps({
  products: Array,
  loading: Boolean,
  totalRecords: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['edit', 'delete', 'page-change'])

const totalPages = computed(() => Math.ceil(props.totalRecords / 10))

const displayedPages = computed(() => {
  const current = props.currentPage
  const total = totalPages.value
  const pages = []
  
  let start = Math.max(1, current - 1)
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
    emit('page-change', { page: page - 1, rows: 10 })
  }
}

const formatCurrency = (value) => {
  if (!value) return '0 UZS'
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value)
}
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
</style>
