<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          {{ $t('subscription.title') }}
          <span v-if="subscription.plan" class="text-[11px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">
            {{ subscription.plan.name }}
          </span>
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ subscription.store_name }}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
         <Button 
            v-if="!loading"
            icon="pi pi-question-circle" 
            :label="$t('subscription.help')" 
            text 
            class="!text-[12px] !font-bold !!tracking-widest !rounded-lg !text-emerald-500 !py-1.5" 
         />
      </div>
    </div>
    <!-- Main Content -->
    <div v-if="loading" class="flex flex-col gap-6 py-20 items-center justify-center">
        <i class="pi pi-spin pi-spinner text-3xl text-emerald-500"></i>
        <p class="text-xs font-bold text-slate-400 tracking-widest">{{ $t('common.loading') }}</p>
    </div>
    <div v-else class="space-y-4 animate-in">
        <Tabs v-model:value="activeTab" class="!bg-transparent border-none">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabList class="!bg-slate-100/80 dark:!bg-slate-800/80 !p-1 !rounded-xl !border-none !inline-flex shrink-0 overflow-x-auto whitespace-nowrap">
                <Tab value="overview" class="!text-[12px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-th-large mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.overview') }}
                </Tab>
                <Tab value="plans" class="!text-[12px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-bolt mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.plans') }}
                </Tab>
                <Tab value="billing" class="!text-[12px] !font-bold !!tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-history mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.billing') }}
                </Tab>
            </TabList>

            <!-- Compact Balance Widget -->
            <div class="bg-emerald-600/90 dark:bg-emerald-700/80 rounded-xl pl-4 pr-1.5 py-1.5 flex items-center gap-6 shadow-sm border border-emerald-500/50 hover:bg-emerald-600 transition-colors w-fit shrink-0">
                <div class="flex flex-col">
                    <span class="text-[9px] text-emerald-100 font-bold uppercase tracking-widest leading-none mb-1">{{ $t('subscription.current_balance') || "Joriy balans" }}</span>
                    <span class="text-base font-black text-white leading-none">{{ formatCurrency(currentBalance) }}</span>
                </div>
                <div class="h-8 w-px bg-emerald-500/50 hidden sm:block"></div>
                <Button icon="pi pi-plus" :label="$t('subscription.topup') || 'To\'ldirish'" class="!bg-white !text-emerald-700 !border-none !rounded-lg !py-1.5 !px-3 !text-[11px] !font-bold !!tracking-widest shadow-sm hover:!bg-emerald-50 transition-colors" />
            </div>
        </div>

            <TabPanels class="!bg-transparent !p-0">
                <!-- Tab: Overview -->
                <TabPanel value="overview">
                    <div class="space-y-4">
                        <SubscriptionStatus :subscription="subscription" @coupon-applied="onCouponApplied" />
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 class="text-xs font-bold text-slate-500 tracking-widest border-b border-slate-50 dark:border-slate-800 pb-3">{{ $t('subscription.faq') }}</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div v-for="i in 4" :key="i" class="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer flex justify-between items-center group">
                                        <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300">{{ $t('subscription.faq_question_1') }}</span>
                                        <i class="pi pi-chevron-right text-[10px] text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-500/10">
                                <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                <div>
                                    <h3 class="text-sm font-bold tracking-tight mb-2">{{ $t('subscription.enterprise_title') }}</h3>
                                    <p class="text-[12px] text-indigo-100 font-medium leading-relaxed opacity-90">{{ $t('subscription.enterprise_desc') }}</p>
                                </div>
                                <Button :label="$t('subscription.contact_us')" severity="contrast" class="!rounded-lg !py-2 !text-[12px] !font-bold !!tracking-widest mt-6 !w-full" />
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab: Plans (Dynamic) -->
                <TabPanel value="plans">
                    <div class="mb-6">
                        <h2 class="text-sm font-black tracking-[0.2em] text-slate-800 dark:text-slate-200">{{ $t('subscription.tabs.plans') }}</h2>
                        <p class="text-[12px] text-slate-400 font-medium tracking-widest mt-1">{{ $t('subscription.plans_subtitle') }}</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                        <PlanCard 
                            v-for="plan in availablePlans"
                            :key="plan.id"
                            :plan="plan.plan_type"
                            :priceLabel="formatCurrency(plan.price_monthly)"
                            :features="getPlanFeatures(plan)"
                            :isCurrent="subscription.plan?.id === plan.id"
                            :popular="plan.plan_type === 'enterprise'"
                            @select="confirmChangePlan(plan.id)"
                            @extend="openExtendDialog"
                        />
                    </div>
                </TabPanel>
                <!-- Tab: Billing -->
                <TabPanel value="billing">
                    <div v-if="loadingBilling" class="flex flex-col gap-6 py-20 items-center justify-center">
                        <i class="pi pi-spin pi-spinner text-3xl text-emerald-500"></i>
                        <p class="text-xs font-bold text-slate-400 tracking-widest">{{ $t('common.loading') || 'Yuklanmoqda...' }}</p>
                    </div>
                    <div v-else class="space-y-6 animate-in">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Transactions List -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                                <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <h3 class="text-xs font-bold text-slate-500 tracking-widest">{{ $t('subscription.transactions') || "O'tkazmalar" }}</h3>
                                </div>
                                <div class="p-4 flex-1 overflow-y-auto">
                                    <div v-if="balanceTransactions.length === 0" class="py-10 text-center space-y-4">
                                        <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                            <i class="pi pi-wallet text-slate-300"></i>
                                        </div>
                                        <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">{{ $t('subscription.no_transactions') || "O'tkazmalar mavjud emas" }}</p>
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div v-for="(tx, idx) in balanceTransactions" :key="idx" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                                     :class="tx.type === 'deduction' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10'">
                                                    <i class="pi" :class="tx.type === 'deduction' ? 'pi-arrow-down-right' : 'pi-arrow-up-right'"></i>
                                                </div>
                                                <div>
                                                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ tx.description || (tx.type === 'deduction' ? "Yechib olindi" : "To'ldirildi") }}</p>
                                                    <p class="text-[11px] text-slate-400 font-medium">{{ tx.created_at }}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-sm font-bold tracking-tight" :class="tx.type === 'deduction' ? 'text-slate-700 dark:text-slate-200' : 'text-emerald-600'">
                                                    {{ tx.type === 'deduction' ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
                                                </p>
                                                <span class="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase mt-1 inline-block"
                                                      :class="tx.status === 'success' || !tx.status ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20'">
                                                    {{ tx.status || 'success' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Invoices List -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[500px]">
                                <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <h3 class="text-xs font-bold text-slate-500 tracking-widest">{{ $t('subscription.invoices') || "Cheklar" }}</h3>
                                    <Button icon="pi pi-download" :label="$t('subscription.export_history') || 'Eksport'" text class="!text-[12px] !font-bold !!tracking-widest !rounded-lg !py-1" />
                                </div>
                                <div class="p-4 flex-1 overflow-y-auto">
                                    <div v-if="invoices.length === 0" class="py-10 text-center space-y-4">
                                        <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                            <i class="pi pi-file-o text-slate-300"></i>
                                        </div>
                                        <p class="text-[12px] font-bold text-slate-400 tracking-widest italic">{{ $t('subscription.no_history') || "Cheklar mavjud emas" }}</p>
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div v-for="(inv, idx) in invoices" :key="idx" class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group relative overflow-hidden">
                                            
                                            <!-- Top Section -->
                                            <div class="flex justify-between items-start gap-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-105 transition-transform">
                                                        <i class="pi pi-receipt"></i>
                                                    </div>
                                                    <div>
                                                        <div class="flex items-center gap-2">
                                                            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                                                                {{ inv.plan_name || inv.plan?.name || "Tarif to'lovi" }}
                                                            </p>
                                                            <span class="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
                                                                  :class="inv.is_yearly ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20'">
                                                                {{ inv.is_yearly ? ($t('subscription.yearly') || 'Yillik') : ($t('subscription.monthly') || 'Oylik') }}
                                                            </span>
                                                        </div>
                                                        <p class="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                                            <i class="pi pi-calendar text-[9px]"></i>
                                                            {{ inv.period_from }} &mdash; {{ inv.period_to }}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="text-right flex flex-col items-end">
                                                    <p class="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                                        {{ formatCurrency(inv.amount) }}
                                                    </p>
                                                    <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                                                        {{ inv.paid_at || inv.created_at }}
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Divider -->
                                            <div class="h-px w-full bg-slate-50 dark:bg-slate-800/50"></div>

                                            <!-- Bottom Section -->
                                            <div class="flex items-center justify-between">
                                                <p class="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 flex-1 pr-4">
                                                    {{ inv.description || "Ta'rif uchun to'lov" }}
                                                </p>
                                                <div class="flex items-center gap-2 shrink-0">
                                                    <div v-if="inv.created_by" class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                                                        <i class="pi pi-user text-[10px] text-slate-400"></i>
                                                        <span class="text-[10px] font-bold text-slate-500 dark:text-slate-300 max-w-[100px] truncate">{{ inv.created_by }}</span>
                                                    </div>
                                                    <span class="text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        #{{ inv.id || idx + 1 }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
    <!-- Payment Dialog -->
    <PaymentDialog 
      v-model:visible="paymentDialog"
      :header="dialogHeader"
      :plan="selectedPlanId"
      :priceLabel="getSelectedPriceLabel"
      v-model:method="paymentMethod"
      :loading="processing"
      @process="processPayment"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import SubscriptionStatus from './components/SubscriptionStatus.vue'
import PlanCard from './components/PlanCard.vue'
import PaymentDialog from './components/PaymentDialog.vue'
import { useSettingsStore } from '@/store/settings'
import { useSubscription } from './composables/useSubscription'

const settingsStore = useSettingsStore()
const activeTab = ref('overview')

const {
    subscription,
    availablePlans,
    loading,
    paymentDialog,
    processing,
    selectedPlanId,
    paymentMethod,
    dialogHeader,
    getSelectedPriceLabel,
    loadSubscription,
    confirmChangePlan,
    openExtendDialog,
    processPayment,
    getPlanFeatures,
    loadingBilling,
    invoices,
    currentBalance,
    balanceTransactions,
    loadBillingData
} = useSubscription()

const formatCurrency = (value) => settingsStore.formatPrice(value)

const onCouponApplied = async () => {
    await Promise.all([
        loadSubscription(true),
        loadBillingData()
    ])
}

watch(activeTab, (newTab) => {
    if (newTab === 'billing' && !invoices.value.length && !balanceTransactions.value.length) {
        loadBillingData()
    }
})

onMounted(() => {
    loadSubscription()
})
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


