import api from './axios'

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

export const customerGroupsAPI = {
    getAll: (params) => api.get('/customer-groups/', { params }),
    create: (data) => api.post('/customer-groups/', data),
    update: (id, data) => api.patch(`/customer-groups/${id}/`, data),
    delete: (id) => api.delete(`/customer-groups/${id}/`)
}


