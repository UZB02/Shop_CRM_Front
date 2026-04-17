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

        <div v-if="errorMessage" class="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-lg text-sm mb-6 border border-rose-200 dark:border-rose-800">
          <i class="pi pi-exclamation-circle mr-2"></i> {{ errorMessage }}
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
          <InputText v-model="form.username" placeholder="admin" class="sr-input" @keyup.enter="handleLogin" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Parol</label>
          <Password v-model="form.password" :feedback="false" toggleMask placeholder="••••••••" class="w-full" inputClass="sr-input" @keyup.enter="handleLogin" />
        </div>

        <Button label="Kirish" 
                severity="success" 
                class="w-full mt-4" 
                :loading="loading"
                @click="handleLogin" />

        <div class="text-center mt-6 text-sm">
          <span class="text-slate-500">Akkauntingiz yo'qmi? </span>
          <router-link to="/register" class="text-emerald-500 font-medium hover:underline">Ro'yxatdan o'tish</router-link>
        </div>

        <div class="text-center mt-6 text-sm text-slate-500">
          <p>Test login: <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">admin / admin123</code></p>
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
    // Handle Django-style error responses
    const errorData = result.message
    if (typeof errorData === 'object' && errorData !== null) {
      const firstKey = Object.keys(errorData)[0]
      const errorMsg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey]
      
      if (firstKey === 'non_field_errors' || firstKey === 'detail') {
        errorMessage.value = errorMsg
      } else {
        errorMessage.value = `${firstKey}: ${errorMsg}`
      }
    } else {
      errorMessage.value = errorData || 'Login xato. Iltimos, qaytadan urinib ko\'ring.'
    }
  }
}
</script>

<style scoped>
</style>
