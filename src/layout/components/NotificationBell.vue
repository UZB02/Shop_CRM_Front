<template>
  <div class="relative">
    <button
      @click="toggle"
      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative
             text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 
             hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
      v-tooltip.bottom="'Bildirishnomalar'"
    >
      <i class="pi pi-bell text-base" />
      <span 
        v-if="store.unreadCount > 0" 
        class="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse select-none transition-all duration-300"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </span>
    </button>

    <Popover ref="op" class="!border-none !shadow-2xl !bg-transparent">
        <div class="w-80 sm:w-96 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <!-- Header -->
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <i class="pi pi-bell text-emerald-500 text-xs" />
                    Bildirishnomalar
                </h3>
                <div class="flex items-center gap-2">
                    <span v-if="store.unreadCount > 0" class="text-[11px] px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-bold tracking-wider">
                        {{ store.unreadCount }}
                    </span>
                    <button 
                        @click="op.hide()" 
                        class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        v-tooltip.bottom="'Yopish'"
                    >
                        <i class="pi pi-times text-sm" />
                    </button>
                </div>
            </div>

            <!-- List -->
            <div class="max-h-[min(450px,70vh)] overflow-y-auto custom-scrollbar">
                <div v-if="notifications.length === 0" class="p-10 text-center flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <i class="pi pi-bell-slash text-2xl text-slate-300 dark:text-slate-600" />
                    </div>
                    <p class="text-slate-400 text-sm">Hozircha xabarlar yo'q</p>
                </div>
                
                <div 
                    v-for="item in notifications" 
                    :key="item.id" 
                    class="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer relative group"
                    @click="handleItemClick(item)"
                    :class="{ 'bg-emerald-50/30 dark:bg-emerald-500/5': !item.read }"
                >
                    <div class="flex gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                            <div :class="[ 
                                'w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-sm',
                                getSeverityClass(getSeverity(item))
                            ]">
                                <i :class="getIcon(item.type, getSeverity(item))" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2">
                                <h4 class="text-[15px] font-bold text-slate-700 dark:text-slate-200 mb-0.5 truncate group-hover:text-emerald-500 transition-colors">
                                    {{ item.title }}
                                </h4>
                                <div class="flex items-center gap-2 flex-shrink-0 mt-1">
                                    <button 
                                        v-if="!item.read" 
                                        @click.stop="store.markItemAsRead(item)"
                                        class="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300"
                                        v-tooltip.left="'O\'qilgan deb belgilash'"
                                    >
                                        <i class="pi pi-check text-[12px]" />
                                    </button>
                                    <span v-if="!item.read" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <p class="text-[13px] text-slate-500 dark:text-slate-400 leading-tight mb-1 line-clamp-2">
                                {{ item.body }}
                            </p>
                            <div class="flex items-center gap-3">
                                <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                    <i class="pi pi-clock text-[10px]" />
                                    {{ item.time }}
                                </span>
                                <span v-if="item.link" class="text-[11px] font-bold text-emerald-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ko'rish <i class="pi pi-arrow-right text-[9px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="store.unreadCount > 0" class="p-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  @click="store.markAsRead()"
                  class="w-full py-2 rounded-xl text-xs font-bold text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-transparent transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <i class="pi pi-check-circle" />
                    Barchasini o'qilgan deb belgilash
                </button>
            </div>
        </div>
    </Popover>

    <!-- Custom Premium Modal -->
    <Teleport to="body">
        <Transition name="fade-scale">
            <div v-if="showDetailModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div @click="showDetailModal = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                
                <!-- Modal Content -->
                <div class="relative w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 dark:border-slate-800 transition-all duration-500">
                    
                    <!-- Close Button (Top Right) -->
                    <button 
                        @click="showDetailModal = false"
                        class="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white dark:text-slate-400 flex items-center justify-center transition-all duration-300 z-10 group"
                    >
                        <i class="pi pi-times text-lg group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <div v-if="selectedNotification" class="p-8">
                        <!-- Header Section -->
                        <div class="flex items-center gap-4 mb-8">
                            <div :class="[
                                'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-current/10',
                                getSeverityClass(getSeverity(selectedNotification))
                            ]">
                                <i :class="getIcon(selectedNotification.type)" />
                            </div>
                            <div>
                                <span class="text-[12px] font-black tracking-[0.2em] text-emerald-500 mb-1 block">
                                    {{ selectedNotification.type_display || selectedNotification.source }}
                                </span>
                                <div class="text-[12px] font-bold text-slate-400">
                                    XABAR #{{ selectedNotification.id }}
                                </div>
                            </div>
                        </div>

                        <!-- Content Section -->
                        <div class="space-y-6">
                            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                                {{ selectedNotification.title }}
                            </h2>
                            
                            <div class="relative">
                                <div class="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full" />
                                <div class="text-[16px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {{ selectedNotification.message || selectedNotification.body }}
                                </div>
                            </div>
                        </div>

                        <!-- Footer / Meta -->
                        <div class="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div class="flex items-center gap-4 text-xs font-bold text-slate-400 tracking-widest">
                                <span v-if="selectedNotification.time" class="flex items-center gap-2">
                                    <i class="pi pi-clock opacity-50" />
                                    {{ selectedNotification.time }}
                                </span>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <div class="mt-8 flex flex-col gap-3">
                            <button 
                                v-if="selectedNotification.link"
                                @click="router.push(selectedNotification.link); showDetailModal = false; op.hide()"
                                class="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-[0_12px_24px_-6px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <i class="pi pi-external-link" />
                                BATAFSIL KO'RISH
                            </button>
                            <button 
                                @click="showDetailModal = false"
                                class="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-black text-sm transition-all active:scale-[0.98]"
                            >
                                YOPISH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notifications'
