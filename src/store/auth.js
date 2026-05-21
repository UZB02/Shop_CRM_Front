import { defineStore } from 'pinia'
import { authAPI, workersAPI, setApiToken, clearApiToken } from '../services/api'
import { useNotificationStore } from './notifications'

const ALL_PERMISSIONS = [
    'dashboard', 'stores', 'warehouse', 'products',
    'workers', 'trades', 'moliya', 'customers', 'settings', 'pos', 'subscription', 'suppliers',
    'yetkazib_beruvchilar'
]

const PERMISSION_MAP = {
    'boshqaruv': 'dashboard',
    'dokonlar': 'stores',
    'mahsulotlar': 'products',
    'mijozlar': 'customers',
    'savdolar': 'trades',
    'ombor': 'warehouse',
    'sotuv': 'pos',
    'sozlamalar': 'settings',
    'moliya': 'moliya',
    'xodimlar': 'workers',
    'obuna': 'subscription',
    'yetkazuvchilar': 'suppliers',
    'suppliers': 'suppliers',
    // Yetkazib beruvchilar bo'limi uchun alohida ruxsat (GET endpointlar)
    'yetkazib_beruvchilar': 'yetkazib_beruvchilar'
}

function buildPermissions(userData) {
    if (!userData) return []
    
    // Check various ownership/admin flags that might come from the server
    const isOwner = userData.is_owner || userData.is_superuser || userData.is_staff
    const role = (userData.role || userData.worker?.role || '').toLowerCase()
    
    // If user is owner or admin in any way, grant all permissions
    if (isOwner || role === 'superadmin' || role === 'owner') {
        return [...ALL_PERMISSIONS]
    }

    // Otherwise, use worker-specific permissions list
    const raw = userData.worker?.permissions || userData.permissions || []
    if (!Array.isArray(raw)) return []
    
    const mapped = raw.map(p => PERMISSION_MAP[p] || p)
    // Filter out duplicates and invalid mappings
    return [...new Set(mapped.filter(p => ALL_PERMISSIONS.includes(p)))]
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        const savedToken = localStorage.getItem('access')
        if (savedToken) setApiToken(savedToken)

        // Bootstrap permissions from localStorage carefully
        const bootstrapPerms = (() => {
            try {
                const p = JSON.parse(localStorage.getItem('permissions') || '[]')
                return Array.isArray(p) ? p : []
            } catch { return [] }
        })()

        return {
            user: JSON.parse(localStorage.getItem('user')) || null,
            token: savedToken || null,
            userPermissions: bootstrapPerms,
            sessionVerified: false,
        }
    },
    actions: {
        async login(credentials) {
            try {
                const response = await authAPI.login(credentials)
                const data = response.data
                const token = data.access || data.token || data.access_token
                const refreshToken = data.refresh

                if (!token) throw new Error('Token topilmadi')

                this.token = token
                this.user = data.user || data
                setApiToken(token)

                const perms = buildPermissions(this.user)
                this.userPermissions = perms
                this.sessionVerified = true

                localStorage.setItem('user', JSON.stringify(this.user))
                localStorage.setItem('access', token)
                if (refreshToken) localStorage.setItem('refresh', refreshToken)
                localStorage.setItem('permissions', JSON.stringify(perms))
                localStorage.setItem('isLoggedIn', 'true')

                console.log('✅ Auth success: permissions granted:', perms)
                return { success: true }
            } catch (error) {
                console.error('❌ Login error:', error)
                
                // Detailed handling for different error types
                let errorMsg = 'Login failed'

                if (!error.response) {
                    // Network error, timeout, or server is down
                    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                        errorMsg = 'So\'rov vaqti tugadi. Internet aloqasi juda sekin yoki server javob bermayapti.'
                    } else if (error.message === 'Network Error') {
                        errorMsg = 'Internet aloqasi mavjud emas yoki serverga ulanib bo\'lmadi. Aloqani tekshiring.'
                    } else {
                        errorMsg = 'Tizimga ulanishda kutilmagan xatolik yuz berdi.'
                    }
                } else {
                    // Server responded with an error (4xx, 5xx)
                    const status = error.response.status
                    if (status === 401 || status === 403) {
                        errorMsg = 'Login yoki parol noto\'g\'ri.'
                    } else if (status === 429) {
                        errorMsg = 'So\'rovlar soni limitdan oshdi. Biroz kuting va qayta urinib ko\'ring.'
                    } else if (status >= 500) {
                        errorMsg = 'Serverda xatolik yuz berdi. Texnik xizmat ko\'rsatilayotgan bo\'lishi mumkin.'
                    } else {
                        errorMsg = error.response.data || 'Login xato.'
                    }
                }

                return { success: false, message: errorMsg }
            }
        },

        async verifySession() {
            if (!this.token) return false
            try {
                const res = await workersAPI.getMe()
                const userData = res.data
                
                if (!userData) throw new Error('Invalid user data from server')

                this.user = userData
                const perms = buildPermissions(userData)
                
                // Update in-memory state
                this.userPermissions = perms
                this.sessionVerified = true
                
                // Keep localStorage in sync correctly
                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('permissions', JSON.stringify(perms))
                
                return true
            } catch (err) {
                console.warn('⚠️ Session verification failed:', err.message)
                if (err.response?.status === 401) {
                    this.logout()
                    return false
                }
                
                // Critical: Fallback to existing permissions if it's just a network/server error
                // This prevents users from getting locked out due to temporary API issues
                this.sessionVerified = true
                return true
            }
        },

        // Reads only from in-memory state — localStorage cannot affect this check.
        hasAccess(section) {
            if (!this.user) return false
            return this.userPermissions.includes(section)
        },

        setPermissions(role, sections) {
            if (role === 'superadmin' || role === 'owner') return // never downgrade admins
            this.userPermissions = sections
            localStorage.setItem('permissions', JSON.stringify(sections))
        },

        logout() {
            // Invalidate refresh token on server (fire-and-forget)
            const refresh = localStorage.getItem('refresh')
            if (refresh) {
                authAPI.logout({ refresh }).catch(() => {})
            }

            try {
                const notificationStore = useNotificationStore()
                notificationStore.reset()
            } catch (e) {
                console.warn('Could not reset notification store:', e)
            }

            this.user = null
            this.token = null
            this.userPermissions = []
            this.sessionVerified = false
            clearApiToken()

            const preservedKeys = ['theme', 'lang']
            Object.keys(localStorage).forEach(key => {
                if (!preservedKeys.includes(key)) localStorage.removeItem(key)
            })
        }
    }
})


