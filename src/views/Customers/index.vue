<template>
  <div class="space-y-6">
    <!-- Header Component -->
    <CustomerHeader 
      :totalRecords="totalRecords"
      v-model:searchQuery="searchQuery"
      @add="openNew"
      @update:searchQuery="handleSearch"
    />

    <!-- Stats & Tabs Component -->
    <CustomerStatsTabs 
      :tabs="customerTabs"
      v-model:activeTab="activeTab"
      :totalDebt="groupedData.debtors.total_debt_balance"
    />

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm backdrop-blur-xl p-0.5">
      <CustomerTable 
        :customers="activeCustomers" 
        :loading="loading" 
        v-model:page="page"
        :totalRecords="totalRecords"
        :pageSize="pageSize"
        :mode="activeTab"
        @page-change="loadCustomers"
        @edit="editCustomer" 
        @delete="confirmDelete"
        @view-history="viewHistory"
      />
    </div>

    <!-- Dialogs -->
    <CustomerDialog 
      v-model:visible="customerDialog"
      :customer="customer"
      :groups="groups"
      :saving="saving"
      :submitted="submitted"
      @save="saveCustomer"
      @hide="hideDialog"
    />

    <ConfirmDialog />
  </div>
</template>

<script setup>
import ConfirmDialog from 'primevue/confirmdialog'
import CustomerTable from './components/CustomerTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import CustomerHeader from './components/CustomerHeader.vue'
import CustomerStatsTabs from './components/CustomerStatsTabs.vue'
import { useCustomers } from './composables/useCustomers'

const {
  loading,
  saving,
  groups,
  customerDialog,
  submitted,
  activeTab,
  groupedData,
  page,
  pageSize,
  searchQuery,
  customer,
  customerTabs,
  activeCustomers,
  totalRecords,
  loadCustomers,
  handleSearch,
  openNew,
  editCustomer,
  viewHistory,
  saveCustomer,
  confirmDelete,
  hideDialog
} = useCustomers()
</script>
