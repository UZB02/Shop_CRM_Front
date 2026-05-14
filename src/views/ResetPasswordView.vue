<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
    <!-- Animated background accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200/80 dark:border-slate-800 relative z-10 transition-all duration-300">
      
      <!-- Back to Login -->
      <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 mb-6 transition-colors group">
         <i class="pi pi-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform" />
         Tizimga kirish
      </router-link>

      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center gap-3 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative">
            <i class="pi pi-key text-white text-3xl"></i>
          </div>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Yangi parol o'rnatish</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Iltimos, yangi va ishonchli parol belgilang</p>
      </div>

      <div class="space-y-4">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm border border-rose-100 dark:border-rose-900/30 flex gap-3 items-start animate-fade-in">
          <i class="pi pi-exclamation-circle text-lg mt-0.5" />
          <div class="flex-1">
            <span class="font-bold block mb-1">Xatolik</span>
            <span class="font-medium text-xs leading-relaxed">{{ errorMessage }}</span>
            <div v-if="showForgotPasswordLink" class="mt-2">
               <router-link to="/forgot-password" class="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1">
                  Havolani qaytadan so'rash <i class="pi pi-arrow-right text-[10px]" />
               </router-link>
            </div>
          </div>
        </div>

        <!-- Reset Password Form -->
        <div v-if="!isSuccess" class="space-y-4">
          <!-- Password Field -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-black tracking-widest text-slate-400 uppercase">Yangi Parol</label>
            <Password 
              v-model="password" 
              :feedback="false"
              toggleMask 
              placeholder="••••••••" 
              class="w-full" 
              inputClass="w-full !rounded-2xl !py-3 dark:bg-slate-950 dark:border-slate-800"
              :disabled="loading"
            />
          </div>

          <!-- Password Confirmation Field -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-black tracking-widest text-slate-400 uppercase">Parolni Tasdiqlang</label>
            <Password 
              v-model="passwordConfirm" 
              :feedback="false" 
              toggleMask 
              placeholder="••••••••" 
              class="w-full" 
              inputClass="w-full !rounded-2xl !py-3 dark:bg-slate-950 dark:border-slate-800"
              :disabled="loading"
              @keyup.enter="handleResetPassword"
            />
          </div>

          <Button 
            label="Parolni o'zgartirish" 
            icon="pi pi-check"
            severity="success" 
            class="w-full !rounded-2xl !py-3 shadow-lg shadow-emerald-500/10" 
            :loading="loading"
            :disabled="loading || !password || !passwordConfirm"
            @click="handleResetPassword" 
          />
        </div>

        <!-- Success redirect info -->
        <div v-else class="py-4 text-center space-y-4">
           <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
              <i class="pi pi-check text-2xl"></i>
           </div>
           <p class="text-sm font-bold text-emerald-600">Parolingiz muvaffaqiyatli yangilandi!</p>
           <p class="text-xs font-semibold text-slate-400">
              Siz 3 soniyadan so'ng login sahifasiga yo'naltirilasiz...
           </p>
           <Button label="Hozir o'tish" severity="success" class="!rounded-2xl w-full" @click="goToLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { authAPI } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)
const showForgotPasswordLink = ref(false)

const uid = computed(() => route.params.uid)
const token = computed(() => route.params.token)

const handleResetPassword = async () => {
  if (!password.value || !passwordConfirm.value) {
    errorMessage.value = 'Iltimos, ikkala parol maydonini ham to\'ldiring.'
    return
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Parollar bir xil emas! Iltimos, tekshirib qaytadan kiriting.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  showForgotPasswordLink.value = false

  try {
    const res = await authAPI.resetPassword(uid.value, token.value, {
      password: password.value,
      password2: passwordConfirm.value
    })

    isSuccess.value = true
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      goToLogin()
    }, 3000)
    
  } catch (err) {
    console.error("Error resetting password:", err)
    
    if (err.response) {
      const data = err.response.data
      
      const errorMsg = data.non_field_errors?.[0] || data.detail || "Xatolik yuz berdi."
      errorMessage.value = errorMsg
      
      // If token expired/invalid, offer a link to ask for a new link
      if (errorMsg.toLowerCase().includes("token") || errorMsg.toLowerCase().includes("expired") || errorMsg.toLowerCase().includes("muddati")) {
        showForgotPasswordLink.value = true
      }
    } else {
      errorMessage.value = "Server bilan bog'lanishda xatolik yuz berdi."
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push({ path: '/login', query: { registered: 'true' } })
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
