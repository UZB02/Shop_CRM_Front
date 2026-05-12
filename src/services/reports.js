import api from './axios'

export const reportsAPI = {
    // Excel/PDF Exports (Binary)
    exportExpenses: (params) => api.get('/export/expenses', { params, responseType: 'blob' }),
    exportWastages: (params) => api.get('/export/wastages', { params, responseType: 'blob' }),
    exportStocks: (params) => api.get('/export/stocks/', { params, responseType: 'blob' }),
    exportShifts: (params) => api.get('/export/shifts/', { params, responseType: 'blob' }),

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
