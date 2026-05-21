import api from './axios'

export const suppliersAPI = {
    getAll: (params) => api.get('/warehouse/suppliers/', { params }),
    getById: (id) => api.get(`/warehouse/suppliers/${id}/`),
    create: (data) => api.post('/warehouse/suppliers/', data),
    update: (id, data) => api.patch(`/warehouse/suppliers/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/suppliers/${id}/`),
    getPurchases: (id, params) => api.get(`/warehouse/suppliers/${id}/purchases/`, { params }),
    getPayments: (id, params) => api.get(`/warehouse/suppliers/${id}/payments/`, { params }),

    // Export / Import
    export: (params) => api.get('/export/suppliers/', { params, responseType: 'blob' }),
    downloadTemplate: () => api.get('/export/suppliers/template/', { responseType: 'blob' }),
    import: (formData) => api.post('/export/suppliers/import/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const supplierPaymentsAPI = {
    getAll: (params) => api.get('/warehouse/supplier-payments/', { params }),
    create: (data) => api.post('/warehouse/supplier-payments/', data)
}
