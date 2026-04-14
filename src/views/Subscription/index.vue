<template>
  <div class="space-y-4">
    <!-- Header: Consistent with WorkerPageHeader -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          {{ $t('subscription.title') }}
          <span class="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">PRO</span>
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ subscription.store_name }}</p>
      </div>
      <div class="flex items-center gap-2">
         <Button icon="pi pi-history" :label="$t('subscription.history')" text class="!text-[10px] !font-bold !uppercase !tracking-widest !rounded-lg !text-slate-500 !py-1.5" />
         <Button icon="pi pi-question-circle" :label="$t('subscription.help')" text class="!text-[10px] !font-bold !uppercase !tracking-widest !rounded-lg !text-emerald-500 !py-1.5" />
      </div>
    </div>

    <!-- Main Content: Simplified Layout -->
    <div class="space-y-4 animate-in">
        <Tabs value="overview" class="!bg-transparent border-none">
            <TabList class="!bg-slate-100/80 dark:!bg-slate-800/80 !p-1 !rounded-xl !border-none !inline-flex !mb-4">
                <Tab value="overview" class="!text-[10px] !font-bold !uppercase !tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-th-large mr-2 !text-[9px]"></i>
                   {{ $t('subscription.tabs.overview') }}
                </Tab>
                <Tab value="plans" class="!text-[10px] !font-bold !uppercase !tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-bolt mr-2 !text-[9px]"></i>
                   {{ $t('subscription.tabs.plans') }}
                </Tab>
                <Tab value="billing" class="!text-[10px] !font-bold !uppercase !tracking-widest !px-5 !py-2 !rounded-lg !border-none !transition-all data-[active]:!bg-white dark:data-[active]:!bg-slate-900 data-[active]:!text-emerald-500 data-[active]:!shadow-sm">
                   <i class="pi pi-history mr-2 !text-[9px]"></i>
                   {{ $t('subscription.tabs.billing') }}
                </Tab>
            </TabList>

            <TabPanels class="!bg-transparent !p-0">
                <!-- Tab: Overview -->
                <TabPanel value="overview">
                    <div class="space-y-4">
                        <SubscriptionStatus :subscription="subscription" />
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 pb-3">{{ $t('subscription.faq') }}</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div v-for="i in 4" :key="i" class="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer flex justify-between items-center group">
                                        <span class="text-[11px] font-medium text-slate-600 dark:text-slate-300">Tarifni qanday o'zgartirish mumkin?</span>
                                        <i class="pi pi-chevron-right text-[8px] text-slate-400 group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-500/10">
                                <div class="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                <div>
                                    <h3 class="text-sm font-bold uppercase tracking-tight mb-2">Enterprise</h3>
                                    <p class="text-[10px] text-indigo-100 font-medium leading-relaxed opacity-90">Maxsus yechimlar va yirik korporatsiyalar uchun.</p>
                                </div>
                                <Button label="Bog'lanish" severity="contrast" class="!rounded-lg !py-2 !text-[10px] !font-bold !uppercase !tracking-widest mt-6 !w-full" />
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab: Plans -->
                <TabPanel value="plans">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <PlanCard 
                            plan="free"
                            priceLabel="0 UZS"
                            :features="['1 ta do\'kon', 'Asosiy hisobotlar', 'Cheklangan savdolar']"
                            :isCurrent="subscription.plan?.plan_type === 'free'"
                            @select="confirmChangePlan('free')"
                        />
                        <PlanCard 
                            plan="standard"
                            priceLabel="150,000 UZS"
                            :features="['3 ta do\'kon', 'Ombor nazorati', 'Savdo qaytarish', 'Eksport (Excel)']"
                            :isCurrent="subscription.plan?.plan_type === 'standard'"
                            :popular="true"
                            @select="confirmChangePlan('standard')"
                            @extend="openExtendDialog"
                        />
                        <PlanCard 
                            plan="premium"
                            priceLabel="300,000 UZS"
                            :features="['Cheksiz do\'konlar', 'KPI & Audit', 'Ko\'p valyuta', 'VIP 24/7']"
                            :isCurrent="subscription.plan?.plan_type === 'enterprise' || subscription.plan?.plan_type === 'premium'"
                            buttonSeverity="help"
                            @select="confirmChangePlan('premium')"
                            @extend="openExtendDialog"
                        />
                    </div>
                </TabPanel>

                <!-- Tab: Billing -->
                <TabPanel value="billing">
                    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div class="px-5 py-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">To'lovlar tarixi</h3>
                            <Button icon="pi pi-download" :label="$t('subscription.export_history')" text class="!text-[10px] !font-bold !uppercase !tracking-widest !rounded-lg !py-1" />
                        </div>
                        <div class="p-16 text-center space-y-4">
                            <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <i class="pi pi-file-o text-slate-300"></i>
                            </div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Hozircha ma'lumot yo'q</p>
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
      :plan="selectedPlan"
      :priceLabel="getSelectedPriceLabel"
      v-model:method="paymentMethod"
      :loading="processing"
      @process="processPayment"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import SubscriptionStatus from './components/SubscriptionStatus.vue'
import PlanCard from './components/PlanCard.vue'
import PaymentDialog from './components/PaymentDialog.vue'
import { useSubscription } from './composables/useSubscription'

const {
    subscription,
    paymentDialog,
    processing,
    selectedPlan,
    paymentMethod,
    dialogHeader,
    getSelectedPriceLabel,
    loadSubscription,
    confirmChangePlan,
    openExtendDialog,
    processPayment
} = useSubscription()

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
