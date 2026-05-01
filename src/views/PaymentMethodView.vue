<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div class="w-full max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">To'lov usulini tanlang</h1>
        <p class="text-slate-500">Xavfsiz va tez to'lov</p>
      </div>

      <!-- Selected Plan Card -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ selectedPlan.name }} Tarif</h3>
            <p class="text-slate-500 mt-1">{{ selectedPlan.desc }}</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-emerald-500">{{ selectedPlan.price }}</div>
            <div class="text-sm text-slate-500">{{ selectedPlan.unit }}</div>
          </div>
        </div>
        
        <!-- Features -->
        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="grid grid-cols-2 gap-3">
            <div v-for="(feature, idx) in selectedPlan.features" :key="idx" class="flex items-center gap-2">
              <i class="pi pi-check-circle text-emerald-500 text-sm"></i>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- Click Payment -->
        <div 
          @click="selectPaymentMethod('click')"
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
          :class="selectedMethod === 'click' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'"
        >
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <i class="pi pi-credit-card text-3xl text-white"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Click</h3>
            <p class="text-slate-500 text-sm mb-4">Bank kartalari orqali to'lov</p>
            <div class="flex justify-center gap-2">
              <div class="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-bold">VISA</div>
              <div class="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-bold">MC</div>
              <div class="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-bold">UZCARD</div>
            </div>
          </div>
        </div>

        <!-- Payme Payment -->
        <div 
          @click="selectPaymentMethod('payme')"
          class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
          :class="selectedMethod === 'payme' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'"
        >
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <i class="pi pi-mobile text-3xl text-white"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payme</h3>
            <p class="text-slate-500 text-sm mb-4">Telefon raqami orqali to'lov</p>
            <div class="flex justify-center gap-2">
              <div class="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-bold">+998</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="flex gap-4">
        <Button 
          label="Davom etish" 
          icon="pi pi-arrow-right" 
          iconPos="right"
          severity="success" 
          class="flex-1 h-14 !rounded-2xl !text-sm font-black tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95"
          :disabled="!selectedMethod"
          @click="proceedToPayment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()
const selectedMethod = ref('')
const selectedPlan = ref({})

onMounted(() => {
  // Get plan from localStorage
  const planData = localStorage.getItem('selectedPlan')
  if (planData) {
    selectedPlan.value = JSON.parse(planData)
  } else {
    // If no plan selected, redirect to landing
    router.push('/')
  }
})

const selectPaymentMethod = (method) => {
  selectedMethod.value = method
}

const proceedToPayment = () => {
  if (selectedMethod.value) {
    router.push(`/payment/process?method=${selectedMethod.value}`)
  }
}

const goBack = () => {
  router.push('/')
}
</script>


