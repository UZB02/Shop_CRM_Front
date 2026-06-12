<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
    <!-- Impersonation Alert Banner -->
    <div 
      v-if="isImpersonated" 
      class="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white py-2.5 px-4 text-center font-bold text-xs md:text-sm shadow-lg flex items-center justify-center gap-3 z-[999] relative shrink-0"
    >
      <i class="pi pi-eye-slash text-base animate-pulse"></i>
      <span>Siz ayni damda do'kon tizimini SUPERADMIN impersonation rejimida kuzatmoqdasiz (30 daqiqa).</span>
      <button 
        @click="exitImpersonation" 
        class="h-7 px-3 bg-white text-orange-700 rounded-full font-bold text-xs hover:bg-slate-100 transition-all active:scale-95 shadow cursor-pointer"
      >
        Tizimdan Chiqish
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <Toast :pt="{
        root: { class: '!right-4 !left-4 sm:!left-auto sm:!right-6 !w-auto sm:!w-[24rem] !pt-4' },
        message: ({ props }) => ({
            class: [
                'rounded-2xl border-none shadow-2xl backdrop-blur-xl transition-all duration-300 p-4 mb-3',
                props.message.severity === 'info' ? 'bg-slate-900/90 text-blue-400 border border-blue-500/20' : 
                props.message.severity === 'success' ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/20' :
                props.message.severity === 'warn' ? 'bg-amber-950/90 text-amber-400 border border-amber-500/20' :
                'bg-red-950/90 text-red-400 border border-red-500/20'
            ]
        }),
        summary: { class: 'text-[13px] font-black mb-1 opacity-60 tracking-[0.05em] leading-none' },
        detail: { class: 'text-sm font-bold text-slate-100 leading-tight block' },
        icon: { class: 'text-lg mr-4 mt-0.5' },
        closeButton: { class: 'hover:bg-white/10 rounded-full transition-colors w-8 h-8 flex items-center justify-center p-0' },
        closeIcon: { class: 'text-sm' }
    }" />
    <AppConfirm />
    <SubscriptionBarrier />

    <!-- MOBILE OVERLAY -->
    <Transition name="overlay">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden" @click="sidebarOpen = false" />
    </Transition>

    <!-- SIDEBAR -->
    <DashboardSidebar 
      v-model:sidebarOpen="sidebarOpen" 
      v-model:desktopCollapsed="desktopCollapsed" 
      :filtered-menu="filteredMenu"
      :user="user"
      @showProfile="router.push('/dashboard/profile')"
      @logout="handleLogout"
    />

    <!-- MAIN AREA -->
    <div
      class="flex flex-col flex-1 min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ml-0"
      :class="{ 'lg:ml-16': desktopCollapsed, 'lg:ml-64': !desktopCollapsed }"
    >
      <!-- HEADER -->
      <DashboardHeader 
        v-model:sidebarOpen="sidebarOpen"
        :locale="locale"
        @update:locale="setLang"
        :current-page-title="currentPageTitle"
        :subscription-warning="subscriptionWarning"
        :is-dark="isDark"
        :is-fullscreen="isFullscreen"
        @toggleTheme="toggleTheme"
        @toggleFullscreen="toggleFullscreen"
        @toggleCalculator="isCalculatorOpen = !isCalculatorOpen"
      />

      <!-- PAGE CONTENT -->
      <main class="flex-1 p-4 sm:p-5 lg:p-6 lg:pt-4 min-w-0 pb-[84px] lg:pb-6">
        <!-- Subscription warning (mobile only) -->
        <div v-if="subscriptionWarning" class="md:hidden mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          <div class="flex items-start gap-2">
            <i class="pi pi-exclamation-triangle mt-0.5 flex-shrink-0" />
            <div class="flex flex-col gap-1">
              <span>{{ subscriptionWarning }}</span>
              <span v-if="notificationStore.subscription?.bonus_days > 0" class="text-[11px] text-amber-600 dark:text-amber-500 font-bold">
                 └── {{ notificationStore.subscription.bonus_days }} kun bonus (kupon/referral) hisobida
              </span>
            </div>
          </div>
          <button class="mt-2 w-full py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold text-xs" @click="router.push('/dashboard/subscription')">
            {{ $t('common.pay_action') }} →
          </button>
        </div>

        <RouterView />
      </main>
    </div>

    <!-- GLOBAL DIALOGS -->
    <CalculatorWidget v-model:visible="isCalculatorOpen" />
    </div>

    <!-- MOBILE BOTTOM NAV -->
    <MobileBottomNav @open-menu="sidebarOpen = true" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import AppConfirm from '@/components/common/AppConfirm.vue'
import { useConfirmStore } from '@/store/confirm'
import { useDashboardLayout } from './composables/useDashboardLayout'
import { useNotificationStore } from '@/store/notifications'

// Layout Components
import DashboardSidebar from './components/DashboardSidebar.vue'
import DashboardHeader from './components/DashboardHeader.vue'
import SubscriptionBarrier from '@/components/SubscriptionBarrier.vue'
import CalculatorWidget from '@/components/CalculatorWidget.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'

const confirmStore = useConfirmStore()
const toast = useToast()
const { 
  router, t, locale, setLang,
  sidebarOpen, desktopCollapsed, showProfileDialog, subscriptionWarning,
  isDark, toggleTheme,
  isFullscreen, toggleFullscreen,
  user, filteredMenu, currentPageTitle, authStore
} = useDashboardLayout()

