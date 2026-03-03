import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('@/views/LandingView.vue'),
        meta: { requiresAuth: false }
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
                path: 'products',
                name: 'products',
                component: () => import('@/views/Products/index.vue'),
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
                path: 'workers',
                name: 'workers',
                component: () => import('@/views/Workers/index.vue'),
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
                path: 'expenses',
                name: 'expenses',
                component: () => import('@/views/Expenses/index.vue'),
                meta: { permission: 'expenses' }
            },
            {
                path: 'customers',
                name: 'customers',
                component: () => import('@/views/Customers/index.vue'),
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
                meta: { permission: 'dashboard' }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // Check authentication
    if (requiresAuth && !isLoggedIn) {
        next({ name: 'login' })
        return
    }

    // Check permissions for protected routes
    if (to.meta.permission) {
        const userStr = localStorage.getItem('user')
        const permissionsStr = localStorage.getItem('permissions')

        if (!userStr) {
            next({ name: 'unauthorized' })
            return
        }

        const user = JSON.parse(userStr)
        let userPermissions = []

        // 1. Check if user has specific permissions (New System)
        if (permissionsStr) {
            try {
                const permissions = JSON.parse(permissionsStr)
                if (Array.isArray(permissions)) {
                    userPermissions = permissions
                } else {
                    const userRole = user.role || 'superadmin'
                    userPermissions = permissions[userRole] || []
                }
            } catch (e) {
                console.error('Error parsing permissions', e)
            }
        }
        else if (user.permissions && Array.isArray(user.permissions)) {
            userPermissions = user.permissions
        }

        // Admin/Owner bypass (optional, but good practice)
        if (user.role === 'superadmin' || user.role === 'owner') {
            next()
            return
        }

        if (!userPermissions.includes(to.meta.permission)) {
            // Intelligent Redirect: If trying to access dashboard but lacks permission, 
            // redirect to the first authorized module instead of blocking.
            if (to.name === 'dashboard' && userPermissions.length > 0) {
                const firstPerm = userPermissions[0];
                // Map permissions to routes (simple mapping)
                // This assumes permission name matches route name or has simple mapping
                if (router.hasRoute(firstPerm)) {
                    next({ name: firstPerm });
                    return;
                }
            }

            next({ name: 'unauthorized' })
            return
        }
    }

    next()
})

export default router
