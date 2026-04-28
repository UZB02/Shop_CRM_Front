<template>
  <Transition name="fade">
    <div 
      v-if="store.isSubscriptionExpired && route.path !== '/dashboard/subscription'" 
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl transition-all duration-500"
    >
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
        <!-- Banner Image/Icon -->
        <div class="h-48 bg-rose-500 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-500 to-rose-700 opacity-90" />
          <!-- Decorative circles -->
          <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          
          <div class="relative flex flex-col items-center">
            <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl mb-3 animate-bounce">
              <i class="pi pi-lock text-4xl text-white" />
            </div>
            <h2 class="text-xl font-black text-white uppercase tracking-widest text-center px-4">
              Obuna muddati tugadi
            </h2>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 text-center">
          <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Sizning obuna muddatingiz yakunlandi. Tizimdan foydalanishni davom ettirish uchun to'lovni amalga oshiring yoki admin bilan bog'laning.
          </p>
          
          <div class="space-y-3">
            <button 
              @click="goToPayment"
              class="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>To'lov sahifasiga o'tish</span>
              <i class="pi pi-arrow-right transition-transform group-hover:translate-x-1" />
            </button>
            
            <button 
              @click="logout"
              class="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              Tizimdan chiqish
            </button>
          </div>
          
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p class="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Texnik yordam: +998 (XX) XXX-XX-XX
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useNotificationStore } from '@/store/notifications'
import { useAuthStore } from '@/store/auth'
import { useRouter, useRoute } from 'vue-router'

const store = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const goToPayment = () => {
    router.push('/dashboard/subscription')
}

const logout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