import Popover from 'primevue/popover'

const store = useNotificationStore()
const router = useRouter()
const op = ref()

const showDetailModal = ref(false)
const selectedNotification = ref(null)

const notifications = computed(() => store.allNotifications)

const toggle = (event) => {
    op.value.toggle(event)
}

// Backend mantiqi bo'yicha severity (rang) aniqlash
const getSeverity = (item) => {
    if (item.severity) return item.severity

    // 1. Tizim Bildirishnomalari (Notification)
    if (item.source === 'notification') {
        if (item.type === 'subscription_expired') return 'error'
        if (item.type === 'subscription_expiry' || item.type === 'low_stock') return 'warn'
    } 
    
    // 2. Announcement (Admin xabarlari)
    if (item.source === 'announcement') {
        if (item.type === 'warning' || item.type === 'maintenance') return 'warn'
        if (item.type === 'new_feature') return 'success'
        if (item.type === 'info') return 'info'
    }

    return 'info'
}

const getSeverityClass = (sev) => {
    switch(sev) {
        case 'error':   return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
        case 'warn':    return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
        case 'success': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        default:        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    }
}

const getIcon = (type) => {
    switch(type) {
        // Tizim
        case 'low_stock':            return 'pi pi-exclamation-triangle'
        case 'subscription_expiry':  return 'pi pi-clock'
        case 'subscription_expired': return 'pi pi-ban'
        
        // Announcement
        case 'info':                 return 'pi pi-info-circle'
        case 'warning':              return 'pi pi-megaphone'
        case 'maintenance':          return 'pi pi-wrench'
        case 'new_feature':          return 'pi pi-sparkles'
        
        default:                     return 'pi pi-bell'
    }
}

const handleItemClick = async (item) => {
    selectedNotification.value = item
    showDetailModal.value = true
    
    if (!item.read) {
        await store.markItemAsRead(item)
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.1);
    border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.2);
}

/* Modal Animations */
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    backdrop-filter: blur(0px);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
    backdrop-filter: blur(12px);
}
</style>


