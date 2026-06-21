import api from './axios'

export const tradesAPI = {
    getAll: (params) => api.get('/trades/', { params }),
    getById: (id) => api.get(`/trades/${id}/`),
    create: (data) => api.post('/trades/', data),
    update: (id, data) => api.patch(`/trades/${id}/`, data),
    delete: (id) => api.delete(`/trades/${id}/`)
}

export const salesAPI = {
    getAll: (params) => api.get('/sales/', { params }),
    getById: (id) => api.get(`/sales/${id}/`),
    create: (data) => api.post('/sales/', data),
    cancel: (id) => api.patch(`/sales/${id}/cancel/`),
    getReceipt: (id) => api.get(`/sales/${id}/receipt/`, { responseType: 'blob' }),
    scanProduct: (barcode) => api.get(`/warehouse/products/scan/`, { params: { code: barcode } }),
    getBarcode: (id, format = 'png') =>
        api.get(`/sales/${id}/barcode/`, {
            params: format !== 'png' ? { format } : {},
            responseType: 'blob'
        }),
    lookupBarcode: (code) => api.get('/sales/lookup-barcode/', { params: { code } }),
    export: (params) => api.get('/export/sales/', { params, responseType: 'blob' })
}

export const saleReturnsAPI = {
    getAll: (params) => api.get('/sale-returns/', { params }),
    getById: (id) => api.get(`/sale-returns/${id}/`),
    create: (data) => api.post('/sale-returns/', data),
    confirm: (id) => api.patch(`/sale-returns/${id}/confirm/`),
    cancel: (id) => api.patch(`/sale-returns/${id}/cancel/`)
}

export const shiftsAPI = {
    getAll: (params) => api.get('/shifts/', { params }),
    open: (data) => api.post('/shifts/', data),
    close: (id, data) => api.patch(`/shifts/${id}/close/`, data),
    getXReport: (id) => api.get(`/shifts/${id}/x-report/`),
    export: (id) => api.get(`/export/shifts/${id}/`, { responseType: 'blob' })
}


