import api from './axios'

export const expenseCategoriesAPI = {
    getAll: (params) => api.get('/expense-categories/', { params }),
    getById: (id) => api.get(`/expense-categories/${id}/`),
    create: (data) => api.post('/expense-categories/', data),
    update: (id, data) => api.patch(`/expense-categories/${id}/`, data),
    delete: (id) => api.delete(`/expense-categories/${id}/`)
}

export const expensesAPI = {
    getAll: (params) => api.get('/expenses/', { params }),
    getById: (id) => api.get(`/expenses/${id}/`),
    create: (data) => {
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

export const financeReportsAPI = {
    getRevenue: (params) => api.get('/finance/revenue/', { params }),
    getExpenses: (params) => api.get('/finance/expenses/', { params }),
    getPaymentMethods: (params) => api.get('/finance/payment-methods/', { params }),
    getCategoryProfit: (params) => api.get('/finance/category-profit/', { params }),
    getProfitLoss: (params) => api.get('/finance/profit-loss/', { params }),
    getDebtorReport: (params) => api.get('/finance/debtor-report/', { params })
}


