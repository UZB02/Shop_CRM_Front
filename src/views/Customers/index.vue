<template>
  <div class="space-y-4">
    <!-- Header Component -->
    <CustomerPageHeader 
      :totalRecords="totalRecords"
      v-model:searchQuery="searchQuery"
      @add="openNew"
      @update:searchQuery="handleSearch"
    />

    <!-- Stats & Tabs Component -->
    <MinimalCustomerStatsTabs 
      :tabs="customerTabs"
      v-model:activeTab="activeTab"
       :totalDebt="groupedData.debtors.total_debt_balance"
    />

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
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
  </div>
</template>

<script setup>
import CustomerTable from './components/CustomerTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import CustomerPageHeader from './components/CustomerPageHeader.vue'
import MinimalCustomerStatsTabs from './components/MinimalCustomerStatsTabs.vue'
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


