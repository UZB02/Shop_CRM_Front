<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Obuna Sozlamalari</h1>
    </div>

    <!-- Status Component -->
    <SubscriptionStatus :subscription="subscription" />

    <!-- Plans -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard 
        plan="free"
        priceLabel="0 so'm"
        :features="['Cheklangan savdolar', '1 ta foydalanuvchi', 'Asosiy hisobotlar']"
        :isCurrent="subscription.plan === 'free'"
        @select="confirmChangePlan('free')"
      />

      <PlanCard 
        plan="standard"
        priceLabel="150,000 so'm"
        :features="['Cheksiz savdolar', '5 ta foydalanuvchi', 'Barcha hisobotlar', 'Ombor nazorati']"
        :isCurrent="subscription.plan === 'standard'"
        :popular="true"
        cardClass="transform scale-105 z-10 shadow-md"
        @select="confirmChangePlan('standard')"
        @extend="openExtendDialog"
      />

      <PlanCard 
        plan="premium"
        priceLabel="300,000 so'm"
        :features="['Cheksiz hamma narsa', 'Cheksiz foydalanuvchilar', 'VIP yordam 24/7', 'API integratsiya']"
        :isCurrent="subscription.plan === 'premium'"
        buttonSeverity="help"
        @select="confirmChangePlan('premium')"
        @extend="openExtendDialog"
      />
    </div>

    <!-- Payment Dialog Component -->
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
import { ref, onMounted, computed } from 'vue'
import SubscriptionStatus from './components/SubscriptionStatus.vue'
import PlanCard from './components/PlanCard.vue'
import PaymentDialog from './components/PaymentDialog.vue'
import { subscriptionAPI } from '@/services/api'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/store/auth'

const toast = useToast()
const authStore = useAuthStore()

const subscription = ref({
    plan: 'free',
    status: 'active',
    endDate: null
})

const loading = ref(false)
const paymentDialog = ref(false)
const processing = ref(false)
const selectedPlan = ref('')
const paymentMethod = ref('click')
const isExtending = ref(false)

const dialogHeader = computed(() => isExtending.value ? 'Obunani Uzaytirish' : 'Tarifni O\'zgartirish')

const getSelectedPriceLabel = computed(() => {
    switch(selectedPlan.value) {
        case 'free': return '0 so\'m';
        case 'standard': return '150,000 so\'m';
        case 'premium': return '300,000 so\'m';
        default: return '';
    }
})

const loadSubscription = async () => {
    loading.value = true
    try {
        const response = await subscriptionAPI.getStatus()
        subscription.value = response.data
    } catch (error) {
        console.error('Error loading subscription:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Obuna ma\'lumotlarini yuklashda xatolik', life: 5000 })
    } finally {
        loading.value = false
    }
}

const confirmChangePlan = (plan) => {
    selectedPlan.value = plan
    isExtending.value = false
    paymentDialog.value = true
}

const openExtendDialog = () => {
    selectedPlan.value = subscription.value.plan
    isExtending.value = true
    paymentDialog.value = true
}

const processPayment = async () => {
    processing.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1500))

        let response;
        if (isExtending.value) {
            response = await subscriptionAPI.extend({ durationInDays: 30 })
        } else {
            response = await subscriptionAPI.changePlan({ plan: selectedPlan.value, durationInDays: 30 })
        }

        subscription.value = response.data.subscription
        
        if (authStore.user && authStore.user.subscription) {
            authStore.user.subscription = response.data.subscription;
        }

        toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'To\'lov qabul qilindi va tarif yangilandi', life: 5000 })
        paymentDialog.value = false
        
        if (subscription.value.status === 'active') {
             window.dispatchEvent(new CustomEvent('subscription-updated'))
        }

    } catch (error) {
        console.error('Payment error:', error)
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'To\'lovni amalga oshirishda xatolik', life: 5000 })
    } finally {
        processing.value = false
    }
}

onMounted(() => {
    loadSubscription()
})
</script>
