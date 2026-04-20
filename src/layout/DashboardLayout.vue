<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
    <Toast />
    <ConfirmDialog pt:root:class="!rounded-2xl !border-none !shadow-2xl !bg-white dark:!bg-slate-900" />
    <SubscriptionBarrier />

    <!-- MOBILE OVERLAY -->
    <Transition name="overlay">
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" @click="sidebarOpen = false" />
    </Transition>

    <!-- SIDEBAR -->
    <DashboardSidebar 
      v-model:sidebarOpen="sidebarOpen" 
      v-model:desktopCollapsed="desktopCollapsed" 
      :filtered-menu="filteredMenu"
      :user="user"
      @showProfile="showProfileDialog = true"
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
      <main class="flex-1 p-4 sm:p-5 lg:p-6 lg:pt-4 min-w-0">
        <!-- Subscription warning (mobile only) -->
        <div v-if="subscriptionWarning" class="md:hidden mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          <div class="flex items-start gap-2">
            <i class="pi pi-exclamation-triangle mt-0.5 flex-shrink-0" />
            <span>{{ subscriptionWarning }}</span>
          </div>
          <button class="mt-2 w-full py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold text-xs" @click="router.push('/dashboard/subscription')">
            {{ $t('common.pay_action') }} →
          </button>
        </div>

        <RouterView />
      </main>
    </div>

    <!-- GLOBAL DIALOGS -->
    <UserProfileDialog v-model:visible="showProfileDialog" :user="user" @logout="handleLogout" />
    <CalculatorWidget v-model:visible="isCalculatorOpen" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useDashboardLayout } from './composables/useDashboardLayout'
import { useNotificationStore } from '@/store/notifications'

// Layout Components
import DashboardSidebar from './components/DashboardSidebar.vue'
import DashboardHeader from './components/DashboardHeader.vue'
import UserProfileDialog from '@/components/UserProfileDialog.vue'  
import SubscriptionBarrier from '@/components/SubscriptionBarrier.vue'
import CalculatorWidget from '@/components/CalculatorWidget.vue'

const confirm = useConfirm()
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

const notificationStore = useNotificationStore()
let initialAnnouncementsHandled = false
let initialStockHandled = false

const handleAnnouncements = (newCount, oldCount) => {
  if (!notificationStore.initialFetchDone) return

  if (initialAnnouncementsHandled) {
    if (newCount > oldCount) {
      const latest = notificationStore.announcements.find(a => !a.is_read)
      if (latest) {
        toast.add({
          severity: latest.type === 'critical' ? 'error' : 'info',
          summary: 'Yangi xabar',
          detail: latest.title,
          life: 5000
        })
      }
    }
    return
  }

  // Initial session check
  if (newCount > 0) {
    initialAnnouncementsHandled = true
    if (!sessionStorage.getItem('session_notified_announcements')) {
      toast.add({
        severity: 'info',
        summary: 'Bildirishnomalar',
        detail: `${newCount} ta yangi xabar mavjud`,
        life: 5000
      })
      sessionStorage.setItem('session_notified_announcements', 'true')
    }
  }
}

const handleLowStock = (newLen, oldLen) => {
  if (!notificationStore.initialFetchDone) return

  if (initialStockHandled) {
    if (newLen > oldLen) {
      toast.add({
        severity: 'warn',
        summary: 'Kam qolgan tovarlar',
        detail: `${newLen} ta mahsulot qoldig'i kamaygan!`,
        life: 7000
      })
    }
    return
  }

  // Initial session check
  if (newLen > 0) {
    initialStockHandled = true
    if (!sessionStorage.getItem('session_notified_stock')) {
      toast.add({
        severity: 'warn',
        summary: 'Kam qolgan tovarlar',
        detail: `${newLen} ta mahsulot qoldig'i kamaygan!`,
        life: 7000
      })
      sessionStorage.setItem('session_notified_stock', 'true')
    }
  }
}

// Watch for unread announcements to show toast
watch(() => notificationStore.unreadCount, handleAnnouncements)

// Watch for low stock — more specific toast
watch(() => notificationStore.lowStockItems.length, handleLowStock)

// Handle initial load once all data is present
watch(() => notificationStore.initialFetchDone, (done) => {
  if (done) {
    handleAnnouncements(notificationStore.unreadCount, 0)
    handleLowStock(notificationStore.lowStockItems.length, 0)
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('rate-limit-error', handleRateLimitError)
  notificationStore.startPolling()
})

onUnmounted(() => {
  window.removeEventListener('rate-limit-error', handleRateLimitError)
  notificationStore.stopPolling()
})

/* --- Logout with confirmation --- */
const isConfirmingLogout = ref(false)
const isCalculatorOpen = ref(false)

const handleLogout = () => {
  if (isConfirmingLogout.value) return
  isConfirmingLogout.value = true
  showProfileDialog.value = false
  
  confirm.require({
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
