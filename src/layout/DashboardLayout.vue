<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
    <Toast />
    <ConfirmDialog />

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
        v-model:locale="locale"
        :current-page-title="currentPageTitle"
        :subscription-warning="subscriptionWarning"
        :is-dark="isDark"
        :is-fullscreen="isFullscreen"
        @toggleTheme="toggleTheme"
        @toggleFullscreen="toggleFullscreen"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useDashboardLayout } from './composables/useDashboardLayout'

// Layout Components
import DashboardSidebar from './components/DashboardSidebar.vue'
import DashboardHeader from './components/DashboardHeader.vue'
import UserProfileDialog from '@/components/UserProfileDialog.vue'

const confirm = useConfirm()
const { 
  router, t, locale,
  sidebarOpen, desktopCollapsed, showProfileDialog, subscriptionWarning,
  isDark, toggleTheme,
  isFullscreen, toggleFullscreen,
  user, filteredMenu, currentPageTitle, authStore
} = useDashboardLayout()

/* --- Logout with confirmation --- */
const isConfirmingLogout = ref(false)
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
