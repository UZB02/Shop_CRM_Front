import { defineStore } from 'pinia'
import { authAPI, setApiToken, clearApiToken } from '../services/api'

const ALL_PERMISSIONS = [
    'dashboard', 'stores', 'warehouse', 'products',
    'workers', 'trades', 'expenses', 'customers', 'settings', 'pos'
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
    'xarajatlar': 'expenses',
    'xodimlar': 'workers'
}

function buildPermissions(userData) {
    const role = userData?.role || userData?.worker?.role || ''
    if (role === 'superadmin' || role === 'owner') return ALL_PERMISSIONS
    const raw = userData?.worker?.permissions || []
    return raw.map(p => PERMISSION_MAP[p] || p)
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        const savedToken = localStorage.getItem('token')
        if (savedToken) setApiToken(savedToken)

        // Bootstrap permissions from localStorage so the first navigation
        // (before verifySession completes) doesn't immediately redirect.
        // These are replaced by server-verified values in verifySession().
        const bootstrapPerms = (() => {
            try {
                const p = JSON.parse(localStorage.getItem('permissions') || '[]')
                return Array.isArray(p) ? p : []
            } catch { return [] }
        })()

        return {
            user: JSON.parse(localStorage.getItem('user')) || null,
            token: savedToken || null,
            // In-memory permissions — the only source the router guard trusts.
            // Populated from the API, not from localStorage directly.
            userPermissions: bootstrapPerms,
            // True once /auth/me has confirmed the session this browser session.
            sessionVerified: false,
        }
    },
    actions: {
        async login(credentials) {
            try {
                const response = await authAPI.login(credentials)
                const data = response.data
                const token = data.access || data.token || data.access_token

                if (!token) throw new Error('Token topilmadi')

                this.token = token
                this.user = data.user || data
                setApiToken(token)

                const perms = buildPermissions(this.user)
                this.userPermissions = perms
                this.sessionVerified = true

                localStorage.setItem('user', JSON.stringify(this.user))
                localStorage.setItem('token', token)
                localStorage.setItem('permissions', JSON.stringify(perms))
                localStorage.setItem('isLoggedIn', 'true')

                return { success: true }
            } catch (error) {
                console.error('Login error:', error)
                return { success: false, message: error.response?.data || 'Login failed' }
            }
        },

        // Called once per browser session by the router guard before the first
        // protected navigation. Fetches real user data from the server and writes
        // verified permissions into memory. localStorage cannot influence the result.
        async verifySession() {
            if (!this.token) return false
            try {
                const res = await authAPI.getMe()
                const userData = res.data
                this.user = userData
                const perms = buildPermissions(userData)
                this.userPermissions = perms
                this.sessionVerified = true
                // Keep localStorage in sync so bootstrap is fresh on next page load
                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('permissions', JSON.stringify(perms))
                return true
            } catch {
                // 401 or network error — token is invalid, clear everything
                this.logout()
                return false
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
