import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/payment/method',
        name: 'payment-method',
        component: () => import('@/views/PaymentMethodView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/payment/process',
        name: 'payment-process',
        component: () => import('@/views/PaymentProcessingView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegistrationView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/ForgotPasswordView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/reset-password/:uid/:token',
        name: 'reset-password',
        component: () => import('@/views/ResetPasswordView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import('@/views/UnauthorizedView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        component: () => import('@/layout/DashboardLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/Dashboard/index.vue'),
                meta: { permission: 'dashboard' }
            },
            {
                path: 'stores',
                name: 'stores',
                component: () => import('@/views/Stores/index.vue'),
                meta: { permission: 'stores' }
            },
            {
                path: 'branches/:id',
                name: 'branch-detail',
                component: () => import('@/views/Branches/Detail.vue'),
                meta: { permission: 'stores' }
            },
            {
                path: 'branches/:id/bulk',
                name: 'branch-bulk',
                component: () => import('@/views/Branches/BulkMovement.vue'),
                meta: { permission: 'stores' }
            },
            {
                path: 'branches/:id/transfer/create',
                name: 'branch-transfer-create',
                component: () => import('@/views/Warehouse/TransferCreate.vue'),
                meta: { permission: 'stores' }
            },
            {
                path: 'shifts/:id',
                name: 'shift-detail',
                component: () => import('@/views/Shifts/Detail.vue'),
                meta: { permission: 'stores' }
            },
            {
                path: 'products',
                name: 'products',
                component: () => import('@/views/Products/index.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'products/categories',
                name: 'product-categories',
                component: () => import('@/views/Products/Categories.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'products/create',
                name: 'product-create',
                component: () => import('@/views/Products/CreateProduct.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'products/edit/:id',
                name: 'product-edit',
                component: () => import('@/views/Products/CreateProduct.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'products/promotions',
                name: 'product-promotions',
                component: () => import('@/views/Products/Promotions/index.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'products/:id',
                name: 'product-detail',
                component: () => import('@/views/Products/Detail.vue'),
                meta: { permission: 'products' }
            },
            {
                path: 'workers',
                name: 'workers',
                component: () => import('@/views/Workers/index.vue'),
                meta: { permission: 'workers' }
            },
            {
                path: 'workers/add',
                name: 'worker-add',
                component: () => import('@/views/Workers/Add.vue'),
                meta: { permission: 'workers' }
            },
            {
                path: 'workers/edit/:id',
                name: 'worker-edit',
                component: () => import('@/views/Workers/Add.vue'),
                meta: { permission: 'workers' }
            },
            {
                path: 'workers/kpi',
                name: 'workers-kpi',
                component: () => import('@/views/Workers/KPIView.vue'),
                meta: { permission: 'workers' }
            },
            {
                path: 'workers/:id',
                name: 'worker-detail',
                component: () => import('@/views/Workers/Detail.vue'),
                meta: { permission: 'workers' }
            },
            {
                path: 'trades',
                name: 'trades',
                component: () => import('@/views/Trades/index.vue'),
                meta: { permission: 'trades' }
            },
            {
                path: 'finance',
                name: 'finance',
                component: () => import('@/views/Finance/index.vue'),
                meta: { permission: 'moliya' }
            },
            {
                path: 'customers',
                name: 'customers',
                component: () => import('@/views/Customers/index.vue'),
                meta: { permission: 'customers' }
            },
            {
                path: 'customers/groups',
                name: 'customer-groups',
                component: () => import('@/views/Customers/Groups.vue'),
                meta: { permission: 'customers' }
            },
            {
                path: 'customers/:id',
                name: 'customer-detail',
                component: () => import('@/views/Customers/Detail.vue'),
                meta: { permission: 'customers' }
            },
            {
                path: 'warehouse',
                name: 'warehouse',
                component: () => import('@/views/Warehouse/index.vue'),
                meta: { permission: 'warehouse' }
            },
            {
                path: 'warehouse/:id',
                name: 'warehouse-detail',
                component: () => import('@/views/Warehouse/Detail.vue'),
                meta: { permission: 'warehouse' }
            },
            {
                path: 'warehouse/:id/bulk',
                name: 'warehouse-bulk',
                component: () => import('@/views/Warehouse/BulkMovement.vue'),
                meta: { permission: 'warehouse' }
            },
            {
                path: 'warehouse/:id/transfer/create',
                name: 'warehouse-transfer-create',
                component: () => import('@/views/Warehouse/TransferCreate.vue'),
                meta: { permission: 'warehouse' }
            },
            {
                path: 'pos',
                name: 'pos',
                component: () => import('@/views/Pos/index.vue'),
                meta: { permission: 'pos' }
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('@/views/Settings/index.vue'),
                meta: { permission: 'settings' }
            },
            {
                path: 'subscription',
                name: 'subscription',
                component: () => import('@/views/Subscription/index.vue'),
                meta: { permission: 'subscription' }
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/views/Profile/index.vue'),
                meta: { permission: null }
            },
            {
                path: 'suppliers',
                name: 'suppliers',
                component: () => import('@/views/Suppliers/index.vue'),
                meta: { permission: 'yetkazib_beruvchilar' }
            },
            {
                path: 'suppliers/:id',
                name: 'supplier-detail',
                component: () => import('@/views/Suppliers/Detail.vue'),
                meta: { permission: 'yetkazib_beruvchilar' }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Global Navigation Guard
//
// Security model:
//  1. authStore.userPermissions is in-memory (Pinia state) — cannot be spoofed via localStorage.
//  2. On the first protected navigation each browser session, verifySession() calls /auth/me
//     and writes server-verified permissions into memory. After that, sessionVerified = true
//     and subsequent navigations are instant (no extra API call).
//  3. If /auth/me returns 401 the user is logged out regardless of what localStorage contains.
router.beforeEach(async (to, from, next) => {
    // Start global loading bar
    if (window.startLoader) window.startLoader()

    const authStore = useAuthStore()
    const isLoggedIn = !!authStore.token
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

    // Public routes — let through
    if (to.meta.requiresAuth === false) {
        if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
            next({ name: 'dashboard' })
        } else {
            next()
        }
        return
    }

    // Not logged in — redirect to login
    if (!isLoggedIn) {
        next({ name: 'login' })
        return
    }

    // First protected navigation: verify token with the server.
    // This replaces the localStorage-bootstrapped permissions with server-verified ones.
    if (!authStore.sessionVerified) {
        const ok = await authStore.verifySession()
        if (!ok) {
            next({ name: 'login' })
            return
        }
    }

    // No permission requirement on this route — allow
    if (!to.meta.permission) {
        next()
        return
    }

    // Check in-memory (server-verified) permissions
    if (!authStore.hasAccess(to.meta.permission)) {
        // If blocked on dashboard, redirect to first accessible module instead
        if (to.name === 'dashboard' && authStore.userPermissions.length > 0) {
            const firstPerm = authStore.userPermissions[0]
            if (router.hasRoute(firstPerm)) {
                next({ name: firstPerm })
                return
            }
        }
        next({ name: 'unauthorized' })
        return
    }

    // Special Check: Related routes should be blocked if disabled in settings
    const settingsStore = (await import('@/store/settings')).useSettingsStore()
    
    // Ensure settings are loaded before making a decision on module routes
    if (to.path.includes('/shifts') || to.path.includes('/workers/kpi')) {
        if (!settingsStore.initialized) await settingsStore.fetchSettings()
        
        if (to.path.includes('/shifts') && (!settingsStore.isShiftEnabled || !settingsStore.hasPlanShift)) {
            next({ name: 'dashboard' })
            return
        }

        if (to.path.includes('/workers/kpi') && (!settingsStore.isKpiEnabled || !settingsStore.hasPlanKpi)) {
            next({ name: 'workers' })
            return
        }
    }

    next()
})

router.afterEach(() => {
    // Stop global loading bar
    if (window.stopLoader) window.stopLoader()
})

export default router


