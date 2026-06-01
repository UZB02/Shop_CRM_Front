import { defineStore } from 'pinia'
import { notificationsAPI, subscriptionAPI, announcementsAPI } from '../services/api'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        items: [], 
        unreadCountFromBackend: 0,
        locallyReadIds: JSON.parse(localStorage.getItem('locallyReadNotificationIds') || '[]'),
        subscription: null, 
        usage: {
            branches: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            warehouses: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            workers: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true },
            products: { used: 0, limit: 0, remaining: 0, unlimited: false, can_add: true }
        },
        pollingTimer: null,
        timeoutTimer: null, // Har kuni soat 09:00 dagi rejalashtiruvchi uchun timer
        loading: {
            notifications: false,
            subscription: false
        },
        initialFetchDone: false
    }),

    getters: {
        unreadCount: (state) => {
            // Backend dan kelgan unread_count ustivor. Agar u mavjud bo'lmasa, localni ishlatamiz.
            if (state.unreadCountFromBackend !== undefined && state.unreadCountFromBackend !== null) {
                return state.unreadCountFromBackend
            }
            return Array.isArray(state.items) ? state.items.filter(i => !i.is_read).length : 0
        },
        isSubscriptionExpired: (state) => {
            if (!state.subscription) return false
            if (state.subscription.status === 'expired') return true
            
            // Check end_date dynamically to see if it has expired
            if (state.subscription.end_date) {
                const now = new Date()
                now.setHours(0, 0, 0, 0)
                
                const endDate = new Date(state.subscription.end_date)
                endDate.setHours(0, 0, 0, 0)
                
                if (endDate.getTime() < now.getTime()) {
                    return true
                }
            }
            return false
        },
        daysLeft: (state) => {
            if (!state.subscription) return 0
            if (!state.subscription.end_date) return state.subscription.days_left ?? 0
            
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            
            const endDate = new Date(state.subscription.end_date)
            endDate.setHours(0, 0, 0, 0)
            
            const diffTime = endDate.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays
        },
        hasLowStock: (state) => Array.isArray(state.items) && state.items.some(i => i.type === 'low_stock' && !i.is_read),

        canAddBranch: (state) => {
            const u = state.usage?.branches;
            if (!u) return true;
            if (u.unlimited) return true;
            if (typeof u.limit === 'number' && typeof u.used === 'number') return u.used < u.limit;
            if (typeof u.can_add === 'boolean') return u.can_add;
            return true;
        },
        canAddWarehouse: (state) => {
            const u = state.usage?.warehouses;
            if (!u) return true;
            if (u.unlimited) return true;
            if (typeof u.limit === 'number' && typeof u.used === 'number') return u.used < u.limit;
            if (typeof u.can_add === 'boolean') return u.can_add;
            return true;
        },
        canAddWorker: (state) => {
            const u = state.usage?.workers;
            if (!u) return true;
            if (u.unlimited) return true;
            if (typeof u.limit === 'number' && typeof u.used === 'number') return u.used < u.limit;
            if (typeof u.can_add === 'boolean') return u.can_add;
            return true;
        },
        canAddProduct: (state) => {
            const u = state.usage?.products;
            if (!u) return true;
            if (u.unlimited) return true;
            if (typeof u.limit === 'number' && typeof u.used === 'number') return u.used < u.limit;
            if (typeof u.can_add === 'boolean') return u.can_add;
            return true;
        },

        allNotifications: (state) => {
            if (!Array.isArray(state.items)) return []
            
            // Backend formatini UI formatiga o'girish (Mapping)
            return state.items.map(item => {
                return {
                    ...item,
                    source: item.source || 'system',
                    read: item.is_read || state.locallyReadIds.includes(item.id),
                    date: item.time,                       
                    body: item.message || item.body       
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
                // 1. Fetch system notifications
                const res = await notificationsAPI.getAll(null, silent ? { silent: true } : {})
                let systemNotifications = []
                let unreadCount = 0
                if (res.data) {
                    systemNotifications = res.data.results || (Array.isArray(res.data) ? res.data : [])
                    unreadCount = res.data.unread_count || 0
                }

                // 2. Fetch announcements from store-level endpoint (Temporarily disabled)
                let announcements = []
                /*
                try {
                    const annRes = await announcementsAPI.getAll(silent ? { silent: true } : {})
                    const annData = annRes.data?.results || (Array.isArray(annRes.data) ? annRes.data : [])
                    announcements = annData.map(a => ({
                        id: a.id,
                        title: a.title,
                        body: a.body,
                        type: a.type || 'info',
                        type_display: a.type_display || 'E\'lon',
                        is_read: a.is_read || false,
                        source: 'announcement',
                        time: a.created_on || a.created_at,
                        link: a.link || null
                    }))

                    // Count unread announcements
                    const unreadAnnouncementsCount = announcements.filter(
                        a => !a.is_read && !this.locallyReadIds.includes(a.id)
                    ).length
                    unreadCount += unreadAnnouncementsCount
                } catch (annErr) {
                    console.error('❌ Fetch announcements error:', annErr)
                }
                */

                // 3. Merge system notifications and announcements
                const allItems = [...systemNotifications, ...announcements]

                // Apply local read state overrides
                allItems.forEach(item => {
                    if (!item.is_read && this.locallyReadIds.includes(item.id)) {
                        item.is_read = true
                    }
                })

                this.items = allItems
                this.unreadCountFromBackend = unreadCount

                console.log('📦 Notifications & Announcements loaded:', this.items.length, 'Unread:', this.unreadCountFromBackend)
            } catch (err) {
                console.error('❌ Fetch notifications error:', err)
            } finally {
                this.loading.notifications = false
            }
        },

        async fetchSubscription(silent = false) {
            if (!silent) this.loading.subscription = true
            try {
                // Obuna tugashiga 10, 3 va 1 kun qolgandagina background/silent so'rov yuborilsin
                if (silent && this.subscription && this.subscription.end_date) {
                    const days = this.daysLeft
                    const allowedDays = [10, 3, 1]
                    if (!allowedDays.includes(days)) {
                        console.log(`ℹ️ [Subscription] Silent API call skipped. Days left: ${days}. We only call API when 10, 3, or 1 days are left.`)
                        return
                    }
                }

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
            // 1. Optimistik yangilash: Barcha local xabarlarni o'qilgan deb belgilaymiz
            this.items.forEach(item => {
                item.is_read = true
            })
            this.unreadCountFromBackend = 0
            
            // Local id larni tozalaymiz, chunki endi hammmasi o'qildi
            this.locallyReadIds = []
            localStorage.removeItem('locallyReadNotificationIds')

            // 2. Orqa fonga API so'rovlarni yuboramiz. Biri xato qilsa ham, ikkinchisi ishlayveradi.
            try {
                await notificationsAPI.markReadAll()
            } catch (err) {
                console.error('❌ Tizim xabarlarini o\'qilgan deb belgilashda xatolik:', err)
            }
            
            try {
                const hasAnnouncements = this.items.some(i => i.source === 'announcement')
                if (hasAnnouncements) {
                    await announcementsAPI.markReadAll()
                }
            } catch (err) {
                console.error('❌ Yangiliklarni o\'qilgan deb belgilashda xatolik:', err)
            }
            
            // UI to'liq yangilanishi uchun yana fetch qilamiz
            this.fetchNotifications(true)
        },

        async markItemAsRead(item) {
            if (!item || item.is_read || this.locallyReadIds.includes(item.id)) return
            
            // Local saqlash
            if (item.id) {
                this.locallyReadIds.push(item.id)
                localStorage.setItem('locallyReadNotificationIds', JSON.stringify(this.locallyReadIds))
            }

            // Original ob'ektni topamiz
            const realItem = this.items.find(i => i.id === item.id)
            if (realItem) {
                realItem.is_read = true
            } else {
                item.is_read = true // fallback
            }

            if (this.unreadCountFromBackend > 0) {
                this.unreadCountFromBackend--
            }

            try {
                if (item.source === 'announcement' && item.id) {
                    await announcementsAPI.markRead(item.id)
                } else if (item.id) {
                    // Faqat bitta xabarni o'qilgan deb belgilash
                    await notificationsAPI.markRead(item.id)
                }
                
                // Holatni to'liq moslashtirish uchun API dan yangilab yuboramiz
                // Agar API 404 qaytarsa, bu joy ishlamaydi, ammo local optimistik update ishlagan bo'ladi
                this.fetchNotifications(true)
            } catch (err) {
                console.error('❌ Xabarni o\'qilgan deb belgilashda xatolik:', err)
            }
        },

        async startPolling() {
            this.stopPolling() // Oldingi timerni to'xtatamiz
            
            this.initialFetchDone = false
            
            // 1. Tizimga kirgandagi boshlang'ich yuklash (Initial Load on login/startup)
            console.log('⏱️ [Schedule] Login qilinganda boshlang\'ich yuklash bajarilmoqda...')
            await Promise.allSettled([
                this.fetchNotifications(),
                this.fetchSubscription()
            ])
            
            this.initialFetchDone = true

            // 2. Har kuni aniq soat 09:00 da avtomatik ishga tushadigan rejalashtiruvchi (Daily Scheduler at 09:00 AM) - VAQTINCHA MUZLATILDI (Backend o'zi boshqaradi)
            /*
            const scheduleDailyFetch = () => {
                const now = new Date()
                const target = new Date()
                target.setHours(9, 0, 0, 0) // Bugungi soat 09:00:00

                // Agar bugungi soat 09:00 dan o'tib ketgan bo'lsa, ertangi kungi 09:00 ga rejalashtiramiz
                if (now.getTime() >= target.getTime()) {
                    target.setDate(target.getDate() + 1)
                }

                const msUntilTarget = target.getTime() - now.getTime()
                const minutesUntilTarget = Math.round(msUntilTarget / 1000 / 60)
                
                console.log(`⏱️ [Schedule] Navbatdagi so'rovga qolgan vaqt: ${minutesUntilTarget} daqiqa (Mo'ljal: ${target.toLocaleString('uz-UZ')})`)

                this.timeoutTimer = setTimeout(async () => {
                    console.log('⏱️ [Schedule] Soat 09:00 bo\'ldi! Kundalik so\'rovlar muvaffaqiyatli yuborilmoqda...')
                    
                    await Promise.allSettled([
                        this.fetchNotifications(true),
                        this.fetchSubscription(true)
                    ])

                    // Keyingi kun uchun qayta rejalashtirish
                    scheduleDailyFetch()
                }, msUntilTarget)
            }

            scheduleDailyFetch()
            */
        },

        stopPolling() {
            if (this.timeoutTimer) {
                console.log('🛑 [Schedule] Kundalik rejalashtiruvchi (Timeout) to\'xtatildi.')
                clearTimeout(this.timeoutTimer)
                this.timeoutTimer = null
            }
            if (this.pollingTimer) {
                console.log('🛑 [Schedule] Interval polling to\'xtatildi.')
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


