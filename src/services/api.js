import axios from 'axios'
// Router dynamically imported inside interceptors to avoid circular dependency

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://shopcrmsystem-production.up.railway.app/api/v1"

let _memToken = null

export const setApiToken = (token) => { _memToken = token }
export const clearApiToken = () => { _memToken = null }

let isRefreshing = false
let refreshQueue = []

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Start global loading bar
        if (!config.silent && typeof window !== 'undefined' && window.startLoader) window.startLoader()

        const token = _memToken || localStorage.getItem('access')
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
        // Stop global loading bar
        if (!response.config.silent && typeof window !== 'undefined' && window.stopLoader) window.stopLoader()

        // Log all incoming API data to console for monitoring
        console.log(`🌐 API RESPONSE [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data)

        // Check for subscription warning
        const warning = response.headers['x-subscription-warning']
        if (warning) {
            window.dispatchEvent(new CustomEvent('subscription-warning', { detail: warning }))
        }
        return response
    },
    async (error) => {
        // Stop global loading bar
        if (!error.config?.silent && typeof window !== 'undefined' && window.stopLoader) window.stopLoader()

        console.error(`❌ API ERROR [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response?.data || error.message)
        
        const status = error.response?.status
        const original = error.config

        if (status === 401 && !original._retry) {
            original._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject })
                }).then(token => {
                    original.headers.Authorization = `Bearer ${token}`
                    return api(original)
                })
            }

            isRefreshing = true

            try {
                const refresh = localStorage.getItem('refresh')
                if (!refresh) throw new Error('No refresh token')

                const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
                const newAccess = res.data.access
                const newRefresh = res.data.refresh

                localStorage.setItem('access', newAccess)
                if (newRefresh) localStorage.setItem('refresh', newRefresh)
                setApiToken(newAccess)

                refreshQueue.forEach(p => p.resolve(newAccess))
                refreshQueue = []
                original.headers.Authorization = `Bearer ${newAccess}`
                return api(original)
            } catch (refreshError) {
                refreshQueue.forEach(p => p.reject(refreshError))
                refreshQueue = []

                clearApiToken()
                const preservedKeys = ['theme', 'lang']
                Object.keys(localStorage).forEach(key => {
                    if (!preservedKeys.includes(key)) localStorage.removeItem(key)
                })

                const router = (await import('@/router')).default
                router.push({ name: 'login' })
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        } else if (status === 429) {
            console.log('🔘 Dispatching rate-limit-error event')
            window.dispatchEvent(new CustomEvent('rate-limit-error', {
                detail: error.response?.data?.detail || "So'rovlar soni limitdan oshdi. Biroz kuting va qayta urinib ko'ring."
            }))
        }
        
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: (data) => api.post('/auth/logout/', data),
    tokenRefresh: (data) => axios.post(`${API_BASE_URL}/auth/token/refresh/`, data),
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
    getLowStock: () => api.get('/warehouse/stocks/low-stock/'),
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

