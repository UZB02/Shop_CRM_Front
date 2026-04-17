<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-emerald-500 mb-2">Shop Searem</h1>
        <p class="text-slate-500">Boshqaruv paneliga kiring</p>
      </div>

      <div class="space-y-4">
        <div v-if="route.query.registered" class="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
          <i class="pi pi-check-circle mr-2"></i> Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kirishingiz mumkin.
        </div>

        <Transition name="shake">
          <div v-if="errorMessage" class="bg-rose-500/10 dark:bg-rose-500/5 backdrop-blur-sm border border-rose-500/20 rounded-xl p-4 mb-6 group transition-all duration-300">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
                <i class="pi pi-exclamation-triangle text-white text-[12px]"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Xatolik yuz berdi</span>
                <p class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{{ errorMessage }}</p>
                
                <!-- Action Suggestion for Network Errors -->
                <div v-if="errorMessage.includes('Internet') || errorMessage.includes('Serverga')" class="mt-2 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div class="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                  <span class="text-[9px] font-black text-rose-400 uppercase tracking-wider">Aloqani tekshirib qayta urinib ko'ring</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Username</label>
          <div class="relative group">
            <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10 text-[11px]"></i>
            <InputText v-model="form.username" placeholder="admin" class="sr-input !pl-10 !h-11 !rounded-xl w-full" @keyup.enter="handleLogin" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Parol</label>
          <div class="relative group">
            <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10 text-[11px]"></i>
            <Password v-model="form.password" :feedback="false" toggleMask placeholder="••••••••" class="w-full" pt:input:class="sr-input !pl-10 !h-11 !rounded-xl !w-full" @keyup.enter="handleLogin" />
          </div>
        </div>

        <Button 
          @click="handleLogin"
          :loading="loading"
          class="w-full mt-4 !h-12 !rounded-xl !bg-emerald-500 hover:!bg-emerald-600 !border-none !text-[11px] !font-black !uppercase !tracking-[2px] !shadow-lg !shadow-emerald-500/20 active:scale-[0.98] transition-all"
        >
          <template #default>
            <span>Boshqaruvga kirish</span>
            <i class="pi pi-arrow-right ml-2 text-[9px]"></i>
          </template>
        </Button>

        <div class="text-center mt-8 text-[10px]">
          <span class="text-slate-400 font-bold uppercase tracking-widest">Akkauntingiz yo'qmi? </span>
          <router-link to="/register" class="text-emerald-500 font-black uppercase tracking-widest hover:text-emerald-600 ml-1 decoration-2 underline-offset-4">Ro'yxatdan o'tish</router-link>
        </div>

        <div class="text-center mt-6 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <i class="pi pi-info-circle"></i>
            Test rejimi: <span class="text-slate-600 dark:text-slate-300">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = 'Iltimos, username va parolni kiriting'
    return
  }

  loading.value = true
  errorMessage.value = ''

  const result = await authStore.login({
    username: form.value.username,
    password: form.value.password
  })
  loading.value = false

  if (result.success) {
    router.push('/dashboard')
  } else {
    // result.message is now a user-friendly string from the store
    const errorData = result.message
    
    if (typeof errorData === 'object' && errorData !== null) {
      const firstKey = Object.keys(errorData)[0]
      const errorMsg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey]
      errorMessage.value = firstKey === 'detail' || firstKey === 'non_field_errors' ? errorMsg : `${firstKey}: ${errorMsg}`
    } else {
      errorMessage.value = errorData || 'Login xato.'
    }
  }
}
</script>

<style scoped>
.shake-enter-active {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.sr-input {
  transition: all 0.3s ease;
  background-color: transparent !important;
}

.sr-input:focus {
  background-color: white !important;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.05);
}

.dark .sr-input:focus {
  background-color: rgb(15, 23, 42) !important;
}
</style>
