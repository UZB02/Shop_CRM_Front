<template>
  <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 font-sans">
    <div class="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <!-- Top amber security accent glow -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>

      <!-- Spinner container -->
      <div class="relative w-16 h-16 mx-auto">
        <div class="absolute inset-0 rounded-full border-4 border-amber-500/10"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
      </div>
      
      <div class="space-y-2">
        <h2 class="text-xl font-black tracking-tight text-white">Superadmin Kirishi Faollashtirilmoqda</h2>
        <p class="text-xs text-slate-400">Do'kon tizimiga superadmin huquqlari bilan xavfsiz kirilmoqda...</p>
      </div>

      <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-300 leading-relaxed text-left flex gap-2.5">
        <i class="pi pi-exclamation-triangle mt-0.5 shrink-0 text-amber-400"></i>
        <span><strong>Diqqat:</strong> Ushbu sessiya superadmin audit nazorati ostida amalga oshirilmoqda. Barcha amallar tizim loglarida saqlanadi.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const { access: queryAccess, refresh: queryRefresh } = route.query

  const processTokens = async (accessToken, refreshToken) => {
    // Save tokens and metadata locally
    localStorage.setItem('access', accessToken)
    if (refreshToken) localStorage.setItem('refresh', refreshToken)
    
    // Set admin impersonation flag
    localStorage.setItem('impersonated_by_admin', 'true')
    
    // Update API client authorization headers
    authStore.token = accessToken
    
    // Validate session and retrieve permissions
    const success = await authStore.verifySession()
    
    if (success) {
      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)
    } else {
      localStorage.removeItem('impersonated_by_admin')
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      alert("Sessiyani tasdiqlashda xatolik yuz berdi. Iltimos superadmin panelidan qayta urinib ko'ring.")
      router.push('/login')
    }
  }

  // If tokens are passed via URL query, use them as fallback
  if (queryAccess) {
    await processTokens(queryAccess, queryRefresh)
    return
  }

  // Otherwise, use secure postMessage channel from window.opener
  if (window.opener) {
    const handleMessage = async (event) => {
      if (event.data && event.data.type === 'impersonate-tokens') {
        const { access, refresh } = event.data
        if (access) {
          window.removeEventListener('message', handleMessage)
          await processTokens(access, refresh)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify opener that child window is ready to receive tokens
    window.opener.postMessage({ type: 'impersonate-ready' }, '*')

    // Set a safety timeout of 5 seconds to redirect to login if no message is received
    setTimeout(() => {
      window.removeEventListener('message', handleMessage)
      if (!localStorage.getItem('access')) {
        router.push('/login')
      }
    }, 5000)
  } else {
    router.push('/login')
  }
})
</script>
