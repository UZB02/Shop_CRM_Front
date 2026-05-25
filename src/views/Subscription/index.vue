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
            class="!text-[12px] !font-bold !rounded-lg !text-emerald-500 !py-1.5" 
            @click="router.push('/dashboard/support')"
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
                <Tab value="overview" class="!text-[12px] !font-bold !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-th-large mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.overview') }}
                </Tab>
                <Tab value="plans" class="!text-[12px] !font-bold !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-bolt mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.plans') }}
                </Tab>
                <Tab value="billing" class="!text-[12px] !font-bold !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-history mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.billing') }}
                </Tab>
                <Tab v-if="isOwner" value="coupons" class="!text-[12px] !font-bold !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-ticket mr-2 !text-[11px]"></i>
                   {{ $t('subscription.tabs.coupons') || "Kuponlar" }}
                </Tab>
                <Tab v-if="isOwner" value="referrals" class="!text-[12px] !font-bold !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-share-alt mr-2 !text-[11px]"></i>
                   Takliflar (Referral)
                </Tab>
            </TabList>

            <!-- Compact Balance Widget -->
            <div class="bg-emerald-600/90 dark:bg-emerald-700/80 rounded-xl pl-4 pr-1.5 py-1.5 flex items-center gap-6 shadow-sm border border-emerald-500/50 hover:bg-emerald-600 transition-colors w-fit shrink-0">
                <div class="flex flex-col">
                    <span class="text-[9px] text-emerald-100 font-bold uppercase tracking-widest leading-none mb-1">{{ $t('subscription.current_balance') || "Joriy balans" }}</span>
                    <span class="text-base font-black text-white leading-none">{{ formatCurrency(currentBalance) }}</span>
                </div>
                <div class="h-8 w-px bg-emerald-500/50 hidden sm:block"></div>
                <Button icon="pi pi-plus" :label="$t('subscription.topup') || 'To\'ldirish'" class="!bg-white !text-emerald-700 !border-none !rounded-lg !py-1.5 !px-3 !text-[11px] !font-bold shadow-sm hover:!bg-emerald-50 transition-colors" @click="topupDialog = true" />
            </div>
        </div>

            <TabPanels class="!bg-transparent !p-0">
                <!-- Tab: Overview -->
                <TabPanel value="overview">
                    <div class="space-y-4">
                        <SubscriptionStatus :subscription="subscription" :coupons="coupons" @coupon-applied="onCouponApplied" />
                        <FaqAndPromo />
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
                            :planData="plan"
                            :isCurrent="subscription.plan?.id === plan.id"
                            :popular="plan.plan_type === 'enterprise'"
                            @select="confirmChangePlan(plan.id)"
                            @extend="openExtendDialog"
                        />
                    </div>
                </TabPanel>

                <!-- Tab: Billing -->
                <TabPanel value="billing">
                    <BillingTab 
                        :loadingBilling="loadingBilling"
                        :balanceTransactions="balanceTransactions"
                        :invoices="invoices"
                    />
                </TabPanel>

                <!-- Tab: Coupons (IsOwner only) -->
                <TabPanel v-if="isOwner" value="coupons">
                    <CouponsTab 
                        :loadingCoupons="loadingCoupons"
                        :coupons="coupons"
                        :couponsCount="couponsCount"
                        v-model:couponsPage="couponsPage"
                        :couponsPageSize="couponsPageSize"
                        @coupon-applied="onCouponApplied"
                    />
                </TabPanel>

                <!-- Tab: Referrals (IsOwner only) -->
                <TabPanel v-if="isOwner" value="referrals">
                    <ReferralsTab />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
    <!-- Payment Dialog -->
    <PaymentDialog 
      v-model:visible="paymentDialog"
      :header="dialogHeader"
      :plan="selectedPlanType"
      :priceLabel="getSelectedPriceLabel"
      v-model:method="paymentMethod"
      :loading="processing"
      :discountLabel="getDiscountLabel"
      :finalPriceLabel="getFinalPriceLabel"
      :activeCoupon="activeCoupon"
      :currentBalance="currentBalance"
      :finalPrice="finalPrice"
      :isExtending="isExtending"
      @process="processPayment"
      @topup-required="handleTopupRequired"
    />

    <!-- Topup Dialog -->
    <TopupDialog
      v-model:visible="topupDialog"
      v-model:amount="topupAmount"
      :currentBalance="currentBalance"
      :loading="topupLoading"
      :pollingActive="pollingActive"
      :statusText="topupStatusText"
      @process="handleTopup"
      @refresh-balance="loadBalanceData"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import SubscriptionStatus from './components/SubscriptionStatus.vue'
import PlanCard from './components/PlanCard.vue'
import PaymentDialog from './components/PaymentDialog.vue'
import TopupDialog from './components/TopupDialog.vue'
import BillingTab from './components/BillingTab.vue'
import CouponsTab from './components/CouponsTab.vue'
import ReferralsTab from './components/ReferralsTab.vue'
import FaqAndPromo from './components/FaqAndPromo.vue'
import { useSettingsStore } from '@/store/settings'
import { useAuthStore } from '@/store/auth'
import { useSubscription } from './composables/useSubscription'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const allowedTabs = ['overview', 'plans', 'billing', 'coupons', 'referrals']
const activeTab = ref(allowedTabs.includes(route.query.tab) ? route.query.tab : 'overview')

const isOwner = computed(() => {
    const u = authStore.user
    if (!u) return false
    return u.is_owner || u.role === 'owner' || u.worker?.role === 'owner' || u.is_superuser
})

const {
    subscription,
    availablePlans,
    loading,
    paymentDialog,
    processing,
    selectedPlanId,
    paymentMethod,
    isExtending,
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
    loadBillingData,
    coupons,
    loadingCoupons,
    couponsCount,
    couponsPage,
    couponsPageSize,
    loadCouponsData,
    activeCoupon,
    getDiscountLabel,
    getFinalPriceLabel,
    selectedPlanType,
    finalPrice,
    handleTopupRequired,
    
    // Topup variables & handlers
    topupDialog,
    topupAmount,
    topupLoading,
    pollingActive,
    topupStatusText,
    handleTopup,
    loadBalanceData
} = useSubscription()

const formatCurrency = (value) => settingsStore.formatPrice(value)

const onCouponApplied = async () => {
    await Promise.all([
        loadSubscription(true),
        loadBillingData()
    ])
    if (isOwner.value) {
        loadCouponsData()
    }
}

watch(activeTab, (newTab) => {
    // Persist active tab to URL query params
    if (route.query.tab !== newTab) {
        router.replace({ query: { ...route.query, tab: newTab } })
    }

    if (newTab === 'billing' && !invoices.value.length && !balanceTransactions.value.length) {
        loadBillingData()
    } else if (newTab === 'coupons' && !coupons.value.length) {
        loadCouponsData()
    }
})

// Sync activeTab when route query changes (for back/forward navigation)
watch(() => route.query.tab, (newTab) => {
    if (newTab && allowedTabs.includes(newTab) && newTab !== activeTab.value) {
        activeTab.value = newTab
    }
})

watch(couponsPage, () => {
    loadCouponsData()
})

onMounted(() => {
    loadSubscription()
    if (isOwner.value) {
        loadCouponsData()
    }
    // Load initial tab data on refresh/load
    if (activeTab.value === 'billing') {
        loadBillingData()
    } else if (activeTab.value === 'coupons') {
        loadCouponsData()
    }
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
