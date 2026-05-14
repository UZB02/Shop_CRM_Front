import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useSettingsStore } from '@/store/settings'
import { useNotificationStore } from '@/store/notifications'

export function useDashboardLayout() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  const { t, locale } = useI18n()

  /* --- UI state --- */
  const sidebarOpen = ref(false)   // mobile drawer
  const desktopCollapsed = ref(false)   // desktop icon-only mode
  const showProfileDialog = ref(false)

  const subscriptionWarning = computed(() => {
    if (!notificationStore.subscription) return ''
    if (notificationStore.isSubscriptionExpired) return t('common.subscription_expired') || 'Obuna muddati tugagan!'
    const daysLeft = notificationStore.daysLeft
    if (daysLeft <= 10) return t('common.subscription_warning_days', { days: daysLeft }) || `Obuna tugashiga ${daysLeft} kun qoldi.`
    return ''
  })

  /* --- Dark / Light Mode --- */
  const isDark = ref(false)
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = saved ? saved === 'dark' : prefersDark
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /* --- Fullscreen --- */
  const isFullscreen = ref(false)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }
  const onFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }

  /* --- Language --- */
  const setLang = (lang) => {
    locale.value = lang
    localStorage.setItem('lang', lang)
  }

  /* --- User --- */
  const user = computed(() => authStore.user)

  /* --- Escape key closes sidebar --- */
  const onKeydown = (e) => { if (e.key === 'Escape') sidebarOpen.value = false }

  onMounted(() => {
    initTheme()
    window.addEventListener('keydown', onKeydown)
    document.addEventListener('fullscreenchange', onFullscreenChange)

    // Initialize global settings (faqat birinchi marta fetch qilinadi)
    if (!settingsStore.initialized) {
      settingsStore.fetchSettings()
    }
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  })

  /* --- Menu --- */
  const settingsStore = useSettingsStore()

  const menuItems = computed(() => {
    const list = [
      { label: t('menu.dashboard'), icon: 'pi pi-home', to: '/dashboard', key: 'dashboard' },
      { label: t('menu.sales'), icon: 'pi pi-calculator', to: '/dashboard/pos', key: 'pos' },
      { label: t('menu.stores'), icon: 'pi pi-shop', to: '/dashboard/stores', key: 'stores' },
      { label: t('menu.inventory'), icon: 'pi pi-box', to: '/dashboard/warehouse', key: 'warehouse' },
      { label: t('menu.products'), icon: 'pi pi-tag', to: '/dashboard/products', key: 'products' },
      { label: t('menu.workers'), icon: 'pi pi-users', to: '/dashboard/workers', key: 'workers' },
      { label: t('menu.trades'), icon: 'pi pi-shopping-cart', to: '/dashboard/trades', key: 'trades' },
      { label: t('menu.finance'), icon: 'pi pi-wallet', to: '/dashboard/finance', key: 'moliya' },
      { label: t('menu.customers'), icon: 'pi pi-id-card', to: '/dashboard/customers', key: 'customers' },
      { label: t('menu.settings'), icon: 'pi pi-cog', to: '/dashboard/settings', key: 'settings' },
      { label: t('menu.subscription'), icon: 'pi pi-verified', to: '/dashboard/subscription', key: 'subscription' },
    ]
    return list
  })

  const filteredMenu = computed(() => {
    return menuItems.value.filter(item => {
      // 1. Permission Check
      if (!authStore.hasAccess(item.key)) return false
      return true
    })
  })

  const currentPageTitle = computed(() => {
    const item = menuItems.value.find(i => route.path.startsWith(i.to) && i.to !== '/dashboard')
      ?? menuItems.value.find(i => i.to === '/dashboard')
    return item?.label ?? t('menu.dashboard')
  })

  return {
    router, route, authStore, t, locale,
    sidebarOpen, desktopCollapsed, showProfileDialog, subscriptionWarning,
    isDark, toggleTheme,
    isFullscreen, toggleFullscreen,
    setLang, user,
    filteredMenu, currentPageTitle
  }
}


