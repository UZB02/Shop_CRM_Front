import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://shopcrmsystem-production.up.railway.app/api/v1";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors and warnings
api.interceptors.response.use(
    (response) => {
        // Check for subscription warning
        const warning = response.headers['x-subscription-warning']
        if (warning) {
            window.dispatchEvent(new CustomEvent('subscription-warning', { detail: warning }))
        }
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - Clear all except preferences
            const preservedKeys = ['theme', 'lang']
            Object.keys(localStorage).forEach(key => {
                if (!preservedKeys.includes(key)) {
                    localStorage.removeItem(key)
                }
            })

            // Redirect to login
            window.location.href = '/login'
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
    create: (data) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
        return api.post('/warehouse/products/', data, config)
    },
    update: (id, data) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
        return api.patch(`/warehouse/products/${id}/`, data, config)
    },
    delete: (id) => api.delete(`/warehouse/products/${id}/`),
    getLowStock: () => api.get('/warehouse/products/lowstock/')
}

// Categories API
export const categoriesAPI = {
    getAll: (params) => api.get('/warehouse/categories/', { params }),
    create: (data) => api.post('/warehouse/categories/', data),
    update: (id, data) => api.patch(`/warehouse/categories/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/categories/${id}/`)
}

// Customers API
export const customersAPI = {
    getAll: (params) => api.get('/customers/', { params }),
    getById: (id) => api.get(`/customers/${id}/`),
    create: (data) => api.post('/customers/', data),
    update: (id, data) => api.patch(`/customers/${id}/`, data),
    delete: (id) => api.delete(`/customers/${id}/`)
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
    getAll: (params) => api.get('/trades', { params }),
    getById: (id) => api.get(`/trades/${id}`),
    create: (data) => api.post('/trades', data),
    update: (id, data) => api.put(`/trades/${id}`, data),
    delete: (id) => api.delete(`/trades/${id}`)
}

// Workers API
export const workersAPI = {
    getAll: (params) => api.get('/workers/', { params }),
    getById: (id) => api.get(`/workers/${id}/`),
    create: (data) => api.post('/workers/', data),
    update: (id, data) => api.patch(`/workers/${id}/`, data),
    delete: (id) => api.delete(`/workers/${id}/`),
    changePassword: (id, data) => api.post(`/workers/${id}/change-password/`, data)
}

// Expenses API
export const expensesAPI = {
    getAll: (params) => api.get('/expenses', { params }),
    getById: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`),
    getSummary: (params) => api.get('/expenses/summary', { params })
}

// Stores / Branches API
export const storesAPI = {
    getAll: (params) => api.get('/stores/', { params }),
    getById: (id) => api.get(`/stores/${id}/`),
    create: (data) => api.post('/stores/', data),
    update: (id, data) => api.put(`/stores/${id}/`, data),
    delete: (id) => api.delete(`/stores/${id}/`)
}

export const branchesAPI = {
    getAll: (params) => api.get('/branches/', { params }),
    getById: (id) => api.get(`/branches/${id}/`),
    create: (data) => api.post('/branches/', data),
    update: (id, data) => api.patch(`/branches/${id}/`, data),
    delete: (id) => api.delete(`/branches/${id}/`)
}

// Warehouses API
export const warehousesAPI = {
    getAll: (params) => api.get('/warehouse/warehouses/', { params }),
    getById: (id) => api.get(`/warehouse/warehouses/${id}/`),
    create: (data) => api.post('/warehouse/warehouses/', data),
    update: (id, data) => api.patch(`/warehouse/warehouses/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/warehouses/${id}/`)
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
    update: (id, data) => api.patch(`/settings/${id}/`, data)
}

export default api
