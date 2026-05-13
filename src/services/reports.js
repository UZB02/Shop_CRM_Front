import api from './axios'

export const reportsAPI = {
    // Excel/PDF Exports (Binary)
    exportExpenses: (params) => api.get('/export/expenses', { params, responseType: 'blob' }),
    exportWastages: (params) => api.get('/export/wastages', { params, responseType: 'blob' }),
    exportStocks: (params) => api.get('/export/stocks/', { params, responseType: 'blob' }),
    exportShifts: (params) => api.get('/export/shifts/', { params, responseType: 'blob' }),
    exportDebtorReport: (params) => api.get('/export/debtor-report/', { params, responseType: 'blob' }),

    // JSON Reports
    getFinancialReport: (params) => api.get('/export/financial-report/', { params }),
    getProfitLoss: (params) => api.get('/export/profit-loss/', { params }),
    getProductTurnover: (params) => api.get('/export/product-turnover/', { params }),
    getDebtorReport: (params) => api.get('/export/debtor-report/', { params }),
    getWorkerPerformance: (params) => api.get('/export/worker-performance/', { params }),
    getInventoryValue: (params) => api.get('/export/inventory-value/', { params }),
    getTaxReport: (params) => api.get('/export/tax-report/', { params }),
    getMonthlyProfitLoss: (params) => api.get('/export/profit-loss/monthly-chart/', { params }),

    // Import Shablonlarini Yuklab Olish (Template Download)
    downloadProductsTemplate: () => api.get('/export/products/template/', { responseType: 'blob' }),
    downloadCustomersTemplate: () => api.get('/export/customers/template/', { responseType: 'blob' }),
    downloadSuppliersTemplate: () => api.get('/export/suppliers/template/', { responseType: 'blob' }),
    downloadMovementsTemplate: () => api.get('/export/stock-movements/template/', { responseType: 'blob' }),
    downloadSubcategoriesTemplate: () => api.get('/export/subcategories/template/', { responseType: 'blob' }),

    // Import (POST) — Ommaviy ma'lumot yuklash
    importProducts: (formData) => api.post('/export/products/import/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    importCustomers: (formData) => api.post('/export/customers/import/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

