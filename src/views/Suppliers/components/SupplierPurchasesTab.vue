<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-fade-in">
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Kirimlar tarixi</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase">ID / {{ $t('finance.date') }}</th>
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('pos.product') }}</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('transfers.col_product') }} (Miqdor)</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('pos.total_price') }}</th>
            <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('pos.employee') }}</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="i in 5" :key="i" class="border-b border-slate-50 dark:border-slate-800/50">
            <td class="px-4 py-3" colspan="5"><div class="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div></td>
          </tr>
        </tbody>
        <tbody v-else-if="!records.length">
          <tr>
            <td colspan="5" class="px-4 py-12 text-center text-slate-400 text-[13px]">{{ $t('common.no_results') }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="item in records" :key="item.id" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
            <td class="px-4 py-3">
              <div class="text-[12px] font-black text-slate-700 dark:text-slate-200">#{{ item.id }}</div>
              <div class="text-[11px] text-slate-400">{{ item.created_on }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-[13px] font-bold text-slate-700 dark:text-slate-200">{{ item.product_name }}</div>
              <div v-if="item.tur_name" class="text-[11px] text-emerald-500 mt-0.5">{{ item.tur_name }} {{ item.tur_color }}</div>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="text-[13px] font-bold text-slate-700 dark:text-slate-200">{{ Number(item.quantity) }} {{ item.product_unit }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="text-[13px] font-black text-slate-700 dark:text-slate-200">{{ formatCurrency(Number(item.quantity) * Number(item.unit_cost)) }}</div>
              <div class="text-[11px] text-slate-400">{{ formatCurrency(item.unit_cost) }} / {{ item.product_unit }}</div>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="text-[12px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{{ item.worker_name }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="totalRecords > 20" class="flex justify-center py-4 border-t border-slate-100 dark:border-slate-800">
      <Paginator
        :rows="20"
        :totalRecords="totalRecords"
        :first="(currentPage - 1) * 20"
        @page="onPageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="!bg-transparent !border-none !p-0 custom-paginator"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { suppliersAPI } from '@/services/api'
import Paginator from 'primevue/paginator'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  supplierId: { type: [String, Number], required: true }
})

const settingsStore = useSettingsStore()
const formatCurrency = (val) => settingsStore.formatPrice(val)
const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const records = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalRecords = ref(0)

const loadData = async (page = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const res = await suppliersAPI.getPurchases(props.supplierId, { page })
    records.value = res.data.results || []
    totalRecords.value = res.data.count || 0
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const onPageChange = (event) => {
  const page = Math.floor(event.first / event.rows) + 1
  loadData(page)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
:deep(.custom-paginator .p-paginator-page),
:deep(.custom-paginator .p-paginator-first),
:deep(.custom-paginator .p-paginator-prev),
:deep(.custom-paginator .p-paginator-next),
:deep(.custom-paginator .p-paginator-last) {
  width: 2rem !important; height: 2rem !important;
  border-radius: 0.5rem !important;
  font-size: 10px !important; font-weight: 700 !important;
  transition: all 0.3s ease !important;
  border: 1px solid #e2e8f0 !important;
  background-color: white !important;
  color: #64748b !important;
  margin: 0.125rem !important;
}
.dark :deep(.custom-paginator .p-paginator-page),
.dark :deep(.custom-paginator .p-paginator-first),
.dark :deep(.custom-paginator .p-paginator-prev),
.dark :deep(.custom-paginator .p-paginator-next),
.dark :deep(.custom-paginator .p-paginator-last) {
  background-color: #0f172a !important;
  border-color: #1e293b !important;
  color: #94a3b8 !important;
}
:deep(.custom-paginator .p-paginator-page.p-highlight) {
  background-color: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}
:deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #f8fafc !important;
  color: #10b981 !important;
  border-color: #10b981 !important;
}
.dark :deep(.custom-paginator .p-paginator-page:not(.p-highlight):hover) {
  background-color: #1e293b !important;
}
</style>
