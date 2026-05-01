import api from './axios'

export const dashboardAPI = {
    getData: (params) => api.get('/dashboard/', { params }),
    getRevenueChart: (params) => api.get('/dashboard/revenue-chart/', { params })
}


