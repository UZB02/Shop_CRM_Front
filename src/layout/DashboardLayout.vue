<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
    <Toast />

    <!-- ===== MOBILE OVERLAY ===== -->
    <Transition name="overlay">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- ===== SIDEBAR ===== -->
    <!--
      Mobile:  fixed, initially -translate-x-full, slides in on sidebarOpen
      Desktop: fixed, always translate-x-0, width toggles 64 ↔ 16
    -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col
             bg-white dark:bg-slate-900
             border-r border-slate-200 dark:border-slate-800
             transition-[transform,width] duration-300 ease-in-out
             w-64"
      :class="{
        '-translate-x-full': !sidebarOpen,
        'translate-x-0 shadow-2xl': sidebarOpen,
        'lg:translate-x-0': true,
        'lg:w-16': !sidebarOpen && desktopCollapsed,
        'lg:w-64': !desktopCollapsed,
      }"
    >
      <!-- Logo row -->
      <div class="h-16 flex items-center justify-between px-4
                  border-b border-slate-100 dark:border-slate-800 flex-shrink-0 overflow-hidden">
        <span
          class="text-xl font-black text-emerald-500 whitespace-nowrap transition-all duration-200"
          :class="desktopCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'"
        >
          Shop Searem
        </span>

        <!-- Desktop collapse btn (icon only) -->
        <button
          class="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center
                 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50
                 dark:hover:bg-emerald-900/20 transition-all ml-auto flex-shrink-0"
          @click="desktopCollapsed = !desktopCollapsed"
        >
          <i :class="desktopCollapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'" class="text-xs" />
        </button>

        <!-- Mobile close btn -->
        <button
          class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center
                 text-slate-400 hover:text-slate-600 dark:hover:text-white
                 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ml-auto flex-shrink-0"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-times text-xs" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <RouterLink
          v-for="item in filteredMenu"
          :key="item.key"
          :to="item.to"
          v-tooltip.right="desktopCollapsed ? item.label : null"
          class="flex items-center px-3 py-2.5 rounded-xl
                 text-slate-600 dark:text-slate-400
                 hover:bg-emerald-50 hover:text-emerald-600
                 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400
                 transition-all duration-200 group overflow-hidden relative"
          :class="[
            desktopCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3',
            (item.to === '/dashboard' ? route.path === '/dashboard' : route.path.startsWith(item.to))
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 font-semibold shadow-sm animate-in fade-in duration-300'
              : ''
          ]"
          @click="sidebarOpen = false"
        >
          <i :class="[item.icon, 'text-base group-hover:scale-110 transition-transform flex-shrink-0 relative z-10']" />
          <span
            class="text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden"
            :class="desktopCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'"
          >
            {{ item.label }}
          </span>
        </RouterLink>
      </nav>

      <!-- User Card -->
      <div class="p-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all duration-300"
           :class="desktopCollapsed ? 'lg:p-2' : 'p-3'">
        <div
          class="flex items-center rounded-2xl
                 bg-slate-50 dark:bg-slate-800/40
                 hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                 border border-slate-100 dark:border-slate-800/50
                 hover:border-emerald-200 dark:hover:border-emerald-800/50
                 cursor-pointer transition-all group overflow-hidden relative"
          :class="desktopCollapsed ? 'justify-center p-0 h-10' : 'gap-3 px-3 py-2.5'"
          @click="showProfileDialog = true"
          v-tooltip.right="desktopCollapsed ? user?.username : null"
        >
          <Avatar
            icon="pi pi-user"
            shape="circle"
            class="!w-8 !h-8 bg-white dark:bg-slate-700
                   text-emerald-600 shadow-sm
                   transition-transform group-hover:scale-110 flex-shrink-0 z-10"
          />
          <div
            v-if="!desktopCollapsed"
            class="flex-1 min-w-0 transition-all duration-300"
          >
            <p class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{{ user?.username }}</p>
            <p class="text-[10px] uppercase font-bold text-slate-400 truncate tracking-wider">
              {{ user?.worker?.role_display || 'Xodim' }}
            </p>
          </div>
          <Button
            v-if="!desktopCollapsed"
            icon="pi pi-sign-out"
            text severity="secondary" size="small"
            class="!w-8 !h-8 flex-shrink-0 z-10
                   hover:!bg-rose-50 hover:!text-rose-500
                   dark:hover:!bg-rose-900/30 transition-all"
            @click.stop="handleLogout"
          />
        </div>
      </div>

      <UserProfileDialog v-model:visible="showProfileDialog" :user="user" @logout="handleLogout" />
    </aside>

    <!-- Global Confirmation Dialog -->
    <ConfirmDialog />

    <!-- ===== MAIN AREA ===== -->
    <!--
      Mobile: ml-0 (sidebar overlays)
      Desktop: ml-64 normal | ml-16 when collapsed
    -->
    <div
      class="flex flex-col flex-1 min-h-screen min-w-0
             transition-[margin] duration-300 ease-in-out
             ml-0"
      :class="{ 'lg:ml-16': desktopCollapsed, 'lg:ml-64': !desktopCollapsed }"
    >
      <!-- TOP HEADER -->
      <header
        class="h-16 sticky top-0 z-30
               bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
               border-b border-slate-200 dark:border-slate-800
               flex items-center gap-3 px-4 md:px-6"
      >
        <!-- Hamburger (mobile only) -->
        <button
          class="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                 text-slate-500 hover:text-slate-700 dark:hover:text-white
                 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          @click="sidebarOpen = true"
        >
          <i class="pi pi-bars text-sm" />
        </button>

        <!-- Page title -->
        <h2 class="text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
          {{ currentPageTitle }}
        </h2>

        <!-- Subscription warning strip (md+) -->
        <div
          v-if="subscriptionWarning"
          class="hidden md:flex items-center gap-2 ml-4 mr-auto
                 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800
                 text-amber-700 dark:text-amber-400
                 px-3 py-1.5 rounded-lg text-xs font-medium"
        >
          <i class="pi pi-exclamation-triangle text-amber-500" />
          <span class="truncate max-w-xs">{{ subscriptionWarning }}</span>
          <button
            class="ml-2 underline underline-offset-2 text-amber-600 hover:text-amber-800 font-semibold whitespace-nowrap"
            @click="router.push('/dashboard/subscription')"
          >
            {{ $t('common.pay') }} →
          </button>
        </div>

        <!-- Right icons -->
        <div class="flex items-center gap-3 ml-auto flex-shrink-0">
          <!-- Language Switcher -->
          <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
            <button 
              v-for="l in [{c:'uz', n:'LOT'}, {c:'uz_cy', n:'КРИ'}]" 
              :key="l.c"
              @click="setLang(l.c)"
              class="px-2 py-1 rounded-md text-[9px] font-black transition-all duration-300 border-none cursor-pointer"
              :class="locale === l.c ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-transparent'"
            >
              {{ l.n }}
            </button>
          </div>

          <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <!-- Dark / Light Mode Toggle -->
            <button
              @click="toggleTheme"
              class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden
                     bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                     border border-slate-200 dark:border-slate-700
                     text-slate-500 dark:text-amber-400
                     hover:scale-110 active:scale-95"
              :title="isDark ? 'Light mode' : 'Dark mode'"
            >
              <Transition name="theme-icon" mode="out-in">
                <i v-if="isDark" key="sun" class="pi pi-sun text-sm text-amber-400" />
                <i v-else key="moon" class="pi pi-moon text-sm text-slate-500" />
              </Transition>
            </button>
            <Button icon="pi pi-bell" text rounded severity="secondary" class="!w-9 !h-9" />
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main class="flex-1 p-4 sm:p-5 lg:p-6 lg:pt-4 min-w-0">

        <!-- Subscription warning (mobile) -->
        <div
          v-if="subscriptionWarning"
          class="md:hidden mb-4 p-3 rounded-xl
                 bg-amber-50 dark:bg-amber-900/20
                 border border-amber-200 dark:border-amber-800
                 text-amber-700 dark:text-amber-400 text-sm"
        >
          <div class="flex items-start gap-2">
            <i class="pi pi-exclamation-triangle mt-0.5 flex-shrink-0" />
            <span>{{ subscriptionWarning }}</span>
          </div>
          <button
            class="mt-2 w-full py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40
                   text-amber-800 dark:text-amber-300 font-semibold text-xs"
            @click="router.push('/dashboard/subscription')"
          >
            {{ $t('common.pay_action') }} →
          </button>
        </div>

        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Avatar   from 'primevue/avatar'
