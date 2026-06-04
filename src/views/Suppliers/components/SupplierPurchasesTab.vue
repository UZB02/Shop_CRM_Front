<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-fade-in">
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Kirimlar tarixi</h2>
    </div>

    <!-- Filter Component -->
    <SupplierPurchasesFilter @apply="applyFilters" />

    <!-- Table Component -->
    <SupplierPurchasesTable 
      :records="records"
      :loading="loading"
      :total-records="totalRecords"
      :current-page="currentPage"
      @page="onPageChange"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SupplierPurchasesFilter from './SupplierPurchasesFilter.vue'
import SupplierPurchasesTable from './SupplierPurchasesTable.vue'
import { useSupplierPurchases } from '../composables/useSupplierPurchases'

const props = defineProps({
  supplierId: { type: [String, Number], required: true }
})

const {
  records,
  loading,
  currentPage,
  totalRecords,
  loadData,
  applyFilters,
  onPageChange
} = useSupplierPurchases(props.supplierId)

onMounted(() => {
  loadData(1)
})
</script>
