import api from './axios'

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

export const warehousesAPI = {
    getAll: (params) => api.get('/warehouse/warehouses/', { params }),
    getById: (id, params) => api.get(`/warehouse/warehouses/${id}/`, { params }),
    getIncoming: (id, params) => api.get(`/warehouse/warehouses/${id}/incoming/`, { params }),
    create: (data) => api.post('/warehouse/warehouses/', data),
    update: (id, data) => api.patch(`/warehouse/warehouses/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/warehouses/${id}/`),
    getTransfers: (id, params) => api.get(`/warehouse/warehouses/${id}/transfers/`, { params })
}

export const movementsAPI = {
    getAll: (params) => api.get('/warehouse/movements/', { params }),
    getById: (id) => api.get(`/warehouse/movements/${id}/`),
    create: (data) => api.post('/warehouse/movements/', data),
    bulkCreate: (data) => api.post('/warehouse/movements/bulk/', data)
}

export const wastagesAPI = {
    getAll: (params) => api.get('/warehouse/wastages/', { params }),
    getById: (id) => api.get(`/warehouse/wastages/${id}/`),
    create: (data) => api.post('/warehouse/wastages/', data),
    export: (params) => api.get('/export/wastages/', { params, responseType: 'blob' })
}

export const transfersAPI = {
    getAll: (params) => api.get('/warehouse/transfers/', { params }),
    getById: (id) => api.get(`/warehouse/transfers/${id}/`),
    create: (data) => api.post('/warehouse/transfers/', data),
    confirm: (id) => api.post(`/warehouse/transfers/${id}/confirm/`, {}),
    cancel: (id) => api.post(`/warehouse/transfers/${id}/cancel/`, {})
}
