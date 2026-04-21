import { defineStore } from 'pinia'
import { notificationsAPI, subscriptionAPI, announcementsAPI } from '../services/api'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        items: [], 
        subscription: null, 
        usage: {
            branches: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            warehouses: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            workers: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            products: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true }
        },
        eventSource: null,
        loading: {
            notifications: false,
            subscription: false
        },
        initialFetchDone: false
    }),

    getters: {
        unreadCount: (state) => {
            return Array.isArray(state.items) ? state.items.filter(i => !i.is_read).length : 0
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
                const source = item.source || item.event || 'notification'
                return {
                    ...item,
                    source: source,
                    read: item.is_read,      // UI mask: item.read ishlatadi
                    date: item.time,         // UI mask: item.date ishlatadi
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
                const res = await notificationsAPI.getAll()
                // Rasmga ko'ra: { unread_count: 1, results: [...] }
                if (res.data?.results) {
                    this.items = res.data.results
                } else if (Array.isArray(res.data)) {
                    this.items = res.data
                } else {
                    this.items = []
                }
                console.log('📦 Notifications loaded:', this.items.length)
            } catch (err) {
                console.error('❌ Fetch notifications error:', err)
                this.items = []
            } finally {
                this.loading.notifications = false
            }
        },

        async fetchSubscription(silent = false) {
            if (!silent) this.loading.subscription = true
            try {
                const res = await subscriptionAPI.getStatus()
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

        setupSSE() {
            this.stopSSE()

            const token = localStorage.getItem('access_token') || localStorage.getItem('token')
            if (!token) return

            const url = notificationsAPI.getStreamUrl(token)
            console.log('📡 SSE connecting to:', url)
            
            try {
                this.eventSource = new EventSource(url)

                this.eventSource.onmessage = (e) => {
                    try {
                        const data = JSON.parse(e.data)
                        
                        // Heartbeat va connected — ignore
                        if (data.event === 'heartbeat' || data.event === 'connected') return

                        console.log('🔔 Received SSE event:', data.event, data)

                        // SSE dan kelgan 'event'ni 'source' sifatida saqlaymiz, 
                        // chunki HTTP dan 'source' bo'lib keladi.
                        if (data.event === 'notification' || data.event === 'announcement') {
                            const newItem = {
                                ...data,
                                source: data.event,
                                is_read: data.is_read !== undefined ? data.is_read : false,
                                time: data.time || new Date().toISOString()
                            }
                            
                            // Dublikatni tekshirish
                            const exists = newItem.id ? this.items.find(i => i.id === newItem.id) : false
                            if (!exists) {
                                this.items.unshift(newItem)
                            }
                        }

                        // Obuna holati o'zgarsa statistikani yangilash
                        if (data.event === 'subscription_update') {
                            this.fetchSubscription(true)
                        }
                    } catch (err) {
                        console.error('❌ SSE message parse error:', err)
                    }
                }

                this.eventSource.onerror = (err) => {
                    console.warn('⚠️ SSE Connection error (automatic retry by browser)', err)
                }

            } catch (err) {
                console.error('❌ SSE Setup error:', err)
            }
        },

        stopSSE() {
            if (this.eventSource) {
                this.eventSource.close()
                this.eventSource = null
            }
        },

        async markAsRead() {
            try {
                // Ham tizim, ham e'lonlarni bir vaqtda o'qilgan deb belgilaymiz
                await Promise.allSettled([
                    notificationsAPI.markRead(),
                    announcementsAPI.markReadAll()
                ])
                
                // Front-end state'ni yangilaymiz
                this.items.forEach(item => {
                    item.is_read = true
                })
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
                    this.items.forEach(i => { i.is_read = true })
                }
            } catch (err) {
                console.error('❌ Mark item as read error:', err)
            }
        },

        async startPolling() {
            this.initialFetchDone = false
            await Promise.allSettled([
                this.fetchNotifications(),
                this.fetchSubscription()
            ])
            this.setupSSE()
            this.initialFetchDone = true
        },

        stopPolling() {
            this.stopSSE()
        },

        reset() {
            this.stopSSE()
            this.items = []
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