// Promotions API
export const promotionsAPI = {
    getAll: (params) => api.get('/warehouse/promotions/', { params }),
    getById: (id) => api.get(`/warehouse/promotions/${id}/`),
    create: (data) => api.post('/warehouse/promotions/', data),
    update: (id, data) => api.patch(`/warehouse/promotions/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/promotions/${id}/`),
    activate: (id) => api.post(`/warehouse/promotions/${id}/activate/`),
    deactivate: (id) => api.post(`/warehouse/promotions/${id}/deactivate/`)
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

// Expense Categories API
export const expenseCategoriesAPI = {
    getAll: (params) => api.get('/expense-categories/', { params }),
    getById: (id) => api.get(`/expense-categories/${id}/`),
    create: (data) => api.post('/expense-categories/', data),
    update: (id, data) => api.patch(`/expense-categories/${id}/`, data),
    delete: (id) => api.delete(`/expense-categories/${id}/`)
}

// Expenses API
export const expensesAPI = {
    getAll: (params) => api.get('/expenses/', { params }),
    getById: (id) => api.get(`/expenses/${id}/`),
    create: (data) => {
        // Handle multipart/form-data if image is present
        if (data instanceof FormData) {
            return api.post('/expenses/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        return api.post('/expenses/', data)
    },
    update: (id, data) => {
        if (data instanceof FormData) {
            return api.patch(`/expenses/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        return api.patch(`/expenses/${id}/`, data)
    },
    delete: (id) => api.delete(`/expenses/${id}/`)
}

// Reports & Exports API
export const reportsAPI = {
    // Excel/PDF Exports (Binary)
    exportExpenses: (params) => api.get('/export/expenses', { params, responseType: 'blob' }),
    exportWastages: (params) => api.get('/export/wastages', { params, responseType: 'blob' }),
    
    // JSON Reports
    getFinancialReport: (params) => api.get('/export/financial-report/', { params }),
    getProfitLoss: (params) => api.get('/export/profit-loss/', { params }),
    getProductTurnover: (params) => api.get('/export/product-turnover/', { params }),
    getDebtorReport: (params) => api.get('/export/debtor-report/', { params }),
    getWorkerPerformance: (params) => api.get('/export/worker-performance/', { params }),
    getInventoryValue: (params) => api.get('/export/inventory-value/', { params }),
    getTaxReport: (params) => api.get('/export/tax-report/', { params }),
    getMonthlyProfitLoss: (params) => api.get('/export/profit-loss/monthly-chart/', { params })
}

// Finance API (Reports & Dashboard)
export const financeReportsAPI = {
    getRevenue: (params) => api.get('/finance/revenue/', { params }),
    getExpenses: (params) => api.get('/finance/expenses/', { params }),
    getPaymentMethods: (params) => api.get('/finance/payment-methods/', { params }),
    getCategoryProfit: (params) => api.get('/finance/category-profit/', { params }),
    getProfitLoss: (params) => api.get('/finance/profit-loss/', { params }),
    getDebtorReport: (params) => api.get('/finance/debtor-report/', { params })
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

// Wastages API
export const wastagesAPI = {
    getAll: (params) => api.get('/warehouse/wastages/', { params }),
    getById: (id) => api.get(`/warehouse/wastages/${id}/`),
    create: (data) => api.post('/warehouse/wastages/', data),
    export: (params) => api.get('/export/wastages/', { params, responseType: 'blob' })
}

// Dashboard API
export const dashboardAPI = {
    getData: (params) => api.get('/dashboard/', { params }),
    getRevenueChart: (params) => api.get('/dashboard/revenue-chart/', { params })
}

// Notifications API (Polling & Shared list)
export const notificationsAPI = {
    getAll: (params, config = {}) => api.get('/notifications/', { params, ...config }),
    markRead: (config = {}) => api.post('/notifications/mark-read/', {}, config) // Body bo'sh yuboriladi
}

// Announcements API
export const announcementsAPI = {
    getAll: (params) => api.get('/announcements/', { params }),
    markRead: (id) => api.post(`/announcements/${id}/mark-read/`, {}),
    markReadAll: () => api.post('/announcements/mark-read/', {})
}

// Subscription API
export const subscriptionAPI = {
    getStatus: (config = {}) => api.get('/subscription/', config),
    extend: (data) => api.post('/subscription/extend/', data),
    changePlan: (data) => api.post('/subscription/plan/', data)
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
    cancel: (id) => api.patch(`/sales/${id}/cancel/`),
    getReceipt: (id) => api.get(`/sales/${id}/receipt/`, { responseType: 'blob' }),
    scanProduct: (barcode) => api.get(`/warehouse/products/scan/`, { params: { code: barcode } })
}

// Sale Returns API
export const saleReturnsAPI = {
    getAll: (params) => api.get('/sale-returns/', { params }),
    getById: (id) => api.get(`/sale-returns/${id}/`),
    create: (data) => api.post('/sale-returns/', data),
    confirm: (id) => api.patch(`/sale-returns/${id}/confirm/`),
    cancel: (id) => api.patch(`/sale-returns/${id}/cancel/`)
}

export default api
