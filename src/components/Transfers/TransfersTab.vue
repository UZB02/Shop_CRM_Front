<template>
  <div class="flex flex-col gap-4">
    <!-- Status filter tabs -->
    <TransferStatusFilters
      v-model="activeStatus"
      :status-options="statusOptions"
    />

    <!-- Table card -->
    <TransferTable
      :transfers="filteredTransfers"
      :loading="loading"
      :active-status="activeStatus"
      @view="viewDetail"
      @confirm="confirmAction"
      @cancel="cancelAction"
    />

    <!-- DETAIL DIALOG -->
    <TransferDetailDialog
      v-model:visible="detailDialog"
      :transfer="selectedTransfer"
      @confirm="confirmAction($event); detailDialog = false"
      @cancel="cancelAction($event); detailDialog = false"
    />

    <!-- New Transfer Dialog -->
    <TransferNewDialog
      v-model="transferDialog"
      :form="transferForm"
      :sub-loading="subLoading"
      :branches="branches"
      :warehouses="warehouses"
      :available-products="availableProducts"
      :source-name="sourceName"
      :source-id="sourceId"
      :source-type="sourceType"
      @submit="handleCreateTransfer"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TransferNewDialog from './TransferNewDialog.vue'
import TransferStatusFilters from './components/TransferStatusFilters.vue'
import TransferTable from './components/TransferTable.vue'
import TransferDetailDialog from './components/TransferDetailDialog.vue'
import { useTransfersTab } from './composables/useTransfersTab'

const props = defineProps({
  sourceId: [Number, String],
  sourceType: String,
  sourceName: String,
  availableProducts: Array
})

const emit = defineEmits(['pending-count'])

const {
  loading, subLoading,
  transferDialog, transferForm,
  warehouses, branches,
  activeStatus, detailDialog, selectedTransfer,
  statusOptions, filteredTransfers,
  loadTransfers, handleCreateTransfer,
  confirmAction, cancelAction, viewDetail
} = useTransfersTab(props, emit)

onMounted(() => {
  loadTransfers()
})
</script>

<style scoped>
/* Essential layout styles if needed */
</style>
