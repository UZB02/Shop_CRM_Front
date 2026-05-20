<template>
  <div class="space-y-4 pb-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1 overflow-x-auto no-scrollbar whitespace-nowrap">
          <router-link to="/dashboard/suppliers" class="text-[11px] font-black text-slate-400 hover:text-emerald-500 transition-colors tracking-widest flex items-center gap-1">
            <i class="pi pi-users text-[10px]"></i>
            {{ $t('suppliers.title') }}
          </router-link>
          <i class="pi pi-chevron-right text-[10px] text-slate-300"></i>
          <span class="text-[11px] font-black text-slate-600 dark:text-slate-400 tracking-widest">{{ $t('common.profile') }}</span>
        </div>
        <h1 class="text-lg sm:text-xl font-black text-slate-800 dark:text-white truncate tracking-tight">{{ supplier?.name || '...' }}</h1>
      </div>
      <div class="flex items-center gap-2 shrink-0" v-if="supplier">
        <button 
          v-if="supplier.status === 'active'"
          @click="openPayment"
          v-tooltip.top="$t('suppliers.pay_tooltip')"
          class="w-8 h-8 sm:w-auto sm:px-4 sm:h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-black tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i class="pi pi-wallet text-[14px]"></i>
          <span class="hidden sm:inline">{{ $t('suppliers.pay_tooltip') }}</span>
        </button>
        <button 
          @click="editSupplier"
          v-tooltip.top="$t('common.edit')"
          class="w-8 h-8 sm:w-auto sm:px-4 sm:h-9 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-black tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i class="pi pi-pencil text-[14px]"></i>
          <span class="hidden sm:inline">{{ $t('common.edit') }}</span>
        </button>
        <button 
          @click="confirmDelete"
          v-tooltip.top="supplier.status === 'active' ? $t('suppliers.deactivate') : $t('suppliers.activate')"
          class="w-8 h-8 sm:w-auto sm:px-4 sm:h-9 rounded-xl text-[12px] font-black tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          :class="supplier.status === 'active' ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'"
        >
          <i :class="supplier.status === 'active' ? 'pi pi-ban' : 'pi pi-check'" class="text-[14px]"></i>
          <span class="hidden sm:inline">{{ supplier.status === 'active' ? $t('suppliers.deactivate') : $t('suppliers.activate') }}</span>
        </button>
      </div>
    </div>

    <!-- Sticky Tabs & Summary -->
    <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 py-2 border-y border-slate-100 dark:border-slate-800 px-2 overflow-x-auto no-scrollbar">
      <div class="flex items-center justify-between min-w-max gap-8 px-2">
        <div class="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-950/50 rounded-lg">
          <button 
            class="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-300 whitespace-nowrap bg-white dark:bg-slate-800 text-emerald-500 shadow-sm scale-[1.02]"
          >
            <i class="pi pi-user text-[12px]"></i>
            <span class="text-[12px] font-black tracking-widest">{{ $t('common.profile') }}</span>
          </button>
        </div>
        
        <div class="flex items-center gap-6 px-4">
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-black text-slate-400 tracking-widest leading-none mb-1">{{ $t('suppliers.table.debt') }}</span>
            <span :class="['text-[12px] font-black tracking-tight', Number(supplier?.debt_balance) > 0 ? 'text-rose-500' : 'text-slate-400']">{{ formatCurrency(supplier?.debt_balance) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container-fluid px-2">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="relative w-10 h-10">
          <div class="absolute inset-0 border-2 border-emerald-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>

      <div v-else-if="supplier" class="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in">
        <!-- Main Info -->
        <div class="lg:col-span-8 space-y-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h2 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-4">{{ $t('common.summary') }}</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span class="text-xs font-semibold text-slate-500">{{ $t('suppliers.table.company') }}</span>
                <span class="text-sm font-black text-slate-800 dark:text-slate-200">{{ supplier.company || '—' }}</span>
              </div>
              <div class="py-2" v-if="supplier.description">
                <span class="block text-xs font-semibold text-slate-500 mb-1">{{ $t('suppliers.form.description') }}</span>
                <p class="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">{{ supplier.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <SupplierProfileSidebar 
          :supplier="supplier"
          class="lg:col-span-4"
          @pay-debt="openPayment"
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
      :supplier="supplier"
      :modelForm="paymentForm"
      :submitted="submitted"
      :saving="paymentSaving"
      @save="savePayment"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSupplierDetail } from './composables/useSupplierDetail'
import { useSettingsStore } from '@/store/settings'

import SupplierDialog from './components/SupplierDialog.vue'
import SupplierPaymentDialog from './components/SupplierPaymentDialog.vue'
import SupplierProfileSidebar from './components/SupplierProfileSidebar.vue'

const settingsStore = useSettingsStore()
const { 
  loading, supplier, loadSupplierData,
  supplierDialog, paymentDialog, submitted, saving, paymentSaving,
  supplierForm, paymentForm, editSupplier, saveSupplier,
  openPayment, savePayment, confirmDelete 
} = useSupplierDetail()

const formatCurrency = (val) => settingsStore.formatPrice(val)

onMounted(() => {
  loadSupplierData()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