import Button   from 'primevue/button'
import Toast    from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast }    from 'primevue/usetoast'
import { useConfirm }  from 'primevue/useconfirm'
import { useAuthStore } from '@/store/auth'
import UserProfileDialog from '@/components/UserProfileDialog.vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const toast     = useToast()
const confirm   = useConfirm()
const { t, locale } = useI18n()

/* --- UI state --- */
const sidebarOpen       = ref(false)   // mobile drawer
const desktopCollapsed  = ref(false)   // desktop icon-only mode
const showProfileDialog = ref(false)
const subscriptionWarning = ref('')

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

/* --- Language --- */
const setLang = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

/* --- User --- */
const user = computed(() => authStore.user)

/* --- Close sidebar on route change (mobile) --- */
const unwatch = useRoute()
// Close sidebar whenever route changes on mobile
let lastPath = route.path
const closeOnNav = () => { sidebarOpen.value = false }

/* --- Subscription --- */
const checkSubscriptionStatus = () => {
  if (authStore.user?.subscription?.status === 'warning') {
    subscriptionWarning.value = t('common.subscription_warning') || "Obuna muddati tugagan. 3 kun ichida to'lov qiling."
  }
}
const handleSubscriptionWarning = (e) => {
  subscriptionWarning.value = e.detail
  toast.add({ 
    severity: 'warn', 
    summary: t('common.subscription_warning_title') || 'Obuna Ogohlantirishi', 
    detail: e.detail || t('common.subscription_warning'), 
    life: 10000 
  })
  if (authStore.user?.subscription) authStore.user.subscription.status = 'warning'
}

