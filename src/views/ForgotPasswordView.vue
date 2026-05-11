<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
    <!-- Animated background accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200/80 dark:border-slate-800 relative z-10 transition-all duration-300">
      
      <!-- Back to Login button -->
      <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 mb-6 transition-colors group">
         <i class="pi pi-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform" />
         Orqaga qaytish
      </router-link>

      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center gap-3 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative animate-pulse">
            <i class="pi pi-lock text-white text-3xl"></i>
          </div>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Parolni tiklash</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Elektron pochtangizga tiklash havolasini yuboramiz</p>
      </div>

      <div class="space-y-4">
        <!-- Success Alert -->
        <div v-if="successMessage" class="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm border border-emerald-100 dark:border-emerald-900/30 flex gap-3 items-start animate-fade-in">
          <i class="pi pi-check-circle text-lg mt-0.5"></i>
          <span class="font-medium">{{ successMessage }}</span>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm border border-rose-100 dark:border-rose-900/30 flex gap-3 items-start animate-fade-in">
          <i class="pi pi-exclamation-circle text-lg mt-0.5"></i>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <!-- Form fields (Hidden after success to show clean state) -->
        <div v-if="!successMessage" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-black tracking-widest text-slate-400 uppercase">Email Manzili</label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <InputText 
                v-model="email" 
                placeholder="misol@gmail.com" 
                class="w-full !pl-11 !rounded-2xl !py-3 border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-emerald-500" 
                :disabled="loading"
                @keyup.enter="handleSendEmail" 
              />
            </div>
          </div>

          <Button 
            label="Havolani yuborish" 
            icon="pi pi-send"
            severity="success" 
            class="w-full !rounded-2xl !py-3 shadow-lg shadow-emerald-500/10" 
            :loading="loading"
            :disabled="!email || loading"
            @click="handleSendEmail" 
          />
        </div>

        <!-- If success, display a visual confirmation helper -->
        <div v-else class="py-4 text-center">
           <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 mb-4 animate-bounce">
              <i class="pi pi-envelope text-2xl"></i>
           </div>
           <p class="text-xs font-semibold text-slate-400 leading-relaxed">
              Iltimos, pochtangizni va spam papkasini tekshiring. Havola 10 daqiqa davomida faol bo'ladi.
           </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { authAPI } from '@/services/auth'

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSendEmail = async () => {
  if (!email.value) {
    errorMessage.value = 'Iltimos, email manzilingizni kiriting.'
    return
  }

  // Simple email verification
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Iltimos, elektron pochtani to\'g\'ri formatda kiriting.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await authAPI.sendResetEmail({ email: email.value })
    
    // Axios usually returns data directly under .data
    if (res.data && res.data.message) {
      successMessage.value = res.data.message || "Parolni tiklash uchun havola emailga muvaffaqiyatli yuborildi."
    } else {
      successMessage.value = "Parolni tiklash uchun havola emailga yuborildi."
    }
  } catch (err) {
    console.error("Error sending reset email:", err)
    
    if (err.response) {
      const status = err.response.status
      const data = err.response.data
      
      if (status === 429) {
        errorMessage.value = "Juda ko'p urinish (soatiga max 3 marta). Keyinroq qayta urinib ko'ring."
      } else if (status === 400 && data) {
        if (data.email && Array.isArray(data.email)) {
          errorMessage.value = data.email[0]
        } else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0]
          errorMessage.value = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]
        } else {
          errorMessage.value = "Kiritilgan email bilan muammo yuz berdi."
        }
      } else {
        errorMessage.value = data?.detail || "Email yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
      }
    } else {
      errorMessage.value = "Server bilan bog'lanishda xatolik yuz berdi."
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
