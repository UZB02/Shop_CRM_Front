import axios from 'axios'
import router from '@/router'

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://shopcrmsystem-production.up.railway.app/api/v1"

// In-memory token store — primary source of truth for the active session.
// localStorage is only used as a fallback on page refresh (persisted by auth store).
// NOTE: HttpOnly cookies (set by the backend) would fully eliminate XSS token exposure,
// but that requires backend changes. This is the best mitigation achievable on the frontend.
let _memToken = null

export const setApiToken = (token) => { _memToken = token }
export const clearApiToken = () => { _memToken = null }

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = _memToken || localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle errors and warnings
api.interceptors.response.use(
    (response) => {
        // Log all incoming API data to console for monitoring
        console.log(`🌐 API RESPONSE [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data)

        // Check for subscription warning
        const warning = response.headers['x-subscription-warning']
        if (warning) {
            window.dispatchEvent(new CustomEvent('subscription-warning', { detail: warning }))
        }
        return response
    },
    (error) => {
        console.error(`❌ API ERROR [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response?.data || error.message)
        
        if (error.response?.status === 401) {
            // Token expired or invalid — clear session data
            clearApiToken()
            const preservedKeys = ['theme', 'lang']
            Object.keys(localStorage).forEach(key => {
                if (!preservedKeys.includes(key)) {
                    localStorage.removeItem(key)
                }
            })
            // Use Vue Router instead of hard redirect to preserve SPA state
            router.push({ name: 'login' })
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    getMe: () => api.get('/auth/me'),
    changePassword: (data) => api.post('/auth/change-password/', data)
}

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/warehouse/products/', { params }),
    getById: (id) => api.get(`/warehouse/products/${id}/`),
    create: (data) => api.post('/warehouse/products/', data),
    update: (id, data) => api.patch(`/warehouse/products/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/products/${id}/`),
    getLowStock: () => api.get('/warehouse/products/lowstock/'),
    getBarcode: (id) => api.get(`/products/${id}/barcode/`, { responseType: 'blob' })
}

// Categories API
export const categoriesAPI = {
    getAll: (params) => api.get('/warehouse/categories/', { params }),
    create: (data) => api.post('/warehouse/categories/', data),
    update: (id, data) => api.patch(`/warehouse/categories/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/categories/${id}/`)
}

// Subcategories API
export const subcategoriesAPI = {
    getAll: (params) => api.get('/warehouse/subcategories/', { params }),
    create: (data) => api.post('/warehouse/subcategories/', data),
    update: (id, data) => api.patch(`/warehouse/subcategories/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/subcategories/${id}/`)
}

// Customers API
export const customersAPI = {
    getAll: (params) => api.get('/customers/', { params }),
    getGrouped: (params) => api.get('/customers/grouped/', { params }),
    getById: (id) => api.get(`/customers/${id}/`),
    create: (data) => api.post('/customers/', data),
    update: (id, data) => api.patch(`/customers/${id}/`, data),
    delete: (id) => api.delete(`/customers/${id}/`),
    getPurchases: (id, params) => api.get(`/customers/${id}/purchases/`, { params }),
    getDebtSales: (id, params) => api.get(`/customers/${id}/debt-sales/`, { params }),
    payDebt: (id, data) => api.post(`/customers/${id}/pay-debt/`, data)
}

// Customer Groups API
export const customerGroupsAPI = {
    getAll: (params) => api.get('/customer-groups/', { params }),
    create: (data) => api.post('/customer-groups/', data),
    update: (id, data) => api.patch(`/customer-groups/${id}/`, data),
    delete: (id) => api.delete(`/customer-groups/${id}/`)
}

// Trades API
export const tradesAPI = {
    getAll: (params) => api.get('/trades/', { params }),
    getById: (id) => api.get(`/trades/${id}/`),
    create: (data) => api.post('/trades/', data),
    update: (id, data) => api.patch(`/trades/${id}/`, data),
    delete: (id) => api.delete(`/trades/${id}/`)
}

// Workers API
export const workersAPI = {
    getAll: (params) => api.get('/workers/', { params }),
    getById: (id) => api.get(`/workers/${id}/`),
    create: (data) => api.post('/workers/', data),
    update: (id, data) => api.patch(`/workers/${id}/`, data),
    delete: (id) => api.delete(`/workers/${id}/`),
    changePassword: (id, data) => api.post(`/workers/${id}/change-password/`, data),
    getActivities: (id, params) => api.get(`/workers/${id}/activities/`, { params }),
    getMe: () => api.get('/workers/me/'),
    updateMe: (data) => api.patch('/workers/me/', data)
}

// Expenses API
export const expensesAPI = {
    getAll: (params) => api.get('/expenses/', { params }),
    getById: (id) => api.get(`/expenses/${id}/`),
    create: (data) => api.post('/expenses/', data),
    update: (id, data) => api.patch(`/expenses/${id}/`, data),
    delete: (id) => api.delete(`/expenses/${id}/`),
    getSummary: (params) => api.get('/expenses/summary/', { params })
}

// Stores / Branches API
export const storesAPI = {
    getAll: async (params) => {
        const response = await api.get('/stores/', { params });
        console.log('Stores API data:', response.data);
        return response;
    },
    getById: (id) => api.get(`/stores/${id}/`),
    create: (data) => api.post('/stores/', data),
    update: (id, data) => api.patch(`/stores/${id}/`, data),
    delete: (id) => api.delete(`/stores/${id}/`)
}

export const branchesAPI = {
    getAll: (params) => api.get('/branches/', { params }),
    getById: (id, params) => api.get(`/branches/${id}/`, { params }),
    getProducts: (id, params) => api.get(`/branches/${id}/products/`, { params }),
    create: (data) => api.post('/branches/', data),
    update: (id, data) => api.patch(`/branches/${id}/`, data),
    delete: (id) => api.delete(`/branches/${id}/`),
    getIncoming: (id, params) => api.get(`/branches/${id}/incoming/`, { params }),
    getTransfers: (id, params) => api.get(`/branches/${id}/transfers/`, { params })
}

// Warehouses API
export const warehousesAPI = {
    getAll: (params) => api.get('/warehouse/warehouses/', { params }),
    getById: (id, params) => api.get(`/warehouse/warehouses/${id}/`, { params }),
    getIncoming: (id, params) => api.get(`/warehouse/warehouses/${id}/incoming/`, { params }),
    create: (data) => api.post('/warehouse/warehouses/', data),
    update: (id, data) => api.patch(`/warehouse/warehouses/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/warehouses/${id}/`),
    getTransfers: (id, params) => api.get(`/warehouse/warehouses/${id}/transfers/`, { params })
}

// Stock Movements API
export const movementsAPI = {
    getAll: (params) => api.get('/warehouse/movements/', { params }),
    getById: (id) => api.get(`/warehouse/movements/${id}/`),
    create: (data) => api.post('/warehouse/movements/', data),
    bulkCreate: (data) => api.post('/warehouse/movements/bulk/', data)
}

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getActivities: (params) => api.get('/dashboard/activities', { params }),
    getSalesChart: (params) => api.get('/dashboard/sales-chart', { params })
}

// Subscription API
export const subscriptionAPI = {
    getStatus: () => api.get('/subscription/status'),
    extend: (data) => api.post('/subscription/extend', data),
    changePlan: (data) => api.post('/subscription/plan', data)
}

// Settings API
export const settingsAPI = {
    getAll: (params) => api.get('/settings/', { params }),
    getById: (id) => api.get(`/settings/${id}/`),
    create: (data) => api.post('/settings/', data),
    update: (id, data) => {
        if (typeof id === 'object' && !data) {
            return api.patch('/settings/', id);
        }
        return api.patch(`/settings/${id}/`, data);
    }
}

// Transfers API
export const transfersAPI = {
    getAll: (params) => api.get('/warehouse/transfers/', { params }),
    getById: (id) => api.get(`/warehouse/transfers/${id}/`),
    create: (data) => api.post('/warehouse/transfers/', data),
    confirm: (id) => api.post(`/warehouse/transfers/${id}/confirm/`, {}),
    cancel: (id) => api.post(`/warehouse/transfers/${id}/cancel/`, {})
}

// Shifts API
export const shiftsAPI = {
    getAll: (params) => api.get('/shifts/', { params }),
    open: (data) => api.post('/shifts/', data),
    close: (id, data) => api.patch(`/shifts/${id}/close/`, data),
    getXReport: (id) => api.get(`/shifts/${id}/x-report/`),
    export: (id) => api.get(`/export/shifts/${id}/`, { responseType: 'blob' })
}

// Sales API
export const salesAPI = {
    getAll: (params) => api.get('/sales/', { params }),
    getById: (id) => api.get(`/sales/${id}/`),
    create: (data) => api.post('/sales/', data),
    getReceipt: (id) => api.get(`/sales/${id}/receipt/`, { responseType: 'blob' }),
    scanProduct: (barcode) => api.get(`/warehouse/products/scan/`, { params: { code: barcode } })
}

export default api
