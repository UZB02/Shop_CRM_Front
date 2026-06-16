import api from './axios'

export const reportsAPI = {
    // Excel/PDF Exports (Binary)
    exportExpenses: (params) => api.get('/export/expenses', { params, responseType: 'blob' }),
    exportWastages: (params) => api.get('/export/wastages', { params, responseType: 'blob' }),
    exportStocks: (params) => api.get('/export/stocks/', { params, responseType: 'blob' }),
    exportShifts: (params) => api.get('/export/shifts/', { params, responseType: 'blob' }),
    exportDebtorReport: (params) => api.get('/export/debtor-report/', { params, responseType: 'blob' }),
    exportCustomers: (params) => api.get('/export/customers/', { params, responseType: 'blob' }),

    // JSON Reports
    getFinancialReport: (params) => api.get('/finance/financial-report/', { params }),
    getProfitLoss: (params) => api.get('/export/profit-loss/', { params }),

    // Excel / PDF export (Binary)
    exportProfitLoss: (params) => api.get('/export/profit-loss/', { params, responseType: 'blob' }),
    getProductTurnover: (params) => api.get('/export/product-turnover/', { params }),
    getDebtorReport: (params) => api.get('/finance/debtor-report/', { params }),
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

    // ─── Mahsulot Hisobotlari (Owner/Manager) ─────────────────────────────
    // 1. Eng ko'p sotilgan — paginatsiyali JSON
    getTopSelling: (params) => api.get('/export/top-selling/', { params }),
    // 2. Eng foydali — paginatsiyali JSON
    getTopProfitable: (params) => api.get('/export/top-profitable/', { params }),
    // 3. Sekin sotiladigan — paginatsiyali JSON (sana filtri yo'q)
    getSlowMoving: (params) => api.get('/export/slow-moving/', { params }),
    // 4. O'lik tovar — paginatsiyali JSON (sana filtri yo'q)
    getDeadStock: (params) => api.get('/export/dead-stock/', { params }),

    // Excel eksport variantlari (?export=excel → blob yuklab olish)
    exportTopSelling: (params) => api.get('/export/top-selling/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),
    exportTopProfitable: (params) => api.get('/export/top-profitable/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),
    exportSlowMoving: (params) => api.get('/export/slow-moving/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),
    exportDeadStock: (params) => api.get('/export/dead-stock/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),
    
    // 5. Tugagan tovar
    getSoldOut: (params) => api.get('/export/sold-out/', { params }),
    exportSoldOut: (params) => api.get('/export/sold-out/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),

    // 6. Sotuv trendi
    getSalesTrend: (params) => api.get('/export/sales-trend/', { params }),
    exportSalesTrend: (params) => api.get('/export/sales-trend/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),

    // 7. Stock-out bashorat
    getStockoutForecast: (params) => api.get('/export/stockout-forecast/', { params }),
    exportStockoutForecast: (params) => api.get('/export/stockout-forecast/', {
        params: { ...params, export: 'excel' }, responseType: 'blob'
    }),
}

