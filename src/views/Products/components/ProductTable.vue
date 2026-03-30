<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm transition-all duration-500">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.col_product') }}</th>
              <th class="px-3 sm:px-5 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('products.form.barcode') }}</th>
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
              <td class="px-3 sm:px-5 py-2.5 sm:py-4">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="relative group/img shrink-0">
                    <div class="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden shadow-sm group-hover/img:shadow-md transition-all duration-500">
                      <img 
                        v-if="formatImageUrl(item.image) && !imageErrors[item.id]" 
                        :src="formatImageUrl(item.image)" 
                        @error="handleImageError(item.id)"
                        class="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" 
                      />
                      <i v-else class="pi pi-image text-xl text-slate-300 dark:text-slate-600 animate-in fade-in duration-500"></i>
                    </div>
                    <div v-if="item.status === 'active'" class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm animate-pulse"></div>
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <router-link 
                      :to="`/dashboard/products/${item.id || item._id}`"
                      class="font-bold text-sm sm:text-base text-slate-800 dark:text-white tracking-tight hover:text-emerald-500 transition-colors truncate"
                    >
                      {{ item.name }}
                    </router-link>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {{ item.category_name }}
                      </span>
                      <span v-if="item.subcategory_name" class="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                        {{ item.subcategory_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div v-if="item.barcode" class="inline-flex items-center px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                  <span class="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400">
                    {{ item.barcode }}
                  </span>
                </div>
                <span v-else class="text-[10px] font-bold text-slate-300 italic">Noma'lum</span>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {{ item.currency_code || 'UZS' }}
                    </span>
                    <span class="text-sm sm:text-base font-black text-slate-800 dark:text-white tracking-tight">
                      {{ formatNumber(item.sale_price) }}
                    </span>
                  </div>
                  <div v-if="item.unit_display" class="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic">
                    1 {{ item.unit_display }} uchun
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-right">
                <div class="flex gap-1 justify-end">
                  <Button icon="pi pi-eye" text rounded severity="secondary" @click="router.push(`/dashboard/products/${item.id || item._id}`)" class="!h-8 !w-8 sm:!h-10 sm:!w-10 hover:!bg-sky-500/10 hover:!text-sky-500 transition-all !p-0 !border-none" v-tooltip.top="'Ko\'rish'" />
                  <Button icon="pi pi-barcode" text rounded severity="secondary" v-if="item.barcode" @click="viewBarcode(item)" class="!h-8 !w-8 sm:!h-10 sm:!w-10 hover:!bg-amber-500/10 hover:!text-amber-500 transition-all !p-0 !border-none" v-tooltip.top="'Shtrix-kod'" />
                  <Button icon="pi pi-pencil" text rounded severity="secondary" @click="router.push(`/dashboard/products/edit/${item.id || item._id}`)" class="!h-8 !w-8 sm:!h-10 sm:!w-10 hover:!bg-emerald-500/10 hover:!text-emerald-500 transition-all !p-0 !border-none" v-tooltip.top="'Tahrirlash'" />
                  <Button icon="pi pi-trash" text rounded severity="secondary" @click="$emit('delete', item)" class="!h-8 !w-8 sm:!h-10 sm:!w-10 hover:!bg-rose-500/10 hover:!text-rose-500 transition-all !p-0 !border-none" v-tooltip.top="'O\'chirish'" />
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && products.length === 0">
              <td colspan="4" class="px-6 py-24 text-center">
                <div class="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-slate-900 shadow-xl">
                  <i class="pi pi-box text-slate-200 dark:text-slate-700 text-4xl"></i>
                </div>
                <h3 class="text-slate-800 dark:text-white font-black uppercase tracking-widest mb-1">{{ $t('products.not_found') }}</h3>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Ma'lumotlar mavjud emas</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Pagination -->
    <div v-if="totalRecords > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-500">
      <div class="flex items-center gap-3">
        <div class="h-8 w-1 bg-emerald-500 rounded-full"></div>
        <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          {{ $t('products.page_info', { current: (currentPage - 1) * 10 + 1 + '-' + Math.min(currentPage * 10, totalRecords), total: totalRecords }) }}
        </p>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <Button 
          icon="pi pi-angle-double-left" 
          text 
          rounded 
          :disabled="currentPage === 1" 
          @click="changePage(1)" 
          class="!h-9 !w-9 !text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800"
        />
        <Button 
          icon="pi pi-angle-left" 
          text 
          rounded 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)" 
          class="!h-9 !w-9 !text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800"
        />
        
        <div class="flex items-center gap-1.5 px-2">
          <Button 
            v-for="p in displayedPages" 
            :key="p"
            :label="p.toString()" 
            :severity="p === currentPage ? 'success' : 'secondary'"
            :text="p !== currentPage"
            @click="changePage(p)"
            class="!h-9 !w-9 !rounded-xl font-black text-xs transition-all duration-300"
            :class="p === currentPage ? 'shadow-lg shadow-emerald-500/20 !bg-emerald-500 !text-white' : '!text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800'"
          />
        </div>

        <Button 
          icon="pi pi-angle-right" 
          text 
          rounded 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)" 
          class="!h-9 !w-9 !text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800"
        />
        <Button 
          icon="pi pi-angle-double-right" 
          text 
          rounded 
          :disabled="currentPage === totalPages" 
          @click="changePage(totalPages)" 
          class="!h-9 !w-9 !text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

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

const router = useRouter()

// Image error handling
const imageErrors = ref({})
const handleImageError = (id) => {
  imageErrors.value[id] = true
}

// Reset errors when products change (e.g. pagination)
watch(() => props.products, () => {
  imageErrors.value = {}
}, { deep: false })

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

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('uz-UZ').format(value)
}

const formatImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const baseUrl = 'https://shopcrmsystem-production.up.railway.app'
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const viewBarcode = (item) => {
  const id = item.id || item._id
  window.open(`https://shopcrmsystem-production.up.railway.app/api/v1/warehouse/products/${id}/barcode/`, '_blank')
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
