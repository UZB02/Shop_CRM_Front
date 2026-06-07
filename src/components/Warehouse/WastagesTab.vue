<template>
  <div class="space-y-4">
    <!-- Filters & Export -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
          <i class="pi pi-exclamation-triangle text-lg"></i>
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{{ $t('warehouse.wastage.title') }}</h3>
          <p class="text-[11px] text-slate-400 font-bold tracking-widest uppercase">{{ $t('warehouse.detail.total_count', { Count: totalRecords }) }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <DatePicker 
          v-model="dates" 
          selectionMode="range" 
          :manualInput="false" 
          showIcon 
          iconDisplay="input"
          placeholder="Sana boyicha"
          class="w-full sm:w-60"
          :pt="{
            input: { class: 'h-10 text-[13px] font-bold rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-inner w-full' }
          }"
        />
        <button 
          @click="handleExport" 
          :disabled="exporting"
          class="h-10 px-5 rounded-xl text-[12px] font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
        >
          <i :class="exporting ? 'pi pi-spin pi-spinner' : 'pi pi-file-excel'"></i>
          {{ $t('common.download') }}
        </button>
      </div>
    </div>

    <!-- Data Area -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20 gap-3">
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
        <p class="text-xs text-slate-400 animate-pulse font-medium capitalize">{{ $t('common.loading') }}</p>
      </div>

      <template v-else>
        <div v-if="items.length" class="flex-1">
          <!-- Desktop Table (hidden on mobile) -->
          <div class="hidden lg:block overflow-x-auto custom-scrollbar">
            <table class="w-full text-left min-w-[900px]">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase w-12">№</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('products.col_product') }}</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase text-right">{{ $t('products.form.amount') }}</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('warehouse.wastage.reason_label') }}</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('warehouse.detail.col_worker') }}</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase text-right">{{ $t('common.date') }}</th>
                  <th class="px-4 py-3 text-[11px] font-black text-slate-400 tracking-widest uppercase w-16"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                  <td class="px-4 py-3 text-[12px] font-bold text-slate-400">{{ (page - 1) * rows + index + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-black text-slate-700 dark:text-slate-200 tracking-tight">{{ item.product_name }}</span>
                        <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" class="scale-90 origin-left" />
                      </div>
                      <span class="text-[11px] font-bold text-slate-400">{{ item.product_unit }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-[12px] border border-rose-500/20 shadow-sm">
                      {{ item.quantity }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1.5">
                      <i :class="[getReasonIcon(item.reason), getReasonColor(item.reason)]" class="text-[12px]"></i>
                      <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {{ item.reason_display }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-black text-indigo-500 border border-indigo-100 dark:border-indigo-800/50">
                        {{ item.worker_name?.charAt(0) }}
                      </div>
                      <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300">{{ item.worker_name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex flex-col items-end">
                      <span class="text-[12px] font-bold text-slate-600 dark:text-slate-300">{{ item.created_on?.split(' ')[0] || item.date }}</span>
                      <span class="text-[10px] font-bold text-slate-400">{{ item.created_on?.split(' ')[1] || '' }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      @click="viewDetail(item)" 
                      class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-700 active:scale-90 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <i class="pi pi-eye text-sm"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden p-3 sm:p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            <div 
              v-for="(item, index) in items" 
              :key="item.id"
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
              @click="viewDetail(item)"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-tight truncate">{{ item.product_name }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold text-slate-400">{{ item.product_unit }}</span>
                    <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" class="scale-75 origin-left" />
                  </div>
                </div>
                <div class="shrink-0">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-[12px] border border-rose-500/20 shadow-sm">
                    {{ item.quantity }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div class="flex flex-col gap-0.5">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ $t('warehouse.wastage.reason_label') }}</span>
                  <div class="flex items-center gap-1.5">
                    <i :class="[getReasonIcon(item.reason), getReasonColor(item.reason)]" class="text-[10px]"></i>
                    <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">{{ item.reason_display }}</span>
                  </div>
                </div>
                <div class="flex flex-col gap-0.5 items-end text-right">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ $t('common.date') }}</span>
                  <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">{{ item.created_on || item.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
            <i class="pi pi-inbox text-slate-300 dark:text-slate-600 text-3xl"></i>
          </div>
          <h4 class="text-[14px] font-black text-slate-600 dark:text-slate-300 mb-1 capitalize">{{ $t('warehouse.wastage.no_data') }}</h4>
          <p class="text-[12px] font-bold text-slate-400 max-w-[200px]">{{ $t('common.no_results_desc') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalRecords > rows" class="border-t border-slate-100 dark:border-slate-800 mt-auto bg-white dark:bg-slate-900">
          <TablePagination
            :currentPage="page"
            :totalRecords="totalRecords"
            :rowsPerPage="rows"
            @page-change="onPageChange"
          />
        </div>
      </template>
    </div>

    <!-- Detail Modal -->
    <Dialog 
      v-model:visible="detailVisible" 
      modal 
      :header="$t('warehouse.wastage.detail_title')" 
      :style="{ width: '500px' }" 
      class="p-fluid bypass-loading"
    >
      <div v-if="selectedItem" class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
            <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1.5">{{ $t('products.col_product') }}</p>
            <div class="flex items-center gap-2">
              <p class="text-[14px] font-black text-slate-800 dark:text-slate-100">{{ selectedItem.product_name }}</p>
              <TurBadge :tur-name="selectedItem.tur_name" :tur-color="selectedItem.tur_color" />
            </div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1.5">{{ $t('products.form.amount') }}</p>
            <p class="text-[14px] font-black text-rose-500">{{ selectedItem.quantity }} {{ selectedItem.product_unit }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1.5">{{ $t('warehouse.wastage.reason_label') }}</p>
            <div class="flex items-center gap-1.5">
              <i :class="[getReasonIcon(selectedItem.reason), getReasonColor(selectedItem.reason)]" class="text-[13px]"></i>
              <p class="text-[13px] font-bold text-slate-700 dark:text-slate-200">{{ selectedItem.reason_display }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedItem.description" class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <p class="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1.5">{{ $t('warehouse.detail.col_description') }}</p>
          <p class="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold italic">
            {{ selectedItem.description }}
          </p>
        </div>

        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
              {{ selectedItem.worker_name?.charAt(0) }}
            </div>
            <div>
              <p class="text-[11px] font-bold text-slate-400 tracking-widest line-clamp-1">{{ $t('warehouse.detail.col_worker') }}</p>
              <p class="text-[13px] font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{{ selectedItem.worker_name }}</p>
            </div>
          </div>
          <p class="text-[12px] text-slate-400 font-medium">{{ selectedItem.created_on }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { wastagesAPI } from '@/services/api'
import TurBadge from '@/components/common/TurBadge.vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import TablePagination from '@/components/TablePagination.vue'

const props = defineProps({
  locationId: [Number, String],
  locationType: String // 'branch' or 'warehouse'
})

const items = ref([])
const totalRecords = ref(0)
const loading = ref(false)
const exporting = ref(false)
const page = ref(1)
const rows = ref(10)
const dates = ref(null)

const selectedItem = ref(null)
const detailVisible = ref(false)

const fetchWastages = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      [props.locationType]: props.locationId
    }

    if (dates.value && dates.value[0] && dates.value[1]) {
      params.date_from = dates.value[0].toISOString().split('T')[0]
      params.date_to = dates.value[1].toISOString().split('T')[0]
    }

    const res = await wastagesAPI.getAll(params)
    items.value = res.data.results || []
    totalRecords.value = res.data.count || 0
  } catch (err) {
    console.error('❌ Fetch wastages error:', err)
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  exporting.value = true
  try {
    const params = {
      [props.locationType]: props.locationId
    }

    if (dates.value && dates.value[0] && dates.value[1]) {
      params.date_from = dates.value[0].toISOString().split('T')[0]
      params.date_to = dates.value[1].toISOString().split('T')[0]
    }

    const res = await wastagesAPI.export(params)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `isroflar_${props.locationType}_${props.locationId}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('❌ Export error:', err)
  } finally {
    exporting.value = false
  }
}

const onPageChange = (event) => {
  page.value = event.page + 1
  fetchWastages()
}

const viewDetail = async (item) => {
  selectedItem.value = item
  detailVisible.value = true
  
  // Fetch full detail if needed
  try {
    const res = await wastagesAPI.getById(item.id)
    selectedItem.value = { ...item, ...res.data }
  } catch (err) {
    console.error('❌ Fetch detail error:', err)
  }
}

const getReasonIcon = (value) => {
  switch (value) {
    case 'expired': return 'pi pi-calendar-times'
    case 'damaged': return 'pi pi-exclamation-circle'
    case 'stolen': return 'pi pi-shield'
    default: return 'pi pi-info-circle'
  }
}

const getReasonColor = (value) => {
  switch (value) {
    case 'expired': return 'text-amber-500'
    case 'damaged': return 'text-rose-500'
    case 'stolen': return 'text-slate-700 dark:text-slate-300'
    default: return 'text-blue-500'
  }
}

watch(dates, (newDates) => {
  if (!newDates || (newDates[0] && newDates[1])) {
    page.value = 1
    fetchWastages()
  }
})

onMounted(() => {
  fetchWastages()
})

// Expose refresh method
defineExpose({ refresh: fetchWastages })
</script>


