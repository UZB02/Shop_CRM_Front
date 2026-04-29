<template>
  <div class="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden px-4 md:px-0">
    
    <!-- Top Bar Component -->
    <BulkMovementHeader 
      :warehouseName="warehouseName"
      :validCount="validItemsCount"
      :totalCount="bulkItems.length"
      :saving="saving"
      :type="movement_type"
      @back="router.back()"
      @save="handleSave"
    />

    <!-- Main Content Area: Split View -->
    <div class="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
      
      <!-- Side Config Component -->
      <BulkMovementSidebar 
        v-model:type="movement_type"
        v-model:note="note"
      />

      <!-- Main Items Table Component -->
      <BulkMovementTable 
        :items="bulkItems"
        :products="products"
        :loadingProducts="loadingProducts"
        :movementType="movement_type"
        :validCount="validItemsCount"
        @add="addBulkItem"
        @remove="removeBulkItem"
        @search="loadProducts"
      />
    </div>

    <!-- Overlay Loading -->
    <div v-if="saving" class="fixed inset-0 z-[100] bg-white/60 dark:bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
      <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <i class="pi pi-spin pi-spinner text-blue-500 text-2xl"></i>
      </div>
      <p class="text-[10px] font-black text-slate-900 dark:text-slate-100 tracking-widest">{{ $t('warehouse.bulk.saving') }}</p>
    </div>
    
  </div>
</template>

<script setup>
import { useBulkMovement } from './composables/useBulkMovement'
import BulkMovementHeader from './components/BulkMovement/BulkMovementHeader.vue'
import BulkMovementSidebar from './components/BulkMovement/BulkMovementSidebar.vue'
import BulkMovementTable from './components/BulkMovement/BulkMovementTable.vue'

const {
  warehouseName,
  products,
  loadingProducts,
  loadProducts,
  saving,
  bulkItems,
  movement_type,
  note,
  validItemsCount,
  addBulkItem,
  removeBulkItem,
  handleSave,
  router
} = useBulkMovement()
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.2);
  border-radius: 10px;
}

.animate-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