/* --- Global API Error Handling (Rate Limit) --- */
let lastRateLimitToastTime = 0
const handleRateLimitError = (event) => {
  console.log('🔔 Received rate-limit-error event in layout:', event.detail);
  const now = Date.now()
  // 5 soniya cooldown — spamni oldini olish uchun
  if (now - lastRateLimitToastTime < 5000) return
  lastRateLimitToastTime = now

  toast.add({
    severity: 'warn',
    summary: 'Limitdan oshildi',
    detail: event.detail || "So'rovlar soni limitdan oshdi. Birozdan so'ng urinib ko'ring.",
    life: 5000
  })
}

let lastNetworkErrorToastTime = 0
const handleNetworkError = (event) => {
  const now = Date.now()
  if (now - lastNetworkErrorToastTime < 5000) return
  lastNetworkErrorToastTime = now

  toast.add({
    severity: 'error',
    summary: 'Aloqa xatosi',
    detail: event.detail || "Internet bilan aloqa yo'q yoki serverga ulanib bo'lmadi.",
    life: 5000
  })
}

const notificationStore = useNotificationStore()
let initialSessionNotified = false

const handleNotifications = (newItems, oldItems) => {
  if (!notificationStore.initialFetchDone) return
  if (!Array.isArray(newItems)) return

  const oldLen = Array.isArray(oldItems) ? oldItems.length : 0
  const newLen = newItems.length

  // Yangi kelgan xabarni Toast orqali ko'rsatish
  if (initialSessionNotified) {
    if (newLen > oldLen) {
      const latest = newItems[0] // Sortlangan bo'lgani uchun 0-chi eng yangisi
      if (latest && !latest.is_read) {
        
        let severity = 'info'
        let summary = latest.title || 'Yangi xabar'
        
        // 1. Tizim Bildirishnomalari (Notification)
        if (latest.source === 'notification') {
          if (latest.type === 'low_stock') severity = 'warn'
          if (latest.type === 'subscription_expiry') severity = 'warn' // To'q sariq
          if (latest.type === 'subscription_expired') severity = 'error' // Qizil
          if (latest.type === 'cash_discrepancy') severity = 'error' // Qizil
        } 
        // 2. Announcement (Admin xabarlari)
        else if (latest.source === 'announcement') {
          if (latest.type === 'info') severity = 'info' // Ko'k
          if (latest.type === 'warning') severity = 'warn' // Sariq
          if (latest.type === 'maintenance') severity = 'warn' // To'q sariq (PrimeVue warn ishlatsa bo'ladi)
          if (latest.type === 'new_feature') severity = 'success' // Yashil
        }

        toast.add({
          severity,
          summary: latest.title || summary,
          detail: latest.message || latest.body,
          life: severity === 'error' ? 10000 : 5000 
        })
      }
    }
    return
  }

  // Sahifa yuklanganda (Initial session load)
  if (newLen > 0 && !initialSessionNotified) {
    initialSessionNotified = true
    
    if (!sessionStorage.getItem('session_notified_any')) {
      const unread = newItems.filter(i => !i.is_read).length
      if (unread > 0) {
        toast.add({
          severity: 'info',
          summary: t('common.notifications') || 'Bildirishnomalar',
          detail: t('notifications.unread_count', { count: unread }) || `${unread} ta o'qilmagan xabar mavjud`,
          life: 5000
        })
      }
      sessionStorage.setItem('session_notified_any', 'true')
    }
  }
}

// Watch for items change (real-time or initial)
watch(() => notificationStore.items, handleNotifications, { deep: true })

// Handle initial load
watch(() => notificationStore.initialFetchDone, (done) => {
  if (done) {
    handleNotifications(notificationStore.items, [])
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('rate-limit-error', handleRateLimitError)
  window.addEventListener('network-error', handleNetworkError)
  notificationStore.startPolling()
})

onUnmounted(() => {
  window.removeEventListener('rate-limit-error', handleRateLimitError)
  window.removeEventListener('network-error', handleNetworkError)
  notificationStore.stopPolling()
})

/* --- Impersonation Status & Exit Controls --- */
const isImpersonated = ref(localStorage.getItem('impersonated_by_admin') === 'true')

const exitImpersonation = () => {
  localStorage.removeItem('impersonated_by_admin')
  notificationStore.reset()
  authStore.logout()
  window.close()
}

/* --- Logout with confirmation --- */
const isConfirmingLogout = ref(false)
const isCalculatorOpen = ref(false)

const handleLogout = () => {
  if (isConfirmingLogout.value) return
  isConfirmingLogout.value = true
  
  confirmStore.require({
    message: t('common.logout_confirm') || 'Tizimdan chiqishni tasdiqlaysizmi?',
    header: t('common.logout_title') || 'Chiqish',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('common.logout_yes') || 'Ha, chiqish',
    rejectLabel: t('common.cancel') || 'Bekor qilish',
    acceptClass: 'p-button-danger',
    accept: () => {
      isConfirmingLogout.value = false
      // Tozalash: Keyingi safar kirganda yana Toast chiqishi uchun
      sessionStorage.removeItem('session_notified_announcements')
      sessionStorage.removeItem('session_notified_stock')
      
      notificationStore.reset()
      authStore.logout()
      router.push('/')
    },
    reject: () => {
      isConfirmingLogout.value = false
    }
  })
}
</script>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.25s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
:global(body:has(.sidebar-open)) { overflow: hidden; }
</style>


