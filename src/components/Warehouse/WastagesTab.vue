<template>
  <div class="space-y-4">
    <!-- Filters & Export -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
          <i class="pi pi-exclamation-triangle text-lg"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-100">{{ $t('warehouse.wastage.title') }}</h3>
          <p class="text-[10px] text-slate-400 font-medium tracking-wider">{{ totalRecords }} {{ $t('products.subtitle', { count: totalRecords }) }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <DatePicker 
          v-model="dates" 
          selectionMode="range" 
          :manualInput="false" 
          showIcon 
          iconDisplay="input"
          placeholder="Sana boyicha"
          class="w-full sm:w-60"
          inputClass="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
        />
        <Button 
          icon="pi pi-file-excel" 
          :label="$t('common.download')" 
          @click="handleExport" 
          :loading="exporting"
          class="p-button-emerald p-button-sm h-9 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 whitespace-nowrap" 
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20 gap-3">
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
        <p class="text-xs text-slate-400 animate-pulse font-medium capitalize">{{ $t('common.loading') }}</p>
      </div>

      <template v-else>
        <div v-if="items.length" class="overflow-x-auto flex-1">
          <table class="w-full text-left min-w-[900px]">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest w-12">№</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest">{{ $t('products.col_product') }}</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest text-right">{{ $t('products.form.amount') }}</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.wastage.reason_label') }}</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest">{{ $t('warehouse.detail.col_worker') }}</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest text-right">{{ $t('common.date') }}</th>
                <th class="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-widest w-16"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
              <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                <td class="px-4 py-3 text-[10px] text-slate-400">{{ (page - 1) * rows + index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight">{{ item.product_name }}</span>
                      <TurBadge :tur-name="item.tur_name" :tur-color="item.tur_color" />
                    </div>
                    <span class="text-[9px] font-medium text-slate-400">{{ item.product_unit }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                    {{ item.quantity }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <i :class="[getReasonIcon(item.reason), getReasonColor(item.reason)]" class="text-[8px]"></i>
                    <span class="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {{ item.reason_display }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                      {{ item.worker_name?.charAt(0) }}
                    </div>
                    <span class="text-[10px] font-medium text-slate-600 dark:text-slate-400">{{ item.worker_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right text-[10px] text-slate-400 font-medium">
                  {{ item.date }}
                </td>
                <td class="px-4 py-3 text-right">
                  <Button 
                    icon="pi pi-eye" 
                    @click="viewDetail(item)" 
                    class="p-button-text p-button-secondary p-button-sm w-7 h-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
            <i class="pi pi-inbox text-slate-300 text-3xl"></i>
          </div>
          <h4 class="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1 capitalize">{{ $t('warehouse.wastage.no_data') }}</h4>
          <p class="text-xs text-slate-400 max-w-[200px]">{{ $t('common.no_results_desc') }}</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalRecords > rows" class="border-t border-slate-100 dark:border-slate-800 mt-auto">
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
          <div class="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{{ $t('products.col_product') }}</p>
            <div class="flex items-center gap-2">
              <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ selectedItem.product_name }}</p>
              <TurBadge :tur-name="selectedItem.tur_name" :tur-color="selectedItem.tur_color" />
            </div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{{ $t('products.form.amount') }}</p>
            <p class="text-xs font-bold text-rose-500">{{ selectedItem.quantity }} {{ selectedItem.product_unit }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{{ $t('warehouse.wastage.reason_label') }}</p>
            <div class="flex items-center gap-1.5">
              <i :class="[getReasonIcon(selectedItem.reason), getReasonColor(selectedItem.reason)]" class="text-[10px]"></i>
              <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ selectedItem.reason_display }}</p>
            </div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p class="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{{ $t('common.date') }}</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ selectedItem.date }}</p>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <p class="text-[9px] font-bold text-slate-400 tracking-widest mb-1">{{ $t('warehouse.detail.col_description') }}</p>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {{ selectedItem.description || '—' }}
          </p>
        </div>

        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
              {{ selectedItem.worker_name?.charAt(0) }}
            </div>
            <div>
              <p class="text-[9px] font-bold text-slate-400 tracking-widest line-clamp-1">{{ $t('warehouse.detail.col_worker') }}</p>
              <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{{ selectedItem.worker_name }}</p>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 font-medium">{{ selectedItem.created_on }}</p>
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
