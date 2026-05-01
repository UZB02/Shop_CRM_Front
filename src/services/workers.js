import api from './axios'

export const workersAPI = {
    getAll: (params) => api.get('/workers/', { params }),
    getById: (id) => api.get(`/workers/${id}/`),
    create: (data) => api.post('/workers/', data),
    update: (id, data) => api.patch(`/workers/${id}/`, data),
    delete: (id) => api.delete(`/workers/${id}/`),
    changePassword: (id, data) => api.post(`/workers/${id}/change-password/`, data),
    getActivities: (id, params) => api.get(`/workers/${id}/activities/`, { params }),
    getMe: () => api.get('/workers/me/'),
    updateMe: (data) => api.patch('/workers/me/', data)
}

export const kpiAPI = {
    getAll: (params) => api.get('/kpi/', { params }),
    getById: (id) => api.get(`/kpi/${id}/`),
    setTarget: (id, data) => api.patch(`/kpi/${id}/set-target/`, data),
    getWorkerKpi: (workerId, params) => api.get(`/workers/${workerId}/kpi/`, { params })
}


