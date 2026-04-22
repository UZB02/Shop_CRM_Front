import { defineStore } from 'pinia'
import { notificationsAPI, subscriptionAPI, announcementsAPI } from '../services/api'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        items: [], 
        unreadCountFromBackend: 0,
        subscription: null, 
        usage: {
            branches: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            warehouses: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            workers: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            products: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true }
        },
        pollingTimer: null,
        loading: {
            notifications: false,
            subscription: false
        },
        initialFetchDone: false
    }),

    getters: {
        unreadCount: (state) => {
            // Backend dan kelgan unread_count ustivor, aks holda local filter
            return state.unreadCountFromBackend || (Array.isArray(state.items) ? state.items.filter(i => !i.is_read).length : 0)
        },
        isSubscriptionExpired: (state) => state.subscription?.status === 'expired',
        daysLeft: (state) => state.subscription?.days_left ?? 0,
        hasLowStock: (state) => Array.isArray(state.items) && state.items.some(i => i.type === 'low_stock' && !i.is_read),

        canAddBranch: (state) => state.usage?.branches?.can_add ?? true,
        canAddWarehouse: (state) => state.usage?.warehouses?.can_add ?? true,
        canAddWorker: (state) => state.usage?.workers?.can_add ?? true,
        canAddProduct: (state) => state.usage?.products?.can_add ?? true,

        allNotifications: (state) => {
            if (!Array.isArray(state.items)) return []
            
            // Backend formatini UI formatiga o'girish (Mapping)
            return state.items.map(item => {
                return {
                    ...item,
                    source: item.source || 'system',
                    read: item.is_read,                    // UI mask: item.read ishlatadi
                    date: item.time,                       // UI mask: item.date ishlatadi
                    body: item.message || item.body       // Backend 'message' yuboradi, UI 'body' kutadi
                }
            }).sort((a, b) => {
                const timeA = a.time ? new Date(a.time).getTime() : 0
                const timeB = b.time ? new Date(b.time).getTime() : 0
                return timeB - timeA
            })
        }
    },

    actions: {
        async fetchNotifications(silent = false) {
            if (!silent) this.loading.notifications = true
            try {
                const res = await notificationsAPI.getAll(null, silent ? { silent: true } : {})
                // Backend guide: { unread_count: 3, results: [...] }
                if (res.data) {
                    this.items = res.data.results || (Array.isArray(res.data) ? res.data : [])
                    this.unreadCountFromBackend = res.data.unread_count || 0
                }
                console.log('📦 Notifications loaded:', this.items.length, 'Unread:', this.unreadCountFromBackend)
            } catch (err) {
                console.error('❌ Fetch notifications error:', err)
            } finally {
                this.loading.notifications = false
            }
        },

        async fetchSubscription(silent = false) {
            if (!silent) this.loading.subscription = true
            try {
                const res = await subscriptionAPI.getStatus(silent ? { silent: true } : {})
                this.subscription = res.data || null
                if (res.data?.usage) {
                    this.usage = res.data.usage
                }
            } catch (err) {
                console.error('❌ Subscription stats error:', err)
            } finally {
                this.loading.subscription = false
            }
        },

        async markAsRead() {
            try {
                // Backend: POST /notifications/mark-read/ marks only source: "system"
                const res = await notificationsAPI.markRead()
                console.log('✅ Marked as read (system):', res.data)
                
                // Front-end state'ni yangilaymiz — faqat system xabarlarini
                this.items.forEach(item => {
                    if (item.source !== 'announcement') {
                        item.is_read = true
                    }
                })
                
                // Announcement'lar uchun alohida endpoint bo'lsa ham chaqirib qo'yamiz
                await announcementsAPI.markReadAll()
                this.items.forEach(item => {
                    if (item.source === 'announcement') {
                        item.is_read = true
                    }
                })

                this.unreadCountFromBackend = 0
            } catch (err) {
                console.error('❌ Mark all as read error:', err)
            }
        },

        async markItemAsRead(item) {
            if (!item || item.is_read) return
            try {
                if (item.source === 'announcement' && item.id) {
                    await announcementsAPI.markRead(item.id)
                    item.is_read = true
                } else {
                    // Tizim xabarlari uchun hozircha faqat global bor
                    await notificationsAPI.markRead()
                    this.items.forEach(i => { 
                        if (i.source !== 'announcement') i.is_read = true 
                    })
                }
                if (this.unreadCountFromBackend > 0) this.unreadCountFromBackend--
            } catch (err) {
                console.error('❌ Mark item as read error:', err)
            }
        },

        async startPolling() {
            this.stopPolling() // Har ehtimolga qarshi oldingisini to'xtatamiz
            
            this.initialFetchDone = false
            
            // Dastlabki yuklash
            await Promise.allSettled([
                this.fetchNotifications(),
                this.fetchSubscription()
            ])
            
            this.initialFetchDone = true

            // Polling boshlash (User xohishiga ko'ra 60 soniya)
            console.log('⏱️ Starting notification polling (60s)...')
            this.pollingTimer = setInterval(async () => {
                await Promise.allSettled([
                    this.fetchNotifications(true),
                    this.fetchSubscription(true)
                ])
            }, 60000)
        },

        stopPolling() {
            if (this.pollingTimer) {
                console.log('🛑 Stopping notification polling.')
                clearInterval(this.pollingTimer)
                this.pollingTimer = null
            }
        },

        reset() {
            this.stopPolling()
            this.items = []
            this.unreadCountFromBackend = 0
            this.subscription = null
            this.usage = {
                branches: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
                warehouses: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
                workers: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
                products: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true }
            }
            this.loading = { notifications: false, subscription: false }
            this.initialFetchDone = false
        }
    }
})