/* --- Escape key closes sidebar --- */
const onKeydown = (e) => { if (e.key === 'Escape') sidebarOpen.value = false }

onMounted(() => {
  initTheme()
  window.addEventListener('subscription-warning', handleSubscriptionWarning)
  window.addEventListener('keydown', onKeydown)
  checkSubscriptionStatus()
})
onUnmounted(() => {
  window.removeEventListener('subscription-warning', handleSubscriptionWarning)
  window.removeEventListener('keydown', onKeydown)
})

/* --- Menu --- */
const menuItems = computed(() => [
  { label: t('menu.dashboard'),    icon: 'pi pi-home',          to: '/dashboard',            key: 'dashboard' },
  { label: t('menu.sales'),        icon: 'pi pi-calculator',    to: '/dashboard/pos',        key: 'pos'       },
  { label: t('menu.stores'),       icon: 'pi pi-shop',          to: '/dashboard/stores',     key: 'stores'    },
  { label: t('menu.inventory'),    icon: 'pi pi-database',      to: '/dashboard/warehouse',  key: 'warehouse' },
  { label: t('menu.products'),     icon: 'pi pi-tag',           to: '/dashboard/products',   key: 'products'  },
  { label: t('menu.workers'),      icon: 'pi pi-users',         to: '/dashboard/workers',    key: 'workers'   },
  { label: t('menu.trades'),       icon: 'pi pi-shopping-cart', to: '/dashboard/trades',     key: 'trades'    },
  { label: t('menu.reports'),      icon: 'pi pi-wallet',        to: '/dashboard/expenses',   key: 'expenses'  },
  { label: t('menu.customers'),    icon: 'pi pi-id-card',       to: '/dashboard/customers',  key: 'customers' },
  { label: t('menu.settings'),     icon: 'pi pi-cog',           to: '/dashboard/settings',   key: 'settings'  },
])

const filteredMenu = computed(() => menuItems.value.filter(i => authStore.hasAccess(i.key)))

const currentPageTitle = computed(() => {
  const item = menuItems.value.find(i => route.path.startsWith(i.to) && i.to !== '/dashboard')
             ?? menuItems.value.find(i => i.to === '/dashboard')
  return item?.label ?? t('menu.dashboard')
})

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
/* Overlay fade */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.25s ease; }
.overlay-enter-from, .overlay-leave-to        { opacity: 0; }

/* Prevent body scroll when mobile sidebar is open */
:global(body:has(.sidebar-open)) { overflow: hidden; }

/* Theme icon transition */
.theme-icon-enter-active,
.theme-icon-leave-active { transition: all 0.2s ease; }
.theme-icon-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.5); }
.theme-icon-leave-to     { opacity: 0; transform: rotate(90deg) scale(0.5); }
</style>
