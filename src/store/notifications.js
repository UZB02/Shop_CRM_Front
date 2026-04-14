import { defineStore } from 'pinia'
import { announcementsAPI, productsAPI, subscriptionAPI } from '../services/api'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        announcements: [],
        lowStockItems: [],
        subscription: null,
        intervals: {
            announcements: null,
            lowStock: null,
            subscription: null
        },
        loading: {
            announcements: false,
            lowStock: false,
            subscription: false
        }
    }),

    getters: {
        unreadCount: (state) => {
            const announcementsUnread = Array.isArray(state.announcements) 
                ? state.announcements.filter(a => !a.is_read).length 
                : 0
            
            const lowStockUnread = Array.isArray(state.lowStockItems) && state.lowStockItems.length > 0 ? 1 : 0
            
            const subscriptionUnread = (state.subscription && state.subscription.days_left <= 10) ? 1 : 0
            
            return announcementsUnread + lowStockUnread + subscriptionUnread
        },
        isSubscriptionExpired: (state) => state.subscription?.status === 'expired',
        daysLeft: (state) => state.subscription?.days_left ?? 0,
        hasLowStock: (state) => Array.isArray(state.lowStockItems) && state.lowStockItems.length > 0,
        allNotifications: (state) => {
            const list = []
            
            // Add announcements safely
            if (Array.isArray(state.announcements)) {
                state.announcements.forEach(a => {
                    list.push({
                        id: `ann-${a.id}`,
                        originalId: a.id,
                        type: 'announcement',
                        title: a.title,
                        body: a.body,
                        date: a.created_at,
                        read: a.is_read,
                        severity: a.type === 'critical' ? 'error' : 'info'
                    })
                })
            }

            // Add individual low stock alerts safely
            if (Array.isArray(state.lowStockItems)) {
                state.lowStockItems.slice(0, 10).forEach(item => {
                    list.push({
                        id: `low-stock-${item.stock_id || item.product_id}`,
                        type: 'system',
                        title: item.product_name,
                        body: `${item.location_name}da qoldiq kamaygan: ${item.quantity} ${item.product_unit || 'dona'} (Limit: ${item.threshold})`,
                        date: new Date().toISOString(),
                        severity: 'warn',
                        read: false,
                        link: '/dashboard/products'
                    })
                })

                if (state.lowStockItems.length > 10) {
                    list.push({
                        id: 'low-stock-summary',
                        type: 'system',
                        title: 'Boshqa kam qolgan tovarlar',
                        body: `Yana ${state.lowStockItems.length - 10} ta mahsulotda qoldiq kamaygan.`,
                        severity: 'info',
                        read: false,
                        link: '/dashboard/products'
                    })
                }
            }

            // Add subscription status if critical
            if (state.subscription && state.subscription.days_left <= 10) {
                list.push({
                    id: 'sub-alert',
                    type: 'system',
                    title: 'Obuna muddati tugamoqda',
                    body: state.subscription.status === 'expired' 
                        ? 'Obuna muddati tugagan! Iltimos, to\'lov qiling.' 
                        : `Obuna tugashiga ${state.subscription.days_left} kun qoldi.`,
                    severity: state.subscription.status === 'expired' ? 'error' : 'warn',
                    read: false,
                    link: '/dashboard/subscription'
                })
            }

            return list.sort((a, b) => {
                const timeA = a.date ? new Date(a.date).getTime() : 0
                const timeB = b.date ? new Date(b.date).getTime() : 0
                return (timeB || 0) - (timeA || 0)
            })
        }
    },

    actions: {
        async fetchAnnouncements(silent = false) {
            if (!silent) this.loading.announcements = true
            try {
                const res = await announcementsAPI.getAll()
                this.announcements = Array.isArray(res.data) ? res.data : []
            } catch (err) {
                console.error('Announcements error:', err)
                this.announcements = []
            } finally {
                this.loading.announcements = false
            }
        },

        async fetchLowStock(silent = false) {
            if (!silent) this.loading.lowStock = true
            try {
                const res = await productsAPI.getLowStock()
                this.lowStockItems = Array.isArray(res.data) ? res.data : []
            } catch (err) {
                console.error('Low stock error:', err)
                this.lowStockItems = []
            } finally {
                this.loading.lowStock = false
            }
        },

        async fetchSubscription(silent = false) {
            if (!silent) this.loading.subscription = true
            try {
                const res = await subscriptionAPI.getStatus()
                this.subscription = res.data || null
            } catch (err) {
                console.error('Subscription error:', err)
            } finally {
                this.loading.subscription = false
            }
        },

        async markAsRead(id) {
            try {
                await announcementsAPI.markRead(id)
                const ann = this.announcements.find(a => a.id === id)
                if (ann && !ann.is_read) {
                    ann.is_read = true
                }
            } catch (err) {
                console.error('Mark as read error:', err)
            }
        },

        startPolling() {
            this.stopPolling()
            
            console.log('🔔 Notification polling started')
            
            this.fetchAnnouncements()
            this.fetchLowStock()
            this.fetchSubscription()

            this.intervals.announcements = setInterval(() => {
                if (document.visibilityState === 'visible') this.fetchAnnouncements(true)
            }, 5 * 60 * 1000)

            this.intervals.lowStock = setInterval(() => {
                if (document.visibilityState === 'visible') this.fetchLowStock(true)
            }, 60 * 1000)

            this.intervals.subscription = setInterval(() => {
                if (document.visibilityState === 'visible') this.fetchSubscription(true)
            }, 10 * 60 * 1000)
        },

        stopPolling() {
            if (this.intervals.announcements) clearInterval(this.intervals.announcements)
            if (this.intervals.lowStock) clearInterval(this.intervals.lowStock)
            if (this.intervals.subscription) clearInterval(this.intervals.subscription)
            
            this.intervals = { announcements: null, lowStock: null, subscription: null }
            console.log('🔕 Notification polling stopped')
        }
    }
})
