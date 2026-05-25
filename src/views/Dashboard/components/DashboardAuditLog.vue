<template>
  <div class="space-y-4 animate-in">
    <!-- Filters Card -->
    <div class="p-1.5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/85 rounded-xl shadow-sm backdrop-blur-md relative overflow-hidden transition-all duration-300">
      <!-- Glow effect -->
      <div class="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <!-- First Row: Ultra-Compact Toolbar -->
      <div class="flex flex-wrap lg:flex-nowrap items-center gap-1.5 relative z-10">
        
        <!-- Model Select -->
        <div class="relative flex-1 min-w-[120px] group">
          <i class="pi pi-box absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs z-10 pointer-events-none transition-colors group-hover:text-emerald-500"></i>
          <Select 
            v-model="filters.model" 
            :options="modelOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Model" 
            showClear
            class="w-full h-10"
            pt:root:class="!rounded-xl !h-10 !border-slate-200/80 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950/40 focus:!border-emerald-500/50 focus:!ring-1 focus:!ring-emerald-500/30 !transition-all !duration-200 !flex !items-center"
            pt:label:class="!text-[11px] !font-bold !py-0 !pl-8 !pr-3 !text-slate-700 dark:!text-slate-200 !flex !items-center !h-full"
          />
        </div>

        <!-- Action Select -->
        <div class="relative flex-1 min-w-[120px] group">
          <i class="pi pi-cog absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs z-10 pointer-events-none transition-colors group-hover:text-emerald-500"></i>
          <Select 
            v-model="filters.action" 
            :options="actionOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Amal turi" 
            showClear
            class="w-full h-10"
            pt:root:class="!rounded-xl !h-10 !border-slate-200/80 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950/40 focus:!border-emerald-500/50 focus:!ring-1 focus:!ring-emerald-500/30 !transition-all !duration-200 !flex !items-center"
            pt:label:class="!text-[11px] !font-bold !py-0 !pl-8 !pr-3 !text-slate-700 dark:!text-slate-200 !flex !items-center !h-full"
          />
        </div>

        <!-- Worker Select -->
        <div class="relative flex-1 min-w-[120px] group">
          <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs z-10 pointer-events-none transition-colors group-hover:text-emerald-500"></i>
          <Select 
            v-model="filters.worker" 
            :options="workersList" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Xodim" 
            showClear
            class="w-full h-10"
            pt:root:class="!rounded-xl !h-10 !border-slate-200/80 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950/40 focus:!border-emerald-500/50 focus:!ring-1 focus:!ring-emerald-500/30 !transition-all !duration-200 !flex !items-center"
            pt:label:class="!text-[11px] !font-bold !py-0 !pl-8 !pr-3 !text-slate-700 dark:!text-slate-200 !flex !items-center !h-full"
          />
        </div>

        <!-- Unified Date Range Grouped Input -->
        <div class="flex items-center h-10 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 gap-1 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all duration-200 flex-1 min-w-[190px] group">
          <i class="pi pi-calendar text-slate-400 dark:text-slate-500 text-xs pointer-events-none mr-1 select-none transition-colors group-hover:text-emerald-500"></i>
          <DatePicker 
            v-model="filters.date_from" 
            dateFormat="yy-mm-dd"
            placeholder="Dan"
            class="!w-[42%] !bg-transparent !border-none !shadow-none"
            inputClass="!w-full !bg-transparent !border-none !shadow-none !ring-0 focus:!ring-0 !p-0 !text-[11px] !font-bold !text-slate-700 dark:!text-slate-200 !text-center !outline-none"
            pt:root:class="!bg-transparent !border-none !shadow-none"
            pt:input:class="!w-full !bg-transparent !border-none !shadow-none !ring-0 focus:!ring-0 !p-0 !text-[11px] !font-bold !text-slate-700 dark:!text-slate-200 !text-center !outline-none"
          />
          <span class="text-slate-400 dark:text-slate-600 text-xs select-none">→</span>
          <DatePicker 
            v-model="filters.date_to" 
            dateFormat="yy-mm-dd"
            placeholder="Gachacha"
            class="!w-[42%] !bg-transparent !border-none !shadow-none"
            inputClass="!w-full !bg-transparent !border-none !shadow-none !ring-0 focus:!ring-0 !p-0 !text-[11px] !font-bold !text-slate-700 dark:!text-slate-200 !text-center !outline-none"
            pt:root:class="!bg-transparent !border-none !shadow-none"
            pt:input:class="!w-full !bg-transparent !border-none !shadow-none !ring-0 focus:!ring-0 !p-0 !text-[11px] !font-bold !text-slate-700 dark:!text-slate-200 !text-center !outline-none"
          />
        </div>

        <!-- "More Filters" (Kengaytirilgan) Button -->
        <button 
          @click="showAdvanced = !showAdvanced" 
          class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
        >
          <i class="pi" :class="showAdvanced ? 'pi-chevron-up' : 'pi-sliders-h'"></i>
          Ko'proq
        </button>

        <!-- Action Buttons: Reset and Search -->
        <div class="flex items-center gap-1.5 ml-auto sm:ml-0 whitespace-nowrap">
          <button @click="resetFilters" class="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
            <i class="pi pi-filter-slash text-[10px]"></i>
            Tozalash
          </button>
          <button @click="fetchLogs(1)" :disabled="loading" class="h-10 px-4.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black tracking-wider active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50">
            <i class="pi pi-search text-[10px]"></i>
            Qidirish
          </button>
        </div>
      </div>

      <!-- Collapsible Advanced Filters Row -->
      <div v-show="showAdvanced" class="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 mt-1.5 transition-all duration-300 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <!-- Description Search Keyword -->
          <div class="relative flex items-center h-10 group">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs z-10 pointer-events-none transition-colors group-hover:text-emerald-500"></i>
            <input 
              v-model="filters.search_query" 
              type="text" 
              placeholder="Tavsif bo'yicha qidirish..."
              class="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/45 pl-9 pr-3 text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 focus:outline-none"
            />
          </div>

          <!-- Impersonated Filter -->
          <div class="relative flex items-center h-10 group">
            <i class="pi pi-shield absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs z-10 pointer-events-none transition-colors group-hover:text-emerald-500"></i>
            <Select 
              v-model="filters.is_impersonated" 
              :options="[
                { label: 'Barchasi', value: null },
                { label: 'Faqat Superadmin bajarganlar', value: true },
                { label: 'Superadminsiz (Normal)', value: false }
              ]" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Superadmin orqali bajarilganlar" 
              class="w-full h-10"
              pt:root:class="!rounded-xl !h-10 !border-slate-200/80 dark:!border-slate-800 !bg-slate-50 dark:!bg-slate-950/40 focus:!border-emerald-500/50 focus:!ring-1 focus:!ring-emerald-500/30 !transition-all !duration-200 !flex !items-center"
              pt:label:class="!text-[11px] !font-bold !py-0 !pl-8 !pr-3 !text-slate-700 dark:!text-slate-200 !flex !items-center !h-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table / Loader / Empty State -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.25rem] shadow-xl shadow-slate-500/5 overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="loading" class="p-8 space-y-4">
        <div v-for="n in 5" :key="n" class="flex gap-4 items-center animate-pulse">
          <div class="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
          <div class="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
          <div class="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
          <div class="w-20 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        </div>
      </div>

      <!-- Log Table -->
      <div v-else-if="logs.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/55 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider">ID</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider">KIM BAJARDI (ACTOR)</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider">MODEL & ID</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider">AMAL TURI</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider">TAVSIF</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider text-center">VAQT</th>
              <th class="py-3.5 px-5 text-[10px] font-black text-slate-400 tracking-wider text-right">AMALLAR</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80 dark:divide-slate-800/80">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
              <!-- ID -->
              <td class="py-3.5 px-5 text-xs font-bold text-slate-500 dark:text-slate-400">#{{ log.id }}</td>
              
              <!-- Actor -->
              <td class="py-3.5 px-5">
                <div class="flex flex-col">
                  <span class="text-xs font-extrabold text-slate-700 dark:text-slate-200">{{ log.actor || 'Tizim' }}</span>
                  <div class="flex items-center gap-1.5 mt-0.5" v-if="log.is_impersonated">
                    <span class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-black tracking-wider flex items-center gap-1">
                      <i class="pi pi-shield text-[8px]"></i>
                      Superadmin orqali
                    </span>
                    <span class="text-[9px] font-medium text-slate-400">({{ log.impersonated_by_name }})</span>
                  </div>
                </div>
              </td>
              
              <!-- Model & ID -->
              <td class="py-3.5 px-5">
                <div v-if="log.target_model" class="flex items-center gap-1.5">
                  <span class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                    {{ log.model_label || log.target_model }}
                  </span>
                  <span v-if="log.target_id" class="text-[10px] font-bold text-slate-400">(ID: {{ log.target_id }})</span>
                </div>
                <span v-else class="text-xs text-slate-400 font-bold">-</span>
              </td>

              <!-- Action -->
              <td class="py-3.5 px-5">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1 w-max"
                      :class="getActionClass(log.action)">
                  <i :class="getActionIcon(log.action)" class="text-[9px]"></i>
                  {{ log.action_label || getActionLabel(log.action) }}
                </span>
              </td>

              <!-- Description -->
              <td class="py-3.5 px-5 max-w-[300px]">
                <p class="text-xs font-bold text-slate-600 dark:text-slate-300 truncate" :title="log.description">
                  {{ log.description || '-' }}
                </p>
              </td>

              <!-- Time -->
              <td class="py-3.5 px-5 text-center whitespace-nowrap">
                <span class="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-tight flex items-center justify-center gap-1">
                  <i class="pi pi-clock text-[9px] opacity-75"></i>
                  {{ log.created_at }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-5 text-right whitespace-nowrap">
                <button @click="showDetails(log)" class="h-7 px-3 rounded-lg bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-300 text-[11px] font-black tracking-wider transition-all active:scale-95 flex items-center gap-1 ml-auto">
                  <i class="pi pi-eye text-[9px]"></i>
                  Batafsil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <i class="pi pi-history text-2xl"></i>
        </div>
        <h3 class="text-sm font-black text-slate-700 dark:text-slate-300">Yozuvlar Topilmadi</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-[280px]">Tanlangan filtrlarga mos keluvchi tizim jurnal yozuvlari mavjud emas.</p>
      </div>

      <!-- Pagination Footer -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800" v-if="totalRecords > 0">
        <TablePagination 
          :currentPage="currentPage" 
          :totalRecords="totalRecords" 
          :rowsPerPage="10" 
          @page-change="onPageChange"
        />
      </div>
    </div>

    <!-- Detail Dialog -->
    <DashboardAuditLogDetail 
      v-model:visible="detailVisible" 
      :log="selectedLog" 
    />
  </div>
</template>

<script setup>
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import TablePagination from '@/components/TablePagination.vue'
import DashboardAuditLogDetail from './DashboardAuditLogDetail.vue'
import { useAuditLogs } from '@/composables/useAuditLogs'

const {
  loading,
  logs,
  totalRecords,
  currentPage,
  showAdvanced,
  filters,
  workersList,
  detailVisible,
  selectedLog,
  modelOptions,
  actionOptions,
  getActionLabel,
  getActionIcon,
  getActionClass,
  fetchLogs,
  onPageChange,
  resetFilters,
  showDetails
} = useAuditLogs()
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.p-select) {
  background-color: transparent !important;
}
</style>
