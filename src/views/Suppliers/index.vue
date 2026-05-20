<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <SupplierPageHeader
      :totalRecords="totalRecords"
      v-model:searchQuery="searchQuery"
      v-model:statusFilter="statusFilter"
      @add="openNew"
      @export="exportSuppliers"
    />

    <!-- Plan restriction banner -->
    <div v-if="planBlocked"
      class="flex items-center gap-3 px-5 py-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
      <i class="pi pi-lock text-amber-500 text-xl" />
      <div class="flex-1">
        <p class="text-sm font-black text-amber-700 dark:text-amber-400">{{ $t('plan.plan_required') }}</p>
        <p class="text-xs text-amber-600 dark:text-amber-500 mt-0.5">{{ $t('suppliers.plan_required_detail') }}</p>
      </div>
      <router-link
        to="/dashboard/subscription"
        class="shrink-0 h-8 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all"
      >
        {{ $t('plan.upgrade_btn') }}
      </router-link>
    </div>

    <!-- Stats cards (only when data is loaded) -->
    <SupplierStatsCards
      v-if="!planBlocked"
      :totalCount="totalRecords"
      :activeCount="suppliers.filter(s => s.status === 'active').length"
      :totalDebt="totalDebt"
      :topDebtor="topDebtor"
    />

    <!-- Table card -->
    <div
      v-if="!planBlocked"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden"
    >
      <SupplierTable
        :suppliers="filteredSuppliers"
        :loading="loading"
        @add="openNew"
        @edit="editSupplier"
        @delete="confirmDelete"
        @pay="openPayment"
      />

      <!-- Pagination -->
      <div v-if="totalRecords > rows" class="flex justify-center py-4 border-t border-slate-100 dark:border-slate-800">
        <Paginator
          :rows="rows"
          :totalRecords="totalRecords"
          :first="(currentPage - 1) * rows"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="!bg-transparent !border-none !p-0 custom-paginator"
        />
      </div>
    </div>

    <!-- Create / Edit dialog -->
    <SupplierDialog
      v-model:visible="supplierDialog"
      :supplier="supplier"
      :modelForm="supplierForm"
      :submitted="submitted"
      :saving="saving"
      @save="saveSupplier"
    />

    <!-- Payment dialog -->
    <SupplierPaymentDialog
      v-model:visible="paymentDialog"
      :supplier="selectedSupplier"
      :modelForm="paymentForm"
      :submitted="submitted"
      :saving="paymentSaving"
      @save="savePayment"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import Paginator from 'primevue/paginator'

import SupplierPageHeader from './components/SupplierPageHeader.vue'
import SupplierStatsCards from './components/SupplierStatsCards.vue'
import SupplierTable from './components/SupplierTable.vue'
import SupplierDialog from './components/SupplierDialog.vue'
import SupplierPaymentDialog from './components/SupplierPaymentDialog.vue'

import { useSuppliers } from './composables/useSuppliers'

const planBlocked = ref(false)

const {
  suppliers,
  loading,
  saving,
  paymentSaving,
  supplierDialog,
  paymentDialog,
  submitted,
  supplier,
  selectedSupplier,
  supplierForm,
  paymentForm,
  searchQuery,
  statusFilter,
  currentPage,
  rows,
  totalRecords,
  filteredSuppliers,
  loadSuppliers,
  saveSupplier,
  confirmDelete,
  savePayment,
  exportSuppliers,
  openNew,
  editSupplier,
  openPayment,
  onPageChange
} = useSuppliers()

// Derived stats
const totalDebt = computed(() =>
  suppliers.value.reduce((acc, s) => acc + (Number(s.debt_balance) || 0), 0)
)

const topDebtor = computed(() => {
  const actives = suppliers.value.filter(s => s.status === 'active' && Number(s.debt_balance) > 0)
  if (!actives.length) return null
  return actives.reduce((max, s) => Number(s.debt_balance) > Number(max.debt_balance) ? s : max)
})

onMounted(async () => {
  await loadSuppliers()
})
</script>

<style scoped>
/* Emerald paginator */
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
