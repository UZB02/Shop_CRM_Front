import { defineStore } from 'pinia'
import { authAPI } from '../services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        // Available sections and default permissions
        permissions: {
            admin: ['dashboard', 'products', 'trades', 'customers'],
            seller: ['dashboard', 'pos', 'trades'],
            superadmin: ['dashboard', 'stores', 'warehouse', 'products', 'workers', 'trades', 'expenses', 'customers', 'settings', 'pos']
        }
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await authAPI.login(credentials)
                console.log('Login Backend Response:', response.data)
                const data = response.data
                const token = data.access || data.token || data.access_token

                if (!token) {
                    throw new Error('Token topilmadi')
                }

                this.token = token
                this.user = data.user || data

                // Map backend permissions to frontend keys
                const backendPermissions = this.user?.worker?.permissions || []
                const permissionMap = {
                    'boshqaruv': 'dashboard',
                    'dokonlar': 'stores',
                    'mahsulotlar': 'products',
                    'mijozlar': 'customers',
                    'savdolar': 'trades',
                    'sklad': 'warehouse',
                    'sotuv': 'pos',
                    'sozlamalar': 'settings',
                    'xarajatlar': 'expenses',
                    'xodimlar': 'workers'
                }

                const mappedPermissions = backendPermissions.map(p => permissionMap[p] || p)

                localStorage.setItem('user', JSON.stringify(this.user))
                localStorage.setItem('token', token)
                localStorage.setItem('permissions', JSON.stringify(mappedPermissions))
                localStorage.setItem('isLoggedIn', 'true')

                return { success: true }
            } catch (error) {
                console.error('Login error:', error)
                return {
                    success: false,
                    message: error.response?.data || 'Login failed'
                }
            }
        },
        setPermissions(role, sections) {
            this.permissions[role] = sections
            localStorage.setItem('permissions', JSON.stringify(this.permissions))
        },
        hasAccess(section) {
            if (!this.user) return false

            // Check mapped permissions from localStorage first (it's the source of truth for the session)
            const permissionsStr = localStorage.getItem('permissions')
            if (permissionsStr) {
                try {
                    const mappedPermissions = JSON.parse(permissionsStr)
                    if (Array.isArray(mappedPermissions)) {
                        return mappedPermissions.includes(section)
                    }
                } catch (e) {
                    console.error('Error parsing permissions', e)
                }
            }

            // Fallback to role-based defaults if no dynamic permissions found
            const userRole = this.user.role || 'seller'
            const defaultPermissions = this.permissions[userRole] || []
            return defaultPermissions.includes(section)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }
})
