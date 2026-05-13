<template>
  <div class="space-y-4">
    <!-- Header Component -->
    <CustomerPageHeader 
      :totalRecords="totalRecords"
      :templateLoading="templateLoading.customers"
      v-model:searchQuery="searchQuery"
      :importing="importing"
      :canImport="isManagerOrAbove()"
      @add="openNew"
      @update:searchQuery="handleSearch"
      @download-template="downloadTemplate('customers')"
      @import="importData('customers', $event, loadCustomers)"
    />

    <!-- Stats & Tabs Component -->
    <MinimalCustomerStatsTabs 
      :tabs="customerTabs"
      v-model:activeTab="activeTab"
      v-model:minDebt="minDebt"
      :totalDebt="groupedData.debtors.total_debt_balance"
      @export="exportDebtors"
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

    <!-- Import Result Dialog -->
    <ImportResultDialog
      v-model:visible="showResultDialog"
      :result="importResult"
      @reload="loadCustomers"
    />
  </div>
</template>

<script setup>
import CustomerTable from './components/CustomerTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import CustomerPageHeader from './components/CustomerPageHeader.vue'
import MinimalCustomerStatsTabs from './components/MinimalCustomerStatsTabs.vue'
import ImportResultDialog from '@/components/ImportResultDialog.vue'
import { useCustomers } from './composables/useCustomers'
import { useTemplateDownload } from '@/composables/useTemplateDownload'
import { useImport } from '@/composables/useImport'

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
  minDebt,
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
  hideDialog,
  exportDebtors
} = useCustomers()

const { templateLoading, downloadTemplate } = useTemplateDownload()
const { importing, importResult, showResultDialog, isManagerOrAbove, importData } = useImport()
</script>
