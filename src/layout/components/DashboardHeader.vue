<template>
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
      @click="$emit('update:sidebarOpen', true)"
    >
      <i class="pi pi-bars text-sm" />
    </button>

    <!-- Page title -->
    <h2 class="text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
      {{ currentPageTitle }}
    </h2>

    <!-- Browser Navigation Controls (Back, Forward, Reload) -->
    <div class="hidden sm:flex items-center gap-0.5 ml-2 mr-auto border-l border-slate-200 dark:border-slate-800 pl-2">
      <button 
        @click="router.go(-1)"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
        v-tooltip.bottom="'Ortga'"
      >
        <i class="pi pi-arrow-left text-[10px]"></i>
      </button>
      <button 
        @click="router.go(1)"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
        v-tooltip.bottom="'Oldinga'"
      >
        <i class="pi pi-arrow-right text-[10px]"></i>
      </button>
      <button 
        @click="handleReload"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-95"
        v-tooltip.bottom="'Yangilash'"
      >
        <i class="pi pi-refresh text-[10px]" :class="{ 'animate-spin': isReloading }"></i>
      </button>
    </div>

    <!-- Subscription warning strip (md+) -->
    <div
      v-if="subscriptionWarning"
      class="hidden md:flex items-center gap-2 mr-auto
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
          @click="$emit('update:locale', l.c)"
          class="px-2 py-1 rounded-md text-[9px] font-black transition-all duration-300 border-none cursor-pointer"
          :class="locale === l.c ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-transparent'"
        >
          {{ l.n }}
        </button>
      </div>

      <div class="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
        <!-- Dark / Light Mode Toggle -->
        <button
          @click="$emit('toggleTheme')"
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

        <!-- Fullscreen Toggle -->
        <button
          v-tooltip.bottom="isFullscreen ? 'Kichraytirish' : 'To\'liq ekran'"
          @click="$emit('toggleFullscreen')"
          class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
        >
          <i class="text-sm" :class="isFullscreen ? 'pi pi-window-minimize text-emerald-500' : 'pi pi-window-maximize'"></i>
        </button>

        <Button icon="pi pi-bell" text rounded severity="secondary" class="!w-9 !h-9" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const isReloading = ref(false)

const handleReload = () => {
  isReloading.value = true
  setTimeout(() => {
    window.location.reload()
  }, 200)
}

defineProps({
  currentPageTitle: String,
  subscriptionWarning: String,
  locale: String,
  isDark: Boolean,
  isFullscreen: Boolean
})

defineEmits(['update:sidebarOpen', 'update:locale', 'toggleTheme', 'toggleFullscreen'])
</script>

<style scoped>
/* Theme icon transition */
.theme-icon-enter-active,
.theme-icon-leave-active { transition: all 0.2s ease; }
.theme-icon-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.5); }
.theme-icon-leave-to     { opacity: 0; transform: rotate(90deg) scale(0.5); }
</style>
