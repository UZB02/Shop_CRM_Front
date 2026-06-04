<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-fade-in">
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">To'lovlar tarixi</h2>
    </div>

    <!-- Filters -->
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-all relative z-10 bg-slate-50/30 dark:bg-slate-900/30">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative flex-initial w-full sm:w-56 group">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
            <i class="pi pi-search text-[12px]"></i>
          </div>
          <input 
            v-model="filters.search" 
            type="text"
            :placeholder="$t('common.search')" 
            class="w-full h-10 pl-9 pr-4 text-sm font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all tracking-wider placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
            @keyup.enter="loadData(1)" 
          />
        </div>

        <!-- Payment Type -->
        <div class="relative flex-1 min-w-[150px] sm:flex-none sm:w-48 group">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
            <i class="pi pi-credit-card text-[12px]"></i>
          </div>
          <Select 
            v-model="filters.payment_type" 
            :options="paymentTypes" 
            optionLabel="label" 
            optionValue="value" 
            :placeholder="$t('pos.payment_method')" 
            showClear
            class="w-full" 
            pt:root:class="!h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !bg-slate-50/50 dark:!bg-slate-800/40 transition-all" 
            pt:label:class="!text-sm !font-black !flex !items-center !py-0 !pl-9 !pr-3 !tracking-wider text-slate-700 dark:text-slate-200"
          />
        </div>

        <!-- Date Range -->
        <div class="relative flex-initial w-full sm:w-64 group">
          <DatePicker 
            v-model="filters.dates" 
            selectionMode="range" 
            :manualInput="false" 
            placeholder="Sana oralig'i" 
            showIcon
            iconDisplay="input"
            class="w-full" 
            pt:root:class="!h-10 !rounded-xl !bg-transparent !border-none transition-all"
            pt:input:class="!w-full !h-10 !rounded-xl !border !border-slate-200/60 dark:!border-slate-700/50 !bg-slate-50/50 dark:!bg-slate-800/40 focus:!border-emerald-500/50 focus:!ring-4 focus:!ring-emerald-500/10 !text-sm !font-black !pl-4 !shadow-none select-none !tracking-wider !text-slate-700 dark:!text-slate-200 placeholder:!text-slate-400"
          />
        </div>

        <!-- Min Amount -->
        <div class="relative flex-1 min-w-[140px] sm:w-40 group">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
            <i class="pi pi-angle-down text-[12px]"></i>
          </div>
          <input 
            v-model.number="filters.min_amount" 
            type="number"
            placeholder="Min. summa" 
            class="w-full h-10 pl-9 pr-4 text-sm font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all tracking-wider placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
          />
        </div>

        <!-- Max Amount -->
        <div class="relative flex-1 min-w-[140px] sm:w-40 group">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
            <i class="pi pi-angle-up text-[12px]"></i>
          </div>
          <input 
            v-model.number="filters.max_amount" 
            type="number"
            placeholder="Max. summa" 
            class="w-full h-10 pl-9 pr-4 text-sm font-black rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all tracking-wider placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
          />
        </div>

        <!-- Filter Button -->
        <button @click="loadData(1)" class="h-10 w-10 shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center group/btn active:scale-95 ml-auto sm:ml-0">
          <i class="pi pi-filter text-[14px] group-hover/btn:scale-110 transition-transform"></i>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800">
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase">ID / {{ $t('finance.date') }}</th>
            <th class="px-4 py-3 text-right text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('finance.amount') }}</th>
            <th class="px-4 py-3 text-center text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('pos.payment_method') }}</th>
            <th class="px-4 py-3 text-left text-[11px] font-black text-slate-400 tracking-widest uppercase">{{ $t('finance.description') }}</th>
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
              <div class="text-[11px] text-slate-400">{{ formatDate(item.created_on) || item.created_on }}</div>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="text-[13px] font-black text-emerald-500">{{ formatCurrency(item.amount) }}</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {{ item.payment_type_display || item.payment_type }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="text-[13px] text-slate-600 dark:text-slate-300">{{ item.description || '—' }}</div>
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
import { ref, onMounted, watch } from 'vue'
import { suppliersAPI } from '@/services/api'
import Paginator from 'primevue/paginator'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import { useSettingsStore } from '@/store/settings'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  supplierId: { type: [String, Number], required: true }
})

const settingsStore = useSettingsStore()
const formatCurrency = (val) => settingsStore.formatPrice(val)
const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const records = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalRecords = ref(0)

const filters = ref({
  search: '',
  payment_type: null,
  dates: null,
  min_amount: null,
  max_amount: null
})

const paymentTypes = [
  { label: t('common.cash'), value: 'cash' },
  { label: t('common.card'), value: 'card' },
  { label: t('suppliers.payment.transfer') || 'O\'tkazma', value: 'transfer' }
]

const loadData = async (page = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const params = { page }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.payment_type) params.payment_type = filters.value.payment_type
    
    if (filters.value.dates && filters.value.dates[0] && filters.value.dates[1]) {
      const d1 = new Date(filters.value.dates[0])
      const d2 = new Date(filters.value.dates[1])
      d1.setMinutes(d1.getMinutes() - d1.getTimezoneOffset())
      d2.setMinutes(d2.getMinutes() - d2.getTimezoneOffset())
      params.date_from = d1.toISOString().split('T')[0]
      params.date_to = d2.toISOString().split('T')[0]
    }

    if (filters.value.min_amount) params.min_amount = filters.value.min_amount
    if (filters.value.max_amount) params.max_amount = filters.value.max_amount

    const res = await suppliersAPI.getPayments(props.supplierId, params)
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

watch(() => filters.value.payment_type, () => loadData(1))
watch(() => filters.value.dates, (newVal) => {
  if (!newVal || (newVal[0] && newVal[1])) loadData(1)
})

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

<style scoped>
:deep(.p-datepicker-input) {
  background-color: rgb(30 41 59 / 0.4) !important; /* dark:bg-slate-800/40 */
  border-color: rgb(51 65 85 / 0.5) !important; /* dark:border-slate-700/50 */
  color: #e2e8f0 !important; /* text-slate-200 */
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-size: 0.875rem !important;
  box-shadow: none !important;
}

:deep(.p-datepicker:not(.p-datepicker-inline) .p-datepicker-input) {
   background-color: rgb(30 41 59 / 0.4) !important;
}

html:not(.dark) :deep(.p-datepicker-input) {
  background-color: rgb(248 250 252 / 0.5) !important; /* bg-slate-50/50 */
  border-color: rgb(226 232 240 / 0.6) !important; /* border-slate-200/60 */
  color: #334155 !important; /* text-slate-700 */
}
</style>
