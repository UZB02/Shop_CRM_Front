<template>
  <div class="space-y-4 pb-8">
    <CustomerDetailHeader 
      :customer-name="customer?.name"
      @edit="editCustomer"
    />

    <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 py-2 border-y border-slate-100 dark:border-slate-800 px-2 overflow-x-auto no-scrollbar">
      <div class="flex items-center justify-between min-w-max gap-8 px-2">
        <div class="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-950/50 rounded-lg">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-300 whitespace-nowrap', activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300']"
          >
            <i :class="['pi text-[10px]', tab.icon]"></i>
            <span class="text-[10px] font-black uppercase tracking-widest">{{ tab.label }}</span>
          </button>
        </div>
        
        <div class="flex items-center gap-6 px-4">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{{ $t('customers.details.total_spent') }}</span>
            <span class="text-[10px] font-black text-emerald-500 tracking-tight">{{ formatCurrency(customer?.total_purchases_amount) }}</span>
          </div>
          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div class="flex flex-col items-end">
            <span class="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{{ $t('customers.details.debt') }}</span>
            <span :class="['text-[10px] font-black tracking-tight', Number(customer?.debt_balance) > 0 ? 'text-rose-500' : 'text-slate-400']">{{ formatCurrency(customer?.debt_balance) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid px-2">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="relative w-10 h-10">
          <div class="absolute inset-0 border-2 border-emerald-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>

      <div v-else>
        <Transition name="fade" mode="out-in">
          <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-8 space-y-4">
              <CustomerStatsCards 
                :purchase-count="purchaseCount"
                :group-name="customer?.group_name"
                :debt-balance="customer?.debt_balance"
              />
              
              <CustomerRecentActivity 
                :recent-trades="lastTrades"
                @view-all="activeTab = 'trades'"
                @select-trade="showTradeDetail"
              />
            </div>

            <CustomerProfileSidebar 
              v-if="customer"
              :customer="customer"
              class="lg:col-span-4"
              @pay-debt="payDebtDialog = true"
            />
          </div>

          <div v-else-if="activeTab === 'trades'" class="animate-fade-in">
            <CustomerTradesTable 
              :purchases="purchaseHistory" 
              :debts="debtHistory" 
              :purchase-count="purchaseCount"
              :debt-count="debtCount"
              :purchase-page="purchasePage"
              :debt-page="debtPage"
              :purchase-summary="purchaseSummary"
              :debt-summary="debtSummary"
              :total-debt="totalDebt"
              @update:purchasePage="loadPurchases"
              @update:debtPage="loadDebts"
              @filter="handleFilters"
              class="h-full" 
            />
          </div>
        </Transition>
      </div>
    </div>

    <CustomerDialog 
        v-model:visible="editDialog"
        :customer="customerToEdit"
        :groups="groups"
        :saving="saving"
        :submitted="submitted"
        @save="saveUpdate"
    />

    <PayDebtDialog 
        v-if="customer?.id"
        v-model:visible="payDebtDialog"
        :customer-id="customer.id"
        :customer-debt="customer.debt_balance"
        @success="loadCustomerData"
    />

    <TradeDetailModal 
        v-if="selectedTrade"
        v-model:visible="displayTradeDetail"
        :trade="selectedTrade"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomerDetail } from './composables/useCustomerDetail'

// Components
import CustomerTradesTable from './components/CustomerTradesTable.vue'
import CustomerDialog from './components/CustomerDialog.vue'
import PayDebtDialog from './components/PayDebtDialog.vue'
import CustomerDetailHeader from './components/CustomerDetailHeader.vue'
import CustomerStatsCards from './components/CustomerStatsCards.vue'
import CustomerRecentActivity from './components/CustomerRecentActivity.vue'
import CustomerProfileSidebar from './components/CustomerProfileSidebar.vue'
import TradeDetailModal from './components/TradeDetailModal.vue'

import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()

const { t } = useI18n()
const {
  loading, saving, submitted, customer, purchaseHistory, debtHistory,
  purchaseCount, debtCount, purchasePage, debtPage, totalDebt,
  groups, activeTab, editDialog, payDebtDialog, customerToEdit,
  selectedTrade, displayTradeDetail,
  lastTrades, purchaseSummary, debtSummary,
  loadCustomerData, loadPurchases, loadDebts, loadGroups,
  handleFilters, editCustomer, saveUpdate, showTradeDetail
} = useCustomerDetail()

const tabs = [
  { id: 'overview', icon: 'pi-user', label: t('common.profile') },
  { id: 'trades', icon: 'pi-shopping-bag', label: t('customers.trades.title') }
]

const formatCurrency = (val) => settingsStore.formatPrice(val)

onMounted(() => {
  loadCustomerData()
  loadGroups()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
