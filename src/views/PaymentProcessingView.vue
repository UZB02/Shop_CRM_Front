<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div class="w-full max-w-md">
      <!-- Payment Method Header -->
      <div class="text-center mb-8">
        <div 
          class="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          :class="paymentMethod === 'click' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'"
        >
          <i :class="paymentMethod === 'click' ? 'pi pi-credit-card' : 'pi pi-mobile'" class="text-4xl text-white"></i>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {{ paymentMethod === 'click' ? 'Click' : 'Payme' }} To'lov
        </h1>
        <p class="text-slate-500">Mock to'lov tizimi (Test)</p>
      </div>

      <!-- Payment Amount Card -->
      <div class="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
        <div class="flex justify-between items-center">
          <span class="text-slate-600 dark:text-slate-400">To'lov summasi:</span>
          <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ selectedPlan.price }} so'm</span>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <form @submit.prevent="handlePayment" class="space-y-4">
          
          <!-- Click Payment Fields -->
          <template v-if="paymentMethod === 'click'">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Karta raqami</label>
              <InputMask 
                v-model="form.cardNumber" 
                mask="9999 9999 9999 9999" 
                placeholder="0000 0000 0000 0000"
                class="w-full"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Amal qilish muddati</label>
                <InputMask 
                  v-model="form.expiry" 
                  mask="99/99" 
                  placeholder="MM/YY"
                  class="w-full"
                  required
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">CVV</label>
                <InputMask 
                  v-model="form.cvv" 
                  mask="999" 
                  placeholder="000"
                  class="w-full"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Karta egasi</label>
              <InputText 
                v-model="form.cardHolder" 
                placeholder="FIRSTNAME LASTNAME"
                class="w-full "
                required
              />
            </div>
          </template>

          <!-- Payme Payment Fields -->
          <template v-else>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Telefon raqami</label>
              <InputMask 
                v-model="form.phone" 
                mask="+998 (99) 999-99-99" 
                placeholder="+998 (00) 000-00-00"
                class="w-full"
                required
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">SMS kod (Mock: 123456)</label>
              <InputMask 
                v-model="form.smsCode" 
                mask="999999" 
                placeholder="000000"
                class="w-full"
                required
              />
            </div>
          </template>

          <!-- Mock Notice -->
          <div class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div class="flex gap-2">
              <i class="pi pi-info-circle text-amber-600 dark:text-amber-400 mt-0.5"></i>
              <div class="text-sm text-amber-800 dark:text-amber-300">
                <strong>Test rejimi:</strong> Bu mock to'lov tizimi. Haqiqiy to'lov amalga oshirilmaydi. 
                Istalgan ma'lumotlarni kiritishingiz mumkin.
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <Button 
              type="button"
              label="Bekor qilish" 
              severity="secondary" 
              outlined 
              class="flex-1"
              @click="goBack"
            />
            <Button 
              type="submit"
              label="To'lash" 
              severity="success" 
              class="flex-1"
              :loading="processing"
            />
          </div>
        </form>
      </div>

      <!-- Security Notice -->
      <div class="text-center mt-6 text-sm text-slate-500">
        <i class="pi pi-lock mr-1"></i>
        Xavfsiz to'lov tizimi
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'

const router = useRouter()
const route = useRoute()
const processing = ref(false)
const paymentMethod = ref('')
const selectedPlan = ref({})

const form = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardHolder: '',
  phone: '',
  smsCode: ''
})

onMounted(() => {
  paymentMethod.value = route.query.method || 'click'
  
  // Get plan from localStorage
  const planData = localStorage.getItem('selectedPlan')
  if (planData) {
    selectedPlan.value = JSON.parse(planData)
  } else {
    router.push('/')
  }
})

const handlePayment = async () => {
  processing.value = true

  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Store payment success info
  const paymentInfo = {
    method: paymentMethod.value,
    plan: selectedPlan.value,
    timestamp: new Date().toISOString(),
    status: 'success'
  }
  
  localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo))
  
  processing.value = false

  // Redirect to registration
  router.push('/register')
}

const goBack = () => {
  router.push('/payment/method')
}
</script>
