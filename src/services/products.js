import api from './axios'

export const productsAPI = {
    getAll: (params) => api.get('/warehouse/products/', { params }),
    getById: (id) => api.get(`/warehouse/products/${id}/`),
    create: (data) => api.post('/warehouse/products/', data),
    update: (id, data) => api.patch(`/warehouse/products/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/products/${id}/`),
    getLowStock: () => api.get('/warehouse/stocks/low-stock/'),
    getBarcode: (id) => api.get(`/products/${id}/barcode/`, { responseType: 'blob' }),
    getTurlar: (productId) => api.get(`/warehouse/products/${productId}/turlar/`),
    createTur: (productId, data) => api.post(`/warehouse/products/${productId}/turlar/`, data),
    updateTur: (productId, turId, data) => api.patch(`/warehouse/products/${productId}/turlar/${turId}/`, data),
    deleteTur: (productId, turId) => api.delete(`/warehouse/products/${productId}/turlar/${turId}/`)
}

export const categoriesAPI = {
    getAll: (params) => api.get('/warehouse/categories/', { params }),
    create: (data) => api.post('/warehouse/categories/', data),
    update: (id, data) => api.patch(`/warehouse/categories/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/categories/${id}/`)
}

export const subcategoriesAPI = {
    getAll: (params) => api.get('/warehouse/subcategories/', { params }),
    create: (data) => api.post('/warehouse/subcategories/', data),
    update: (id, data) => api.patch(`/warehouse/subcategories/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/subcategories/${id}/`)
}

export const promotionsAPI = {
    getAll: (params) => api.get('/warehouse/promotions/', { params }),
    getById: (id) => api.get(`/warehouse/promotions/${id}/`),
    create: (data) => api.post('/warehouse/promotions/', data),
    update: (id, data) => api.patch(`/warehouse/promotions/${id}/`, data),
    delete: (id) => api.delete(`/warehouse/promotions/${id}/`),
    activate: (id) => api.post(`/warehouse/promotions/${id}/activate/`),
    deactivate: (id) => api.post(`/warehouse/promotions/${id}/deactivate/`)
}


