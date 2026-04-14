<template>
  <div class="relative">
    <button
      @click="toggle"
      class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative
             text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 
             hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
      v-tooltip.bottom="'Bildirishnomalar'"
    >
      <i class="pi pi-bell text-sm" />
      <span 
        v-if="store.unreadCount > 0" 
        class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse"
      >
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
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
                <span v-if="store.unreadCount > 0" class="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-bold uppercase tracking-wider">
                    {{ store.unreadCount }}
                </span>
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
                    :class="{ 'bg-emerald-50/30 dark:bg-emerald-500/5': !item.read && item.type === 'announcement' }"
                >
                    <div class="flex gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                            <div :class="[ 
                                'w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-sm',
                                getSeverityClass(item.severity)
                            ]">
                                <i :class="getIcon(item.type, item.severity)" />
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2">
                                <h4 class="text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-0.5 truncate group-hover:text-emerald-500 transition-colors">
                                    {{ item.title }}
                                </h4>
                                <span v-if="!item.read && item.type === 'announcement'" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse mt-1.5" />
                            </div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-1 line-clamp-2">
                                {{ item.body }}
                            </p>
                            <div class="flex items-center gap-3">
                                <span class="text-[9px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                    <i class="pi pi-clock text-[8px]" />
                                    {{ formatTime(item.date) }}
                                </span>
                                <span v-if="item.link" class="text-[9px] font-bold text-emerald-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ko'rish <i class="pi pi-arrow-right text-[7px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="notifications.length > 0" class="p-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  @click="store.fetchAnnouncements()"
                  class="w-full py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all active:scale-[0.98]"
                >
                    Barchasini yangilash
                </button>
            </div>
        </div>
    </Popover>
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

const notifications = computed(() => store.allNotifications)

const toggle = (event) => {
    op.value.toggle(event)
}

const getSeverityClass = (sev) => {
    switch(sev) {
        case 'error': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
        case 'warn': return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
        case 'success': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        default: return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    }
}

const getIcon = (type, severity) => {
    switch(type) {
        case 'announcement': return 'pi pi-megaphone'
        case 'stock': return 'pi pi-shopping-cart'
        case 'subscription': return 'pi pi-shield' // Or 'pi pi-credit-card'
        default: 
            if (severity === 'error') return 'pi pi-exclamation-circle'
            return 'pi pi-info-circle'
    }
}

const formatTime = (dateStr) => {
    if (!dateStr) return 'Yaqunda'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Hozirgina'
    if (diff < 3600000) return Math.floor(diff/60000) + ' daqiqa oldin'
    if (diff < 86400000) return Math.floor(diff/3600000) + ' soat oldin'
    
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
}

const handleItemClick = async (item) => {
    if (item.type === 'announcement' && !item.read) {
        await store.markAsRead(item.originalId)
    }
    
    if (item.link) {
        router.push(item.link)
        op.value.hide()
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
</style>
